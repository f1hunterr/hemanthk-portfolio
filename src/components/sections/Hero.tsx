import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";

// The italic word in the tagline cycles through these
const WORDS = ["reliable.", "automated.", "secure.", "monitored."];

// Tool labels placed around the rings: [label, ring (1-3), angle in degrees]
const ORBIT: [string, 1 | 2 | 3, number][] = [
  ["Proxmox", 1, 228], ["TrueNAS", 1, 312], ["Zabbix", 1, 132], ["n8n", 1, 48],
  ["Tailscale", 2, 200], ["WireGuard", 2, 338], ["GLPI", 2, 160], ["Sophos", 2, 22],
  ["Unreal Engine", 3, 250], ["PowerShell", 3, 290], ["VMware ESXi", 3, 112], ["Cloudflare", 3, 68],
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

  return (
    <section id="home" className="relative pt-[49px] min-h-[100svh] flex flex-col overflow-hidden">
      {/* Rings + orbiting tool labels, centred on the content block */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="hero-orbit" aria-hidden="true">
          {[1, 2, 3].map((r) => (
            <span key={r} className={`hero-ring hero-ring-${r}`} />
          ))}
          <span className="hero-ring hero-ring-0" />
          {ORBIT.map(([label, ring, angle]) => (
            <span
              key={label}
              className="hero-chip mono-label"
              style={{
                transform: `translate(calc(${Math.cos((angle * Math.PI) / 180).toFixed(4)} * var(--orbit-${ring})), calc(${Math.sin((angle * Math.PI) / 180).toFixed(4)} * var(--orbit-${ring}))) translate(-50%, -50%)`,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative z-10 text-center px-5 py-20 md:py-28 max-w-5xl"
        >
          <p className="mono-label text-[var(--muted)] mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
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

          <p className="mt-8 font-[family-name:var(--font-display)] font-[620] text-[clamp(1.6rem,3.2vw,2.25rem)] leading-[1.05] tracking-[-0.03em] text-[var(--ink-strong)]">
            Infrastructure that stays{" "}
            <span className="serif-em inline-block min-w-[6.5ch] text-left">
              {reduceMotion ? WORDS[0] : displayed}
              {!reduceMotion && (
                <span className="inline-block w-[2px] h-[0.85em] ml-[2px] align-[-0.08em] bg-[var(--ink)] animate-pulse" aria-hidden="true" />
              )}
            </span>
          </p>

          <p className="lede mt-6 max-w-[34rem] mx-auto">
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

          <p className="mt-8 mono-label text-[var(--muted)] flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a className="hover:text-[var(--ink)] transition-colors" href="https://www.linkedin.com/in/hemanth-k-8609b4255" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="text-[var(--faint)]">·</span>
            <a className="hover:text-[var(--ink)] transition-colors" href="https://github.com/f1hunterr" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="text-[var(--faint)]">·</span>
            <a className="hover:text-[var(--ink)] transition-colors" href="https://wa.me/918088461724?text=Hi%20Hemanth%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </p>
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
