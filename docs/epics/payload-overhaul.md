---
slug: payload-overhaul
status: in-flight
owner: steve
started: 2026-09-05
target: >
  scug.co.uk runs on a stack a second maintainer can be handed without a resource transfer:
  one repo, one host, one database, one place an event is defined. Exit criterion: Jeremy can
  add an event, see the RSVPs and read a contact-form submission without Steve's Azure
  subscription, Auth0 tenant or Mailchimp login being involved — and the Azure resource group
  `scuguk` is deleted.
---

> **Update 2026-11-12: the branch was brought up to date with `master` and re-checked.**
> `master` had moved 16 commits since 2026-09-09 (a November 2026 London event and a Manchester
> September 2026 event, dependency updates, and the agent loop handed to a daemon). `master` was
> merged in (not rebased, so the original commits keep their hashes). The package manager is now
> **yarn**, with `yarn.lock` as the only lockfile (it was pnpm on this branch). Plans 1 and 2 were
> re-verified on the merged branch; the evidence is in *What can be tested right now* →
> *Re-verified 2026-11-12*. The import now holds **23 events, 118 agenda entries, 40 speakers,
> 16 sponsors, 4 locations and 64 media**. Nothing in plans 3 to 7 has started. The text below is
> the 2026-09-09 status, kept as written except where a line is marked "Corrected".
>
> **Rewritten 2026-11-12.** This branch was rewritten on 12 November 2026, before its first push, to
> keep a local database password out of a public repository. Five commits changed hash
> (`7005670`→`f963124`, `31e1067`→`708a1c6`, `db600ce`→`deb3bab`, and the merge and the commit after it);
> `7afaeca`, `dc41f08` and the other earlier ones kept theirs. The unrewritten commits remain on the
> local branch `worktree-payload-overhaul`, which was left untouched. The documented docker command now
> binds the database to localhost only and takes the password from `.env.local`.
>
> **Status 2026-09-09.** **Host = Vercel on a new group-owned account, database = Neon, scope =
> everything into Payload, repo stays public, Mailchimp unchanged, Vercel's non-commercial
> restriction accepted** — all decided by Steve and recorded under *Decisions* and *D6*.
>
> **Plans 1 and 2 are done.** The Payload admin is loaded against a local Postgres and all 21
> events, 35 speakers, 14 sponsors and 109 agenda entries are in it, with the rich text
> verified rather than assumed — evidence in *What can be tested right now*. The one decision
> still genuinely open is **D4, how attendees sign in to RSVP**, and it blocks plan 4 only.
> Next is plan 3: render the public pages from Payload instead of from YAML.
>
> **Four things want doing regardless of what this epic decides**, none on the critical path:
>
> 1. ⏰ **The nightly rebuild is switched off** (`state=disabled_inactivity`), so the homepage's
>    idea of "next event" is frozen at the last deploy. One command to re-enable; plan 3 deletes
>    the mechanism for good. *Current architecture* §1.
>    **Corrected 2026-11-12:** still disabled (`gh api repos/steviemcg/scuguk/actions/workflows`
>    lists "Schedule Netlify Build" as `disabled_inactivity`). The 25 September date passed
>    without harm: `master` has deployed several times since, and <https://scug.co.uk/> showed
>    "Next Event" = `2026-11-london-sitecore-usergroup` when loaded on 2026-11-12. It will go
>    stale again on **20 November 2026**, the day after the 19 November London event, unless
>    something deploys.
> 2. The SQL row behind the **September 2026** event page has its date stored as **2023-09-26**
>    instead of 2026-09-24, so the RSVP API reports no upcoming events at all. Blast radius in
>    *Current architecture* §2. A one-column `UPDATE`, needs N2.
>    **Corrected 2026-11-12:** the September London row is still wrong (`2023-09-26`), and so is
>    the new **Manchester September 2026** row (`2023-09-10`, against `2026-09-17` in
>    `src/data/events/2026-09-manchester-meetup.yml`). Both events are now in the past. The API's
>    `/events/future` returns one row, November London (`2026-11-19`, 17 yes-RSVPs, and its
>    `eventId` matches the YAML), so "reports no upcoming events" no longer shows. The year typo
>    has now happened twice (`curl https://api.scug.co.uk/events`).
> 3. A **Google Maps API key** sat in the public git history for six years and is still live
>    unless restricted — now tracked as
>    [issue #242](https://github.com/steviemcg/scuguk/issues/242), off the critical path.
> 4. **Prepay the domain and put a GitHub org around the repo** — the two cheapest, largest
>    reductions in bus-factor available, and neither depends on any decision here. *D6 →
>    Recommended, not yet done*.

# Epic — collapse the scug.co.uk stack onto Payload

---

## Why this exists

Jeremy Davis raised an access problem, not an architecture one *(Slack, 2026-09-03)*:

> "For the moment, was mostly just thinking about how to handle access to stuff as people
> involved change - but if you have ideas about simplifying things overall then that's
> definitely something to discuss."

and later, on why a shared account is hard:

> "It's hard to set up anything for group access without paid directory services."

**The two problems are the same problem.** Access is hard here because the site is eight
services across six personal accounts (GitHub, Netlify, Namecheap, Azure, Auth0, Mailchimp),
and the Azure half cannot be shared or transferred at all (below). Reducing the moving parts *is* the access fix; a "usergroup email account" fronting
eight logins is a workaround for a stack that is bigger than it needs to be.

Steve's outline in the same thread — Neon instead of Azure SQL, the API as Next.js server
functions, Payload instead of git-based content, "removing the disconnected data stores for the
page and database entities" — is the starting sketch. This doc is that sketch checked against
what is actually deployed.

---

## Current architecture, end to end

Verified 2026-09-05; the verifying command for each part is in `AGENTS.md` § *The moving parts*.

```
  Namecheap (registrar, scug.co.uk, ~€8.60/yr)
        │ delegates NS
        ▼
  Netlify DNS (dns*.p05.nsone.net) ──► Netlify site "scuguk"
                                         • builds `out/` from GitHub steviemcg/scuguk (public)
                                         • serves the static export — THERE IS NO SERVER
                                         • Netlify Forms receives the contact form
                                         • deploy-preview is a required check on master

  the visitor's browser, from the static page, calls out to three places directly:

     ├─► scuguk.azurewebsites.net ──► Azure App Service "scuguk"  (RG scuguk, West Europe)
     │      (NOT api.scug.co.uk —       │  .NET, source: GitHub steviemcg/scuguk.api (PRIVATE)
     │       that hostname is bound     │  validates Auth0 JWTs
     │       but unused: api.ts:7)      ├─► Azure SQL "scuguk" (RG scuguk, UK South, Basic 5 DTU)
     │                                  │     Events · Attendance · Users · Emails · LoginSubjects
     │                                  └─► Mailchimp (tags the RSVP-er with the event key)
     │
     ├─► Auth0 scug.eu.auth0.com  — attendee login, SPA client id in the page source
     └─► Mailchimp us15           — the newsletter form POSTs straight to list-manage.com

  GitHub Actions cron 02:00 UTC ──► Netlify build hook   (makes the clock move; see below)
```

### Four things about this that are load-bearing

**1. There is no server, so a cron job stands in for the passage of time — and the cron is off.**
`next.config.js` sets `output: 'export'`. `getUpcomingEvents()`
(`src/util/data/events.ts:19`) compares each event's date to `new Date()` **at build time**.
So `.github/workflows/main.yml` POSTs a Netlify build hook every night at 02:00 UTC purely so
that yesterday's event stops being tomorrow's. Nothing else in the repo needs that cron.

⚠️ **It has been switched off and nobody noticed.** The workflow is `state=disabled_inactivity`
— GitHub disables scheduled workflows in repositories that go quiet — and there are no runs in
the retained history *(forced — verified 2026-09-09:
`gh api repos/steviemcg/scuguk/actions/workflows` returns `disabled_inactivity` for
"Schedule Netlify Build"; `.../workflows/main.yml/runs` returns `total_count: 0`)*.

The site's idea of "which event is next" is therefore frozen at the last deploy, **7 September
2026**. That is harmless today, because the 24 September event is genuinely still upcoming.
**It stops being harmless on 25 September**, when a finished event will sit on the homepage as
"Next Event" until somebody happens to push a commit.

Two ways to fix it, and they are not equivalent:

- **Now, on `master`:** re-enable the workflow (`gh api -X PUT
  repos/steviemcg/scuguk/actions/workflows/main.yml/enable`, or the button in the Actions tab).
  One command, restores the intended behaviour, and it will silently switch itself off again the
  next time the repo goes quiet for 60 days.
- **Permanently, via this epic:** plan 3 deletes the whole mechanism. With a server rendering the
  page, "is this event in the future?" is answered when the visitor asks, not when the build ran.

This is the epic's argument in miniature: the workaround for having no server had itself failed
silently, and the failure was invisible because its only symptom is a stale homepage on a day
nobody happened to look.

**2. Every event is defined twice, nothing joins the halves — and they have already drifted.**
`src/data/events/{key}.yml` carries `eventId: <guid>`. That GUID is a primary key in Azure SQL
`dbo.Events`, a row that *separately* stores the event's name, date, capacity and three running
attendance counters. Adding an event means inserting the SQL row by hand and pasting its GUID
into the YAML. Nothing validates the pairing — no build error, no test, no check. This is the
"disconnected data stores" line in Steve's Slack outline.

It is not a theoretical risk. Cross-checking all 21 YAML events against the live API on
2026-09-05 (`https://api.scug.co.uk/events`, public, no auth) — **3 of 21 disagree on the date**:

| Page | Date on the page | Date in SQL | |
|---|---|---|---|
| `2026-09-london-sitecore-usergroup` | **2026-09-24** | **2023-09-26** | live — event is 19 days away, 5 RSVPs already on the row |
| `2025-11-remarkable-london-sitecore-usergroup` | 2025-11-25 | 2025-11-11 | past |
| `2024-07-virtual-sitecore-user-group` | 2024-07-25 | 2024-07-18 | past |

The September 2026 row is named "London September 2026" and keyed `2026-09-london`, so it was
created deliberately for this event and the **year was typed as 2023**. *(forced — verified
2026-09-05: `curl https://api.scug.co.uk/event/febafa73-3c73-4d49-bbda-fe6cf08d1487` returns
`"eventDate": "2023-09-26T00:00:00+00:00"`, `"attendingYes": 5`, against
`src/data/events/2026-09-london-sitecore-usergroup.yml` `date: 2026-09-24`.)*

**Be precise about the blast radius: no user journey is currently broken.**
`EventAttendance.tsx` reads only `capacity`, `capacityIsLimited`, `isOnline` and
`onlineDetails` from that row, never `eventDate`, so the RSVP box works and the five RSVPs are
real and attached to the right event. What *is* broken is the API's own view of itself —
**`/events/future` returns `[]`**, i.e. the RSVP system believes the user group has no upcoming
events at all. Nothing consumes that endpoint today, which is exactly why nobody noticed.

There are also **18 orphan SQL rows** (2020-02 to 2022-10, from the pre-Next.js site) holding
real attendance data — 50, 66, 46, 39 people — with no page in the repo at all. Whether those
come across in a migration is a question for plan 2.

**3. The share images are made by driving a browser on Steve's laptop.**
`scripts/export-event-ads.ts` serves `out/`, points Puppeteer at `/events/{key}/ad`, crops a
1126×569 screenshot and writes a JPEG into `public/events/` which is then committed.
`localChromePath` (line 16) is a hardcoded path to Edge on Steve's machine. The script skips
files that already exist, so updating an event's image means deleting the JPEG first — which
the README has to tell you, because nothing enforces it.

**4. ⚠️ The Azure API cannot be transferred, and it is not free.**
App Service `scuguk` runs on the plan `PersonalWindowsEuropeWest` (RG `Personal`, **P0v3
Premium**) that also hosts **16 other personal sites** — LEAF, LifeOS, Planner, myvdp, the lot.
It is free *to the user group* only because it rides on a plan Steve pays for regardless.
*(forced — verified 2026-09-05: `az appservice plan show -g Personal -n
PersonalWindowsEuropeWest` → `P0v3`; 16 of 17 apps in `az webapp list` name that plan.)*

So the offer in the Slack thread — "I could transfer the resources to your subscription" —
does not survive contact with the resource graph. Moving the App Service means either dragging
16 unrelated sites along or provisioning a **new** plan first, at which point SCUG starts
paying for hosting it does not currently pay for. **Deleting the Azure side entirely is
cheaper than transferring it**, and it is the single strongest argument in this document.

The Azure SQL database is separable and genuinely costs ~£3–4/mo (Basic, 5 DTU, 2 GB).

---

## What Payload does and does not fix

`proposed` throughout — this is analysis, not a decision.

| Today | Under Payload | Notes |
|---|---|---|
| Event defined in YAML **and** SQL | One `events` collection | The GUID hand-copy disappears. This is the core win. |
| Nightly cron to move the clock | Server-rendered / ISR | Cron deleted. |
| Puppeteer + committed JPEGs | `next/og` `ImageResponse` | Generated per request from the same data; no Edge path, no delete-first rule. |
| .NET API + private repo | Route handlers / server actions | One repo, public, in the language the site is already in. |
| Azure SQL (Basic, £3–4/mo) | Postgres | **Forced, not chosen:** Payload 3 has adapters for Postgres, MongoDB and SQLite. **There is no SQL Server adapter.** Choosing Payload means leaving Azure SQL. |
| Netlify Forms | `contactSubmissions` collection + email | Submissions become visible in the admin to whoever is a Payload user — which is Jeremy's actual ask. |
| Content reviewed via PR | Content edited in an admin UI | **This is a real loss.** See below. |

### The honest cost: git-based content was a feature

Jeremy's phrasing was neutral — *"'CMS' is git based and PRs, as you know"* — but PR review of
content is a genuine property of the current setup: an event page is diffable, reviewable,
revertible, and its history is in the same log as the code. A database CMS trades that for
non-developer editing and for collapsing the double-entry problem.

Payload's drafts + versions cover *some* of it (an editor can preview before publishing, and
roll back), but not review-by-another-person-before-it-goes-live.

