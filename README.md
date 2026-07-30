# Lead Generation Landing Page

A high-performance, responsive landing page with GTM/GA4/Meta Pixel tracking and form integration.

Built with [Astro](https://astro.build).

## Getting Started

```sh
pnpm install
pnpm dev          # starts at http://localhost:4321
pnpm build        # production build to ./dist/
pnpm preview      # preview production build
```

## Google Tag Manager Setup

This project includes GTM out of the box. The container ID defaults to `GTM-T46X25DV`. To use your own:

1. Go to https://tagmanager.google.com and create a container.
2. Copy your container ID (e.g. `GTM-XXXXXXX`).
3. Create a `.env` file:

```bash
echo "PUBLIC_GTM_ID=GTM-XXXXXXX" > .env
```

Or update the fallback in `src/components/Analytics.astro`.

### How GTM is integrated

The GTM snippet is loaded in `src/components/Analytics.astro` and injected at the top of `<body>` (the `<script>` and `<noscript>` tags as specified by Google).

### Step-by-step: Configure GA4 in GTM

1. Go to https://tagmanager.google.com → your container → **Tags** → **New**.
2. **Tag Configuration** → choose **Google Analytics: GA4 Event**.
3. Enter your **Measurement ID** (from Google Analytics admin → Data Streams → your stream).
4. **Triggering** → choose **Initialization - All Pages**.
5. Name it `GA4 - Page View` and save.

Repeat for custom events:

| Tag | Event Name | Trigger |
|---|---|---|
| `GA4 - Button Click` | `button_click` | Custom Event - `button_click` |
| `GA4 - Lead` | `generate_lead` | Custom Event - `lead` |

To create a **Custom Event trigger**: go to **Triggers** → **New** → trigger type **Custom Event** → enter the event name (e.g. `button_click`).

### Step-by-step: Configure Meta Pixel in GTM

1. In GTM → **Tags** → **New** → **Tag Configuration** → **Custom HTML**.
2. Paste your Meta Pixel base code (from Meta Events Manager):
   ```html
   <script>
   !function(f,b,e,v,n,t,s){...} // your Facebook pixel code
   fbq('init', 'YOUR_PIXEL_ID');
   fbq('track', 'PageView');
   </script>
   ```
3. **Trigger** → **Initialization - All Pages**.
4. Name it `Meta Pixel - Base Code` and save.

5. Create another **Custom HTML** tag for lead events:
   ```html
   <script>fbq('track', 'Lead');</script>
   ```
6. **Trigger** → Custom Event → `lead`.
7. Name it `Meta Pixel - Lead Event` and save.

### Testing with GTM Preview Mode

1. In GTM, click **Preview** — this opens Tag Assistant.
2. Enter your site URL (`http://localhost:4321`) and click **Connect**.
3. A Tag Assistant window opens showing all fired tags in the left panel.
4. Click the **Get Started** button → confirm `button_click` fires **once**.
5. Submit an invalid email → confirm `form_submit` does **not** fire.
6. Submit a valid email → confirm `form_submit` fires, then `lead` fires **exactly once** on success response.

If any event fires more than once, check for duplicate triggers in GTM.

### dataLayer events fired

| Event | When | Where |
|---|---|---|
| `page_view` | Page load (automatic via GTM) | — |
| `button_click` | CTA button clicked | `Hero.astro` |
| `form_submit` | Form submitted | `LeadForm.astro` |
| `lead` | Form submission succeeded (HTTP 200) | `LeadForm.astro` |

All events are pushed via `window.pushDataLayer(name, payload)` which centralizes to `window.dataLayer`. The `lead` event only fires after a successful API response, preventing false conversions.

### Quick verification in Console

```js
window.dataLayer
// Look for: gtm.js, button_click, form_submit, lead
```

## Form Handling (Formspree)

Form submissions are handled by [Formspree](https://formspree.io) — a zero-infrastructure form backend. No server code needed: the form POSTs directly to Formspree, submissions arrive in your email, and spam protection is built in. Free tier covers up to 50 submissions/month.

The form posts to `https://formspree.io/f/mdaqvavb`. To change it, update the `fetch` URL in `src/components/LeadForm.astro`.

### Form validation rules

- **Empty field** → "Email is required."
- **Invalid format** (e.g. `abc`) → "Please enter a valid email address."
- **Valid email** → POSTs to Formspree → "Thank you! We will be in touch."
- **Network error** → "Something went wrong. Please try again."

A loading spinner shows during submission. The submit button is disabled while the request is in flight.

## Image Optimization

This landing page uses a pure CSS design (gradients, icons via CSS, no `<img>` tags). If you later add images:

1. Place them in `src/assets/` and use Astro's `<Image />` component — it auto-generates WebP/AVIF and responsive sizes.
2. Always set explicit `width` and `height` to prevent Cumulative Layout Shift (CLS).
3. Use `format="avif"` for best compression:

```astro
---
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.png';
---
<Image src={heroImg} alt="" width="800" height="600" format="avif" />
```

## Deployment

The easiest way to deploy is **Cloudflare Pages** (free, global CDN, zero config):

1. Push this repo to GitHub.
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Create a project** → **Connect to Git**.
3. Select your repo, set **Build command** to `pnpm build`, **Build output** to `dist`.
4. Click **Save and Deploy**.

No adapter or CLI needed — Astro's static output (`./dist/`) works natively with Cloudflare Pages, Netlify, and Vercel.

For CLI deployment (requires [Wrangler](https://developers.cloudflare.com/workers/wrangler/)):

```sh
pnpm build
npx wrangler pages deploy dist
```

## Performance Tuning (CLS)

If Lighthouse shows CLS (Cumulative Layout Shift) above 0.1:

- Ensure all elements have explicit dimensions (`width`/`height` or `aspect-ratio` in CSS).
- Avoid injecting dynamic content above the fold without reserving space.
- Use `font-display: optional` if loading custom fonts.
- Run Lighthouse in Incognito mode with CPU 4x slowdown for accurate mobile scores.

Current measured metrics: Performance 100 on category scoring, but CLS at 0.25 may pull the aggregate score down to ~58. Applying the above fixes typically resolves this.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PUBLIC_GTM_ID` | `GTM-T46X25DV` | Google Tag Manager container ID |

Copy `.env.example` to `.env` to override defaults.
