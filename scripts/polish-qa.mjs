import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const BASE = process.env.QA_BASE || "http://127.0.0.1:5173";
const OUT = new URL("../docs/polish-qa/", import.meta.url);
const outDir = fileURLToPath(OUT);
const issues = [];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});

function note(ok, message) {
  const mark = ok ? "PASS" : "FAIL";
  if (!ok) issues.push(message);
  console.log(`${mark}  ${message}`);
}

async function screenshot(page, name) {
  const path = fileURLToPath(new URL(name, OUT));
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function fullPage(page, name) {
  const path = fileURLToPath(new URL(name, OUT));
  await page.screenshot({ path, fullPage: true });
  return path;
}

async function overflow(page, label) {
  const data = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    inner: window.innerWidth,
    body: document.body.scrollWidth,
  }));
  note(
    data.doc <= data.inner + 1 && data.body <= data.inner + 1,
    `${label} no horizontal overflow (${data.doc} vs ${data.inner})`,
  );
}

async function fonts(page) {
  const families = await page.evaluate(() => {
    const h1 = getComputedStyle(document.querySelector("h1")).fontFamily;
    const body = getComputedStyle(document.body).fontFamily;
    const legend = getComputedStyle(document.querySelector(".items legend")).fontFamily;
    return { h1, body, legend };
  });
  note(families.h1.includes("Space Grotesk"), `H1 uses Space Grotesk (${families.h1})`);
  note(families.body.includes("IBM Plex Sans"), `body uses IBM Plex Sans (${families.body})`);
  note(
    families.legend.includes("IBM Plex Sans") && !families.legend.includes("IBM Plex Mono"),
    `score legends use body font (${families.legend})`,
  );
}

async function withPage(viewport, fn) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
  await page.goto(BASE, { waitUntil: "networkidle" });
  try {
    await fn(page);
  } finally {
    await context.close();
  }
}

await withPage({ width: 1280, height: 800 }, async (page) => {
  await screenshot(page, "hero-desktop.png");
  await overflow(page, "1280x800");
  await fonts(page);

  const heroAboveFold = await page.evaluate(() => {
    const h1 = document.querySelector("h1").getBoundingClientRect();
    const cta = document.querySelector(".cta-row .btn.primary").getBoundingClientRect();
    return h1.bottom < 800 && cta.bottom < 800 && h1.top >= 0;
  });
  note(heroAboveFold, "1280x800 hero promise and primary CTA above the fold");

  const copy = await page.evaluate(() => document.body.innerText);
  note(copy.includes("Illustrative example"), "example is labeled illustrative");
  note(!/Formspree|SOLVD|Priestley interview|No SOLVD/i.test(copy), "no Formspree/SOLVD/Priestley visitor copy");
  note(copy.includes("MCP Client Readiness Score"), "score heading renamed");
  note(copy.includes("thespencerlowe@gmail.com"), "FormSubmit recipient remains visible in reply copy");
  note(copy.includes("$1,497–$2,997"), "Ship pack price preserved");
  note(copy.includes("$497–$997/mo"), "retest price preserved");
  note(copy.includes("+$997"), "security add-on price preserved");

  await page.locator("#ranges").scrollIntoViewIfNeeded();
  await screenshot(page, "pricing-desktop.png");

  const items = page.locator("#score-items li");
  note((await items.count()) === 10, "ten score items remain");

  await page.locator("#scorecard").scrollIntoViewIfNeeded();
  await screenshot(page, "scorecard-empty-desktop.png");

  for (let i = 0; i < 7; i += 1) {
    await items.nth(i).getByLabel("Yes", { exact: true }).click();
  }
  for (let i = 7; i < 10; i += 1) {
    await items.nth(i).getByLabel("No", { exact: true }).click();
  }

  const completed = (await page.locator("#score-total").innerText()).replace(/\u00a0/g, " ");
  const band = await page.locator("#score-band").innerText();
  note(completed.includes("70 / 100"), `completed score shows /100 (${completed})`);
  note(band === "Most checks covered", `70 maps to Most checks covered (${band})`);
  note(await page.locator("#score-invite").isVisible(), "completed invite is visible");

  await page.locator("#scorecard").scrollIntoViewIfNeeded();
  await fullPage(page, "scorecard-desktop.png");

  await items.nth(7).getByLabel("Yes", { exact: true }).click();
  const changed = (await page.locator("#score-total").innerText()).replace(/\u00a0/g, " ");
  note(changed.includes("80 / 100"), `changed answer updates total (${changed})`);

  await page.locator("#waitlist").scrollIntoViewIfNeeded();
  await screenshot(page, "form-desktop.png");

  const yn = await page.locator(".yn label").first().evaluate((el) => el.getBoundingClientRect().height);
  note(yn >= 44, `Yes/No label height is at least 44px (${yn})`);

  await page.goto(`${BASE}/?submitted=1`, { waitUntil: "networkidle" });
  note(await page.locator("#priestley-form").isVisible(), "?submitted does not hide the form");
  note(!(await page.locator("#form-success").isVisible()), "?submitted does not show success");
});

