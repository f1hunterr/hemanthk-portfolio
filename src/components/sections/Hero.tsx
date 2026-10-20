import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { NumberTicker } from "@/components/magic/NumberTicker";
import { Marquee } from "@/components/magic/Marquee";
import { ResumeLink } from "@/components/ResumeLink";
import { scrollToSection } from "@/hooks/use-active-section";
import { useBootDone } from "@/hooks/use-boot-done";
import { useTypewriter } from "@/hooks/use-typewriter";
import { HeroOrbit } from "./HeroOrbit";
import { instantStart } from "@/lib/prerender";

// The italic word in the tagline cycles through these
const WORDS = ["reliable.", "automated.", "secure.", "monitored."];

const TOOLS = [
  "Proxmox", "TrueNAS", "Zabbix", "n8n", "GLPI", "Tailscale",
  "WireGuard", "Sophos", "Unreal Engine", "PowerShell", "Docker", "Cloudflare",
];

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
  // Prerendered page already showing (return visit): start finished, so nothing blinks when React takes over
  const [instant] = useState(instantStart);
  const bootDone = useBootDone();
  const displayed = useTypewriter(WORDS, Boolean(reduceMotion), instant ? WORDS[0] : "");

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
        <HeroOrbit />
        </motion.div>

        {/* Soft fade behind the text so it stays readable over the photos */}
        <div className="hero-veil" aria-hidden="true" />

        <motion.div className="relative z-10" style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}>
        <motion.div
          data-hero-copy
          initial={instant ? false : { opacity: 0, y: 16 }}
          animate={bootDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative z-10 text-center px-5 py-20 md:py-28 [@media(max-height:560px)]:py-10 max-w-5xl min-[1800px]:max-w-7xl"
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

          <h1 className="hero-wordmark display-wide whitespace-nowrap text-[var(--ink-strong)]">Hemanth K</h1>

          <p className="legible mt-8 font-[family-name:var(--font-display)] font-[620] text-[clamp(1.6rem,3.2vw,2.25rem)] leading-[1.05] tracking-[-0.03em] text-[var(--ink-strong)]">
            Infrastructure that stays{" "}
            <span className="serif-em inline-block min-w-[6.5ch] text-left">
              {reduceMotion ? WORDS[0] : displayed}
              {!reduceMotion && (
                <span className="inline-block w-[2px] h-[0.85em] ml-[2px] align-[-0.08em] bg-[var(--ink)] animate-pulse" aria-hidden="true" />
              )}
            </span>
          </p>

          <p className="legible lede hero-lede mt-6 max-w-[34rem] mx-auto">
            Building reliable IT systems, automating day-to-day operations, and managing infrastructure at scale — with
            hands-on experience across servers, networks, and enterprise IT environments.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="btn btn-solid w-full sm:w-auto" onClick={() => scrollToSection("projects")} data-testid="button-view-projects">
              View projects <ArrowDown size={14} />
            </button>
            <ResumeLink className="btn btn-outline w-full sm:w-auto" data-testid="button-download-resume">
              <Download size={14} /> Download resume
            </ResumeLink>
          </div>

          <p className="legible mt-6 mono-label text-[var(--muted)] flex flex-wrap items-center justify-center gap-x-1 gap-y-0">
            <a className="tap-pad hover:text-[var(--ink)] transition-colors" href="https://www.linkedin.com/in/hemanth-k-8609b4255" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="text-[var(--faint)]">·</span>
            <a className="tap-pad hover:text-[var(--ink)] transition-colors" href="https://github.com/f1hunterr" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="text-[var(--faint)]">·</span>
            <a className="tap-pad hover:text-[var(--ink)] transition-colors" href="https://wa.me/918088461724?text=Hi%20Hemanth%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </p>
        </motion.div>
        </motion.div>
      </div>

      {/* Stats strip, inside the frame so its hairlines continue down the page */}
      <div className="frame relative z-10">
        <Marquee items={TOOLS} label="Tools" />
        <div className="hairgrid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
          {STATS.map((s) => (
            <div key={s.label} className="px-5 md:px-8 py-6">
              <div className="font-[family-name:var(--font-display)] font-[620] text-[2.5rem] leading-none tracking-[-0.04em] text-[var(--ink-strong)]">
                <NumberTicker value={parseInt(s.value, 10)} suffix={s.value.replace(/^\d+/, "")} />
              </div>
              <div className="mono-label text-[var(--muted)] mt-3">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
