// Renders public/resume.html to public/Hemanth-K-Resume.pdf (A4, real selectable text, clickable links).
// Run after editing the resume: npm run resume:pdf
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = pathToFileURL(path.join(root, "public", "resume.html")).href;
const out = path.join(root, "public", "Hemanth-K-Resume.pdf");

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "msedge" });
const page = await browser.newPage();
await page.goto(src, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: "print" });

const mono = "font-family:'Geist Mono',Consolas,monospace;font-size:6.5pt;letter-spacing:.12em;text-transform:uppercase;color:#10101499";
await page.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%;padding:0 15mm;display:flex;justify-content:space-between;${mono}">
    <span>Hemanth K — Resume · f1hunterr.github.io/hemanthk-portfolio</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  tagged: true,
  outline: true,
});
await browser.close();

// HR expects two pages at most; fail loudly if an edit pushes it over
const { readFileSync } = await import("node:fs");
const pages = (readFileSync(out, "latin1").match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
console.log(`wrote ${path.relative(root, out)} (${pages} pages)`);
if (pages > 2) {
  console.error("Resume is longer than 2 pages: tighten public/resume.html");
  process.exit(1);
}
