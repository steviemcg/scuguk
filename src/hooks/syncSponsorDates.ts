import type { CollectionAfterChangeHook } from 'payload';

/**
 * Keeps `sponsors.lastSponsoredAt` in step with the events that name each sponsor.
 *
 * In the YAML this was a hand-typed `lastSponsorDate` whose only job was to order the
 * /sponsors page, and it had drifted on 3 of 14 sponsors — Sitecore's read 2024-11-14
 * against a real latest event of 2026-09-24, so it sorted nearly two years too low.
 * Deriving it on read is not an option, because Payload cannot sort a list by an
 * aggregate over a reverse relationship; so it is denormalised here and maintained by
 * the machine rather than by a person.
 *
 * Only ever moves the date forward. Removing a sponsor from an event does not roll it
 * back — that would need a scan of every other event, and a slightly stale date is a
 * much smaller problem than a slow save. It is corrected by the reconcile pass in
 * `.claude/scripts/` if it ever matters.
 */
export const syncSponsorDates: CollectionAfterChangeHook = async ({ doc, req }) => {
  const sponsorIds: number[] = (doc.sponsors ?? [])
    .map((s: unknown) => (typeof s === 'object' && s !== null ? (s as { id: number }).id : s))
    .filter((id: unknown): id is number => typeof id === 'number');

  if (sponsorIds.length === 0 || !doc.date) return doc;

  const eventDate = new Date(doc.date);
  if (isNaN(eventDate.getTime())) return doc;

  for (const id of sponsorIds) {
    try {
      const sponsor = await req.payload.findByID({
        collection: 'sponsors',
        id,
        depth: 0,
        req,
      });

      const current = sponsor.lastSponsoredAt ? new Date(sponsor.lastSponsoredAt) : null;
      if (current && !isNaN(current.getTime()) && current >= eventDate) continue;

      await req.payload.update({
        collection: 'sponsors',
        id,
        data: { lastSponsoredAt: eventDate.toISOString() },
        depth: 0,
        req,
        context: { skipSponsorSync: true },
      });
    } catch (error) {
      // A sponsor that has been deleted out from under the event should not stop the
      // event saving. Log it and carry on — the reconcile script picks up the gap.
      req.payload.logger.error(
        { err: error, sponsorId: id, event: doc.slug },
        'syncSponsorDates: could not update sponsor',
      );
    }
  }

  return doc;
};
