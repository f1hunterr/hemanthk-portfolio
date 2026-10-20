import { test, expect, type Page } from "@playwright/test";

// Downloadable PDF resume for HR. Each test names the break it catches.
const HOME = "/hemanthk-portfolio/";
const PDF = "Hemanth-K-Resume.pdf";

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

test.describe("resume pdf", () => {
  // Break: the PDF missing, or the host serving it as something else
  test("is served as a real PDF", async ({ request }) => {
    const res = await request.get(`${HOME}${PDF}`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/pdf");
    expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });

  // Break: a committed PDF that grew past the two pages HR expects
  test("is at most two A4 pages", async ({ request }) => {
    const pdf = (await (await request.get(`${HOME}${PDF}`)).body()).toString("latin1");
    const pages = pdf.match(/\/Type\s*\/Page(?!s)/g) ?? [];
    expect(pages.length).toBeGreaterThan(0);
    expect(pages.length).toBeLessThanOrEqual(2);
    // A4 is 595.28 x 841.89pt; Chromium writes it as 594.96 x 841.92
    expect(pdf).toMatch(/\/MediaBox\s*\[\s*0 0 59[45]\.\d+ 841\.\d+\s*\]/);
  });

  // Break: HR clicking "Download resume" and landing on a web page instead of a file
  test("downloads from the hero and the navbar", async ({ page }) => {
    await open(page);
    for (const id of ["button-download-resume", "button-download-resume-nav"]) {
      const link = page.getByTestId(id);
      expect(await link.evaluate((a: HTMLAnchorElement) => a.href)).toMatch(new RegExp(`/hemanthk-portfolio/${PDF}$`));
      await expect(link).toHaveAttribute("download", PDF);
    }
  });

  // Break: the footer still pointing at the old web page
  test("is the footer's resume link", async ({ page }) => {
    await open(page);
    const link = page.locator("footer").getByRole("link", { name: /Resume/ });
    expect(await link.evaluate((a: HTMLAnchorElement) => a.href)).toMatch(new RegExp(`${PDF}$`));
  });

  // Break: someone opening the web version with no way to get the file
  test("is offered from the web version of the resume", async ({ page }) => {
    await page.goto(`${HOME}resume.html`);
    const link = page.getByRole("link", { name: /Download PDF/ });
    await expect(link).toHaveAttribute("href", PDF);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Hemanth K/);
  });
});
