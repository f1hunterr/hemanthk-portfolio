// Build-time prerender of the home page. Runs after `vite build` (see the build script).
// Serves dist/, opens it in a headless browser with reduced motion, walks down the page so every
// scroll-in reveal has played, then writes the drawn markup into dist/index.html. Visitors and
// crawlers get real content in the HTML; React replaces it with the live app once its JS runs
// (see src/lib/prerender.ts for how a return visit avoids any blink).
// dist/404.html keeps the empty shell, so a wrong URL never flashes the home page.
import { preview } from "vite";
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const base = process.env.VITE_BASE_PATH ?? "/hemanthk-portfolio/";
const EMPTY_ROOT = '<div id="root"></div>';
const PORT = 4190;

const shell = await readFile(path.join(dist, "index.html"), "utf8");
if (!shell.includes(EMPTY_ROOT)) throw new Error("dist/index.html has no empty #root (already prerendered?)");

const server = await preview({ root, logLevel: "silent", preview: { port: PORT, strictPort: true, host: "127.0.0.1" } });
// CI has Playwright's own Chromium; locally use the installed Edge (no browser download)
const browser = await chromium.launch({ channel: process.env.CI ? undefined : (process.env.PW_CHANNEL ?? "msedge") });
let markup;
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("hk-booted", "1");
    } catch {
      /* storage blocked */
    }
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}${base}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__hkAppReady === true);
  await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));

  // Walk down so every whileInView reveal plays, then back to the top
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);

  // Pointer-only UI (the custom cursor) has no place in the static page
  await page.$$eval("#root [data-prerender-skip]", (els) => els.forEach((e) => e.remove()));
  markup = await page.$eval("#root", (el) => el.innerHTML);
  // Anything still hidden would ship invisible to visitors without JS and to crawlers
  const hidden = await page.$$eval("#root [style*='opacity: 0']", (els) =>
    els.filter((e) => !e.closest("[aria-hidden='true']")).map((e) => e.outerHTML.slice(0, 160))
  );
  if (hidden.length) throw new Error(`prerender captured hidden content: ${JSON.stringify(hidden)}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}

for (const id of ["home", "about", "skills", "projects", "experience", "contact"]) {
  if (!markup.includes(`id="${id}"`)) throw new Error(`prerender is missing #${id}`);
}
await writeFile(path.join(dist, "404.html"), shell);
await writeFile(path.join(dist, "index.html"), shell.replace(EMPTY_ROOT, `<div id="root">${markup}</div>`));
console.log(`prerendered ${base} (${Math.round(markup.length / 1024)} KB of markup); 404.html keeps the shell`);
