// The home page HTML is prerendered at build time (scripts/prerender.mjs). main.tsx sets this flag
// before React mounts when that HTML is already on screen with no boot screen covering it (a return
// visit in the same tab). Anything visible must then start in its final state, or it would blink out
// and animate back in when React replaces the static markup.
type PrerenderWindow = Window & { __hkInstant?: boolean };

export function markInstantStart(root: HTMLElement) {
  const boot = document.getElementById("boot");
  // Gone, never shown, or already lifted (a prerendered page lifts it before the JS arrives)
  const bootHidden =
    !boot ||
    document.documentElement.classList.contains("no-boot") ||
    boot.classList.contains("boot-done") ||
    (window as Window & { __hkBootDone?: boolean }).__hkBootDone === true;
  (window as PrerenderWindow).__hkInstant = root.hasChildNodes() && bootHidden;
}

export const instantStart = () => typeof window !== "undefined" && (window as PrerenderWindow).__hkInstant === true;
