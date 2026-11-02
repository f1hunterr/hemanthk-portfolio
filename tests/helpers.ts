import type { Page } from "@playwright/test";

export const HOME = "/hemanthk-portfolio/";

type OpenOptions = { reduced?: boolean; dark?: boolean };

/** Mark the once-per-session boot screen as seen, so the page is interactive straight away. */
export async function skipBoot(page: Page, { dark = false }: Pick<OpenOptions, "dark"> = {}) {
  await page.addInitScript((dark) => {
    try {
      sessionStorage.setItem("hk-booted", "1");
      if (dark) localStorage.setItem("portfolio-theme", "dark");
    } catch {
      /* storage blocked */
    }
  }, dark);
}

/** Open the home page past the boot screen, with the given motion preference and theme. */
export async function openHome(page: Page, { reduced = false, dark = false }: OpenOptions = {}) {
  await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
  await skipBoot(page, { dark });
  await page.goto(HOME);
}