await withPage({ width: 1440, height: 900 }, async (page) => {
  await overflow(page, "1440x900");
  await screenshot(page, "hero-1440.png");
});

await withPage({ width: 768, height: 1024 }, async (page) => {
  await overflow(page, "768x1024");
  await screenshot(page, "hero-tablet.png");
});

await withPage({ width: 390, height: 844 }, async (page) => {
  await overflow(page, "390x844");
  await screenshot(page, "hero-mobile.png");

  const hero = await page.evaluate(() => {
    const h1 = document.querySelector("h1").getBoundingClientRect();
    const cta = document.querySelector(".cta-row .btn.primary").getBoundingClientRect();
    const map = document.querySelector(".fail-map").getBoundingClientRect();
    const copyBottom = document.querySelector(".cta-row").getBoundingClientRect().bottom;
    return {
      h1Bottom: h1.bottom,
      ctaBottom: cta.bottom,
      mapTop: map.top,
      mapAfterCtas: map.top >= copyBottom - 1,
      ctaText: document.querySelector(".cta-row .btn.primary").innerText.replace(/\s+/g, " "),
    };
  });
  note(hero.h1Bottom < 844 && hero.ctaBottom < 844, "390x844 hero promise and primary CTA above the fold");
  note(hero.mapAfterCtas, "example sits below CTAs on mobile");
  note(
    hero.ctaText === "Check your client readiness — free",
    `primary CTA copy is intact (${hero.ctaText})`,
  );

  await page.locator("#ranges").scrollIntoViewIfNeeded();
  const tableOverflow = await page.evaluate(() => {
    const table = document.querySelector(".price-table");
    return {
      scroll: table.scrollWidth,
      client: table.clientWidth,
    };
  });
  note(
    tableOverflow.scroll <= tableOverflow.client + 1,
    `mobile pricing does not require sideways scroll (${tableOverflow.scroll} vs ${tableOverflow.client})`,
  );
  await screenshot(page, "pricing-mobile.png");

  await page.locator("#scorecard").scrollIntoViewIfNeeded();
  const items = page.locator("#score-items li");
  for (let i = 0; i < 10; i += 1) {
    await items.nth(i).getByLabel("Yes", { exact: true }).click();
  }
  note(
    (await page.locator("#score-total").innerText()).replace(/\u00a0/g, " ") === "100 / 100",
    "all Yes = 100",
  );
  await screenshot(page, "scorecard-mobile.png");

  await page.locator("#waitlist").scrollIntoViewIfNeeded();
  await screenshot(page, "form-mobile.png");
});

await withPage({ width: 360, height: 800 }, async (page) => {
  await overflow(page, "360x800");
});

await withPage({ width: 320, height: 568 }, async (page) => {
  await overflow(page, "320x568");
  await screenshot(page, "hero-320.png");
  const clientWrap = await page.evaluate(() => {
    const clients = [...document.querySelectorAll(".fail-map .client")];
    return clients.every((el) => el.scrollWidth <= el.clientWidth + 1);
  });
  note(clientWrap, "320px client names do not overflow their cells");
});

await withPage({ width: 640, height: 400 }, async (page) => {
  await page.setViewportSize({ width: 640, height: 400 });
  await page.evaluate(() => {
    document.body.style.zoom = "2";
  });
  const overflowAtZoom = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    inner: window.innerWidth,
  }));
  note(
    overflowAtZoom.doc <= overflowAtZoom.inner + 2,
    `200% zoom no document overflow (${overflowAtZoom.doc} vs ${overflowAtZoom.inner})`,
  );
});

