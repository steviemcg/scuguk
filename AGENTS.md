# Sitecore User Group UK (scug.co.uk) — Agent Instructions

Canonical project instructions for **all** coding agents (Claude Code, Codex, Cursor, Copilot).
`CLAUDE.md` is a one-line pointer that imports this file; Codex and most tools read `AGENTS.md`
directly. **Edit this file (`AGENTS.md`), never `CLAUDE.md`.** Loaded automatically.

**Core principle:** cite concrete file paths, reuse the patterns already here, never invent
infrastructure. This is a volunteer-run community site with two maintainers and no budget —
prefer removing a moving part over adding one.

**Self-maintenance:** when you change a pattern, a convention or a piece of infrastructure,
update this file to match. Keep it current.

---

## What this is

A statically-exported Next.js site for the UK Sitecore user group. Content is YAML files in
git; a separate .NET API on Azure handles event RSVPs. **Maintainers: Steve McGill
(steviemcg) and Jeremy Davis (jermdavis).**

An overhaul is in flight — see **`docs/epics/payload-overhaul.md`** before doing any
implementation work. Read it first; it is the durable record and this file is not.

---

## The moving parts

Eight services, four accounts. Every one of them was verified on **2026-09-05** by the command
shown; re-run the command rather than trusting the text if it matters.

