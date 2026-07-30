# Lead Generation Landing Page

A high-performance, responsive landing page with GTM/GA4/Meta Pixel tracking and form integration.

Built with [Astro](https://astro.build).

## Form Handling (Formspree)

Form submissions are handled by [Formspree](https://formspree.io) — a zero-infrastructure form backend. We chose it because:

- **No server code** — the form POSTs directly to Formspree's API, eliminating the need for a backend, database, or serverless functions.
- **Instant setup** — create a form endpoint on Formspree's dashboard, paste the URL into the form action.
- **Email notifications** — each submission is forwarded to the account owner's email with no additional configuration.
- **Spam protection** — built-in reCAPTCHA and spam filtering without extra code.
- **Free tier** — handles up to 50 submissions/month at no cost.

### Configuration

1. Sign up at [formspree.io](https://formspree.io) and create a new form.
2. Copy your form endpoint URL (e.g. `https://formspree.io/f/xxxxx`).
3. Open `src/components/LeadForm.astro` and replace the fetch URL with yours.

## Environment Variables

| Variable | Description |
|---|---|
| `PUBLIC_GTM_ID` | Google Tag Manager container ID (e.g. `GTM-XXXXXXX`) |

Copy `.env.example` to `.env` and fill in your values.

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build to `./dist/` |
| `pnpm preview` | Preview production build |
