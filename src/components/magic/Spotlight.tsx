import type { PointerEvent } from "react";

// After Magic UI's Magic Card (MIT, https://magicui.design): a soft glow that follows the mouse.
// Put <SpotlightGlow /> inside a position: relative card and spread `spotlightHandlers` on the card.
// The glow is hidden on touch screens (no hover there), see .spotlight-glow in index.css.
export const spotlightHandlers = {
  onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${Math.round(e.clientX - r.left)}px`);
    e.currentTarget.style.setProperty("--spot-y", `${Math.round(e.clientY - r.top)}px`);
  },
};

export function SpotlightGlow() {
  return <span className="spotlight-glow" data-spotlight-glow aria-hidden="true" />;
}
