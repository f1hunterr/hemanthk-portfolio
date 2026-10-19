import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

export type FeedItem = { level: "ok" | "warn"; text: string };

// Adapted from Magic UI's Animated List (MIT, https://magicui.design): lines arrive one at a time
// once the list scrolls into view. Under reduced motion every line is shown at once.
export function AnimatedList({ items, label, intervalMs = 1000 }: { items: FeedItem[]; label: string; intervalMs?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setCount(items.length);
      return;
    }
    if (!inView || count >= items.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 200 : intervalMs);
    return () => clearTimeout(t);
  }, [inView, reduceMotion, count, items.length, intervalMs]);

  return (
    <div ref={ref} className="mt-6">
      <p className="mono-label text-[var(--muted)] flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok)]" aria-hidden="true" />
        {label}
      </p>
      {/* Fixed height for all lines, so the card never jumps as they arrive */}
      <ul data-animated-list className="mt-3 space-y-1.5" style={{ minHeight: `${items.length * 2.1}rem` }}>
        <AnimatePresence initial={false}>
          {items.slice(0, count).map((item) => (
            <motion.li
              key={item.text}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex items-center gap-2 border border-[var(--line)] bg-[var(--bg-raised)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink)]"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.level === "warn" ? "bg-[#b45309]" : "bg-[var(--ok)]"}`}
                aria-hidden="true"
              />
              {item.text}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
