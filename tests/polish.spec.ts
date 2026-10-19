import { test, expect, type Page } from "@playwright/test";

// Behaviour tests for the Magic UI-style polish components. Each test names the break it catches.
const HOME = "/hemanthk-portfolio/";

async function open(page: Page, { reduced = false } = {}) {
  await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
  // Skip the once-per-session boot screen so the page is interactive straight away
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("hk-booted", "1");
    } catch {
      /* storage blocked */
    }
  });
  await page.goto(HOME);
}

const statValues = (page: Page) => page.locator("[data-stat-value]");

/** Horizontal offset of an element's current transform, in px. */
const translateX = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);

// ---------------------------------------------------------------- A. Number ticker
test.describe("number ticker", () => {
  // Break: a wrong target value, or the ticker stopping short of it
  test("stats settle on their real values once scrolled into view", async ({ page }) => {
    await open(page);
    await statValues(page).first().scrollIntoViewIfNeeded();
    await expect(statValues(page)).toHaveText(["200+", "100+", "6+", "10+", "5+"], { timeout: 5000 });
  });

  // Break: the numbers being rendered at their final value with no counting
  test("stats visibly count up rather than appearing at the final value", async ({ page }) => {
    await open(page);
    await statValues(page).first().scrollIntoViewIfNeeded();
    const samples: number[] = [];
    for (let i = 0; i < 20; i++) {
      samples.push(parseInt((await statValues(page).first().textContent()) ?? "", 10));
      await page.waitForTimeout(60);
    }
    expect(samples.some((n) => n > 0 && n < 200)).toBe(true);
  });

  // Break: ignoring the reduced-motion preference
  test("reduced motion shows the final stat values immediately", async ({ page }) => {
    await open(page, { reduced: true });
    await expect(statValues(page)).toHaveText(["200+", "100+", "6+", "10+", "5+"], { timeout: 500 });
  });
});

// ---------------------------------------------------------------- B. Tools marquee
const TOOLS = [
  "Proxmox", "TrueNAS", "Zabbix", "n8n", "GLPI", "Tailscale",
  "WireGuard", "Sophos", "Unreal Engine", "PowerShell", "Docker", "Cloudflare",
];

test.describe("tools marquee", () => {
  // Break: a missing tool, or the looping duplicate being read out to screen readers twice
  test("lists every tool once for assistive technology", async ({ page }) => {
    await open(page);
    const strip = page.getByRole("region", { name: "Tools" });
    await expect(strip).toBeVisible();
    const spoken = await strip.evaluate((el) =>
      [...el.querySelectorAll("li")].filter((li) => !li.closest('[aria-hidden="true"]')).map((li) => li.textContent?.trim())
    );
    expect(spoken).toEqual(TOOLS);
  });

  // Break: the strip not animating
  test("moves on its own", async ({ page }) => {
    await open(page);
    const a = await translateX(page, "[data-marquee-track]");
    await page.waitForTimeout(800);
    const b = await translateX(page, "[data-marquee-track]");
    expect(b).not.toBe(a);
  });

  // Break: no pause-on-hover, so a visitor can't read a moving name
  test("pauses while hovered", async ({ page }) => {
    await open(page);
    // Hover the strip (stable), not the moving track: Playwright waits for a hover target to stop moving
    await page.getByRole("region", { name: "Tools" }).hover();
    await page.waitForTimeout(300);
    const a = await translateX(page, "[data-marquee-track]");
    await page.waitForTimeout(700);
    expect(await translateX(page, "[data-marquee-track]")).toBe(a);
  });

  // Break: ignoring the reduced-motion preference
  test("stays still under reduced motion", async ({ page }) => {
    await open(page, { reduced: true });
    const a = await translateX(page, "[data-marquee-track]");
    await page.waitForTimeout(800);
    expect(await translateX(page, "[data-marquee-track]")).toBe(a);
  });
});

// ---------------------------------------------------------------- C. Border beam
test.describe("border beam", () => {
  // Break: the beam missing, or spread to every card so it stops meaning "headline project"
  test("marks exactly the render farm and Suol cards", async ({ page }) => {
    await open(page);
    const titles = await page
      .locator("[data-border-beam]")
      .evaluateAll((els) => els.map((el) => el.closest("article")?.querySelector("h3")?.textContent?.trim()));
    expect(titles).toEqual(["Unreal Engine Distributed Render Farm", "Suol — Unified IT Operations Dashboard"]);
  });

  // Break: the beam being drawn but never moving
  test("animates", async ({ page }) => {
    await open(page);
    const running = await page
      .locator("[data-border-beam]")
      .first()
      .evaluate((el) => el.getAnimations({ subtree: true }).some((a) => a.playState === "running"));
    expect(running).toBe(true);
  });

  // Break: ignoring the reduced-motion preference
  test("is still under reduced motion", async ({ page }) => {
    await open(page, { reduced: true });
    const running = await page
      .locator("[data-border-beam]")
      .first()
      .evaluate((el) => el.getAnimations({ subtree: true }).some((a) => a.playState === "running"));
    expect(running).toBe(false);
  });
});

// ---------------------------------------------------------------- D. Dot pattern
test.describe("dot pattern", () => {
  // Break: the decoration missing, read out by screen readers, or swallowing clicks
  test("sits behind each section intro without being announced or blocking clicks", async ({ page }) => {
    await open(page);
    for (const id of ["skills", "projects", "experience"]) {
      const pattern = page.locator(`#${id} [data-dot-pattern]`);
      await expect(pattern, `#${id} has a dot pattern`).toHaveCount(1);
      await expect(pattern).toHaveAttribute("aria-hidden", "true");
      expect(await pattern.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
    }
  });
});

// ---------------------------------------------------------------- E. Animated list
const suolCard = (page: Page) => page.locator("article", { has: page.getByRole("heading", { name: /^Suol/ }) });

test.describe("animated ops feed", () => {
  // Break: the feed missing, or not labelled as an example (it must not pass for real system data)
  test("appears in the Suol card, labelled as an example", async ({ page }) => {
    await open(page);
    await expect(suolCard(page).getByText("Example feed", { exact: true })).toBeVisible();
  });

  // Break: all lines appearing at once instead of arriving one by one
  test("lines arrive one after another", async ({ page }) => {
    await open(page);
    const items = suolCard(page).locator("[data-animated-list] li");
    await suolCard(page).scrollIntoViewIfNeeded();
    const early = await items.count();
    await expect(items).toHaveCount(4, { timeout: 6000 });
    expect(early).toBeLessThan(4);
  });

  // Break: ignoring the reduced-motion preference
  test("reduced motion shows the whole feed at once", async ({ page }) => {
    await open(page, { reduced: true });
    await suolCard(page).scrollIntoViewIfNeeded();
    await expect(suolCard(page).locator("[data-animated-list] li")).toHaveCount(4, { timeout: 500 });
  });
});