**This is a fork worth deciding deliberately, not sliding past** — it is decision D3 below.

---

## Target architecture (proposed)

```
        Namecheap ──► Vercel DNS ──► Vercel project "scuguk"    ┐
                                       • Next.js + Payload      │  one repo
                                       • /admin  (Payload)      │  one host
                                       • /api/*  (route handlers)│
                                       • next/og share images   ┘
                                            │
                                            ├──► Neon Postgres (free tier)  — content + RSVPs
                                            ├──► Blob storage — speaker/sponsor/event media
                                            └──► Resend — contact-form + RSVP mail
```

Four services instead of eight, and **every one of them supports multiple owners on a free
tier** — a GitHub org, a Vercel team, a Neon project with members, a Namecheap account.
That answers Jeremy's original question without a shared mailbox.

`D:\vdp` (GitHub `steviemcg/vdah`) is a working reference for exactly this shape — Next.js 16 +
Payload 3 + Neon + Vercel, with R2 for media and Resend for mail. Read its `README.md`,
`src/payload.config.ts`, `next.config.ts` and `tsconfig.json` before scaffolding; the
`withPayload()` wrapper, the `@payload-config` path alias and the `(payload)` / `(frontend)`
route-group split are the config quirks worth copying rather than rediscovering.

---

## Decisions

