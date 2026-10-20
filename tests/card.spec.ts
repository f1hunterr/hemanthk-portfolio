import { test, expect } from "@playwright/test";

// WhatsApp kit: the contact card page, its link preview, and the saved contact. Each test names the break it catches.
const CARD = "/hemanthk-portfolio/card/";
const SITE = "https://f1hunterr.github.io/hemanthk-portfolio/";

const meta = (page: import("@playwright/test").Page, prop: string) =>
  page.locator(`meta[property="${prop}"]`).getAttribute("content");

test.describe("contact card", () => {
  // Break: the page missing, or the name not the first thing you read
  test("opens as a standalone page with the name as its heading", async ({ page }) => {
    await page.goto(CARD);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Hemanth K/);
  });

  // Break: a chat app showing no preview, or a broken image in it
  test("has its own link preview with a real image", async ({ page, request }) => {
    await page.goto(CARD);
    expect(await meta(page, "og:url")).toBe(`${SITE}card/`);
    const img = await meta(page, "og:image");
    expect(img).toBe(`${SITE}card/og.jpg`);
    const res = await request.get(img!.replace(SITE, "/hemanthk-portfolio/"));
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/jpeg");
  });

  // Break: the main site's preview image missing (it was deleted locally)
  test("keeps a preview image for the main portfolio link", async ({ request }) => {
    const res = await request.get("/hemanthk-portfolio/opengraph.jpg");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/jpeg");
  });

  // Break: a dead or wrong action button
  test("offers every way to reach him", async ({ page }) => {
    await page.goto(CARD);
    // The resolved destination, so relative links like ../ are judged by where they go
    const href = (name: RegExp) => page.getByRole("link", { name }).first().evaluate((a: HTMLAnchorElement) => a.href);
    expect(await href(/View portfolio/)).toMatch(/\/hemanthk-portfolio\/$/);
    expect(await href(/Resume/)).toMatch(/Hemanth-K-Resume\.pdf$/);
    expect(await href(/Save contact/)).toMatch(/hemanth-k\.vcf$/);
    expect(await href(/WhatsApp/)).toMatch(/^https:\/\/wa\.me\/918088461724/);
    expect(await href(/Email/)).toBe("mailto:Hemanth2608@hotmail.com");
    expect(await href(/Call/)).toBe("tel:+918088461724");
    expect(await href(/LinkedIn/)).toContain("linkedin.com/in/hemanth-k-8609b4255");
  });

  // Break: a contact file phones can't import
  test("serves a vCard phones can import", async ({ request }) => {
    const res = await request.get("/hemanthk-portfolio/hemanth-k.vcf");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/^BEGIN:VCARD\r?\nVERSION:3\.0/);
    expect(body).toContain("TEL;TYPE=CELL:+918088461724");
    expect(body).toContain("EMAIL;TYPE=INTERNET:Hemanth2608@hotmail.com");
    expect(body.trim()).toMatch(/END:VCARD$/);
  });

  // Break: sideways scrolling on a small phone
  test("fits a 360px phone without sideways scroll", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(CARD);
    await expect(page.locator("[data-card]")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });
});

test.describe("resume page", () => {
  // Break: no icon declared, so browsers request /favicon.ico at the domain root and log a 404
  test("declares the site icon", async ({ page, request }) => {
    await page.goto("/hemanthk-portfolio/resume.html");
    const href = await page.locator('link[rel="icon"]').evaluate((l: HTMLLinkElement) => l.href);
    expect((await request.get(href)).status()).toBe(200);
  });
});

test.describe("card is reachable from the site", () => {
  // Break: the card only reachable by someone who already has the link
  test("Contact section and footer link to the contact card", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("hk-booted", "1");
      } catch {
        /* storage blocked */
      }
    });
    await page.goto("/hemanthk-portfolio/");
    for (const scope of [page.locator("#contact"), page.locator("footer")]) {
      const link = scope.getByRole("link", { name: /Contact card/ });
      expect(await link.evaluate((a: HTMLAnchorElement) => a.href)).toMatch(/\/hemanthk-portfolio\/card\/$/);
    }
  });
});
