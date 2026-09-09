/**
 * One-shot import of the YAML content in `src/data/**` into Payload.
 *
 *   pnpm import:content            # dry run — reports what it would do, writes nothing
 *   pnpm import:content --write    # actually write
 *   pnpm import:content --write --fresh   # delete imported docs first, then write
 *
 * Idempotent: every collection is keyed on the slug that was the YAML filename, so a
 * second run updates rather than duplicates. That matters because this will be run more
 * than once — against a local database now, and against Neon at cutover.
 *
 * What it deliberately does NOT do: touch the RSVP data. Capacity, attendees and the
 * waitlist still live in Azure SQL and come across in plan 4. `legacyEventId` is carried
 * over on every event so that migration has something to join on.
 */
import fs from 'node:fs';
import path from 'node:path';

import { editorConfigFactory, convertHTMLToLexical } from '@payloadcms/richtext-lexical';
import { JSDOM } from 'jsdom';
import { getPayload } from 'payload';
import yaml from 'yaml';

import config from '../payload.config';

const DATA = path.resolve(process.cwd(), 'src/data');
const args = new Set(process.argv.slice(2));
const WRITE = args.has('--write');
const FRESH = args.has('--fresh');

type Yaml = Record<string, unknown>;

const readDir = (dir: string): { key: string; doc: Yaml }[] =>
  fs
    .readdirSync(path.join(DATA, dir))
    .filter((f) => f.endsWith('.yml'))
    .sort()
    .map((f) => ({
      key: f.slice(0, -4),
      doc: yaml.parse(fs.readFileSync(path.join(DATA, dir, f), 'utf-8')) as Yaml,
    }));

/** Sibling asset for a YAML file, e.g. speakers/jeremydavis.jpg. Case-sensitive on Linux. */
const siblingAsset = (dir: string, filename: string | undefined): string | null => {
  if (!filename) return null;
  const full = path.join(DATA, dir, filename);
  return fs.existsSync(full) ? full : null;
};

const warnings: string[] = [];
const warn = (msg: string) => {
  warnings.push(msg);
  console.log(`  ⚠ ${msg}`);
};