**D1 — Host: Vercel** *(decided — Steve, 2026-09-05)*. `D:\vdp` proves the
Vercel + Payload + Neon path works, and Vercel has been a **sponsor of the group since
2025-11-25** (`src/data/sponsors/vercel.yml`). Accepted cost: a DNS cutover off Netlify DNS and
a migration off Netlify Forms. Netlify *could* have run Next SSR — this was "why fight it", not
"impossible".

**D2 — Database: Neon Postgres** *(decided — Steve, 2026-09-05, following D1)*. Free tier,
provisioned through the Vercel Marketplace, matches `D:\vdp`. Azure SQL was ruled out by
Payload having no SQL Server adapter, not by preference.

**D3 — Scope: everything into Payload** *(decided — Steve, 2026-09-05)*. Events, speakers,
sponsors and RSVPs all become Payload collections. **The accepted loss is PR review of
content** — Payload drafts/versions give preview and rollback, but not
review-by-another-person-before-publish. Recorded here so nobody later reads the absence of a
PR flow as an oversight. Jeremy has not seen this yet (N3).

### Follow-on decision this forces — design system

Under D3 every page eventually re-renders from Payload data, so the components get rewritten
either way. **Keep the existing look: Bootstrap 5 CSS + the SCSS modules under
`src/styles/theme/`, ported as-is.** Not Tailwind, despite `D:\vdp` using it — redesigning a
site people already like is a different project with a different risk profile, and it is not
in this epic's target. **Drop `reactstrap`** though: it is used for nothing but `Row`/`Col`
across 8 files, and plain `<div className="row">` on the Bootstrap grid removes a React 19
compatibility unknown for free. *(proposed — mine, 2026-09-05; say so if you want the redesign
in scope after all.)*

