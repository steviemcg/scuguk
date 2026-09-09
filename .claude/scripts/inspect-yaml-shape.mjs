/**
 * Inventories every key actually used across src/data/**, so the Payload collections
 * are modelled from the content rather than from src/content.types.ts, which the YAML
 * has drifted away from (showOnlineRsvp and talksTbc are in the files but not the type).
 *
 * Run: node .claude/scripts/inspect-yaml-shape.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

const read = (dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yml'))
    .map((f) => ({ key: f.slice(0, -4), doc: yaml.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) }));

const tally = (rows, label) => {
  const keys = new Map();
  for (const { doc } of rows) {
    for (const [k, v] of Object.entries(doc ?? {})) {
      const e = keys.get(k) ?? { n: 0, types: new Set(), sample: undefined };
      e.n++;
      e.types.add(Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);
      if (e.sample === undefined && typeof v !== 'object') e.sample = String(v).slice(0, 48);
      keys.set(k, e);
    }
  }
  console.log(`\n=== ${label} (${rows.length} files) ===`);
  for (const [k, e] of [...keys].sort((a, b) => b[1].n - a[1].n)) {
    const opt = e.n === rows.length ? ' ' : '?';
    console.log(
      `  ${opt} ${k.padEnd(18)} ${String(e.n).padStart(3)}/${rows.length}  ${[...e.types].join('|').padEnd(8)} ${e.sample ?? ''}`,
    );
  }
  return rows;
};

const events = tally(read('src/data/events'), 'events');
tally(read('src/data/speakers'), 'speakers');
tally(read('src/data/sponsors'), 'sponsors');

// Agenda entries are the interesting part — they are a discriminated union.
const agendaKeys = new Map();
const types = new Map();
let links = 0;
let bothSpeakerFields = 0;
for (const { key, doc } of events) {
  for (const entry of doc.agenda ?? []) {
    types.set(entry.type, (types.get(entry.type) ?? 0) + 1);
    for (const k of Object.keys(entry)) agendaKeys.set(k, (agendaKeys.get(k) ?? 0) + 1);
    if (entry.links) links++;
    if (entry.speaker && entry.speakers) bothSpeakerFields++;
    if (!['talk', 'item', 'tbd'].includes(entry.type))
      console.log(`  !! unknown agenda type "${entry.type}" in ${key}`);
  }
}
console.log('\n=== agenda entries ===');
console.log('  types:', Object.fromEntries(types));
for (const [k, n] of [...agendaKeys].sort((a, b) => b[1] - a[1])) console.log(`    ${k.padEnd(18)} ${n}`);
console.log(`  entries with links: ${links}; entries setting BOTH speaker and speakers: ${bothSpeakerFields}`);

// Locations, and which have an image on disk.
const locs = new Map();
for (const { doc } of events) locs.set(doc.location, (locs.get(doc.location) ?? 0) + 1);
console.log('\n=== locations used by events ===');
for (const [l, n] of [...locs].sort((a, b) => b[1] - a[1])) {
  const img = l ? fs.existsSync(path.join('src/data/locations', `${String(l).toLowerCase()}.jpg`)) : false;
  console.log(`  ${String(l).padEnd(14)} ${String(n).padStart(2)} events   image: ${img ? 'yes' : 'NO'}`);
}

// Referential integrity: do all speaker and sponsor keys resolve to a file?
const has = (dir, key) => fs.existsSync(path.join(dir, `${key}.yml`));
const missing = { speakers: new Set(), sponsors: new Set() };
for (const { doc } of events) {
  for (const s of doc.sponsors ?? []) if (!has('src/data/sponsors', s)) missing.sponsors.add(s);
  for (const entry of doc.agenda ?? []) {
    for (const s of entry.speakers ?? (entry.speaker ? [entry.speaker] : []))
      if (!has('src/data/speakers', s)) missing.speakers.add(s);
  }
}
console.log('\n=== dangling references ===');
console.log('  speakers:', missing.speakers.size ? [...missing.speakers] : 'none');
console.log('  sponsors:', missing.sponsors.size ? [...missing.sponsors] : 'none');

// How much of `intro` is HTML, and which events use the alert callout?
console.log('\n=== intro/description HTML ===');
let withHtml = 0;
const alerts = [];
for (const { key, doc } of events) {
  if (/<[a-z][\s\S]*>/i.test(doc.intro ?? '')) withHtml++;
  if (/class(Name)?=["'][^"']*alert/i.test(doc.intro ?? '')) alerts.push(key);
}
console.log(`  events whose intro contains HTML tags: ${withHtml}/${events.length}`);
console.log(`  events using an alert callout: ${alerts.length ? alerts.join(', ') : 'none'}`);
const tags = new Map();
for (const { doc } of events)
  for (const m of (doc.intro ?? '').matchAll(/<\s*([a-z][a-z0-9]*)/gi))
    tags.set(m[1].toLowerCase(), (tags.get(m[1].toLowerCase()) ?? 0) + 1);
console.log('  tags used in intro:', Object.fromEntries([...tags].sort((a, b) => b[1] - a[1])));

// Speaker photos on disk
const speakerFiles = fs.readdirSync('src/data/speakers');
const noPhoto = speakerFiles
  .filter((f) => f.endsWith('.yml'))
  .map((f) => f.slice(0, -4))
  .filter((k) => !speakerFiles.some((f) => f.startsWith(`${k}.`) && !f.endsWith('.yml')));
console.log('\n=== speakers with no image file on disk ===');
console.log(' ', noPhoto.length ? noPhoto.join(', ') : 'none');
