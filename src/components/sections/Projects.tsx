import { lazy, Suspense, useCallback, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { Section, SectionIntro, Reveal } from "@/components/frame/Section";

// Loaded on demand: most visitors never open the game, so keep it out of the main bundle
const NetworkDefenseGame = lazy(() =>
  import("@/components/game/NetworkDefenseGame").then((m) => ({ default: m.NetworkDefenseGame }))
);

type Project = {
  category: string;
  title: string;
  description: string;
  problem: string;
  result: string;
  tags: string[];
  href?: string;
  game?: boolean;
};

const projects: Project[] = [
  {
    category: "Rendering",
    title: "Unreal Engine Distributed Render Farm",
    description: "Built a distributed render farm system with a master node and multiple render nodes. Features job distribution, node status monitoring, and per-node job cancellation. Cut render times noticeably and streamlined studio workflow across the team.",
    tags: [
      "Distributed Computing",
      "Node Management",
      "Job Scheduling",
      "Rendering"
    ],
    problem: "Manual rendering was slow and could not utilize multiple machines.",
    result: "Automated multi-node rendering with centralized job management."
  },
  {
    category: "Automation",
    title: "IT Automation System (n8n + GLPI + Slack)",
    description: "Automated IT ticket alerts to Slack, daily IT reports, and system notifications using n8n workflows and GLPI integration. Eliminated nearly all manual IT work and improved team response times.",
    tags: [
      "n8n",
      "GLPI",
      "Slack",
      "Automation",
      "Webhooks"
    ],
    problem: "Manual ticket tracking and reporting consumed significant IT time.",
    result: "Fully automated notifications and daily reports with zero manual effort."
  },
  {
    category: "Storage",
    title: "TrueNAS Central Storage System",
    description: "Centralized NAS file server with granular user permissions, automated backup system, and shared team storage. Ensures data integrity, team collaboration, and reliable backup/recovery.",
    tags: [
      "TrueNAS",
      "NAS",
      "Backup",
      "Storage",
      "Permissions"
    ],
    problem: "Data was scattered across machines with no centralized control or backups.",
    result: "Centralized storage with automated backup and access control in place."
  },
  {
    category: "Remote access",
    title: "Remote Access VPN System",
    description: "Secure remote access infrastructure for 100+ freelancers using Tailscale and WireGuard. Enables secure file access, application access, and remote work support from any location.",
    tags: [
      "VPN",
      "Tailscale",
      "WireGuard",
      "Remote Access",
      "Security"
    ],
    problem: "Freelancers had no secure, reliable way to access internal resources remotely.",
    result: "100+ remote users securely connected with zero downtime access."
  },
  {
    category: "Asset management",
    title: "IT Asset & License Management System",
    description: "Centralized tracking system for software licenses (Autodesk, Adobe, V-Ray), hardware assets, and user assignments. Built on GLPI with custom automation for expiry alerts and renewals.",
    tags: [
      "GLPI",
      "Asset Management",
      "License Tracking",
      "Autodesk",
      "Adobe"
    ],
    problem: "No visibility into software license usage, expiry, or hardware inventory.",
    result: "Complete asset visibility with automated renewal alerts and audit trails."
  },
  {
    category: "Internal tool",
    title: "Office LAN Messaging Tool",
    description: "Python-based internal LAN messaging system enabling broadcast messages to multiple computers across the office network. Supports targeted and group messaging without external services.",
    tags: [
      "Python",
      "LAN",
      "Networking",
      "Internal Tools",
      "Sockets"
    ],
    problem: "No quick way to broadcast internal messages to office computers.",
    result: "Instant LAN messaging across all office systems with no external dependency."
  },
  {
    category: "Knowledge base",
    title: "IT Help Center",
    description: "Built an internal IT Help Center web portal with step-by-step guides for the most common staff IT tasks. Covers software setup, VPN access, printer configuration, account management, and general troubleshooting.",
    tags: [
      "Internal Tools",
      "Knowledge Base",
      "Web Portal",
      "IT Support",
      "Documentation"
    ],
    problem: "Staff repeatedly raised tickets for the same common IT tasks and issues.",
    result: "Self-service portal empowering users to resolve issues independently, reducing support load.",
    href: "https://portal.hobb-dashboard.com/index.html"
  },
  {
    category: "Monitoring",
    title: "Server Monitoring System",
    description: "Full server and infrastructure monitoring built on Zabbix. Covers CPU, memory, disk, network, and service uptime with automated alerting for critical thresholds.",
    tags: [
      "Zabbix",
      "Monitoring",
      "Alerting",
      "SNMP",
      "Infrastructure"
    ],
    problem: "Server issues were only discovered after users reported them.",
    result: "Proactive alerts and dashboards enabling issues to be resolved before impact."
  },
  {
    category: "Environment",
    title: "Temperature Monitoring System",
    description: "Real-time server room temperature and environmental monitoring system with threshold-based alerts. Integrates with the notification pipeline to alert IT staff when temperatures exceed safe limits.",
    tags: [
      "Monitoring",
      "IoT",
      "Alerting",
      "Server Room",
      "Automation"
    ],
    problem: "Server room temperatures were not monitored, risking hardware damage.",
    result: "Automated temperature tracking with instant alerts preventing equipment failure."
  },
  {
    category: "Web",
    title: "Company Website & Case Study Management",
    description: "Maintained and updated the HOBB company website, publishing client case studies and keeping project portfolios current. Coordinated with the team to ensure timely, accurate content goes live.",
    tags: [
      "Web Management",
      "Content Publishing",
      "Case Studies",
      "CMS"
    ],
    problem: "Case studies and project showcases needed regular updates as new client work was completed.",
    result: "Website consistently updated with published case studies, strengthening the company's online presence."
  },
  {
    category: "Game",
    title: "Network Defense Game",
    description: "An IT-themed browser game built with React and HTML5 Canvas. Defend your core server from incoming cyber threats — viruses, DDoS attacks, ransomware, and zero-days — across waves of increasing difficulty.",
    tags: [
      "React",
      "HTML5 Canvas",
      "TypeScript",
      "Game Dev"
    ],
    problem: "Wanted an interactive element that showcases front-end development skills in a memorable way.",
    result: "Fully playable browser game with wave-based progression, particle effects, score tracking, and 4 threat types.",
    game: true
  }
];

export function Projects() {
  const [gameOpen, setGameOpen] = useState(false);
  const closeGame = useCallback(() => setGameOpen(false), []);

  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 49, behavior: "smooth" });
  };

  return (
    <Section id="projects" index="03" label="Projects" meta="Built and run at HOBB">
      <SectionIntro
        title={<>Built to <em>remove</em> manual work.</>}
        lede="Showcasing robust systems, automated workflows, and internal tools built to solve real operational challenges."
      />

      {/* 11 projects + 1 closing cell = 12, so the grid has no empty slots at 2 or 3 columns */}
      <div className="hairgrid md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, idx) => (
          <article key={p.title} className="flex flex-col" data-testid={`card-project-${idx}`}>
            <div className="cell-strip mono-label">
              <span>{p.category}</span>
              <span className="text-[var(--faint)]">{String(idx + 1).padStart(2, "0")}</span>
            </div>
            <Reveal delay={(idx % 3) * 0.06} className="flex-1 flex flex-col px-5 md:px-8 py-8">
              <h3 className="text-2xl leading-[1.15] tracking-[-0.02em]">{p.title}</h3>
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

              <p className="mt-auto pt-6 mono-label text-[var(--muted)] text-[10px]">
                {p.tags.join("  /  ")}
              </p>

              {(p.href || p.game) && (
                <div className="mt-5">
                  {p.game ? (
                    <button className="btn btn-solid btn-sm" onClick={() => setGameOpen(true)}>
                      <Play size={12} /> Play game
                    </button>
                  ) : (
                    <a className="btn btn-outline btn-sm" href={p.href} target="_blank" rel="noopener noreferrer">
                      Visit site <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              )}
            </Reveal>
          </article>
        ))}

        <div className="flex flex-col">
          <div className="cell-strip mono-label">
            <span>Next</span>
            <span className="text-[var(--faint)]">12</span>
          </div>
          <Reveal className="flex-1 flex flex-col justify-between gap-8 px-5 md:px-8 py-8 bg-[var(--bg-sunken)]">
            <h3 className="headline text-[2.5rem]">
              Your project <em>next?</em>
            </h3>
            <div>
              <p className="text-[var(--muted)] leading-relaxed mb-5">
                Infrastructure, automation or a farm of your own — happy to talk it through.
              </p>
              <button className="btn btn-solid btn-sm" onClick={scrollToContact}>
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
