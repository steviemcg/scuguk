# Sitecore User Group UK

The site behind [scug.co.uk](https://scug.co.uk) — Next.js 16 + Payload 3 + Postgres.

> **This branch is mid-overhaul.** Production still runs the previous static-export build
> from `master` on Netlify. The plan, what is done, and what is still open are in
> **[`docs/epics/payload-overhaul.md`](docs/epics/payload-overhaul.md)** — read that before
> starting work. Agent-facing conventions are in [`AGENTS.md`](AGENTS.md).

## Getting started

Node 22+ and [yarn](https://classic.yarnpkg.com) 1.x (`yarn.lock` is the only lockfile; if yarn is not
installed, `npm install --global yarn`). `.nvmrc` pins the Node major.

```bash
yarn install
cp .env.local.example .env.local   # then fill in PAYLOAD_SECRET and DATABASE_URL
yarn prebuild                      # copies content images into public/data (see below)
yarn dev                           # http://localhost:8000
```

The public site is at `/`; the Payload admin is at `/admin`. On first run, `/admin` offers a
first-user wizard — create yourself an account there.

`DATABASE_URL` must point at a Postgres. **The public pages render without one** (they still
read YAML from `src/data/`), but `/admin` returns a 500 until it is set.

## Scripts

| Script | What |
| --- | --- |
| `yarn dev` | Dev server on **port 8000** (not 3000) |
| `yarn build` / `yarn start` | Production build and server |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn lint` / `yarn lint:fix` | ESLint + Prettier |
| `yarn prebuild` | Copies `src/data/**` sibling images into `public/data/` — **a new event's image 404s until this runs.** Also runs automatically before `yarn build`. |
| `yarn payload:generate:types` | Regenerates `src/payload-types.ts` after editing a collection |
| `yarn payload:generate:importmap` | Regenerates the admin import map after adding a custom admin component |
| `yarn payload:migrate` / `:create` | Database migrations |

## Content today

The public pages still read events, speakers and sponsors from YAML under `src/data/`, one file
per item, with the filename as the key. The same content has been modelled as Payload
collections and can be imported (`yarn import:content`, plan 2 of the epic), but nothing renders
from Payload yet; that is plan 3. Until then the YAML is the source of truth: add or edit events
there.

`<p className="alert alert-warning">` inside an event's `intro` is the house callout block —
that field is HTML rendered into JSX, so it takes `className`, not `class`.

## Wishlist

- Add support for dietary requirements when booking attendance

## Environment variables

See `.env.local.example`. `PAYLOAD_SECRET` and `DATABASE_URL` are required;
`BLOB_READ_WRITE_TOKEN` is optional locally and uploads fall back to disk without it.