| # | Part | Where | Verify with |
|---|---|---|---|
| 1 | **Site source** | GitHub `steviemcg/scuguk` (public), branch `master` | `gh repo view steviemcg/scuguk` |
| 2 | **Hosting + DNS + forms** | Netlify, site `scuguk`. DNS delegated to NS1 (`dns*.p05.nsone.net`) — Netlify DNS, *not* the registrar | `nslookup -type=NS scug.co.uk` |
| 3 | **Registrar** | Namecheap, `scug.co.uk`, ~€8.60/yr | (no CLI — Steve's account) |
| 4 | **API source** | GitHub `steviemcg/scuguk.api` (**private**, C#, last commit 2024-12-08) | `gh api repos/steviemcg/scuguk.api` |
| 5 | **API host** | Azure App Service `scuguk`, RG `scuguk`, West Europe. Hostnames `api.scug.co.uk` + `scuguk.azurewebsites.net` | `az webapp show -g scuguk -n scuguk` |
| 6 | **Database** | Azure SQL server `scuguk`, RG `scuguk`, **UK South**, db `scuguk`, **Basic / 5 DTU / 2 GB**, admin login `scuguk-admin` | `az sql db show -g scuguk -s scuguk -n scuguk` |
| 7 | **Attendee login** | Auth0 tenant `scug.eu.auth0.com`, SPA client `43Q01n8GCEy57DM1qmxM7C71Qw62ESy4` (hardcoded, `src/pages/_app.tsx:26`) | that file |
| 8 | **Newsletter + RSVP tagging** | Mailchimp list `us15` / `u=2f953a15d3e2810c056751401` / `id=8542525dce` (hardcoded, `src/components/NewsletterForm/NewsletterForm.tsx:8`) | that file |

Azure subscription is **`Pay-As-You-Go` `a8d404cf-caa9-4bb4-8d2a-afec9b71a747`**, tenant
`8047f36f-…` — Steve's *personal* subscription, not the Dev/Test one and not Schreuders'.
`az account set --subscription a8d404cf-caa9-4bb4-8d2a-afec9b71a747` before any `az` call, or
pass `--subscription`. Application Insights component `scuguk` lives in RG `Personal`, not RG
`scuguk`.

⚠️ **The App Service is not free, and it is not separable.** It runs on the App Service Plan
`PersonalWindowsEuropeWest` (RG `Personal`, **P0v3 Premium**) shared with **16 other personal
sites** — LEAF, LifeOS, Planner, myvdp, and so on. It is free *to the user group* because it
rides on a plan Steve pays for anyway. A resource transfer to another owner therefore cannot
just move the App Service: it would take the other 16 sites with it, or need a new plan
provisioned first. *(forced — verified 2026-09-05: `az appservice plan show -g Personal -n
PersonalWindowsEuropeWest` returns `P0v3`, and 16 of the 17 apps in `az webapp list` name it.)*
This constraint is the reason the handover conversation and the re-architecture are the same
conversation.

---

## Content model — and the join that only exists in someone's head

Content is YAML under `src/data/`, read at build time by `src/util/data/*.ts` and typed by
`src/content.types.ts`:

- `src/data/events/{key}.yml` — one file per event; the filename **is** the `eventKey` and the
  URL slug. Sibling `.jpg` is the optional in-page event image.
- `src/data/speakers/{key}.yml` + sibling image. Referenced from an agenda entry by bare key.
- `src/data/sponsors/{key}.yml` + sibling `.svg`/`.png`. Referenced from an event by bare key.
- `src/data/locations/{name}.jpg` — image only, no YAML.

`yarn prebuild` copies those sibling images into `public/data/**` (gitignored) via `copyfiles`;
the site then serves them from there. **A new event's image will 404 until `prebuild` has run.**

**The event exists twice, and nothing links the two copies.** `src/data/events/*.yml` carries
`eventId: <guid>` — that GUID is a row in the Azure SQL `dbo.Events` table, which independently
stores `EventKey`, `EventName`, `EventDate`, `Capacity`, `CapacityIsLimited` and the three
running attendance counters. Adding an event means creating the SQL row by hand and pasting its
GUID into the YAML. Nothing validates the pairing. This is the "disconnected data stores for the
page and database entities" in the overhaul brief, and collapsing it is the point of the
exercise.

⚠️ **The two copies have already drifted.** 3 of the 21 events disagree on the date, including
the live September 2026 one *(forced — cross-checked against `https://api.scug.co.uk/events` on
2026-09-05; full table and blast radius in `docs/epics/payload-overhaul.md` § Current
architecture #2)*. **Do not trust an `eventId` in a YAML file without checking it** —
`curl https://api.scug.co.uk/event/<guid>` is public and needs no auth.

The API's five tables (`Events`, `Attendance`, `Users`, `Emails`, `LoginSubjects`) are defined
in the private `scuguk.api` repo under `Database/dbo/Tables/`. `Users` holds only a name, city,
country and avatar; identity comes from Auth0 via `LoginSubjects.Subject`.

---

## Build and deploy chain

1. PR to `master` → Netlify builds a deploy preview. **`master` is protected**: required checks
   are `netlify/scuguk/deploy-preview` plus Netlify's Header/Redirect/Pages-changed rules,
   linear history required, force-push and deletion blocked. `enforce_admins` is **off**, so
   Steve can merge his own PRs without a second reviewer.
2. Merge → Netlify builds and publishes `out/` (`netlify.toml`).
3. `next.config.js` sets `output: 'export'` and `images.unoptimized` — **there is no server**.
   Everything is decided at build time, including "is this event in the future?"
4. Which is why **`.github/workflows/main.yml` POSTs the Netlify build hook every night at
   02:00 UTC**: it is a cron job whose only job is to make the clock move. `getUpcomingEvents()`
   in `src/util/data/events.ts` compares against `new Date()` *at build time*. Without the
   nightly rebuild a finished event stays on the homepage.
5. Social share images are **not** generated by the build. `yarn build` then `yarn events` runs
   `scripts/export-event-ads.ts`, which serves `out/`, drives Puppeteer at
   `/events/{key}/ad`, screenshots a 1126×569 crop and writes `public/events/{key}-image.jpg`
   — which is then committed. The script skips any file that already exists, so **updating an
   event's image means deleting the JPEG first**. `localChromePath` is a hardcoded absolute
   path to Edge on Steve's machine (`scripts/export-event-ads.ts:16`), overridable by
   `CHROME_PATH`. Netlify installs its own via `netlify-plugin-chromium`.

Redirects for renamed events live in `netlify.toml`, not in the app.

---

## Local development

Node is pinned to **v18.12.1** by `.nvmrc` and the lockfile is `yarn.lock` (there is also a
stale `package-lock.json` — prefer yarn).

```bash
yarn install
yarn prebuild   # copies data images into public/data — required, or images 404
yarn dev        # http://localhost:8000  (port 8000, not 3000)
```

`yarn build` writes `out/`. `yarn events` regenerates share images and needs a Chrome/Edge
binary (see above).

---

## Conventions in the current code

- **Pages Router** (`src/pages/`), not App Router. Data is fetched in `getStaticProps` /
  `getStaticPaths` only.
- One component per folder under `src/components/<Name>/` — `<Name>.tsx`, optional
  `<Name>.module.scss`, and an `index.ts` re-export. Import as `@/components/<Name>`.
- `@/*` maps to `src/*` (`tsconfig.json`).
- Styling is **Bootstrap 5 + reactstrap** with SCSS modules on top; shared tokens in
  `src/styles/theme/settings/`. Not Tailwind.
- SVGs are imported as React components via `@svgr/webpack` (`next.config.js`).
- The API base URL is hardcoded in `src/util/api/api.ts:7` behind a `// TODO: Move baseUrl to
  config`, and it is **`https://scuguk.azurewebsites.net`, not `api.scug.co.uk`** — the custom
  hostname is bound to the App Service with a managed certificate but nothing in this repo
  calls it.
- Event `intro` fields are **HTML strings rendered into JSX**, so they use `className`, not
  `class`. `<p className="alert alert-warning">` is the house callout — see
  `src/data/events/2026-03-london-sitecore-usergroup.yml`.
- Contact form posts to Netlify Forms (`data-netlify='true'`, honeypot field `telephone`).
  Netlify's form parser only sees fields present in the built HTML, so conditional fields are
  **rendered always and hidden with CSS** — see the comment at
  `src/components/ContactForm/ContactForm.tsx:7`. Do not switch them to conditional rendering.

---

## Worktrees

All worktrees live under `.claude/worktrees/` (gitignored). Merge target is `master`.

Always use the native **`EnterWorktree`** tool, never `git worktree add` + `cd` — only
`EnterWorktree` moves the session's working directory (the harness resets a Bash `cd` between
calls, so the fallback silently edits the main checkout).

`master` here is the default branch and is current, so the default `worktree.baseRef fresh`
(branch from `origin/master`) is correct. Do not set `head`.

The full contract — where you may write, dispatch rules, host budget, peer-collision protocols
— is the user-level **`running-worktree-agent-fanout`** skill.

---

## Multi-session work

The overhaul spans many sessions, so it lives in **`docs/epics/payload-overhaul.md`**, rewritten
as state changes rather than appended to. It carries the architecture end to end, what is done
versus not, and what can actually be tested right now. Read it before implementing; update it
when state changes.

---

## Claims carry their warrant

Every constraint recorded in a durable artifact must say where it came from — **`decided`**
(name who and when), **`forced`** (cite the error, the `file:line`, or the API behaviour that
compelled it), or **`proposed`** (say so in the artifact, not just in chat).

**A completion claim is a claim.** Attach a commit SHA, a passing test name, or a URL you
actually loaded — or write "unverified".

Two traps this repo is specifically exposed to, because almost nothing about the overhaul has
been decided yet:

- **Never write a rationale for a state nobody chose.** "The API repo is private" is a fact.
  Stating it is fine; inventing why is manufacturing a decision.
- **Never promote your own earlier proposal.** Before writing "by design", "deliberately" or
  "per the existing convention" about a *choice*, check who chose it. Options in the epic doc
  are marked `proposed` and stay that way until Steve or Jeremy says otherwise.

---

## Authoring guidance for AI responses

Cite concrete file paths. Reuse existing patterns over inventing new ones. Keep diffs minimal.
Provide patches, not prose.

**Two maintainers, and Jeremy is a Sitecore solutions architect, not a Next.js one.** Anything
he will read — a PR description, an issue, a doc — should lead with what a change *means* for
running the user group (who has to do what, when, and what breaks if nobody does) before it
gets to adapters and build steps. Nothing gets dropped; the technical half goes below.
