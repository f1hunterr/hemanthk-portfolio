import { test, expect } from "@playwright/test";

// Printed-copy extras in public/print (not linked from the site). Each test names the break it catches.
const PRINT = "/hemanthk-portfolio/print/";

test.describe("print back page", () => {
  // Break: the back-page source losing its QR code or headline
  test("source page renders the drawing and a QR code", async ({ page }) => {
    await page.goto(`${PRINT}fig03-back-page.html`);
    await expect(page.locator("h1")).toContainText("Systems-first.");
    await expect(page.locator("#qr svg")).toBeVisible();
    await expect(page.locator("#art rect").first()).toBeAttached();
  });

  // Break: a print PDF missing from the repo
  for (const file of ["Hemanth-K-Fig03-back-page.pdf", "Hemanth-K-Resume-PRINT-double-sided.pdf"]) {
    test(`serves ${file}`, async ({ request }) => {
      const res = await request.get(`${PRINT}${file}`);
      expect(res.status()).toBe(200);
      expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
    });
  }
});
