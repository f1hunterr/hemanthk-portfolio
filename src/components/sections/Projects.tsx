import { lazy, Suspense, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cpu, Workflow, Database, Shield, Package, MessageSquare,
  Activity, Thermometer, BookOpen, ExternalLink, Globe, Gamepad2, Play
} from "lucide-react";
// Loaded on demand: most visitors never open the game, so keep it out of the main bundle
const NetworkDefenseGame = lazy(() =>
  import("@/components/game/NetworkDefenseGame").then((m) => ({ default: m.NetworkDefenseGame }))
);

const projects = [
  {
    title: "Unreal Engine Distributed Render Farm",
    description: "Built a distributed render farm system with a master node and multiple render nodes. Features job distribution, node status monitoring, and per-node job cancellation. Cut render times noticeably and streamlined studio workflow across the team.",
    tags: ["Distributed Computing", "Node Management", "Job Scheduling", "Rendering"],
    problem: "Manual rendering was slow and could not utilize multiple machines.",
    result: "Automated multi-node rendering with centralized job management.",
    icon: <Cpu className="w-6 h-6" />
  },
  {
    title: "IT Automation System (n8n + GLPI + Slack)",
    description: "Automated IT ticket alerts to Slack, daily IT reports, and system notifications using n8n workflows and GLPI integration. Eliminated nearly all manual IT work and improved team response times.",
    tags: ["n8n", "GLPI", "Slack", "Automation", "Webhooks"],
    problem: "Manual ticket tracking and reporting consumed significant IT time.",
    result: "Fully automated notifications and daily reports with zero manual effort.",
    icon: <Workflow className="w-6 h-6" />
  },
  {
    title: "TrueNAS Central Storage System",
    description: "Centralized NAS file server with granular user permissions, automated backup system, and shared team storage. Ensures data integrity, team collaboration, and reliable backup/recovery.",
    tags: ["TrueNAS", "NAS", "Backup", "Storage", "Permissions"],
    problem: "Data was scattered across machines with no centralized control or backups.",
    result: "Centralized storage with automated backup and access control in place.",
    icon: <Database className="w-6 h-6" />
  },
  {
    title: "Remote Access VPN System",
    description: "Secure remote access infrastructure for 100+ freelancers using Tailscale and WireGuard. Enables secure file access, application access, and remote work support from any location.",
    tags: ["VPN", "Tailscale", "WireGuard", "Remote Access", "Security"],
    problem: "Freelancers had no secure, reliable way to access internal resources remotely.",
    result: "100+ remote users securely connected with zero downtime access.",
    icon: <Shield className="w-6 h-6" />
  },
  {
    title: "IT Asset & License Management System",
    description: "Centralized tracking system for software licenses (Autodesk, Adobe, V-Ray), hardware assets, and user assignments. Built on GLPI with custom automation for expiry alerts and renewals.",
    tags: ["GLPI", "Asset Management", "License Tracking", "Autodesk", "Adobe"],
    problem: "No visibility into software license usage, expiry, or hardware inventory.",
    result: "Complete asset visibility with automated renewal alerts and audit trails.",
    icon: <Package className="w-6 h-6" />
  },
  {
    title: "Office LAN Messaging Tool",
    description: "Python-based internal LAN messaging system enabling broadcast messages to multiple computers across the office network. Supports targeted and group messaging without external services.",
    tags: ["Python", "LAN", "Networking", "Internal Tools", "Sockets"],
    problem: "No quick way to broadcast internal messages to office computers.",
    result: "Instant LAN messaging across all office systems with no external dependency.",
    icon: <MessageSquare className="w-6 h-6" />
  },
  {
    title: "IT Help Center",
    description: "Built an internal IT Help Center web portal with step-by-step guides for the most common staff IT tasks. Covers software setup, VPN access, printer configuration, account management, and general troubleshooting.",
    tags: ["Internal Tools", "Knowledge Base", "Web Portal", "IT Support", "Documentation"],
    problem: "Staff repeatedly raised tickets for the same common IT tasks and issues.",
    result: "Self-service portal empowering users to resolve issues independently, reducing support load.",
    icon: <BookOpen className="w-6 h-6" />,
    href: "https://portal.hobb-dashboard.com/index.html"
  },
  {
    title: "Server Monitoring System",
    description: "Full server and infrastructure monitoring built on Zabbix. Covers CPU, memory, disk, network, and service uptime with automated alerting for critical thresholds.",
    tags: ["Zabbix", "Monitoring", "Alerting", "SNMP", "Infrastructure"],
    problem: "Server issues were only discovered after users reported them.",
    result: "Proactive alerts and dashboards enabling issues to be resolved before impact.",
    icon: <Activity className="w-6 h-6" />
  },
  {
    title: "Temperature Monitoring System",
    description: "Real-time server room temperature and environmental monitoring system with threshold-based alerts. Integrates with the notification pipeline to alert IT staff when temperatures exceed safe limits.",
    tags: ["Monitoring", "IoT", "Alerting", "Server Room", "Automation"],
    problem: "Server room temperatures were not monitored, risking hardware damage.",
    result: "Automated temperature tracking with instant alerts preventing equipment failure.",
    icon: <Thermometer className="w-6 h-6" />
  },
  {
    title: "Company Website & Case Study Management",
    description: "Maintained and updated the HOBB company website, publishing client case studies and keeping project portfolios current. Coordinated with the team to ensure timely, accurate content goes live.",
    tags: ["Web Management", "Content Publishing", "Case Studies", "CMS"],
    problem: "Case studies and project showcases needed regular updates as new client work was completed.",
    result: "Website consistently updated with published case studies, strengthening the company's online presence.",
    icon: <Globe className="w-6 h-6" />
  }
];

