import { test, expect, type Page } from "@playwright/test";

// Second batch of Magic UI-style components. Each test names the break it catches.
const HOME = "/hemanthk-portfolio/";

async function open(page: Page, { reduced = false } = {}) {
  await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("hk-booted", "1");
    } catch {
      /* storage blocked */
    }
  });
  await page.goto(HOME);
}

const card = (page: Page, title: RegExp) => page.locator("article", { has: page.getByRole("heading", { name: title }) });
const renderFarm = (page: Page) => card(page, /^Unreal Engine Distributed Render Farm/);

// ---------------------------------------------------------------- A. Terminal
const TERMINAL_LINES = [
  "$ SETUP.bat",
  "installing render agent… done",
  "✓ node render-pc-03 joined the farm",
  "$ farm submit shot_040 --split auto",
  "planning pieces on camera cuts…",
  "✓ shot_040 split across 4 PCs",
  "✓ 240 / 240 frames verified",
];

test.describe("terminal", () => {
  // Break: lines appearing all at once, or the session never finishing
  test("types its session line by line in the render farm card", async ({ page }) => {
    await open(page);
    const lines = renderFarm(page).locator("[data-terminal-line]");
    await renderFarm(page).locator("[data-terminal]").scrollIntoViewIfNeeded();
    const early = await lines.count();
    await expect(lines).toHaveCount(TERMINAL_LINES.length, { timeout: 15000 });
    expect(early).toBeLessThan(TERMINAL_LINES.length);
  });

  // Break: screen readers hearing half-typed text, or nothing at all
  test("gives assistive technology the whole transcript, once", async ({ page }) => {
    await open(page);
    const spoken = await renderFarm(page)
      .locator("[data-terminal]")
      .evaluate((el) =>
        [...el.querySelectorAll("*")]
          .filter((n) => !n.closest('[aria-hidden="true"]') && n.children.length === 0)
          .map((n) => n.textContent?.trim())
          .filter(Boolean)
      );
    expect(spoken).toEqual(TERMINAL_LINES);
  });

  // Break: ignoring the reduced-motion preference
  test("shows the whole session at once under reduced motion", async ({ page }) => {
    await open(page, { reduced: true });
    await renderFarm(page).locator("[data-terminal]").scrollIntoViewIfNeeded();
    await expect(renderFarm(page).locator("[data-terminal-line]")).toHaveCount(TERMINAL_LINES.length, { timeout: 500 });
  });
});

// ---------------------------------------------------------------- B. Animated beam diagram
test.describe("architecture diagram", () => {
  // Break: the diagram missing, or not described for screen readers
  test("BlendFlow card shows a described diagram of its pipeline", async ({ page }) => {
    await open(page);
    const diagram = card(page, /^BlendFlow/).getByRole("img", { name: /master.*render PCs.*NAS/i });
    await expect(diagram).toBeVisible();
  });

  // Break: pulses drawn but not travelling
  test("pulses travel along the connections", async ({ page }) => {
    await open(page);
    const running = await card(page, /^BlendFlow/)
      .locator("[data-beam-diagram]")
      .evaluate((el) => el.getAnimations({ subtree: true }).some((a) => a.playState === "running"));
    expect(running).toBe(true);
  });

  // Break: ignoring the reduced-motion preference
  test("is still under reduced motion", async ({ page }) => {
    await open(page, { reduced: true });
    const running = await card(page, /^BlendFlow/)
      .locator("[data-beam-diagram]")
      .evaluate((el) => el.getAnimations({ subtree: true }).some((a) => a.playState === "running"));
    expect(running).toBe(false);
  });
});

