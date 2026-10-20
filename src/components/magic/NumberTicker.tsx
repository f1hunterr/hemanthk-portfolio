import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { instantStart } from "@/lib/prerender";

// Adapted from Magic UI's Number Ticker (MIT, https://magicui.design), rebuilt on framer-motion so
// it adds no dependency. Counts up once, the first time it scrolls into view.
export function NumberTicker({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  // Any visible edge counts: the hero stats peek above the fold on common laptop screens
  const inView = useInView(ref, { once: true });
  // Prerendered page already showing: a number on screen keeps its final value (no drop to 0 and
  // recount); one below the fold resets before paint and still counts up when scrolled to
  const [settled, setSettled] = useState(instantStart);
  const [shown, setShown] = useState(settled ? value : 0);

  useLayoutEffect(() => {
    if (!settled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= window.innerHeight) {
      setSettled(false);
      setShown(0);
    }
    // Only the first layout decides; later scrolling is the normal count-up path
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduceMotion || settled) {
      setShown(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, settled, value]);

  return (
    <span ref={ref} data-stat-value className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown}
      {suffix}
    </span>
  );
}