await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.route("**/formsubmit.co/ajax/**", async (route) => {
    const body = route.request().postDataBuffer();
    const text = body ? body.toString("utf8") : "";
    await writeFile(fileURLToPath(new URL("last-submit.txt", OUT)), text);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: "true", message: "Email sent" }),
    });
  });

  await page.locator("#waitlist").scrollIntoViewIfNeeded();
  await page.getByLabel(/Work email/).fill("qa@example.com");
  await page.locator("#q1").fill("Cursor loops on sign-in; VS Code connects.");
  await page.locator("#q2").fill("A failure map.");
  await page.locator("#q3").fill("Inspector-only so far.");
  await page.locator("#q4").fill("Around $2,000 if a stranger can connect.");
  await page.locator("#q5").fill("Nothing else");
  await page.getByLabel("Not sure yet").check();
  await page.getByLabel("Cursor", { exact: true }).check();
  await page.getByLabel("VS Code", { exact: true }).check();

  await page.getByRole("button", { name: "Join the waitlist" }).click();
  await page.locator("#form-success").waitFor({ state: "visible" });
  note(await page.locator("#form-success").isVisible(), "mock success reveals confirmation");
  const focused = await page.evaluate(() => document.activeElement?.id);
  note(focused === "form-success", `success panel is focused (${focused})`);
  await screenshot(page, "form-success.png");
});

await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.route("**/formsubmit.co/ajax/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: "false", message: "Rejected" }),
    });
  });

  await page.locator("#email").fill("qa@example.com");
  await page.locator("#q1").fill("Keep this answer");
  await page.locator("#q2").fill("Keep this answer");
  await page.locator("#q3").fill("Keep this answer");
  await page.locator("#q4").fill("Keep this answer");
  await page.locator("#q5").fill("Nothing else");
  await page.getByLabel("Under $300").check();
  await page.getByRole("button", { name: "Join the waitlist" }).click();
  await page.locator("#form-error").waitFor({ state: "visible" });
  note(await page.locator("#priestley-form").isVisible(), "HTTP 200 rejection keeps the form");
  note((await page.locator("#q1").inputValue()) === "Keep this answer", "answers survive rejection");
  note(
    (await page.getByRole("button", { name: "Join the waitlist" }).isEnabled()),
    "retry is enabled after rejection",
  );
});

await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.route("**/formsubmit.co/ajax/**", async (route) => {
    await route.fulfill({ status: 500, body: "nope" });
  });
  await page.locator("#email").fill("qa@example.com");
  await page.locator("#q1").fill("A");
  await page.locator("#q2").fill("B");
  await page.locator("#q3").fill("C");
  await page.locator("#q4").fill("D");
  await page.locator("#q5").fill("E");
  await page.getByLabel("$3,000+").check();
  await page.getByRole("button", { name: "Join the waitlist" }).click();
  await page.locator("#form-error").waitFor({ state: "visible" });
  note(await page.locator("#priestley-form").isVisible(), "HTTP error keeps the form");
  await screenshot(page, "form-error.png");
});

await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.route("**/formsubmit.co/ajax/**", async (route) => {
    await route.abort("failed");
  });
  await page.locator("#email").fill("qa@example.com");
  await page.locator("#q1").fill("A");
  await page.locator("#q2").fill("B");
  await page.locator("#q3").fill("C");
  await page.locator("#q4").fill("D");
  await page.locator("#q5").fill("E");
  await page.getByLabel("$800–$1,500").check();
  await page.getByRole("button", { name: "Join the waitlist" }).click();
  await page.locator("#form-error").waitFor({ state: "visible" });
  note(await page.locator("#priestley-form").isVisible(), "network failure keeps the form");
});

await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.locator("#email").fill("not-an-email");
  await page.getByRole("button", { name: "Join the waitlist" }).click();
  const invalid = await page.locator("#email").evaluate((el) => el.validity.valid);
  note(!invalid, "invalid email is blocked before send");
  note(await page.locator("#priestley-form").isVisible(), "validation keeps the form");
  await screenshot(page, "form-validation.png");
});

await browser.close();

if (issues.length) {
  console.error(`\n${issues.length} issue(s):\n- ${issues.join("\n- ")}`);
  process.exit(1);
}

console.log("\nAll automated polish QA checks passed.");
