import { test, expect, type Page } from "@playwright/test";
import { openHome } from "./helpers";

// In-page buttons that scroll to a section. Each test names the break it catches.
const NAV_HEIGHT = 49;

/** Waits for a smooth scroll to bring a section's top to just below the fixed navbar. */
async function expectLandedOn(page: Page, id: string) {
  const offset = () => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
  await expect.poll(offset, { timeout: 8000 }).toBeGreaterThanOrEqual(NAV_HEIGHT - 1);
  await expect.poll(offset, { timeout: 8000 }).toBeLessThanOrEqual(NAV_HEIGHT + 1);
}

test.describe("section navigation", () => {
  // Break: the hero button doing nothing, or landing with the heading under the fixed navbar
  test("hero 'View projects' lands on Projects just below the navbar", async ({ page }) => {
    await openHome(page);
    await page.getByTestId("button-view-projects").click();
    await expectLandedOn(page, "projects");
  });

  // Break: the closing card's button no longer reaching the contact form
  test("'Get in touch' lands on Contact just below the navbar", async ({ page }) => {
    await openHome(page);
    const button = page.getByRole("button", { name: /Get in touch/ });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expectLandedOn(page, "contact");
  });

  // Break: a footer link following its #hash (no smooth scroll, heading under the navbar)
  test("a footer link lands on its section just below the navbar", async ({ page }) => {
    await openHome(page);
    const link = page.locator("footer").getByRole("link", { name: "Experience" });
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expectLandedOn(page, "experience");
    expect(new URL(page.url()).hash).toBe("");
  });
});
