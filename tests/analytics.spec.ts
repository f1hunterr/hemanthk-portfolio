import { test, expect } from "@playwright/test";

// GoatCounter (cookie-free analytics). Each test names the break it catches.
const HOME = "/hemanthk-portfolio/";
const COUNTER = "https://hemanth9908.goatcounter.com/count";

test.describe("analytics", () => {
  // Break: a page shipping without the counter, so its visits go missing
  for (const path of ["", "card/", "resume.html"]) {
    test(`counts visits on /${path}`, async ({ request }) => {
      const html = await (await request.get(`${HOME}${path}`)).text();
      expect(html).toContain(`data-goatcounter="${COUNTER}"`);
      expect(html).toContain('src="https://gc.zgo.at/count.js"');
    });
  }

  // Break: resume downloads and card opens not being counted as events
  test("tags resume downloads and card links as click events", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("hk-booted", "1");
      } catch {
        /* storage blocked */
      }
    });
    await page.goto(HOME);
    for (const id of ["button-download-resume", "button-download-resume-nav"]) {
      await expect(page.getByTestId(id)).toHaveAttribute("data-goatcounter-click", "resume-pdf");
    }
    await expect(page.locator("footer").getByRole("link", { name: /Resume/ })).toHaveAttribute("data-goatcounter-click", "resume-pdf");
    await expect(page.locator("#contact").getByRole("link", { name: /Contact card/ })).toHaveAttribute("data-goatcounter-click", "contact-card");
    await expect(page.locator("footer").getByRole("link", { name: /Contact card/ })).toHaveAttribute("data-goatcounter-click", "contact-card");
    await page.goto(`${HOME}card/`);
    await expect(page.getByRole("link", { name: /Resume/ })).toHaveAttribute("data-goatcounter-click", "resume-pdf");
    await expect(page.getByRole("link", { name: /Save contact/ })).toHaveAttribute("data-goatcounter-click", "save-contact");
  });
});
