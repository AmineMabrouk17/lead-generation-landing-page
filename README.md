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

### Recommended GTM tags

From the GTM dashboard, create these tags:

| Tag | Type | Trigger | Event Name |
|-----|------|---------|------------|
| GA4 - Page View | Google Analytics: GA4 Event | Initialization - All Pages | `page_view` |
| GA4 - Button Click | Google Analytics: GA4 Event | Custom Event - `button_click` | `button_click` |
| GA4 - Lead | Google Analytics: GA4 Event | Custom Event - `lead` | `generate_lead` |
| Meta Pixel - Base | Custom HTML | Initialization - All Pages | Facebook Pixel snippet |
| Meta Pixel - Lead | Custom HTML | Custom Event - `lead` | `fbq('track', 'Lead')` |

Create these **Custom Event triggers** first:

| Trigger Name | Event Name |
|---|---|
| `CE - Button Click` | `button_click` |
| `CE - Form Submit` | `form_submit` |
| `CE - Lead` | `lead` |

### dataLayer events fired

| Event | When | Where |
|---|---|---|
| `page_view` | Page load (automatic via GTM) | — |
| `button_click` | CTA button clicked | `Hero.astro` |
| `form_submit` | Form submitted | `LeadForm.astro` |
| `lead` | Form submission succeeded (HTTP 200) | `LeadForm.astro` |

All events are pushed via `window.pushDataLayer(name, payload)` which centralizes to `window.dataLayer`. Events fire exactly once per trigger — the `lead` event only fires after a successful API response, preventing false conversions.

### Testing

1. Open Chrome DevTools Console and type `window.dataLayer` to see all events.
2. Use **GTM Preview Mode** to verify tags fire without duplication.
3. Install **Meta Pixel Helper** and **GA4 DebugView** for pixel/analytics verification.

## Form Handling (Formspree)

Form submissions are handled by [Formspree](https://formspree.io).

**Why Formspree?** No backend code required — the form POSTs directly to their API, submissions arrive in your email, and it includes built-in spam protection. Free tier covers up to 50 submissions/month.

### Formspree Configuration

The form currently posts to `https://formspree.io/f/mdaqvavb`. To use your own Formspree endpoint:

1. Sign up at https://formspree.io and create a new form.
2. Copy your form endpoint URL.
3. Open `src/components/LeadForm.astro` and replace the `fetch` URL.

### Form validation rules

The form validates client-side before submitting:

- **Empty field** → "Email is required."
- **Invalid format** (e.g. `abc`) → "Please enter a valid email address."
- **Valid email** → POSTs to Formspree → shows "Thank you! We will be in touch."
- **Network error** → "Something went wrong. Please try again."

A loading spinner shows during submission. The submit button is disabled while the request is in flight.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PUBLIC_GTM_ID` | `GTM-T46X25DV` | Google Tag Manager container ID |

Copy `.env.example` to `.env` to override defaults.
