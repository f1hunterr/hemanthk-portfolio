import { test, expect, type Page } from "@playwright/test";

// Glyph Matrix behind the Contact call to action. Each test names the break it catches.
const HOME = "/hemanthk-portfolio/";

async function open(page: Page, { reduced = false, dark = false } = {}) {
  await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
  await page.addInitScript((dark) => {
    try {
      sessionStorage.setItem("hk-booted", "1");
      if (dark) localStorage.setItem("portfolio-theme", "dark");
    } catch {
      /* storage blocked */
    }
  }, dark);
  await page.goto(HOME);
}

const matrix = (page: Page) => page.locator("#contact canvas[data-glyph-matrix]");

// Hash of the canvas pixels, so two frames can be compared
const frame = (page: Page) =>
  matrix(page).evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let h = 0, ink = 0;
    for (let i = 3; i < d.length; i += 4) {
      h = (h * 31 + d[i] + i) | 0;
      if (d[i] > 0) ink++;
    }
    return { h, ink };
  });

test.describe("glyph matrix", () => {
  // Break: missing, exposed to screen readers, or covering the buttons
  test("sits decoratively behind the contact call to action", async ({ page }) => {
    await open(page);
    const m = matrix(page);
    await m.scrollIntoViewIfNeeded();
    await expect(m).toHaveAttribute("aria-hidden", "true");
    await expect(m).toHaveCSS("pointer-events", "none");
    const box = await m.boundingBox();
    expect(box!.width).toBeGreaterThan(300);
    expect(box!.height).toBeGreaterThan(200);
    await page.getByRole("link", { name: /Email me/ }).click({ trial: true });
  });

  // Break: a blank canvas, or a frozen one
  test("draws glyphs and keeps shifting them", async ({ page }) => {
    await open(page);
    await matrix(page).scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const a = await frame(page);
    expect(a.ink).toBeGreaterThan(0);
    await page.waitForTimeout(600);
    const b = await frame(page);
    expect(b.h).not.toBe(a.h);
  });

  // Break: animating for people who asked for less motion
  test("draws one still frame under reduced motion", async ({ page }) => {
    await open(page, { reduced: true });
    await matrix(page).scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const a = await frame(page);
    expect(a.ink).toBeGreaterThan(0);
    await page.waitForTimeout(800);
    expect((await frame(page)).h).toBe(a.h);
  });

  // Break: burning CPU while nobody can see it
  test("stops animating while scrolled out of view", async ({ page }) => {
    await open(page);
    await matrix(page).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const a = await frame(page);
    await page.waitForTimeout(600);
    expect((await frame(page)).h).toBe(a.h);
  });

  // Break: dark glyphs on the dark theme (invisible)
  test("uses light glyphs on the dark theme", async ({ page }) => {
    await open(page, { dark: true });
    await matrix(page).scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const lum = await matrix(page).evaluate((c: HTMLCanvasElement) => {
      const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) return d[i] + d[i + 1] + d[i + 2];
      return -1;
    });
    expect(lum).toBeGreaterThan(600);
  });
});