async function run() {
  const payload = await getPayload({ config });
  const mode = WRITE ? (FRESH ? 'WRITE (fresh)' : 'WRITE') : 'DRY RUN — nothing will be written';
  console.log(`\nImporting src/data/** → Payload  [${mode}]\n`);

  const editorConfig = await editorConfigFactory.default({ config: await config });
  const toLexical = (html: string) => convertHTMLToLexical({ editorConfig, html, JSDOM: JSDOM as never });

  /** Upload a file into the media collection, keyed on filename so reruns reuse it. */
  const mediaCache = new Map<string, number | null>();
  const upload = async (filePath: string | null, alt: string): Promise<number | null> => {
    if (!filePath) return null;
    const filename = path.basename(filePath);
    if (mediaCache.has(filename)) return mediaCache.get(filename)!;

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs.length > 0) {
      mediaCache.set(filename, existing.docs[0].id as number);
      return existing.docs[0].id as number;
    }
    if (!WRITE) {
      mediaCache.set(filename, null);
      return null;
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt },
      filePath,
    });
    mediaCache.set(filename, created.id as number);
    return created.id as number;
  };

  /** Create-or-update by slug. Returns the id, or null on a dry run. */
  const upsert = async (
    collection: 'locations' | 'speakers' | 'sponsors' | 'events',
    slugField: 'slug' | 'name',
    slugValue: string,
    data: Record<string, unknown>,
  ): Promise<number | null> => {
    const found = await payload.find({
      collection,
      where: { [slugField]: { equals: slugValue } },
      limit: 1,
      depth: 0,
    });
    if (!WRITE) return (found.docs[0]?.id as number) ?? null;

    if (found.docs.length > 0) {
      const updated = await payload.update({
        collection,
        id: found.docs[0].id,
        data: data as never,
        depth: 0,
      });
      return updated.id as number;
    }
    const created = await payload.create({ collection, data: data as never, depth: 0 });
    return created.id as number;
  };

  if (FRESH && WRITE) {
    console.log('Clearing events, speakers, sponsors, locations and media…');
    for (const collection of ['events', 'speakers', 'sponsors', 'locations', 'media'] as const) {
      await payload.delete({ collection, where: { id: { exists: true } } });
    }
  }

  // ---------------------------------------------------------------- locations
  // Derived from the events, because there is no locations YAML — only images on disk,
  // and "Online" (3 events) has never had one.
  const events = readDir('events');
  const locationNames = [...new Set(events.map((e) => String(e.doc.location)))].sort();
  const locationIds = new Map<string, number | null>();
  console.log(`Locations (${locationNames.length})`);
  for (const name of locationNames) {
    const img = siblingAsset('locations', `${name.toLowerCase()}.jpg`);
    if (!img) warn(`location "${name}" has no image at src/data/locations/${name.toLowerCase()}.jpg`);
    const image = await upload(img, `${name} venue backdrop`);
    locationIds.set(name, await upsert('locations', 'name', name, { name, image }));
    console.log(`  ${name.padEnd(12)} ${img ? 'image' : 'no image'}`);
  }

  // ---------------------------------------------------------------- speakers
  const speakers = readDir('speakers');
  const speakerIds = new Map<string, number | null>();
  console.log(`\nSpeakers (${speakers.length})`);
  for (const { key, doc } of speakers) {
    const photoPath = siblingAsset('speakers', doc.image as string | undefined);
    if (doc.image && !photoPath) warn(`speaker "${key}" names image "${doc.image}" but it is not on disk`);
    if (!doc.image) warn(`speaker "${key}" has no image field`);
    const photo = await upload(photoPath, `${doc.name} profile photo`);
    speakerIds.set(
      key,
      await upsert('speakers', 'slug', key, {
        slug: key,
        name: doc.name,
        title: doc.title,
        company: doc.company,
        photo,
      }),
    );
  }
  console.log(`  ${speakers.length} speakers, ${[...mediaCache.keys()].length} media so far`);

  // ---------------------------------------------------------------- sponsors
  const sponsors = readDir('sponsors');
  const sponsorIds = new Map<string, number | null>();
  console.log(`\nSponsors (${sponsors.length})`);
  for (const { key, doc } of sponsors) {
    const logoPath = siblingAsset('sponsors', doc.image as string | undefined);
    if (doc.image && !logoPath) warn(`sponsor "${key}" names image "${doc.image}" but it is not on disk`);
    const logo = await upload(logoPath, `${doc.title} logo`);
    sponsorIds.set(
      key,
      await upsert('sponsors', 'slug', key, {
        slug: key,
        title: doc.title,
        logo,
        darkLogo: doc.darkImage === true,
        website: doc.website,
        description: doc.description,
        hideOnPage: doc.hideOnPage === true,
        // Seed only. The syncSponsorDates hook overwrites this from the events as they
        // import, and wins wherever the two disagree — which they do on 3 of 14.
        lastSponsoredAt: doc.lastSponsorDate ? new Date(doc.lastSponsorDate as string).toISOString() : null,
      }),
    );
  }

  // ---------------------------------------------------------------- events
  console.log(`\nEvents (${events.length})`);
  let agendaTotal = 0;
  for (const { key, doc } of events) {
    const agenda = ((doc.agenda ?? []) as Yaml[]).map((entry, i) => {
      // `type` is the discriminator. One entry in 2025-11-remarkable… has `item: talk`
      // instead, which the old renderer treated as a talk because its dispatcher fell
      // through to that case. Reproduce that reading rather than dropping the entry.
      let blockType = entry.type as string | undefined;
      if (!blockType) {
        blockType = entry.title ? 'talk' : 'item';
        warn(
          `${key} agenda[${i}] has no "type" (keys: ${Object.keys(entry).join(', ')}) — importing as "${blockType}"`,
        );
      }

      if (blockType === 'item') return { blockType: 'item', time: entry.time, description: entry.description };
      if (blockType === 'tbd') return { blockType: 'tbd', time: entry.time };

      const speakerKeys = (entry.speakers as string[] | undefined) ?? (entry.speaker ? [entry.speaker as string] : []);
      const ids = speakerKeys.map((k) => {
        if (!speakerIds.has(k)) warn(`${key} agenda[${i}] references unknown speaker "${k}"`);
        return speakerIds.get(k) ?? null;
      });
      const html = (entry.descriptionHtml as string) ?? (entry.description ? `<p>${entry.description}</p>` : null);
      return {
        blockType: 'talk',
        time: entry.time,
        title: entry.title,
        speakers: ids.filter((id): id is number => typeof id === 'number'),
        description: html ? toLexical(html) : null,
        youtubeVideoId: entry.youtubeVideoId ?? null,
        links: (entry.links as Yaml[] | undefined) ?? [],
      };
    });
    agendaTotal += agenda.length;

    const introHtml = String(doc.intro ?? '');
    if (/class(Name)?=["'][^"']*alert/i.test(introHtml))
      warn(
        `${key} intro uses a Bootstrap alert callout; the class is lost in rich text — plan 3 owes it a Callout block`,
      );

    const sponsorRefs = ((doc.sponsors as string[] | undefined) ?? []).map((s) => {
      if (!sponsorIds.has(s)) warn(`${key} references unknown sponsor "${s}"`);
      return sponsorIds.get(s) ?? null;
    });

    const eventImage = await upload(siblingAsset('events', `${key}.jpg`), `${doc.title} image`);
    const meta = (doc.meta ?? {}) as Yaml;
    const venue = (doc.venue ?? {}) as Yaml;

    await upsert('events', 'slug', key, {
      slug: key,
      title: doc.title,
      date: new Date(doc.date as string).toISOString(),
      duration: doc.duration ?? 150,
      dateConfirmed: doc.dateConfirmed !== false,
      talksTbc: doc.talksTbc === true,
      showOnlineRsvp: doc.showOnlineRsvp === true,
      showEventImage: doc.showEventImage !== false,
      excerpt: String(doc.excerpt ?? '').trim(),
      intro: introHtml ? toLexical(introHtml) : null,
      location: locationIds.get(String(doc.location)) ?? null,
      venue: { name: venue.name, address: venue.address ?? null },
      sponsors: sponsorRefs.filter((id): id is number => typeof id === 'number'),
      image: eventImage,
      agenda,
      meta: { title: meta.title ?? null, description: meta.description ?? null },
      legacyEventId: doc.eventId ?? null,
    });
    console.log(`  ${key.padEnd(48)} ${agenda.length} agenda entries`);
  }

  // ---------------------------------------------------------------- summary
  console.log(`\n${'-'.repeat(72)}`);
  console.log(
    `${locationNames.length} locations · ${speakers.length} speakers · ${sponsors.length} sponsors · ` +
      `${events.length} events · ${agendaTotal} agenda entries · ${mediaCache.size} media`,
  );
  console.log(`${warnings.length} warning(s)`);
  if (!WRITE) console.log('\nDRY RUN — nothing was written. Re-run with --write.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
