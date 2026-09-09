# CompatLab

Priestley demand-test interest page for **CompatLab** — a DFY MCP client-compatibility ship lab. Outside SOLVD. Static Vite site: landing copy, client-side Compat Blind Spot Scorecard, and a waitlist form. No product backend, checkout, or cart.

Capture: **thespencerlowe@gmail.com**

Meta title: `CompatLab — client-compatibility ship lab for remote MCP`

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

You can also open `index.html` after a build:

```bash
npm run build
npm run preview
```

`build` writes a static `dist/` you can host anywhere. `preview` serves that build locally.

## Form

The form’s default action is FormSubmit.co:

`https://formsubmit.co/thespencerlowe@gmail.com`

The first live submit sends FormSubmit an activation mail to that address. After you confirm it, later submissions arrive as email.

To point the same form at Formspree (or another endpoint) instead, copy `.env.example` to `.env` and set:

```bash
VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

Then rebuild. Leave it unset to keep FormSubmit → thespencerlowe@gmail.com.

Hidden fields on submit: `_subject` (`CompatLab waitlist`), `_honey`, `source` (`compatlab-scorecard` or `compatlab-waitlist`), `score_total`, `score_vector` (Y/N), and `timestamp`.

## What’s on the page

- Exact demand-test copy (headline, subhead, bullets, soft ranges, who / who not)
- 10-item Compat Blind Spot Scorecard (Yes = 10, No = 0, bands 0–100: Inspector-only / Partial / Fragile ship / Multi-client ready)
- Priestley form (required email + Q1–Q5 + budget bands Under $300 / $300–$799 / $800–$1,500 / $1,500–$3,000 / $3,000+ / Not sure yet)
- Optional MCP URL and client multi-select

This is a waitlist / score follow-up page only. Packaging is unproven.

## Preview

Browser-verified shots of the shipped page:

- [docs/hero.png](docs/hero.png) — hero
- [docs/scorecard.png](docs/scorecard.png) — Compat Blind Spot Scorecard (score 70, Fragile ship)
- [docs/form.png](docs/form.png) — Priestley form
- [docs/hero-mobile.png](docs/hero-mobile.png) — mobile hero
