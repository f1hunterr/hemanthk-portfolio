import { lazy, Suspense, useCallback, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { Section, SectionIntro, Reveal } from "@/components/frame/Section";
import { BorderBeam } from "@/components/magic/BorderBeam";
import { AnimatedList } from "@/components/magic/AnimatedList";
import { Terminal } from "@/components/magic/Terminal";
import { ProgressRing } from "@/components/magic/ProgressRing";
import { BlendFlowDiagram } from "@/components/magic/BlendFlowDiagram";
import { SpotlightGlow, spotlightHandlers } from "@/components/magic/Spotlight";
import { FileTree } from "@/components/magic/FileTree";
import { projects } from "@/data/projects";
import { scrollToSection } from "@/hooks/use-active-section";

// Loaded on demand: most visitors never open the game, so keep it out of the main bundle
const NetworkDefenseGame = lazy(() =>
  import("@/components/game/NetworkDefenseGame").then((m) => ({ default: m.NetworkDefenseGame }))
);

export function Projects() {
  const [gameOpen, setGameOpen] = useState(false);
  const closeGame = useCallback(() => setGameOpen(false), []);

  return (
    <Section id="projects" index="03" label="Projects" meta="Built and run at HOBB">
      <SectionIntro
        title={<>Built to <em>remove</em> manual work.</>}
        lede="Showcasing robust systems, automated workflows, and internal tools built to solve real operational challenges."
      />

      {/* 18 projects (render farm spans 2, Gab spans the full row) + closing row: 24 slots at 3 columns, 22 at 2.
          The full-row card must start a row at both widths: keep 6 slots (or a multiple) before it. */}
      <div className="hairgrid md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, idx) => (
          <article
            key={p.title}
            className={`relative flex flex-col transition-colors duration-200 hover:bg-[var(--bg-raised)] ${p.full ? "md:col-span-2 lg:col-span-3" : p.wide ? "md:col-span-2" : ""}`}
            data-testid={`card-project-${idx}`}
            {...spotlightHandlers}
          >
            <SpotlightGlow />
            {p.featured && <BorderBeam />}
            <div className="cell-strip mono-label">
              <span>{p.category}</span>
              <span className="text-[var(--faint)]">{String(idx + 1).padStart(2, "0")}</span>
            </div>
            <Reveal
              delay={(idx % 3) * 0.06}
              className={`flex-1 px-5 md:px-8 py-8 ${p.wide || p.full ? "grid lg:grid-cols-2 gap-x-10 gap-y-8" : "flex flex-col"}`}
            >
              <div className="flex flex-col h-full">
              <h3 className="text-2xl leading-[1.15] tracking-[-0.02em]">{p.title}</h3>
              {p.spec && <p className="mt-2 mono-label text-[var(--accent-ink)]">{p.spec}</p>}
              <p className="mt-3 text-[var(--muted)] leading-relaxed">{p.description}</p>

              <dl className="mt-6 space-y-3 text-[15px] leading-relaxed">
                <div className="grid grid-cols-[76px_1fr] gap-3">
                  <dt className="mono-label text-[var(--muted)] pt-[3px]">Problem</dt>
                  <dd className="text-[var(--ink)]">{p.problem}</dd>
                </div>
                <div className="grid grid-cols-[76px_1fr] gap-3">
                  <dt className="mono-label text-[var(--accent-ink)] pt-[3px]">Result</dt>
                  <dd className="text-[var(--ink)]">{p.result}</dd>
                </div>
              </dl>

              {p.feed && !p.full && <AnimatedList items={p.feed} label="Example feed" />}
              {p.diagram && (
                <div className="mt-6">
                  <BlendFlowDiagram />
                </div>
              )}
              {p.files && (
                <div className="mt-6">
                  <FileTree root={p.files} />
                </div>
              )}

              <p className="mt-auto pt-6 mono-label text-[var(--muted)] text-[10px]">
                {p.tags.join("  /  ")}
              </p>

              {(p.href || p.repo || p.game) && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.game && (
                    <button className="btn btn-solid btn-sm" onClick={() => setGameOpen(true)}>
                      <Play size={12} /> Play game
                    </button>
                  )}
                  {p.href && (
                    <a className="btn btn-outline btn-sm" href={p.href} target="_blank" rel="noopener noreferrer">
                      Visit site <ArrowUpRight size={12} />
                    </a>
                  )}
                  {p.repo && (
                    <a className="btn btn-outline btn-sm" href={p.repo} target="_blank" rel="noopener noreferrer">
                      View code <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              )}
              </div>

              {p.full && p.feed && (
                <div className="flex flex-col">
                  <AnimatedList items={p.feed} label={p.feedLabel ?? "Example feed"} />
                </div>
              )}
              {p.wide && (p.ring || p.terminal) && (
                <div className="flex flex-col gap-6">
                  {p.ring && <ProgressRing value={p.ring.value} label={p.ring.label} />}
                  {p.terminal && <Terminal lines={p.terminal} label="Example render farm session" />}
                </div>
              )}
            </Reveal>
          </article>
        ))}

        {/* Spans the full row: with the wide render farm card, this keeps the grid free of empty slots */}
        <div className="flex flex-col md:col-span-2 lg:col-span-3">
          <div className="cell-strip mono-label">
            <span>Next</span>
            <span className="text-[var(--faint)]">{String(projects.length + 1).padStart(2, "0")}</span>
          </div>
          <Reveal className="flex-1 flex flex-col justify-between gap-8 px-5 md:px-8 py-8 bg-[var(--bg-sunken)]">
            <h3 className="headline text-[2.5rem]">
              Your project <em>next?</em>
            </h3>
            <div>
              <p className="text-[var(--muted)] leading-relaxed mb-5">
                Infrastructure, automation or a farm of your own — happy to talk it through.
              </p>
              <button className="btn btn-solid btn-sm" onClick={() => scrollToSection("contact")}>
                Get in touch <ArrowUpRight size={12} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {gameOpen && (
        <Suspense fallback={null}>
          <NetworkDefenseGame onClose={closeGame} />
        </Suspense>
      )}
    </Section>
  );
}
