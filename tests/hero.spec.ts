import { test, expect } from "@playwright/test";
import { HOME, openHome } from "./helpers";

// Hero behaviour that static page snapshots cannot see. Each test names the break it catches.
const TAGLINE = "#home .serif-em";

test.describe("hero typewriter", () => {
  // Break: the word never finishing, or the cycle stopping after the first word
  test("types a word, deletes it and moves to the next", async ({ page }) => {
    await openHome(page);
    await expect(page.locator(TAGLINE)).toHaveText("reliable.", { timeout: 4000 });
    await expect(page.locator(TAGLINE)).toHaveText("automated.", { timeout: 6000 });
  });

  // Break: text moving for people who asked for less motion
  test("holds the first word under reduced motion", async ({ page }) => {
    await openHome(page, { reduced: true });
    await expect(page.locator(TAGLINE)).toHaveText("reliable.");
    await page.waitForTimeout(3200);
    await expect(page.locator(TAGLINE)).toHaveText("reliable.");
  });
});

test.describe("hero entrance", () => {
  // Break: the entrance playing unseen behind the boot screen on a first visit
  test("stays hidden until the boot screen lifts, then fades in", async ({ page }) => {
    await page.goto(HOME); // no skipBoot: a real first visit
    const copy = page.locator("#home h1").locator("xpath=ancestor::div[contains(@class,'text-center')][1]");
    const opacity = () => copy.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
    await expect(page.locator("#boot")).toBeVisible();
    await copy.waitFor({ state: "attached" });
    expect(await page.evaluate(() => (window as Window & { __hkBootDone?: boolean }).__hkBootDone === true)).toBe(false);
    expect(await opacity()).toBe(0);
    await expect.poll(opacity, { timeout: 8000 }).toBeGreaterThan(0.95);
    expect(await page.evaluate(() => (window as Window & { __hkBootDone?: boolean }).__hkBootDone)).toBe(true);
  });
});

test.describe("hero stats", () => {
  // Break: stats peeking above the fold stay at "0+" until the visitor scrolls
  test("count up when only their top edge is on screen", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHome(page);
    const first = page.locator("[data-stat-value]").first();
    const top = await first.evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeLessThan(900); // peeking, not fully in view
    await expect.poll(() => first.textContent(), { timeout: 5000 }).not.toMatch(/^0\D*$/);
  });
});