---

## Decisions still open

**D4 — Attendee login: keep Auth0, or replace it?**

First, what the login is actually for. Measured from the public API on 2026-09-09
(`curl https://api.scug.co.uk/events`, no auth needed):

- **955 yes-RSVPs across 39 events.** Distinct people will be far fewer — regulars attend many —
  but this is not a vestigial feature with three rows in it.
- **11 of the 39 events set `capacityIsLimited`.** Capacity and the waitlist
  (`attendingWaiting`) are genuinely used, on about a quarter of events. **This rules out
  dropping to an anonymous form**, which cannot cap numbers or run a waitlist honestly.
- Every event has at least one RSVP. 4 events are online.

So the login serves three things: capacity + waitlist, "see who else is coming", and tagging the
RSVP-er in Mailchimp. Four ways to serve them:

| | Option | Trade |
|---|---|---|
| **a** | **Keep Auth0.** | Works today, free tier, social login is the lowest-friction sign-in there is. Cost: a fifth account in a stack being shrunk, and a login wall in front of RSVPing. The do-nothing option. |
| **b** | **Payload auth for attendees** — a second auth-enabled collection alongside `users`. | Payload ships forgot-password and email verification, and Resend is already needed for plan 6. Cost: email+password is much higher friction than "sign in with Google", and a volunteer group would start storing credentials for a few hundred people — a liability it does not have today. |
| **c** | **Magic link / passwordless.** RSVP with an email address, get a signed link, click to confirm or change. | No passwords, no accounts, no credential liability, no login wall — and capacity and waitlist still work because the email address is the identity. Removes Auth0 from the stack entirely. Cost: more code than (a), and it is the option nobody has built yet. |
| **d** | **No identity at all, just a form.** | Ruled out by the 11 capacity-limited events above: anyone could RSVP fifty times and nobody could change their mind. |

*Leaning (c), with (a) as the do-nothing fallback if plan 4 runs late* — it is the only option
that removes an account **and** removes friction. **Still not decided, and one number would
sharpen it:** how many distinct rows are in the `Users` table. That needs N2 (database access).

**D5 — Newsletter: keep Mailchimp, unchanged** *(decided — Steve, 2026-09-09)*. It holds real
subscribers with regional segmentation (`NewsletterForm.tsx:8` posts five region groups) and the
API tags RSVP-ers with the event key. Migrating it is a separate project with its own consent
questions. Only the RSVP tagging call gets re-pointed when the API moves; the list, the form and
the account stay exactly as they are. Note `servers.mcsv.net` is already in the domain's SPF
record — leave it there.

---

## D6 — Handover: who holds what when people change

This is Jeremy's original question, and it is answered here rather than in *Decisions still
open* because most of it is now settled.

### The sorting rule

Not every service needs the same answer. Sort by **what does losing it cost**:

| | Losing it costs | Where it should live |
|---|---|---|
| `scug.co.uk` | Unrecoverable — anyone can re-register it, every link and reference dies | Registrar, prepaid, auto-renew, contact address not personal |
| The GitHub repo | The site and seven years of history | **A GitHub organisation with ≥2 owners** |
| The Mailchimp list | Unrecoverable — you cannot re-collect consent | Unknown; see N6 |
| Vercel project / Neon DB / Resend | An afternoon. Rebuildable from the repo. | Whoever's account is convenient |

The last row is the point: the deploy is reproducible, so it does **not** need solving.
Steve's personal Vercel account is a fine home for it.

### Decided

**Repo stays public** *(decided — Steve, 2026-09-05)*. The reasons are smaller than they first
look and the decision was made against the strongest counter-argument, so both are recorded:

- *For*: secret scanning is free and automatic on public repos and needs paid Code Security on
  private ones — so going private to avoid leaking a secret removes the free alarm that catches
  leaked secrets. Branch restrictions are free on a public repo in a **GitHub Free
  organisation** and need Team ($4/user/month) on a private one. Vercel's Open Source Program
  requires it. And going private un-publishes nothing: GitHub detaches existing forks and they
  **stay public** — there are 5.
