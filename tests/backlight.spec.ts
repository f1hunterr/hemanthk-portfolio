import { test, expect, type Page } from "@playwright/test";

// Magic UI-style backlight behind the hero photo cards, desktop only. Each test names the break it catches.
const HOME = "/hemanthk-portfolio/";

async function open(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("hk-booted", "1");
    } catch {
      /* storage blocked */
    }
  });
  await page.goto(HOME);
}

const firstCard = (page: Page) => page.locator(".orbit-card-3").first();

test.describe("hero backlight", () => {
  // Break: no glow on desktop, or a glow that isn't blurred and coloured
  test("glows behind each card on desktop", async ({ page }) => {
    await open(page);
    const glow = firstCard(page).locator("img.orbit-glow");
    await expect(glow).toBeVisible();
    await expect(glow).toHaveAttribute("aria-hidden", "true");
    const filter = await glow.evaluate((g) => getComputedStyle(g).filter);
    expect(filter).toMatch(/blur\(/);
    expect(filter).toMatch(/saturate\(/);
  });

  // Break: the glow covering the photo instead of sitting behind it
  test("keeps the sharp photo on top", async ({ page }) => {
    await open(page);
    const top = await firstCard(page).evaluate((card) => {
      const r = card.getBoundingClientRect();
      const hit = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2).find((e) => card.contains(e));
      return hit?.className ?? "";
    });
    expect(top).not.toContain("orbit-glow");
  });

  // Break: the glow downloading a second copy of every photo
  test("reuses the card's own image file", async ({ page }) => {
    await open(page);
    const card = firstCard(page);
    await expect(card.locator("img.orbit-glow")).toBeVisible();
    await page.waitForFunction(() => [...document.querySelectorAll(".orbit-card-3 img")].every((i) => (i as HTMLImageElement).complete));
    const [glowSrc, photoSrc] = await Promise.all([
      card.locator("img.orbit-glow").evaluate((i: HTMLImageElement) => i.currentSrc),
      card.locator("img:not(.orbit-glow)").evaluate((i: HTMLImageElement) => i.currentSrc),
    ]);
    expect(glowSrc).toBe(photoSrc);
  });

  // Break: the costly blur running on phones and tablets
  test("is off on touch screens", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await open(page);
    await expect(firstCard(page).locator("img.orbit-glow")).toBeHidden();
    await ctx.close();
  });
});
