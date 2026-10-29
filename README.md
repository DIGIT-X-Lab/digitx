# DIGITX Lab

Website of DIGITX, Department of Radiology, LMU University Hospital.

Live website: [thedigitxlab.com](https://thedigitxlab.com).

React, TypeScript and Vite, with shared typography and CSS in `src/site/` and Framer Motion for interactions. This is a static website; its scientific demonstrations use precomputed assets.

## Development

Requires Node.js 20 or later.

```sh
npm ci
npm run dev
```

Approved editorial copy lives in `editorial/` and `src/content/`. Team, job and publication records live in `src/data/`. Read `AGENTS.md` and `DESIGN.md` before changing the site.

## Build and deployment

```sh
npm run build
npm run preview
```

The build checks typography and prepares the vendored animation assets before creating `dist/`. Vercel deploys the `main` branch to the existing live domain; feature branches receive preview deployments.

Local review flags in `.env.local` are ignored by Git. For a production check in a working copy that enables those flags, set `VITE_SHOW_SLOTS`, `VITE_PEOPLE_PREVIEW`, `VITE_ENDING_PREVIEW`, `VITE_REVIEW_PROTOTYPE` and `VITE_DEVICE_PREVIEW` to `0` in the build environment. Review routes are not available in production. Only the six approved web portraits are included in the repository; source-resolution portraits remain local.

## Verification

```sh
npm run lint
npx tsc --noEmit -p tsconfig.app.json
npx tsc --noEmit -p tsconfig.node.json
node --test scripts/test-publication-import.mjs scripts/test-publication-archive.mjs scripts/test-story-playback.mjs scripts/test-story-evidence.mjs
```

The browser scripts in `scripts/test-hero-sequence.mjs` and `scripts/test-people-directory.mjs` document their Playwright and local-server environment variables. Publication refresh and source rules are documented in `docs/publication-updates.md`.

## License

MIT
