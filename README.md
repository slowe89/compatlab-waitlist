# CompatLab

Demand-test waitlist for **CompatLab** — compatibility testing for remote MCP servers. Static Vite site: landing copy, client-side MCP Client Readiness Score, and a waitlist form. No product backend, checkout, or cart.

Capture: **thespencerlowe@gmail.com** via FormSubmit.

Meta title: `CompatLab — compatibility testing for remote MCP servers`

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

```bash
npm test
```

runs the scoring and FormSubmit-acknowledgment checks.

## Form

The form’s default action is FormSubmit.co:

`https://formsubmit.co/thespencerlowe@gmail.com`

The first live submit sends FormSubmit an activation mail to that address. After you confirm it, later submissions arrive as email.

Hidden fields on submit: `_subject` (`CompatLab waitlist`), `_honey`, `source` (`compatlab-scorecard` or `compatlab-waitlist`), `score_total`, `score_vector` (Y/N), and `timestamp`.

Success is shown only after FormSubmit acknowledges delivery. A `?submitted` query does not claim success.

## What’s on the page

- Compatibility-testing promise, illustrative failure-map example, Ship pack benefits, who-for/who-not, and early pricing
- 10-item MCP Client Readiness Score (Yes = 10, No = 0; bands 0–100: Baseline not established / Some checks covered / Most checks covered / Checklist largely covered)
- Waitlist form (required email + Q1–Q5 + budget bands Under $300 / $300–$799 / $800–$1,500 / $1,500–$3,000 / $3,000+ / Not sure yet)
- Optional MCP URL and client multi-select

This is a waitlist / score follow-up page only. Packaging is unproven. No payment is taken here.

## Preview

Browser-verified shots of the polished page:

- [docs/polish-qa/hero-desktop.png](docs/polish-qa/hero-desktop.png)
- [docs/polish-qa/hero-mobile.png](docs/polish-qa/hero-mobile.png)
- [docs/polish-qa/pricing-mobile.png](docs/polish-qa/pricing-mobile.png)
- [docs/polish-qa/scorecard-desktop.png](docs/polish-qa/scorecard-desktop.png)
- [docs/polish-qa/form-desktop.png](docs/polish-qa/form-desktop.png)
- [docs/polish-qa/form-success.png](docs/polish-qa/form-success.png)
