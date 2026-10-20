import { test, expect } from "@playwright/test";

// Build-time prerender: the HTML arrives with the page already drawn. Each test names the break it catches.
const HOME = "/hemanthk-portfolio/";

test.describe("prerendered home page", () => {
  // Break: crawlers and link-preview bots getting an empty <div id="root">
  test("ships the real content in the HTML itself", async ({ request }) => {
    const html = await (await request.get(HOME)).text();
    const root = html.slice(html.indexOf('<div id="root"'));
    for (const text of ["Hemanth K", "Systems-first", "Unreal Engine Distributed Render Farm", "talk"]) {
      expect(root).toContain(text);
    }
    for (const id of ["home", "about", "skills", "projects", "experience", "contact"]) expect(root).toContain(`id="${id}"`);
  });

  // Break: content saved mid-animation (opacity 0) or the boot overlay covering it, so nothing shows without JS
  test("is readable with JavaScript turned off", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(HOME);
    await expect(page.locator("#boot")).toBeHidden();
    const opacity = (sel: string) =>
      page.locator(sel).first().evaluate((el) => {
        let o = 1;
        for (let n: Element | null = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
        return o;
      });
    for (const sel of ["#home h1", "#about h2", "#projects h3", "#contact h2"]) expect(await opacity(sel)).toBeGreaterThan(0.95);
    await ctx.close();
  });

  // Break: on a return visit (no boot screen) the hero blinking out when React takes over, then fading back
  test("keeps the hero visible from first paint on a return visit", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("hk-booted", "1");
      } catch {
        /* storage blocked */
      }
      const w = window as Window & { __heroLog?: { atReady: boolean; min: number; frames: number } };
      const log = (w.__heroLog = { atReady: false, min: 1, frames: 0 });
      const effective = (el: Element) => {
        let o = 1;
        for (let n: Element | null = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
        return o;
      };
      document.addEventListener("DOMContentLoaded", () => {
        log.atReady = !!document.querySelector("[data-hero-copy]");
      });
      const t0 = performance.now();
      const tick = () => {
        const el = document.querySelector("[data-hero-copy]");
        if (el) {
          log.frames++;
          log.min = Math.min(log.min, effective(el));
        }
        if (performance.now() - t0 < 2500) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.goto(HOME);
    await page.waitForTimeout(2800);
    const log = await page.evaluate(() => (window as Window & { __heroLog?: { atReady: boolean; min: number; frames: number } }).__heroLog!);
    expect(log.atReady).toBe(true);
    expect(log.frames).toBeGreaterThan(10);
    expect(log.min).toBeGreaterThan(0.95);
  });

  // Break: stats already on screen dropping to 0 and recounting when React takes over
  test("keeps on-screen stats at their values on a return visit", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("hk-booted", "1");
      } catch {
        /* storage blocked */
      }
      const w = window as Window & { __statMin?: number };
      w.__statMin = Infinity;
      const t0 = performance.now();
      const tick = () => {
        const el = document.querySelector("[data-stat-value]");
        if (el) w.__statMin = Math.min(w.__statMin!, parseInt(el.textContent ?? "", 10));
        if (performance.now() - t0 < 2000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.goto(HOME);
    const inView = await page.locator("[data-stat-value]").first().evaluate((e) => e.getBoundingClientRect().top < innerHeight);
    expect(inView).toBe(true);
    await page.waitForTimeout(2300);
    expect(await page.evaluate(() => (window as Window & { __statMin?: number }).__statMin)).toBe(200);
    await ctx.close();
  });

  // Break: a wrong URL briefly showing the whole home page before the 404 message
  test("leaves the 404 page as a plain shell", async ({ request }) => {
    const res = await request.get(`${HOME}404.html`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('<div id="root"></div>');
    expect(html).not.toContain("Unreal Engine Distributed Render Farm");
  });
});