const gameProject = {
  title: "Network Defense Game",
  description: "An IT-themed browser game built with React and HTML5 Canvas. Defend your core server from incoming cyber threats — viruses, DDoS attacks, ransomware, and zero-days — across waves of increasing difficulty.",
  tags: ["React", "HTML5 Canvas", "TypeScript", "Game Dev"],
  problem: "Wanted an interactive element that showcases front-end development skills in a memorable way.",
  result: "Fully playable browser game with wave-based progression, particle effects, score tracking, and 4 threat types.",
  icon: <Gamepad2 className="w-6 h-6" />,
};

export function Projects() {
  const [gameOpen, setGameOpen] = useState(false);
  const closeGame = useCallback(() => setGameOpen(false), []);
  return (
    <section id="projects" className="py-20" style={{ backgroundColor: "var(--portfolio-section-alt)" }}>
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2
            className="text-3xl font-bold tracking-tight text-foreground mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Featured Projects
          </h2>
          <div className="w-14 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: "var(--portfolio-accent)" }}></div>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Showcasing robust systems, automated workflows, and internal tools built to solve real operational challenges.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

          {/* Game card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full flex flex-col border-border bg-white dark:bg-card hover:border-primary/30 hover:shadow-md transition-all rounded-xl overflow-hidden">
              <CardHeader className="pb-3 pt-6 px-6">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--portfolio-icon-bg)", color: "var(--portfolio-accent)" }}
                >
                  {gameProject.icon}
                </div>
                <CardTitle className="text-lg leading-tight text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {gameProject.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between px-6 pb-6">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {gameProject.description}
                </p>
                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex gap-2">
                    <span className="font-semibold text-foreground/70 shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>Problem:</span>
                    <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{gameProject.problem}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold shrink-0" style={{ color: "var(--portfolio-accent)", fontFamily: "'Inter', sans-serif" }}>Result:</span>
                    <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{gameProject.result}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {gameProject.tags.map((tag, tIdx) => (
                    <Badge key={tIdx} variant="outline" className="font-medium text-xs border-border/70 text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <button
                  onClick={() => setGameOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-85 w-fit"
                  style={{ backgroundColor: "var(--portfolio-navy)", fontFamily: "'Inter', sans-serif" }}
                >
                  <Play className="w-3.5 h-3.5" />
                  Play Game
                </button>
              </CardContent>
            </Card>
          </motion.div>

          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              data-testid={`card-project-${idx}`}
            >
              <Card className="h-full flex flex-col border-border bg-white dark:bg-card hover:border-primary/30 hover:shadow-md transition-all rounded-xl overflow-hidden">
                <CardHeader className="pb-3 pt-6 px-6">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--portfolio-icon-bg)", color: "var(--portfolio-accent)" }}
                  >
                    {project.icon}
                  </div>
                  <CardTitle
                    className="text-lg leading-tight text-foreground"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between px-6 pb-6">
                  <p
                    className="text-sm text-muted-foreground mb-4 leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {project.description}
                  </p>

                  <div className="space-y-2 mb-5 text-sm">
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground/70 shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>Problem:</span>
                      <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{project.problem}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold shrink-0" style={{ color: "var(--portfolio-accent)", fontFamily: "'Inter', sans-serif" }}>Result:</span>
                      <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{project.result}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag, tIdx) => (
                      <Badge
                        key={tIdx}
                        variant="outline"
                        className="font-medium text-xs border-border/70 text-muted-foreground"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {project.href && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold transition-colors hover:opacity-80"
                      style={{ color: "var(--portfolio-accent)", fontFamily: "'Inter', sans-serif" }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit Site
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {gameOpen && (
        <Suspense fallback={null}>
          <NetworkDefenseGame onClose={closeGame} />
        </Suspense>
      )}
    </section>
  );
}
