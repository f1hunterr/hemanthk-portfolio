import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";

// The italic word in the tagline cycles through these
const WORDS = ["reliable.", "automated.", "secure.", "monitored."];

// Photo cards on the rotating rings (public/hero, see CREDITS.txt there).
// Each ring holds its cards at fixed angles; the whole ring spins and each card spins back to stay upright.
const RINGS: { ring: 1 | 2 | 3; reverse?: boolean; offset: number; photos: number[] }[] = [
  { ring: 1, offset: 30, photos: [1, 2, 3, 4, 5, 6] },
  { ring: 2, reverse: true, offset: 10, photos: [7, 8, 9, 10, 11, 12, 13, 14, 15] },
  // 19 photos, 27 slots: the outer ring reuses some, spaced so repeats never sit side by side
  { ring: 3, offset: 20, photos: [16, 17, 18, 19, 2, 8, 5, 12, 1, 10, 4, 14] },
];
const photoSrc = (n: number) => `${import.meta.env.BASE_URL}hero/h${String(n).padStart(2, "0")}.webp`;

const STATS = [
  { value: "200+", label: "Systems managed" },
  { value: "100+", label: "Remote users" },
  { value: "6+", label: "Years experience" },
  { value: "10+", label: "Projects delivered" },
  { value: "5+", label: "Servers maintained" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  // Hold the entrance until the boot screen starts fading, otherwise it plays unseen behind it
  const [bootDone, setBootDone] = useState(
    () =>
      !document.getElementById("boot") ||
      document.documentElement.classList.contains("no-boot") ||
      Boolean((window as Window & { __hkBootDone?: boolean }).__hkBootDone)
  );
  useEffect(() => {
    if (bootDone) return;
    const onDone = () => setBootDone(true);
    window.addEventListener("hk:boot-done", onDone);
    return () => window.removeEventListener("hk:boot-done", onDone);
  }, [bootDone]);
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");

  useEffect(() => {
    if (reduceMotion) return;
    const current = WORDS[wordIdx];
    let timer: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      timer = displayed.length < current.length
        ? setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
        : setTimeout(() => setPhase("pause"), 1900);
    } else if (phase === "pause") {
      timer = setTimeout(() => setPhase("deleting"), 100);
    } else if (displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else {
      setWordIdx((i) => (i + 1) % WORDS.length);
      setPhase("typing");
    }
    return () => clearTimeout(timer);
  }, [displayed, phase, wordIdx, reduceMotion]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 49, behavior: "smooth" });
  };

  const resumeHref = `${import.meta.env.BASE_URL}resume.html`;

  // Scroll-linked (and reversible) exit: the rings zoom towards the viewer while the text lifts away
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const orbitScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const orbitOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={heroRef} id="home" className="hero-vignette relative pt-[49px] min-h-[100svh] flex flex-col overflow-hidden">
      {/* Rings, colour arcs and orbiting photo cards, centred on the content block */}
      <div className="relative flex-1 flex items-center justify-center">
        <motion.div
          className="absolute inset-0"
          style={reduceMotion ? undefined : { scale: orbitScale, opacity: orbitOpacity }}
        >
        <div className="hero-orbit" aria-hidden="true">
          <span className="hero-ring hero-ring-0" />
          {[1, 2, 3].map((r) => (
            <span key={r} className={`hero-ring hero-ring-${r}`} />
          ))}
          <span className="hero-arc hero-arc-1" />
          <span className="hero-arc hero-arc-2" />

          {RINGS.map(({ ring, reverse, offset, photos }) => (
            <div key={ring} className={`orbit-spin orbit-spin-${ring}${reverse ? " orbit-rev" : ""}`}>
              {photos.map((n, i) => {
                const a = ((offset + (360 / photos.length) * i) * Math.PI) / 180;
                return (
                  <div
                    key={n}
                    className="orbit-slot"
                    style={{
                      transform: `translate(calc(${Math.cos(a).toFixed(4)} * var(--orbit-${ring})), calc(${Math.sin(a).toFixed(4)} * var(--orbit-${ring})))`,
                    }}
                  >
                    <div className={`orbit-card orbit-card-${ring}`}>
                      <img src={photoSrc(n)} alt="" width={360} height={225} decoding="async" fetchPriority="low" />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        </motion.div>

        {/* Soft fade behind the text so it stays readable over the photos */}
        <div className="hero-veil" aria-hidden="true" />

        <motion.div className="relative z-10" style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={bootDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative z-10 text-center px-5 py-20 md:py-28 max-w-5xl"
        >
          <p className="legible mono-label text-[var(--muted)] mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ok)] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--ok)]" />
              </span>
              Open to work
            </span>
            <span className="hidden sm:inline text-[var(--faint)]">·</span>
            <span className="whitespace-nowrap">IT &amp; Automation Manager · HOBB</span>
          </p>

          <h1 className="display-wide whitespace-nowrap text-[var(--ink-strong)] text-[clamp(2.6rem,8.6vw,8rem)]">Hemanth K</h1>

          <p className="legible mt-8 font-[family-name:var(--font-display)] font-[620] text-[clamp(1.6rem,3.2vw,2.25rem)] leading-[1.05] tracking-[-0.03em] text-[var(--ink-strong)]">
            Infrastructure that stays{" "}
            <span className="serif-em inline-block min-w-[6.5ch] text-left">
              {reduceMotion ? WORDS[0] : displayed}
              {!reduceMotion && (
                <span className="inline-block w-[2px] h-[0.85em] ml-[2px] align-[-0.08em] bg-[var(--ink)] animate-pulse" aria-hidden="true" />
              )}
            </span>
          </p>

          <p className="legible lede mt-6 max-w-[34rem] mx-auto">
            Building reliable IT systems, automating day-to-day operations, and managing infrastructure at scale — with
            hands-on experience across servers, networks, and enterprise IT environments.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="btn btn-solid w-full sm:w-auto" onClick={() => scrollTo("#projects")} data-testid="button-view-projects">
              View projects <ArrowDown size={14} />
            </button>
            <a className="btn btn-outline w-full sm:w-auto" href={resumeHref} target="_blank" rel="noopener noreferrer" data-testid="button-download-resume">
              <Download size={14} /> Download resume
            </a>
          </div>

          <p className="legible mt-8 mono-label text-[var(--muted)] flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a className="hover:text-[var(--ink)] transition-colors" href="https://www.linkedin.com/in/hemanth-k-8609b4255" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="text-[var(--faint)]">·</span>
            <a className="hover:text-[var(--ink)] transition-colors" href="https://github.com/f1hunterr" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="text-[var(--faint)]">·</span>
            <a className="hover:text-[var(--ink)] transition-colors" href="https://wa.me/918088461724?text=Hi%20Hemanth%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </p>
        </motion.div>
        </motion.div>
      </div>

      {/* Stats strip, inside the frame so its hairlines continue down the page */}
      <div className="frame relative z-10">
        <div className="hairgrid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
          {STATS.map((s) => (
            <div key={s.label} className="px-5 md:px-8 py-6">
              <div className="font-[family-name:var(--font-display)] font-[620] text-[2.5rem] leading-none tracking-[-0.04em] text-[var(--ink-strong)]">
                {s.value}
              </div>
              <div className="mono-label text-[var(--muted)] mt-3">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
