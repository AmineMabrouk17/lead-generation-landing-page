# Production Deployment Guide

All commands used to build and deploy this project to production, with explanations.

## Project Setup

```sh
# Create the Astro project
pnpm create astro@latest

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

`pnpm create astro@latest` scaffolds a new Astro project with the interactive CLI. We chose the minimal template (no TypeScript strict mode, no additional integrations).

`pnpm install` installs all project dependencies from `package.json`.

`pnpm dev` starts the Astro dev server at `http://localhost:4321` with HMR.

## Production Build

```sh
pnpm build
```

Builds the static site into `./dist/`. Astro outputs plain HTML, CSS, and JS — no server runtime needed.

Key build config in `astro.config.mjs`:

```js
compressHTML: true,                 // minifies HTML output
build: { inlineStylesheets: 'always' } // inlines all CSS into HTML
```

## Preview Production Build Locally

```sh
pnpm preview
```

Serves the `./dist/` folder locally to verify the production build looks correct before deploying.

## Type Checking

```sh
pnpm astro check
```

Runs the Astro type checker (`@astrojs/check`) across all `.astro` files. Ensures zero type errors before deployment. Use this as a pre-deployment gate.

## Version Control

```sh
# Create and switch to a feature branch
git checkout -b feat/responsive-landing-page-with-analytics

# Stage specific files
git add <file1> <file2>

# Commit with conventional commit message
git commit -m "feat: add hero section with headline, subtitle, and CTA button"

# Push branch to remote
git push -u origin feat/responsive-landing-page-with-analytics

# Create a PR
gh pr create \
  --title "feat: High-performance responsive landing page with GTM/Meta/GA4 tracking & form integration" \
  --body "Closes #1" \
  --base main

# Sync main after PR merges
git checkout main
git pull origin main
```

Conventional commit types used: `feat` (new feature), `fix` (bug fix), `perf` (performance), `docs` (documentation), `style` (CSS/visual), `chore` (tooling).

## Cloudflare Pages Deployment

```sh
# Install wrangler CLI
pnpm add -D wrangler

# Create the Pages project (one-time setup)
pnpm wrangler pages project create lead-generation-landing-page --production-branch main

# Deploy the dist folder
pnpm wrangler pages deploy dist --branch main --project-name lead-generation-landing-page
```

`wrangler pages project create` registers a new Cloudflare Pages project. `--production-branch main` means any deploy from the `main` branch goes to the production URL.

`wrangler pages deploy dist` uploads the contents of `./dist/` to Cloudflare's global edge network.

## Alternative: Deploy via Dashboard (no CLI)

1. Push repo to GitHub.
2. Go to https://dash.cloudflare.com → Pages → Create a project → Connect to Git.
3. Select the repo, build command: `pnpm build`, output dir: `dist`.
4. Save and Deploy. Auto-deploys on every push to `main`.

## Environment Variables

```sh
# Create .env file with custom GTM ID
echo "PUBLIC_GTM_ID=GTM-XXXXXXX" > .env
```

The GTM container ID is read at build time from `import.meta.env.PUBLIC_GTM_ID`. Falls back to `GTM-T46X25DV`.

## Form Backend (Formspree)

No commands needed. The form POSTs directly to Formspree's API from the client side. To change the endpoint, update the URL in `src/components/LeadForm.astro`.

## Performance Verification

```sh
pnpm build && pnpm preview
# Then run Lighthouse in Chrome Incognito
```

Test production build in Lighthouse (not the dev server) to get accurate metrics without dev-tool overhead.