// ---------------------------------------------------------------- C. Hyper text
test.describe("decode-on-hover labels", () => {
  const label = (page: Page) => page.locator("#skills [data-hyper]").first();
  // The part people see (the screen-reader copy is separate and never scrambles)
  const visible = (page: Page) => label(page).locator('[aria-hidden="true"]');

  // Break: no scramble on hover, or the label never returning to its real text
  test("scramble on hover, then settle back on the real label", async ({ page }) => {
    await open(page);
    const original = (await visible(page).textContent())?.trim();
    expect(original).toBe("02 / Skills");
    await label(page).hover();
    let changed = false;
    for (let i = 0; i < 10 && !changed; i++) {
      await page.waitForTimeout(30);
      changed = (await visible(page).textContent())?.trim() !== original;
    }
    expect(changed).toBe(true);
    await expect(visible(page)).toHaveText("02 / Skills", { timeout: 2000 });
  });

  // Break: screen readers hearing random characters, or nothing (aria-label is ignored on a plain span)
  test("keep the real label readable by screen readers, even mid-scramble", async ({ page }) => {
    await open(page);
    const spoken = () =>
      label(page).evaluate((el) =>
        [...el.querySelectorAll("*")]
          .filter((n) => !n.closest('[aria-hidden="true"]') && n.children.length === 0)
          .map((n) => n.textContent)
          .join("")
      );
    expect(await spoken()).toBe("02 / Skills");
    await label(page).hover();
    await page.waitForTimeout(90);
    expect(await spoken()).toBe("02 / Skills");
    expect(await label(page).getAttribute("aria-label")).toBeNull();
  });

  // Break: ignoring the reduced-motion preference
  test("never scramble under reduced motion", async ({ page }) => {
    await open(page, { reduced: true });
    await label(page).hover();
    for (let i = 0; i < 8; i++) {
      await page.waitForTimeout(40);
      expect((await visible(page).textContent())?.trim()).toBe("02 / Skills");
    }
  });
});

// ---------------------------------------------------------------- D. Spotlight cards
test.describe("spotlight cards", () => {
  // Break: the glow not following the pointer
  test("glow follows the mouse across a project card", async ({ page }) => {
    await open(page);
    const c = card(page, /^Studio Copy/);
    // Put the card's top well below the fixed 49px nav bar, so the pointer lands on the card itself
    await c.evaluate((el) => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 150);
    });
    const box = (await c.boundingBox())!;
    await page.mouse.move(box.x + 40, box.y + 60);
    await expect(c).toHaveCSS("--spot-x", "40px");
    await expect(c).toHaveCSS("--spot-y", "60px");
  });

  // Break: a hover effect showing on touch screens, where there is no hover
  test("is off on touch screens", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await open(page);
    const glow = card(page, /^Studio Copy/).locator("[data-spotlight-glow]");
    await expect(glow).toHaveCSS("display", "none");
    await ctx.close();
  });
});

// ---------------------------------------------------------------- E. File tree
test.describe("file tree", () => {
  // Break: the tree missing, or folders not opening
  test("Studio Copy card shows its files and opens folders on click", async ({ page }) => {
    await open(page);
    const tree = card(page, /^Studio Copy/).locator("[data-file-tree]");
    await expect(tree.getByText("StudioCopy.ps1", { exact: true })).toBeVisible();
    await expect(tree.getByText("Run-Tests.ps1", { exact: true })).toBeHidden();
    await tree.getByText("Tests/", { exact: true }).click();
    await expect(tree.getByText("Run-Tests.ps1", { exact: true })).toBeVisible();
  });
});

// ---------------------------------------------------------------- F. Progress ring
const ringOffset = (page: Page) =>
  renderFarm(page).locator("[data-ring-value]").evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));

test.describe("progress ring", () => {
  // Break: the ring missing, or never filling
  test("render farm ring fills to complete once in view", async ({ page }) => {
    await open(page);
    await expect(renderFarm(page).locator("[data-progress-ring]")).toContainText("230+");
    await renderFarm(page).locator("[data-progress-ring]").scrollIntoViewIfNeeded();
    await expect.poll(() => ringOffset(page), { timeout: 4000 }).toBeLessThan(1);
  });

  // Break: ignoring the reduced-motion preference
  test("is already full under reduced motion", async ({ page }) => {
    await open(page, { reduced: true });
    await renderFarm(page).locator("[data-progress-ring]").scrollIntoViewIfNeeded();
    await expect.poll(() => ringOffset(page), { timeout: 400 }).toBeLessThan(1);
  });
});

// ---------------------------------------------------------------- Layout guard
test.describe("projects grid", () => {
  // Break: the wide featured card leaving an empty slot (grey block) in the grid
  for (const width of [820, 1440]) {
    test(`has no empty slots at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page);
      const { cols, used } = await page.locator("#projects .hairgrid").evaluate((grid) => {
        const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
        const used = [...grid.children].reduce((n, el) => {
          const end = getComputedStyle(el).gridColumnEnd;
          return n + (end.startsWith("span") ? parseInt(end.replace("span ", ""), 10) : 1);
        }, 0);
        return { cols, used };
      });
      expect(used % cols).toBe(0);
    });
  }
});
