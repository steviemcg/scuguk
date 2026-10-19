// Rebuilds the site after each event, so the homepage's next event moves on by itself (#256).
//
// The site is a static export: anything that compares an event's date with now is frozen at the last deploy. This runs
// daily and reads /data/event-dates.json from the live site, which holds every event's date and the time the live build
// was made. It POSTs to the build hook when an event has started since that build: the morning after an evening event.
// A failed morning (the file unreadable, the hook or the build failing) leaves the old build live, so the next run
// tries again; once the rebuild is live its later build time stops it. The hook is the Netlify environment variable
// REBUILD_HOOK_URL; without it the function logs and does nothing.

// The events that started after the live build was made and by `now`.
export const eventsSinceBuild = ({ builtAt, events }, now) => {
  const built = new Date(builtAt);
  return events.filter((event) => {
    const date = new Date(event.date);
    return date > built && date <= now;
  });
};

export default async (req, context) => {
  const siteUrl = context?.site?.url || 'https://scug.co.uk';
  const response = await fetch(`${siteUrl}/data/event-dates.json`);
  if (!response.ok) {
    console.error(`Could not read ${siteUrl}/data/event-dates.json: ${response.status}`);
    return new Response('Could not read event dates', { status: 502 });
  }

  const dates = await response.json();
  const held = eventsSinceBuild(dates, new Date());
  if (held.length === 0) {
    console.log(`No event since the live build (${dates.builtAt}); nothing to rebuild.`);
    return new Response('No event since the live build');
  }

  const keys = held.map((e) => e.key).join(', ');
  const hook = process.env.REBUILD_HOOK_URL;
  if (!hook) {
    console.error(`Event since the live build (${keys}) but REBUILD_HOOK_URL is not set.`);
    return new Response('REBUILD_HOOK_URL is not set', { status: 500 });
  }

  const build = await fetch(hook, { method: 'POST', body: '{}' });
  console.log(`Event since the live build (${keys}); build hook answered ${build.status}.`);
  return new Response(`Build hook answered ${build.status}`, { status: build.ok ? 200 : 502 });
};

// 05:00 UTC is 05:00 or 06:00 in the UK: well after any evening event, before anyone looks at the homepage.
export const config = { schedule: '0 5 * * *' };
