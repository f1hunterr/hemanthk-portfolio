import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** A framed page section: "+" marks on the frame, then a "01 / LABEL ····· meta" tag row. */
export function Section({
  id,
  index,
  label,
  meta,
  children,
}: {
  id: string;
  index: string;
  label: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative cross-top border-t border-[var(--line)] scroll-mt-12" data-section={label}>
      <div className="h-[42px] flex items-center justify-between gap-4 px-5 md:px-10 border-b border-[var(--line)] mono-label text-[var(--muted)]">
        <span>
          {index} <span className="text-[var(--faint)]">/</span> {label}
        </span>
        {meta && <span className="hidden sm:inline truncate">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

/** Headline + lede block at the top of a section. Pass the italic word as <em>. */
export function SectionIntro({ title, lede }: { title: ReactNode; lede?: ReactNode }) {
  return (
    <Reveal className="px-5 md:px-10 pt-14 pb-14 md:pt-20 md:pb-20">
      <h2 className="headline max-w-[16ch]">{title}</h2>
      {lede && <p className="lede mt-6 max-w-[38rem]">{lede}</p>}
    </Reveal>
  );
}

/** Subtle fade-up on first scroll into view (framer-motion honours reduced motion via MotionConfig). */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
