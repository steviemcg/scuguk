/**
 * `lastSponsorDate` in src/data/sponsors/*.yml is hand-maintained and exists only to sort
 * the /sponsors page. It is derivable from the events that reference each sponsor, which
 * means it can drift — this checks whether it has.
 *
 * Run: node .claude/scripts/check-sponsor-dates.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

const load = (dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yml'))
    .map((f) => ({ key: f.slice(0, -4), doc: yaml.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) }));

const events = load('src/data/events');
const sponsors = load('src/data/sponsors');

const actual = new Map();
for (const { doc } of events)
  for (const key of doc.sponsors ?? []) {
    const d = new Date(doc.date);
    if (!actual.has(key) || d > actual.get(key)) actual.set(key, d);
  }

const iso = (d) => (d instanceof Date && !isNaN(d) ? d.toISOString().slice(0, 10) : String(d));

console.log(`${'sponsor'.padEnd(14)} ${'stored'.padEnd(12)} ${'derived'.padEnd(12)} `);
let drift = 0;
let orphan = 0;
for (const { key, doc } of sponsors.sort((a, b) => a.key.localeCompare(b.key))) {
  const stored = doc.lastSponsorDate ? new Date(doc.lastSponsorDate) : null;
  const derived = actual.get(key) ?? null;
  if (!derived) {
    orphan++;
    console.log(
      `${key.padEnd(14)} ${iso(stored).padEnd(12)} ${'—'.padEnd(12)} no event in src/data/events references it`,
    );
    continue;
  }
  const same = stored && iso(stored) === iso(derived);
  if (!same) drift++;
  console.log(`${key.padEnd(14)} ${iso(stored).padEnd(12)} ${iso(derived).padEnd(12)} ${same ? '' : '<-- DRIFTED'}`);
}
console.log(
  `\n${drift} of ${sponsors.length} stored dates disagree with the events; ${orphan} sponsor(s) referenced by no event.`,
);
