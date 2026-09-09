# CompatLab — polish fixes for Grok Build

**Grade: BORDERLINE**

The hero grid, labeled example and component structure are a useful foundation. Dense technical phrasing, missing font loading and uncertain score/submission messaging prevent a full pass.

Evidence: [supplied HTML, inline CSS and module JS](src/compatlab.html). [Live target](https://compatlab-waitlist.vercel.app) was unreachable. No CompatLab screenshot was available when reviewed and local browser launch was blocked. Visual consequences below are inferred from source; mobile, actual font rendering and provider delivery need Build verification.

## Top 5 quality problems

1. **The intended typography is declared but not loaded.** `--display`, `--sans` and `--mono` name Space Grotesk, Source Sans 3 and IBM Plex Mono, but the supplied HTML contains no font stylesheet or `@font-face`. Most visitors will see fallback fonts. Long `.items legend` text uses mono, and H1 is constrained to `14ch` within a two-column hero, increasing wrapping pressure.
2. **Copy assumes too much insider context.** “DFY MCP client-compatibility ship lab,” “Inspector green ≠ ship-ready,” “silent auth poison,” “PRM slash miss” and “DCR callback” appear before a plain explanation of the service. The `.fail-map` is correctly labeled as an example, but it does not explicitly say its named-client failures are illustrative, not current test findings.
3. **The score name and bands are easy to misread.** `Compat Blind Spot Scorecard` implies a high score means more blind spots, while every Yes increases readiness and 90–100 is `Multi-client ready`. Ten self-reported checks do not substantiate that claim. `.yn label` is only `2.4rem` minimum height and the scoreband repeats jargon rather than a next step.
4. **The form asks for repetitive and poorly guided effort.** Q4 asks budget, followed by a required budget band; Q5 is required “Anything else?” with a four-row box. All questions have long disappearing placeholders. `.priestley` fills a 1080px container. Field borders `#2a3354` against `#10162c` are only about 1.45:1, even though muted body text is readable.
5. **Trust and submission states contain avoidable rough edges.** `.form-hint` says “or Formspree if configured,” `.privacy` says “No SOLVD branding,” and `#fit` arrives after the interview. The module accepts HTTP success alone, discards `_honey`, automatically creates a second POST after failure, and treats any `?submitted` query as confirmation. These can show success without evidence or obscure the result of a send.

## Ordered Build fix list

### P0 — honest results and capture feedback

1. **Make success depend on delivery acknowledgment.** Apply the [rollup capture-state contract](astra-rollup.md): check the provider's actual success response body as well as HTTP status; remove the unconditional query-string success toggle; keep answers and show/focus `#form-error` on failure; offer explicit retry rather than silently invoking `O(c)` for another POST. Keep `[hidden]{display:none!important}`, which this source already has. Preserve `_honey` in submission. Keep native and AJAX FormSubmit destinations at thespencerlowe@gmail.com, with all existing metadata and `_subject=CompatLab waitlist`.
2. **Correct the visible score meaning without changing the checklist.** Rename visible score headings, CTA/result references and accessible labels to `MCP Client Readiness Score`. Preserve ten item meanings, `maturity-q1…q10`, Yes=10/No=0, thresholds and hidden metadata names. Rename bands consistently in array `S`, `.band-key`, result copy and any `[data-band=…]` CSS: `Inspector-only` → `Baseline not established`; `Partial` → `Some checks covered`; `Fragile ship` → `Most checks covered`; `Multi-client ready` → `Checklist largely covered`. Add `Higher means more checks covered. This is a self-assessment, not a compatibility test result.` Do not count unanswered items as a completed band.
3. **Clean the trust layer.** Apply copy below plus the shared `Early access` badge and early-pricing note. Explicitly label `.fail-map` as an illustrative example with version-dependent results, preserving the existing example status. Remove Formspree and SOLVD instructions from rendered copy while keeping this outside SOLVD and on FormSubmit. Preserve the privacy promise and make the offer's prelaunch status clear.

### P1 — visual craft and form clarity

4. **Load the intended fonts deliberately.** Keep Space Grotesk 600 for headings; set shared body font to IBM Plex Sans 400/500/600 and reserve IBM Plex Mono for numeric/short map labels. Add actual font loading with swap and useful fallbacks. Replace long mono `.items legend` text with 16px/1.4 body font. Use only loaded weights. Set H1 to the shared 32–56px scale and `max-width:22ch` within its column; let the grid collapse below 900px so text and map get enough width.
5. **Simplify the hero and example panel.** Use `minmax(0,1.2fr) minmax(0,1fr)` for `.hero-grid` at ≥900px and one column below. Keep the map after the copy/CTAs in mobile reading order. Set `.fail-map li` to `minmax(0,1fr) minmax(0,1.25fr)`; remove `.client{white-space:nowrap}` where it forces width. Keep existing ≤520px stacked rows. Use sentence-case 14px map labels, a 16px panel gap and 24px padding. Preserve semantic pass/fail text in addition to color. Soften the repeating diagonal body texture and remove repeated 24px/48px heavy shadows from benefit cards. Do not add more dashboard elements.
6. **Make benefits and fit readable before pricing.** Add `What’s in a Ship pack` section H2 and make card headings H3s at 20px. Use the shorter copy below. Move `#fit` between benefits and pricing; keep its existing two-column desktop/one-column mobile structure. Use the shared 64px/40px section rhythm, 48px buttons, mobile stacked CTAs and 80px sticky-header anchor offset.
7. **Keep every interview question but reduce friction.** Set intro and `.priestley` to the same centered 720px column. Use 24px field spacing, 96px minimum vertically resizable textareas and 16px input text. Keep all five questions required. Clarify Q4 as budget context and Q5 as constraints with `“Nothing else” is fine`; retain the required budget band unchanged. Move useful placeholder examples into persistent `aria-describedby` helpers. Preserve optional `mcp_url` and all four `clients` checkboxes, with `Optional context` clearly marked. Use 44px choice labels and 18px native radio/checkbox controls.
8. **Improve meaningful boundaries and pricing.** Change input/textarea/select, secondary CTA and unselected Yes/No borders to `#70819b`; keep decorative `--rule` unchanged. Use 3px visible focus outlines with 3px offset. Keep the cobalt filled selected state and native checked mark. Reset score readout margins and present final `/100` score near its CTA. Add `Early pricing` H2 and readable sentence-case note; preserve **$1,497–$2,997 Ship pack**, **$497–$997/mo retest**, **+$997 Security add-on**, including their exact scopes. Replace the 36rem mobile table scroll dependency with labeled stacked rows. The security add-on stays an auth-surface review, not a certification.

### P2 — consistency and polish

9. Update title, description and OG text to the simpler compatibility-testing promise. Keep the existing favicon and skip link if they work. Use 14px sentence-case helpers instead of uppercase mono for required markers, pricing note and form hint. Keep the example as the page's distinguishing visual.
10. Retain reduced-motion CSS and also disable smooth programmatic scrolling when requested. Add no-JS guidance explaining the live score needs JavaScript, with the native waitlist form still available. Check the module script produces no errors before changing how it loads; `type=module` already defers execution and is not itself a DOM-timing defect.

## Copy rewrites — before → after

| Location | Before | After |
| --- | --- | --- |
| Eyebrow | `DFY MCP client-compatibility ship lab` | `Compatibility testing for remote MCP servers` |
| H1 | `Inspector green ≠ ship-ready.` | `Make your MCP server work in your customers’ clients.` |
| Subhead | `CompatLab runs your remote MCP through the clients your users actually use — Cursor, VS Code, Claude Desktop/Code — and returns a client-by-client failure map + fix brief before OAuth drift kills adoption.` | `Test connections and sign-in across Cursor, VS Code, Claude Desktop and Claude Code. Get a client-by-client failure map and a clear fix brief.` |
| Hero CTAs | `Get your Compat Blind Spot Score (free)` / `Join waitlist for a Ship pack` | `Check your client readiness — free` / `Join the waitlist` |
| Example label | `example failure map` | `Illustrative example — not current client test results` Add helper: `Actual results depend on your server and client versions.` |
| Map cells | `green` / `needs-auth loop` / `PRM slash miss` / `DCR callback` / `cold restart` | `Connects` / `Sign-in loop` / `Resource URL mismatch` / `Registration callback fails` / `Fails after restart` |
| Benefit headings | `Real-client matrix — not Inspector-only.` / `Catch silent auth poison` / `Retest when clients churn` | `Test the clients customers use` / `Find connection and sign-in failures` / `Retest after client updates` |
| Benefit 2 paragraph | `Trailing-slash PRM mismatches, cached needs-auth skips, DCR/discovery regressions. The Ship pack is a failure map + fix brief, not another “works in Inspector” thread.` | `Check resource URLs, cached sign-in state and client registration. See which step fails in each client and what needs to change.` |
| Benefit 3 paragraph | `Optional monthly re-run when client MCP auth surfaces move — so last month’s connect does not become this month’s poisoned cache.` | `Optional monthly retests check whether client updates have broken a connection that worked before.` |
| Score lede | `Answer yes or no. Your total is 0–100. After you score, share it with the Priestley form below if you want a Ship pack conversation.` | `Answer 10 yes/no questions about your current client checks. Each Yes adds 10 points. No email needed to see your score.` |
| Form eyebrow / H2 | `Priestley interview` / `CompatLab waitlist / score follow-up` | `Join the waitlist` / `Tell us about your MCP server` |
| Q1 | `Current MCP auth / client-compatibility situation?` | `Which clients connect to your MCP server today, and where does sign-in or connection fail?` |
| Q2 | `Specific result most wanted?` | `What result would help you most?` Helper: `For example, a failure map or a reliable connection after restart.` |
| Q3 | `Tried before (Inspector-only, DIY, mcp-remote) and what still fails?` | `What have you tried, and what still fails?` Keep tool examples in helper text. |
| Q4 | `Budget if we prove multi-client ship readiness?` | `What could you spend to resolve this, and what would justify that budget?` Helper: `A rough estimate is fine. Choose the closest range below as well.` |
| Q5 | `Anything else?` | `Any deadlines, sign-in requirements or other constraints?` Helper: `“Nothing else” is fine.` |
| Who for / not | `MCP server authors shipping OAuth/remote MCP.` / `Readers with no server URL.` | `Operators and vendors of remote MCP servers that customers connect to through agent clients.` / `Teams without a remote server URL ready to test, or teams working only with local stdio connections.` |
| Form hint | `Delivers to thespencerlowe@gmail.com via formsubmit.co (or Formspree if configured).` | `Spencer may reply from thespencerlowe@gmail.com about your answers. Joining doesn't commit you to buy.` |
| Footer | `Demand test — packaging unproven. Capture: thespencerlowe@gmail.com` | `We're testing interest before committing to Ship packs and retests. No payment is taken here.` |

Remove the `No SOLVD branding.` sentence and retain the existing restricted-use/no-sale privacy promise. Apply the shared pricing note and `Join the waitlist` submit label. Keep field names and submitted values stable while revising visible labels.

## Acceptance checks for Build QA

- [ ] The declared heading/body fonts actually load; fallback fonts remain readable with network/font loading blocked. No unrequested weight synthesis or long mono question paragraphs.
- [ ] The hero promise and primary CTA fit above the fold at 1280×800 and 390×844; the example sits below them on mobile. No forced client-name overflow at 320/360/390/768/1280/1440px or 200% zoom.
- [ ] The example explicitly says it is illustrative. No named-client failures are presented as verified current findings.
- [ ] All ten original checklist meanings and field keys remain. All No=0, all Yes=100, thresholds and revised band CSS agree; partial answers and changed answers update correctly. Higher clearly means more checks covered.
- [ ] Every control is keyboard usable with visible focus; radio targets are at least 44px high. Borders and text meet the shared contrast targets; no sticky-header overlap.
- [ ] All five interview questions remain required; Q4/Q5 helpers reduce uncertainty. All six original budget choices, optional MCP URL and four client checkboxes are preserved.
- [ ] All three price rows retain amounts, units and scope; mobile pricing is readable without sideways discovery. Who-for/who-not precedes the interview.
- [ ] Mock success reveals/focuses confirmation; HTTP 200 rejection, HTTP error and network failure preserve the form with retry. Loading prevents duplicate clicks. `?submitted` alone cannot claim success.
- [ ] Capture is still FormSubmit → thespencerlowe@gmail.com with subject, source, total/vector, timestamp, optional values and honeypot; no automatic second POST or synthetic lead emails.
- [ ] No public Formspree, SOLVD or Priestley implementation copy remains. No-JS guidance and reduced motion work; collect desktop/mobile state proof per the rollup.
