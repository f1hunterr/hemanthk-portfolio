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
  repo?: string;
  spec?: string;
  game?: boolean;
};

const projects: Project[] = [
  {
    category: "Rendering",
    title: "Unreal Engine Distributed Render Farm",
    description: "A distributed render farm for Unreal Engine 5 Movie Render Queue, run from a web dashboard. A priority job queue splits each shot across free render PCs (on camera cuts), retries failures on another machine, checks every written frame, and shows live progress with CPU, GPU, RAM and VRAM per node.",
    tags: [
      "Python",
      "Unreal Engine 5",
      "Docker",
      "Job Scheduling",
      "Distributed Computing"
    ],
    problem: "Manual rendering was slow and could not utilize multiple machines.",
    result: "Automated multi-node rendering with centralized job management — new render PCs join with a one-click setup.",
    spec: "v1.0 · 230+ automated tests · UE 5.6 · Docker"
  },
  {
    category: "Platform",
    title: "Suol — Unified IT Operations Dashboard",
    description: "A self-hosted dashboard that pulls Windows PCs, Linux servers, Proxmox, TrueNAS and Zabbix into one view, one alert stream, one audit log and one permission model — sitting on top of the tools already in place instead of replacing them.",
    problem: "Infrastructure status was spread across a separate console for every system.",
    result: "Working Proxmox, TrueNAS and Zabbix integrations with role-based access (4 roles), an audit log and encrypted integration settings; Wazuh, GLPI, n8n and Sophos in preview.",
    tags: [
      "FastAPI",
      "React",
      "PostgreSQL",
      "Docker",
      "Proxmox",
      "Zabbix"
    ],
    spec: "In development · ~13,000 lines · self-hosted"
  },
  {
    category: "Render automation",
    title: "BlendFlow — Blender Batch Rendering",
    description: "Automates batch-rendering 3D product images in Blender: a job list says which model, materials and frames, and render PCs open Blender in the background, swap models and materials, render, and save the images to the NAS.",
    problem: "Rendering product image variations meant setting up each model and material by hand in Blender.",
    result: "Batches imported from Google Sheets run unattended across render PCs, with a web app to track, edit and re-trigger them.",
    tags: [
      "Python",
      "Blender",
      "Flask",
      "Google Sheets",
      "NAS"
    ],
    spec: "Master + render clients · Google Sheets import"
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
    category: "Tooling",
    title: "Studio Copy",
    description: "A simple Windows app for copying large folders with a progress bar people can actually read. Robocopy runs underneath, multithreaded and restartable, with percent done, time left, speed and files copied shown in plain English.",
    problem: "Artists moving large asset folders to and from the NAS could not see how far along a copy was or when it would finish.",
    result: "A no-install tool for stock Windows 10/11 that rolls out from a network share and never deletes anything at the destination.",
    tags: [
      "PowerShell",
      "WPF",
      "Robocopy",
      "NAS"
    ],
    spec: "v1.2 · 8 copy threads · 28 regression checks",
    repo: "https://github.com/f1hunterr/studio-copy"
  },
  {
    category: "Pipeline tool",
    title: "VSE Media Collector (Blender Add-on)",
    description: "A Blender add-on that makes Video Sequencer projects portable: it copies every image sequence, movie and sound an edit uses into one folder, verifies each copy with SHA-256, and can restore the original links.",
    problem: "Edit projects broke when moved between machines because their footage was spread across the network.",
    result: "Portable edit projects with a scan preview before anything is copied, tested automatically on Windows and Linux. Co-developed with a colleague.",
    tags: [
      "Python",
      "Blender",
      "SHA-256",
      "GitHub Actions"
    ],
    spec: "v1.7 · Blender 4.5 · CI on Windows + Linux"
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
    category: "IT planning",
    title: "Artist Workstation Audit",
    description: "A web form that collects each artist's workstation usage, software, project types and hardware needs for IT infrastructure planning, with an admin dashboard to search, filter and export the results.",
    problem: "Hardware planning needed a consistent picture of what every artist actually uses and needs.",
    result: "Submissions land in Google Sheets; the admin dashboard exports CSV and Excel and also runs offline in demo mode.",
    tags: [
      "JavaScript",
      "Google Apps Script",
      "Google Sheets",
      "SheetJS"
    ],
    spec: "Audit form + admin dashboard · CSV / XLSX export",
    repo: "https://github.com/f1hunterr/artist-workstation-audit"
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
    category: "Internal tool",
    title: "Prompt Ledger",
    description: "A self-hosted prompt manager that keeps day-to-day prompts sorted by client, ready to copy, download or share — as a shared web app for the team and as Chrome side-panel extensions.",
    problem: "Prompts used across client work were scattered and hard to share across the team.",
    result: "One shared library on the LAN plus an offline extension, all using the same export/import format.",
    tags: [
      "Node.js",
      "SQLite",
      "Docker",
      "Chrome Extension"
    ],
    spec: "Web app + 2 Chrome extensions · Docker",
    repo: "https://github.com/f1hunterr/prompt-ledger"
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
    repo: "https://github.com/f1hunterr/it-help-centre",
    spec: "4 step-by-step guides · search · dark mode · Docker"
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

      {/* 17 projects + 1 closing cell = 18, so the grid has no empty slots at 2 or 3 columns */}
      <div className="hairgrid md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, idx) => (
          <article key={p.title} className="flex flex-col transition-colors duration-200 hover:bg-[var(--bg-raised)]" data-testid={`card-project-${idx}`}>
            <div className="cell-strip mono-label">
              <span>{p.category}</span>
              <span className="text-[var(--faint)]">{String(idx + 1).padStart(2, "0")}</span>
            </div>
            <Reveal delay={(idx % 3) * 0.06} className="flex-1 flex flex-col px-5 md:px-8 py-8">
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
            </Reveal>
          </article>
        ))}

        <div className="flex flex-col">
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