- *Against, and correct*: the repo has had ten contributors and eight are not Steve (Alex
  Washtell alone has 113 commits to Steve's 46) — but they are organising-committee members who
  would have been given access to a private repo anyway *(Steve, 2026-09-05)*. The contributor
  count does not prove public was necessary.
- **And D3 weakens it further, on Steve's own observation**: once content lives in Payload,
  nobody PRs an event YAML any more. The "someone can fix their own speaker bio without asking
  permission" argument expires with plan 3. See *Two risks D3 introduces* below — this one
  needs an answer, not a note.

There is nothing sensitive in the repo: it holds event listings, speaker bios and sponsor logos
that are all already published on scug.co.uk. The only genuinely sensitive data in the system —
attendee RSVPs — is in the database, not the repo, and stays that way under Payload.

**A shared mailbox, as a mailbox — not as a login for everything** *(decided — Steve,
2026-09-05)*. `contact@scug.co.uk` **on the domain the group already owns**, not a Gmail or
Outlook address, so it survives changing provider and does not become another account tied to
whoever registered it. Use it to *receive*: form submissions, service notifications, domain
renewal warnings, password resets — things that currently land in Steve's inbox and die there
when he stops reading. Not as the username for all eight services: a shared credential is one
that everybody who has ever held it keeps, with no record of who did what.

**Mail is already on forwardemail.net, and both existing forwarders point at one person**
*(forced — `host -t txt scug.co.uk`, 2026-09-09)*:

```
forward-email=steve:steviemcg+scug@gmail.com
forward-email=newsletter:steviemcg+scug@gmail.com
v=spf1 include:spf.forwardemail.net include:_spf.google.com include:servers.mcsv.net ?all
google-site-verification=…
```

So `steve@` and `newsletter@scug.co.uk` both land in Steve's personal Gmail and nowhere else.
That is the bus-factor problem in miniature, already live. **Adding `contact@` to two people is
worth less than repointing `newsletter@` to two people**, because `newsletter@` already receives
things.

Multiple recipients per alias are supported on the free plan; repeat the alias rather than
relying on bare-address parsing, which means something different:

```
forward-email=contact:steve@…,contact:jeremy@…
```

Three things about the free plan that matter later:

- **Receive/forward only — no SMTP.** You cannot *send as* `contact@scug.co.uk` without the paid
  add-on. Fine for plan 6, because Resend sends the contact-form mail; but a human *replying* to
  a notification would reply from their own address unless something else is arranged.
- **Free-plan aliases are publicly searchable.** Anyone can discover that `contact@scug.co.uk`
  forwards to a particular personal address. Low stakes for a public user group, but it does
  publish the personal addresses.
- **SPF is at three includes already** (`forwardemail`, `google`, `mcsv`), and plan 6 adds
  Resend as a fourth. SPF has a hard 10-DNS-lookup limit and each include expands to several —
  worth counting before adding, not after mail starts failing. Separately, the record ends
  `?all` (neutral), which means nothing is ever marked as a forgery; `~all` would be the normal
  choice. *(observation — not a decision, and not urgent.)*

### Recommended, not yet done

- **Create a GitHub organisation and transfer `steviemcg/scuguk` into it, with Steve and Jeremy
  both as Owners.** Free: GitHub Free for organisations gives unlimited collaborators on public
  repos, and branch restrictions work on a public repo in a free org, so the protection `master`
  has today survives. GitHub's own docs recommend the owner role be held by "no less than two
  people" for ownership continuity. This is the largest bus-factor reduction available and it
  costs nothing. Watch afterwards: Netlify's GitHub App permissions are scoped to the account
  that installed it, so the build hook and the required status checks want re-checking.
  **Do not move `steviemcg/scuguk.api`** — it is private, so it would lose those features, and
  plan 7 deletes it anyway.
- **Prepay the domain for ~10 years** (~£86 at €8.60/yr), auto-renew on, registrar contact
  address pointed at the shared mailbox. Nobody touches a registrar for years at a time, so
  day-to-day access is not the risk — a silently lapsed renewal is. This removes the failure
  mode for a decade for the price of a takeaway, and needs no shared password.
- **Put the Neon database in a Neon organisation with both of them in it from day one.** Neon's
  free plan allows unlimited organisation members. The database sharing for free while the host
  does not is an absurd asymmetry, but it is free, so take it.
- **Apply to the Vercel Open Source Program.** $3,600 in platform credits over three years plus
  third-party credits; the current cohort closed 2026-09-13, cohorts run quarterly. Criteria are
  "actively developed and maintained", "hosted on or intended to host on Vercel", "measurable
  impact", and a Code of Conduct. The page leans toward tools and libraries, so a user-group
  site is **not** a certainty — but Vercel has sponsored the group since 2025-11-25
  (`src/data/sponsors/vercel.yml`), so there is plausibly a human to ask. It would resolve both
  Vercel problems below at once.

### Who owns the hosting — settled

Briefly recorded here as Alex Washtell's on 2026-09-09; **that was wrong and is retracted the
same day.** Steve reached `app.netlify.com/projects/scuguk/overview` in his own browser, so the
Netlify account is his and the handover really is Steve → Jeremy. DNS delegation is confirmed
still Netlify's (`dns[1-4].p05.nsone.net`, 2026-09-09), so that account also holds the
operational control of the domain even though Namecheap holds the registration.

Kept rather than deleted because the misreading is instructive: nobody could say from the repo,
the DNS or the build config who owned the hosting, and it took a screenshot to settle. That is
the documentation gap this epic exists to close.

### Where the Vercel account should live

**A new Vercel account, registered to the group** *(decided — Steve, 2026-09-09: "I'm going to
create a new vercel account later")*. Not either personal account.

That is Jeremy's original Slack suggestion, and for *this* service it is the right one. The
argument against a shared credential — that everybody who has ever held it keeps it, with no
audit trail — is an argument against using one as the username for all eight services. It is not
an argument against using one for a **rebuildable** service whose only alternative is welding it
to a named individual, which is the mistake being unwound. The Hobby one-seat limit stops
mattering when the *account* is the shared thing rather than a team inside it. Register it to
`contact@scug.co.uk` and keep the password in a shared vault.

### The one Vercel problem this leaves

**Hobby is one seat.** Free Vercel has no collaborators at all; Pro is $20/user/month. The
group-account answer above sidesteps this rather than solving it — two people cannot act *as
themselves*, and there is no record of who deployed what. Accepted, because the deploy is
rebuildable; the Open Source Program application is the route to a real team if it lands.
### Vercel's non-commercial restriction — raised, and accepted

Vercel's fair use guidelines restrict Hobby to non-commercial use and prohibit "the inclusion of
advertisements", stating explicitly that even asking for donations counts as commercial. The
site has a `/sponsors` page and per-event sponsor logos linking to UNRVLD, EPAM and Sitecore, so
the question is real.

**Steve has accepted the risk** *(decided — Steve, 2026-09-09: "i'll own that risk. we don't
charge any money, sponsors get a logo in return for venue + food")*. No money changes hands; a
logo in exchange for a room and catering is not a sale. The site has also been on a free
individual Netlify plan with the same logos for years without trouble. **Do not raise this
again** — if Vercel ever objects, the answer is the Open Source Program or a Pro seat, not a
redesign.

### Audit of the public history (done, 2026-09-05)

All 284 commits across every ref, full patch content, binaries and lockfiles excluded.
**Nothing found that should not be public** — no passwords, connection strings, private keys or
API secrets. Public-by-design and fine: the Auth0 SPA client id, the Mailchimp list/user ids,
the event GUIDs. Removed and clean: `.env.development` (only ever `SCUG_API=<url>`) and
`auth_config.json` (Auth0 domain, the same public client id, audience).

Three loose ends:

| | What | Action |
|---|---|---|
| **1** | **Google Maps browser API key `AIzaSyBr85Ei…`** — added by Steve 2019-12-08 (`5346fce`), removed by Alex Washtell 2023-09-05 (`bd1d962`) in the Next.js migration. Gone from every current tree, permanent in the public history, so readable for ~6 years. Browser Maps keys are meant to be public **but only when referrer-restricted**; unrestricted, anyone can use it and the bill lands on Steve's Google Cloud account. | Restrict to `scug.co.uk` referrers or delete it — nothing uses it. **Billing exposure, not a breach.** Needed regardless of repo visibility: the 5 forks keep the history. |
| **2** | **Sentry DSN**, added 2024-12-09 (`39e4c73`) by Alex Washtell, since removed. DSNs are public by design — worst case someone posts junk events at the quota. | The real finding is what it implies: **a Sentry account and project nobody has listed.** A ninth service in a stack being shrunk. Close it or record it. |
| **3** | **Netlify build hook inline** at `.github/workflows/main.yml:12`, public since 2022-07-06 (`42134f0`). Anyone can POST to it and trigger a production build. | Nuisance and build-minutes vector, not a data risk. Would normally belong in a repo secret — but plan 7 deletes the cron, so leave it rather than churn it. |

Also found: **18 open GitHub issues, all filed in January 2020, seventeen by Steve.** A dead
wishlist nobody has looked at in six and a half years. Close them as part of the handover so
the next person does not read a 2020 backlog as current intent.

### Two risks D3 introduces — both need an answer before plan 3

Moving content out of git is not free, and neither of these existed before the decision:

1. **The repo stops being a backup of the content.** Today the events, speakers and sponsors
   live in git — mirrored into 5 forks and every clone anyone has ever made. After plan 3 they
   live in one Neon free-tier database. Seven years of event history would sit on a single free
   tier with no second copy. **Proposed mitigation: a scheduled export of the Payload
   collections back into the repo as JSON.** It restores the off-site copy, and as a bonus it
   restores the diffable, reviewable property that D3 gives up — a content change would show as
   a commit again, after the fact rather than before it. *(proposed — mine, 2026-09-05.)*
2. **Contribution becomes gated on a Payload account.** The "anyone can PR a fix to their own
   speaker bio" route disappears; someone has to create them a user. That is the gatekeeper
   problem in a new place, and it is the reason the repo-visibility argument gets weaker after
   plan 3 rather than stronger. `src/collections/Users.ts` currently lets **any** logged-in user
   create another, so at least it is not Steve-only — but who holds an account, and how someone
   gets one, is now a handover question in its own right and nobody has answered it.

---

## Blocked on / needed from outside

| # | Need | Why | Who |
|---|---|---|---|
| N1 | **Netlify access** — a personal access token, or add Claude via the Netlify MCP/plugin. The account is **Steve's** (settled 2026-09-09) | Cannot otherwise see the site config, the Forms submissions, the DNS records or the build settings. No Netlify CLI installed either (`npm i -g netlify-cli`). Lower priority now that the migration moves off Netlify anyway — the one thing genuinely wanted from it is the archive of contact-form submissions. | Steve |
| N2 | **Azure SQL firewall + credentials** for server `scuguk` (UK South, admin `scuguk-admin`) | Need row counts and a data export to size the migration and answer D4. The password is not in the App Service app settings — it is in connection string `scuguk`. | Steve |
| N3 | **Tell Jeremy what D3 costs him** — content moves out of git, so no more PR review of an event page before it publishes | Decided without him on 2026-09-05; he is the one who will be adding events, so he should get the chance to push back before plan 3 makes it irreversible. | Steve → Jeremy |
| N4 | **Auth0 tenant access** (`scug.eu.auth0.com`) | Only if D4 lands on "keep Auth0". | Steve |
| ~~N5~~ | ~~A Postgres to point at~~ — **done 2026-09-09.** Steve started Docker Desktop; a dedicated `scuguk-postgres` container runs on **5433**, deliberately not the `boss-postgres` on 5432 that belongs to another project. Command in `AGENTS.md` § *The local database*. | Unblocked plan 1. A hosted Neon database is still needed before anything deploys, but nothing is waiting on it today. | — |
| N6 | **Whether Mailchimp's free tier allows a second user** | It is the third of the three irreplaceable assets in D6 and the one least is known about. If it is single-user, it is the strongest case for the shared mailbox being the actual login. | Steve |
| ~~N7~~ | **The Google Maps key in the public history** — now tracked as **[issue #242, "Restrict or delete the legacy Google Maps API key exposed in git history"](https://github.com/steviemcg/scuguk/issues/242)** | Off the critical path by Steve's decision, 2026-09-09. Still needs doing: six years exposed, billing exposure on the owning Google Cloud project, and the 5 forks keep the history whatever this repo does. | Steve |
| N8 | **Repoint `newsletter@scug.co.uk`** (and add `contact@`) to two people, not just Steve's Gmail | Both existing forwarders go to one personal inbox. `newsletter@` already receives mail, so fixing it is worth more than adding a new alias. See D6. | Steve |

---

## Plan inventory

| # | Plan | Status | Notes |
|---|---|---|---|
| 0 | Discovery + `AGENTS.md` + this doc | **done** — `7afaeca` | Current state verified against Azure, GitHub, DNS on 2026-09-05 |
| 1 | Scaffold Next 16 + Payload 3 + Postgres **in place**, existing pages still rendering | **done** — `dc41f08`, admin verified 2026-09-09; **re-verified 2026-11-12 on the merged branch** (merge commit `e75278d` on `payload-overhaul`) | `/admin` loads, schema pushed, first-user wizard renders. Evidence below. On 2026-11-12: `yarn build` and `yarn typecheck` pass, `yarn lint` has 0 errors and the 2 known warnings, the public pages checked return 200, and `/admin` and `/admin/login` load against the local database. |
| 2 | Model events/speakers/sponsors as collections; import the YAML events, speakers, sponsors | **done** — verified 2026-09-09 (21 events, 109 agenda entries, 35 speakers, 14 sponsors, 4 locations, 55 media); **re-run 2026-11-12 on the merged branch: 23 events, 118 agenda entries, 40 speakers, 16 sponsors, 4 locations, 64 media** | September: counts and rich-text fidelity checked, see below. 2026-11-12: counts, repeatability and the November event checked; rich text for the new events was not. |
| 3 | Port the pages to App Router reading from Payload; drop `reactstrap`, keep the SCSS | not started | Where `output: 'export'` and the nightly cron die |
| 4 | Port the RSVP/attendance API to route handlers; migrate the SQL data | not started | Blocked on N2 and D4. Decide the 18 orphan rows. |
| 5 | Replace the Puppeteer share-image pipeline with `next/og`, reading from Payload | not started | Was a candidate to go first; under D3 it would have had to be built twice |
| 6 | Contact form → Payload collection + Resend | not started | Netlify Forms is host-coupled, so this lands with the cutover |
| 7 | Cut DNS over; delete the cron, the Azure RG, and the `scuguk.api` repo | not started | The exit criterion |

---

## What can be tested right now

In the worktree `.claude/worktrees/payload-overhaul-merge` (branch `payload-overhaul`, pushed to
`origin/payload-overhaul`). The original worktree `.claude/worktrees/payload-overhaul` (branch
`worktree-payload-overhaul`, the eight commits as of 2026-09-09) is kept unchanged.

```bash
npx --yes yarn@1.22.22 install --ignore-engines   # --ignore-engines only because this machine runs Node 24.13
yarn prebuild && yarn dev                          # http://localhost:8000
```

The database is the `scuguk-postgres` container on 5433 (`AGENTS.md`, *The local database*).
Its data lives in the Docker volume `scuguk-pgdata`, which outlived the container: the container
had been removed, and recreating it with the same volume brought the September import back.

**Verified** (2026-09-05, on `pnpm build && pnpm start`; the package manager was pnpm then and is
yarn since 2026-11-12, so the commands in this and the next section are as they were run):

| Check | Result |
| --- | --- |
| `pnpm build` | passes — 53 pages, all 21 events + their `/ad` variants prerendered |
| `pnpm typecheck` | passes |
| `pnpm lint` | passes (2 known `no-img-element` warnings, owned by plan 3) |
| `/`, `/events`, `/sponsors`, `/events/2026-09-london-sitecore-usergroup` | HTTP 200, render identically to production |
| reactstrap → `@/components/Grid` | grid classes byte-identical to <https://scug.co.uk> across 5 pages, including the two most nested ones |
| `/admin` | **HTTP 200** in 11.7s cold (2026-09-09). Payload connected, pushed its schema, and served the first-user wizard, correctly titled "Create first user — Sitecore User Group UK". |
| Database schema | 9 tables created by the schema push: `users`, `users_sessions`, `media`, `payload_kv`, `payload_locked_documents(_rels)`, `payload_migrations`, `payload_preferences(_rels)`. |

### Plan 2 — the content is in Payload (verified 2026-09-09)

`pnpm import:content --write`, then checked three ways rather than taking the script's word:

| Check | Result |
| --- | --- |
| Row counts, straight from Postgres | 21 events · 35 speakers · 14 sponsors · 4 locations · 55 media |
| Agenda blocks, per block table | 53 talk + 53 item + 3 tbd = **109**, matching the YAML inventory exactly; 18 link rows; 72 relationship rows |
| Every event has a location | `select count(location_id) from events` → 21 of 21 |
| Rich text survived the HTML→Lexical conversion | 9 links (matching the 9 `<a>` tags in the source), 3 lists / 8 list items, 3 headings, and 28 text nodes carrying bold / italic / underline. `.claude/scripts/verify-import.mjs` |
| The sponsor-date drift is gone | The hook rewrote all three: Sitecore 2024-11-14 → **2026-09-24**, UNRVLD 2024-03-06 → **2026-03-19**, Avanade 2023-01-11 → **2023-02-01**. The four sponsors with no events kept their seeded YAML dates. |
| A spot-check through the API and the admin UI | The March 2026 event: title, date, venue, both sponsors, all 7 agenda entries with the right speakers attached, `legacyEventId` carried over, and the intro rendering in the editor with its bold and underline intact. |

**One known loss, and it was reported rather than swallowed:** two events wrap a paragraph in
`<p className="alert alert-warning">`. Lexical keeps the text and drops the class, so those
callouts are ordinary paragraphs until plan 3 gives them a Callout block.

### Re-verified 2026-11-12, on the merged branch

`master` (`3cccbc8`) merged into `payload-overhaul`; dependencies installed with yarn 1.22.22
(`yarn.lock` regenerated by that install; no `pnpm-lock.yaml` and no `package-lock.json`).

| Check | Result |
| --- | --- |
| `yarn typecheck` | passes. It needs `next-env.d.ts`, which `yarn build` or `yarn dev` generates, so run one of those first |
| `yarn lint` | 0 errors and the 2 known `no-img-element` warnings. Prettier flagged `EventAgenda.tsx`, where `master`'s edit used 4-space indentation; it was reformatted |
| `yarn build` | passes; `/`, `/events`, `/sponsors`, `/contact`, `/newsletter`, and the `/events/[key]` and `/events/[key]/ad` pages generate |
| `yarn dev`, then `curl` | `/`, `/events`, `/sponsors`, `/events/2026-11-london-sitecore-usergroup`, `/events/2026-09-manchester-meetup` and `/api/events?limit=1` all HTTP 200. `/admin` HTTP 200 (48 s cold); `/admin/login` is titled "Login — Sitecore User Group UK". A user already exists in the database, so the first-user wizard was not seen this time |
| Schema push | the 18 `public` tables were already there from September and the dev server connected without error; nothing new was pushed because no collection changed |
| Import, before | row counts straight from Postgres before the run: 21 events, 109 agenda entries, 35 speakers, 14 sponsors, 4 locations, 55 media |
| `yarn import:content` | dry run, then `--write`, then `--write` again; all exit 0 and each reports 23 events, 118 agenda entries, 40 speakers, 16 sponsors, 4 locations, 64 media, with 6 warnings (the "Online" location has no image, two speakers have no image, the two alert callouts, and one agenda entry with no `type`) |
| Import, after | **23 events, 118 agenda entries, 40 speakers, 16 sponsors, 4 locations, 64 media**, equal to the YAML inventory. After the second `--write` there were no duplicate slugs in `events` and no duplicate filenames in `media` (`count(*) - count(distinct …)` = 0 for each), so the import is repeatable |
| New content | `2026-11-london-sitecore-usergroup` (2026-11-19) is in `events` with its three talks, including "A comparison of the stand-alone Sitecore Search and SitecoreAI Search", and Michael Haahr and Benj Bayfield are linked to it. `2026-09-manchester-meetup` (2026-09-17) is in too |

Not re-checked on 2026-11-12: the HTML to Lexical conversion of the new events' `intro` text
(`.claude/scripts/verify-import.mjs`), the `syncSponsorDates` hook on the two new sponsors
(Macmillan and XCentium), and an authored edit through the admin.

**Still unverified:** nothing has been *authored* through the admin — the import writes through
Payload's local API, which is not the same code path as a human filling in the form and hitting
Save. And everything above is local: no Neon database, no Vercel project, nothing deployed.

Production is untouched: <https://scug.co.uk> still serves the `master` static export, and the
old API at <https://api.scug.co.uk/events> still answers.
