import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Adapted from Magic UI's Number Ticker (MIT, https://magicui.design), rebuilt on framer-motion so
// it adds no dependency. Counts up once, the first time it scrolls into view.
export function NumberTicker({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
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
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} data-stat-value className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown}
      {suffix}
    </span>
  );
}
