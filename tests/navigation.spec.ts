import { test, expect, type Page } from "@playwright/test";
import { openHome } from "./helpers";

// In-page buttons that scroll to a section. Each test names the break it catches.
const NAV_HEIGHT = 49;

/** Where a section's top sits below the viewport top once scrolling has settled. */
async function settledOffset(page: Page, id: string) {
  await expect
    .poll(async () => {
      const a = await page.evaluate(() => window.scrollY);
      await page.waitForTimeout(150);
      return a !== 0 && a === (await page.evaluate(() => window.scrollY));
    }, { timeout: 8000 })
    .toBe(true);
  return page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
}

test.describe("section navigation", () => {
  // Break: the hero button doing nothing, or landing with the heading under the fixed navbar
  test("hero 'View projects' lands on Projects just below the navbar", async ({ page }) => {
    await openHome(page);
    await page.getByTestId("button-view-projects").click();
    expect(Math.abs((await settledOffset(page, "projects")) - NAV_HEIGHT)).toBeLessThanOrEqual(1);
  });

  // Break: the closing card's button no longer reaching the contact form
  test("'Get in touch' lands on Contact just below the navbar", async ({ page }) => {
    await openHome(page);
    const button = page.getByRole("button", { name: /Get in touch/ });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    expect(Math.abs((await settledOffset(page, "contact")) - NAV_HEIGHT)).toBeLessThanOrEqual(1);
  });

  // Break: a footer link following its #hash (no smooth scroll, heading under the navbar)
  test("a footer link lands on its section just below the navbar", async ({ page }) => {
    await openHome(page);
    const link = page.locator("footer").getByRole("link", { name: "Experience" });
    await link.scrollIntoViewIfNeeded();
    await link.click();
    expect(Math.abs((await settledOffset(page, "experience")) - NAV_HEIGHT)).toBeLessThanOrEqual(1);
    expect(new URL(page.url()).hash).toBe("");
  });
});
