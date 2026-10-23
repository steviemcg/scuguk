// Writes the date of every event, and the time of this build, to public/data/event-dates.json, so it is published at
// /data/event-dates.json. The scheduled function netlify/functions/rebuild-after-event.mjs reads it from the live site
// to tell whether an event has started since the live build was made, and the site needs rebuilding.
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const eventsDir = './src/data/events';
const outFile = './public/data/event-dates.json';

const events = fs
  .readdirSync(eventsDir)
  .filter((file) => file.endsWith('.yml'))
  .map((file) => {
    const { date } = yaml.parse(fs.readFileSync(path.join(eventsDir, file), 'utf-8'));
    return { key: file.replace(/\.yml$/, ''), date: new Date(date).toISOString() };
  });

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ builtAt: new Date().toISOString(), events }, null, 2));
console.log(`Wrote ${events.length} event dates to ${outFile}`);
