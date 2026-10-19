import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const R = 26;
const C = 2 * Math.PI * R; // circumference

// Adapted from Magic UI's Animated Circular Progress Bar (MIT, https://magicui.design): the ring
// fills once when it scrolls into view. Only for figures that can be backed up.
export function ProgressRing({ value, label, fraction = 1 }: { value: string; label: string; fraction?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const target = C * (1 - fraction);

  return (
    <div ref={ref} data-progress-ring className="flex items-center gap-4">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={R} fill="none" stroke="var(--line)" strokeWidth="5" />
        <motion.circle
          data-ring-value
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          transform="rotate(-90 32 32)"
          initial={{ strokeDashoffset: reduceMotion ? target : C }}
          animate={{ strokeDashoffset: reduceMotion || inView ? target : C }}
          transition={{ duration: reduceMotion ? 0 : 1.6, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </svg>
      <div>
        <div className="font-[family-name:var(--font-display)] font-[620] text-[1.75rem] leading-none tracking-[-0.04em] text-[var(--ink-strong)]">
          {value}
        </div>
        <div className="mono-label text-[var(--muted)] mt-1.5">{label}</div>
      </div>
    </div>
  );
}
