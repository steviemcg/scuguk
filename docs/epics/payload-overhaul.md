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

> **Status 2026-09-05.** Discovery done. **Host = Vercel, database = Neon, scope = everything
> into Payload** — all three decided by Steve on 2026-09-05 and recorded under *Decisions*.
> Plan 1 (the scaffold) is **built and the public site is verified against production; the
> Payload admin is not** — there is no database to point it at yet (N5). D4 (attendee login),
> D5 (Mailchimp) and D6 (handover mechanics) are still open and block nothing immediately.
>
> **One thing found here wants fixing regardless of what this epic decides:** the SQL row
> behind the **September 2026** event page has its date stored as **2023-09-26** instead of
> 2026-09-24, so the RSVP API reports no upcoming events at all. Detail and blast radius in
> *Current architecture* §2. It needs a one-column `UPDATE`, which needs N2 (database access).

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

**1. There is no server, so a cron job stands in for the passage of time.**
`next.config.js` sets `output: 'export'`. `getUpcomingEvents()`
(`src/util/data/events.ts:19`) compares each event's date to `new Date()` **at build time**.
So `.github/workflows/main.yml` POSTs a Netlify build hook every night at 02:00 UTC purely so
that yesterday's event stops being tomorrow's. Nothing else in the repo needs that cron.

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
Auth0's free tier and the existing `LoginSubjects` rows are real; but it is a fifth account in
a stack we are shrinking, and the SPA client id is hardcoded in `src/pages/_app.tsx:26`.
Payload has its own auth, but it is built for editors, not for hundreds of attendees signing in
with socials. *No recommendation yet* — this needs a look at how many distinct users are
actually in the `Users` table. **Blocked on: reading the production database** (see below).

**D5 — Newsletter: keep Mailchimp?**
It holds real subscribers with regional segmentation (`NewsletterForm.tsx` posts five region
groups), and the API tags RSVP-ers with the event key. Migrating it is a separate project with
its own consent questions. *Recommend leaving Mailchimp exactly as it is* and re-pointing only
the RSVP tagging call.

**D6 — Handover mechanics.**
The finding in §4 above changes the offer that was made in Slack. Someone has to tell Jeremy
that transferring the App Service is not the cheap option, and that deleting it is. Also open:
whether the GitHub repo moves to an organisation (which is the actual multi-owner primitive)
rather than staying under `steviemcg`.

---

## Blocked on / needed from outside

| # | Need | Why | Who |
|---|---|---|---|
| N1 | **Netlify access** — a personal access token, or add Claude via the Netlify MCP/plugin | Cannot see the site config, the Forms submissions, the DNS records or the build settings. No Netlify CLI installed either (`npm i -g netlify-cli`). | Steve |
| N2 | **Azure SQL firewall + credentials** for server `scuguk` (UK South, admin `scuguk-admin`) | Need row counts and a data export to size the migration and answer D4. The password is not in the App Service app settings — it is in connection string `scuguk`. | Steve |
| N3 | **Tell Jeremy what D3 costs him** — content moves out of git, so no more PR review of an event page before it publishes | Decided without him on 2026-09-05; he is the one who will be adding events, so he should get the chance to push back before plan 3 makes it irreversible. | Steve → Jeremy |
| N4 | **Auth0 tenant access** (`scug.eu.auth0.com`) | Only if D4 lands on "keep Auth0". | Steve |
| N5 | **A Postgres to point at** — either say "provision Neon through the Vercel Marketplace" (free tier, and it creates a Vercel project + starts deploying, which is why it has not been done unasked) or start Docker Desktop for a local one | `/admin` has never been loaded. Plan 1 is not finishable without it. | Steve |

---

## Plan inventory

| # | Plan | Status | Notes |
|---|---|---|---|
| 0 | Discovery + `AGENTS.md` + this doc | **done** — `7afaeca` | Current state verified against Azure, GitHub, DNS on 2026-09-05 |
| 1 | Scaffold Next 16 + Payload 3 + Postgres **in place**, existing pages still rendering | **built, half-verified** | Site half verified (see below); `/admin` **not** verified — no database exists yet (N5) |
| 2 | Model events/speakers/sponsors as collections; import the 21 YAML events, 35 speakers, 14 sponsors | not started | Import script, not hand-entry |
| 3 | Port the pages to App Router reading from Payload; drop `reactstrap`, keep the SCSS | not started | Where `output: 'export'` and the nightly cron die |
| 4 | Port the RSVP/attendance API to route handlers; migrate the SQL data | not started | Blocked on N2 and D4. Decide the 18 orphan rows. |
| 5 | Replace the Puppeteer share-image pipeline with `next/og`, reading from Payload | not started | Was a candidate to go first; under D3 it would have had to be built twice |
| 6 | Contact form → Payload collection + Resend | not started | Netlify Forms is host-coupled, so this lands with the cutover |
| 7 | Cut DNS over; delete the cron, the Azure RG, and the `scuguk.api` repo | not started | The exit criterion |

---

## What can be tested right now

In the worktree `.claude/worktrees/payload-overhaul` (branch `worktree-payload-overhaul`):

```bash
pnpm install && pnpm prebuild && pnpm dev   # http://localhost:8000
```

**Verified** (2026-09-05, on `pnpm build && pnpm start`):

| Check | Result |
| --- | --- |
| `pnpm build` | passes — 53 pages, all 21 events + their `/ad` variants prerendered |
| `pnpm typecheck` | passes |
| `pnpm lint` | passes (2 known `no-img-element` warnings, owned by plan 3) |
| `/`, `/events`, `/sponsors`, `/events/2026-09-london-sitecore-usergroup` | HTTP 200, render identically to production |
| reactstrap → `@/components/Grid` | grid classes byte-identical to <https://scug.co.uk> across 5 pages, including the two most nested ones |
| `/admin` | **HTTP 500 — unverified.** `missing secret key`, then it would need a database. Nothing about the admin has been proven to work. |

**Not verified, and why:** there is no Postgres to point at. Docker Desktop is not running on
this machine and no Neon database has been provisioned, so `/admin` has never been loaded. That
is N5 below and it is the whole of what stands between plan 1 and done.

Production is untouched: <https://scug.co.uk> still serves the `master` static export, and the
old API at <https://api.scug.co.uk/events> still answers.
