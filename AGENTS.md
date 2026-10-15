# Scuguk

The website of the Sitecore User Group UK, https://scug.co.uk: a Next.js static export of the events, speakers and
sponsors kept as YAML under `src/data/`. RSVPs and sign-in go from the browser to a separate .NET API on Azure (repository
`steviemcg/scuguk.api`, private) and Auth0; neither is deployed from here. `README.md` has local setup and the event workflow.

## Goals

**Draft by Claude, 2026-10-12, for Steve to approve; merging the pull request that adds this section is that approval.**
Each goal becomes a GitHub milestone of the same name once approved; none exists yet. Sources: the Payload epic
(`docs/epics/payload-overhaul.md` on the local branch `worktree-payload-overhaul`, not pushed) and issue #242.

- **One stack a second maintainer can be handed.** Done when Jeremy can add an event, see its RSVPs and read a
  contact-form submission without Steve's Azure subscription, Auth0 tenant or Mailchimp login being involved, and the
  Azure resource group `scuguk` is deleted (the epic's exit criterion; its work is on the unpushed branch above).
- **The live site stays right until then.** Done when the homepage's next event moves on by itself after an event has
  happened (the nightly rebuild is disabled, see Deploy), RSVPs work for the next event, and the Google Maps API key
  exposed in git history is restricted or deleted (#242).

The open issues from January 2020 (#11 to #28) are about the site before its Next.js rewrite and sit under neither goal.

## Definition of done

- `yarn build` passes (see Verify for how to run it here): every event page and its `/ad` page generate.
- A new or changed event carries its social image, made with `yarn events` after `yarn build`; when speakers change,
  the old image is deleted before rebuilding (`README.md`).
- An event whose key (its URL) changes keeps the old URL working with a 301 in `netlify.toml`, as the existing
  redirects do.
- A visible change is checked at phone and desktop width.

## Verify

Locally, from the worktree root (yarn is not installed globally; `.nvmrc` says Node 18, this machine runs 24, hence
`--ignore-engines`):

```
npx --yes yarn@1.22.22 install --frozen-lockfile --ignore-engines
npx --yes yarn@1.22.22 build
```

Both pass on `master` as of 2026-10-12 (Node 24.13.1). The loop runs the same pair before it lands anything
(`LandChecks` in `.claude/agentloop/config.ps1`). `yarn dev` serves the site on http://localhost:8000 to look at a
change. `yarn events` (the social images, through puppeteer) has not been run on this machine.

A pull request gets a public Netlify preview at `https://deploy-preview-<number>--scuguk.netlify.app`. A branch the
loop lands directly gets none, so its change is checked on https://scug.co.uk once Netlify has deployed it.

## Deploy

Reaching `master` deploys to production: the Netlify site `scuguk` (Steve's account) runs `yarn build` and publishes
`out/` to https://scug.co.uk. It is static, with no server; a failed build leaves the previous deploy live. Netlify
records no GitHub deployment, so the loop has no Deployed (verify) turn here.

The pages are only rebuilt when something deploys. The GitHub Action "Schedule Netlify Build" (a nightly rebuild at
02:00) is disabled by GitHub for inactivity, so anything that depends on today's date, such as the homepage's next
event, stays as it was at the last deploy.

## People

- **Steve** owns the repository and the Netlify, Azure and Auth0 accounts behind it, and decides what the loops do here.
- **Jeremy Davis** (`jermdavis`) writes the event pages, as pull requests from his fork. He raised the access problem
  the first goal answers.
- **Alex Washtell** (`AlexKasaku`) and **Adam Seabridge** (`fluxdigital`) have write access; both have committed events and
  styling since 2021.
- **Landing:** every change the code loop makes reaches `master` as a pull request, for now (Steve, 2026-10-15);
  `AlwaysPr` in `.claude/agentloop/config.ps1`.
