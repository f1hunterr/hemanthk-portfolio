import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

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
    <div className="px-5 md:px-10 pt-14 pb-14 md:pt-20 md:pb-20">
      <ScrubIn>
        <h2 className="headline max-w-[16ch]">{title}</h2>
      </ScrubIn>
      {lede && (
        <Reveal delay={0.1}>
          <p className="lede mt-6 max-w-[38rem]">{lede}</p>
        </Reveal>
      )}
    </div>
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

/**
 * Scroll-linked entrance: slides in from the left as it rises into view, tied to the scroll
 * position rather than played once, so it reverses when scrolling back up.
 */
export function ScrubIn({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 55%"] });
  // Smaller travel on phones so the headline never starts past the screen edge
  const travel = typeof window !== "undefined" && window.innerWidth < 640 ? -12 : -32;
  const x = useTransform(scrollYProgress, [0, 1], [travel, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

  return (
    <motion.div ref={ref} className={className} style={reduceMotion ? undefined : { x, opacity }}>
      {children}
    </motion.div>
  );
}
