// Rebuilds the site the morning after each event, so the homepage's next event moves on by itself (#256).
//
// The site is a static export: anything that compares an event's date with today is frozen at the last deploy.
// This runs daily, reads the event dates the last deploy published at /data/event-dates.json, and POSTs to the build
// hook only when an event took place yesterday, UK time. The hook is the Netlify environment variable
// REBUILD_HOOK_URL; without it the function logs and does nothing.

const ukDate = (date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

// The events whose UK calendar date was the day before `now`.
export const eventsYesterday = (events, now) => {
  const yesterday = ukDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  return events.filter((event) => ukDate(new Date(event.date)) === yesterday);
};

export default async (req, context) => {
  const siteUrl = context?.site?.url || 'https://scug.co.uk';
  const response = await fetch(`${siteUrl}/data/event-dates.json`);
  if (!response.ok) {
    console.error(`Could not read ${siteUrl}/data/event-dates.json: ${response.status}`);
    return new Response('Could not read event dates', { status: 502 });
  }

  const { events } = await response.json();
  const held = eventsYesterday(events, new Date());
  if (held.length === 0) {
    console.log('No event yesterday; nothing to rebuild.');
    return new Response('No event yesterday');
  }

  const hook = process.env.REBUILD_HOOK_URL;
  if (!hook) {
    console.error(`Event yesterday (${held.map((e) => e.key).join(', ')}) but REBUILD_HOOK_URL is not set.`);
    return new Response('REBUILD_HOOK_URL is not set', { status: 500 });
  }

  const build = await fetch(hook, { method: 'POST', body: '{}' });
  console.log(`Event yesterday (${held.map((e) => e.key).join(', ')}); build hook answered ${build.status}.`);
  return new Response(`Build hook answered ${build.status}`, { status: build.ok ? 200 : 502 });
};

// 05:00 UTC is 05:00 or 06:00 in the UK: well after any evening event, before anyone looks at the homepage.
export const config = { schedule: '0 5 * * *' };
