# Lead Generation Landing Page

**Live:** https://lead-generation-landing-page.pages.dev

A high-performance, responsive lead generation landing page with Google Tag Manager (GTM), GA4, Meta Pixel tracking, and Formspree form integration.

Built with [Astro](https://astro.build) — deployed on Cloudflare Pages global edge network.

---

## Overview

| Feature | Detail |
|---|---|
| **Framework** | Astro v7.1.6 (static site, zero JS by default) |
| **Hosting** | Cloudflare Pages (global CDN, automated deploys) |
| **Analytics** | GTM container, GA4 events, Meta Pixel-ready |
| **Form backend** | Formspree (zero-infrastructure, email delivery) |
| **Performance** | CSS inlined, HTML compressed, CLS 0, sub-100ms FCP/LCP |
| **Styling** | Pure CSS with custom properties, responsive breakpoints |
| **Package manager** | pnpm |

## Components

| Component | File | Purpose |
|---|---|---|
| `Layout.astro` | `src/layouts/Layout.astro` | Document shell with OG/Twitter meta tags, dataLayer init, GTM preconnect |
| `Analytics.astro` | `src/components/Analytics.astro` | GTM snippet + noscript iframe (injected at top of `<body>`) |
| `Hero.astro` | `src/components/Hero.astro` | Gradient hero with CTA button; scrolls to form, fires `button_click` event |
| `Features.astro` | `src/components/Features.astro` | 3-card responsive grid (01, 02, 03) |
| `LeadForm.astro` | `src/components/LeadForm.astro` | Email form with validation, spinner, Formspree POST, success/error feedback; fires `form_submit` and `lead` |
| `Footer.astro` | `src/components/Footer.astro` | Dark footer with copyright |

## Analytics Events

| Event | Trigger | Destination |
|---|---|---|
| `page_view` | Page load (automatic via GTM) | GA4 / Meta Pixel |
| `button_click` | CTA button clicked | GA4 / Meta Pixel |
| `form_submit` | Form submitted (validated) | Custom tracking |
| `lead` | Form submission succeeded (HTTP 200) | GA4 (`generate_lead`) / Meta Pixel (`Lead`) |

Events are centralized through `window.pushDataLayer(name, payload)` which pushes to `window.dataLayer`. The `lead` event only fires after a successful API response to prevent false conversions.

## Configure GA4 in GTM

1. Go to https://tagmanager.google.com → your container → **Tags** → **New**.
2. **Tag Configuration** → choose **Google Analytics: GA4 Event**.
3. Enter your **Measurement ID** (from Google Analytics admin → Data Streams).
4. **Triggering** → **Initialization - All Pages**.
5. Name it `GA4 - Page View` and save.

| Tag | Event Name | Trigger |
|---|---|---|
| `GA4 - Button Click` | `button_click` | Custom Event - `button_click` |
| `GA4 - Lead` | `generate_lead` | Custom Event - `lead` |

## Configure Meta Pixel in GTM

1. **Tags** → **New** → **Tag Configuration** → **Custom HTML**.
2. Paste your Meta Pixel base code with `fbq('init', 'YOUR_PIXEL_ID')` and `fbq('track', 'PageView')`.
3. **Trigger** → **Initialization - All Pages**.
4. Create another **Custom HTML** tag: `<script>fbq('track', 'Lead');</script>` triggered on Custom Event `lead`.

## Form Handling (Formspree)

Form submissions POST directly to Formspree at `https://formspree.io/f/mdaqvavb`. No server code needed — submissions arrive via email with built-in spam protection. Free tier: 50 submissions/month.

**Validation rules:**
- Empty field → "Email is required."
- Invalid format → "Please enter a valid email address."
- Valid email → POSTs to Formspree → "Thank you! We will be in touch."
- Network error → "Something went wrong. Please try again."

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PUBLIC_GTM_ID` | `GTM-T46X25DV` | Google Tag Manager container ID |

Copy `.env.example` to `.env` to override.

## Local Development

```sh
pnpm install          # install dependencies
pnpm dev              # start dev server at http://localhost:4321
pnpm build            # production build to ./dist/
pnpm preview          # preview production build locally
pnpm astro check      # type-check all .astro files
```

## Deployment

Already deployed at https://lead-generation-landing-page.pages.dev.

Deploys automatically when pushing to `main` (GitHub → Cloudflare Pages integration). Alternatively:

```sh
pnpm build
pnpm wrangler pages deploy dist --branch main --project-name lead-generation-landing-page
```

See [PRODUCTION.md](./PRODUCTION.md) for the full command reference.
