import { motion } from "framer-motion";
import {
  Briefcase, Building2, MapPin, Calendar, CheckCircle2, GraduationCap, BookOpen,
  Server, Network, Zap, Users, Cpu, Activity, Code2, Shield, HardDrive, Award,
  FileText
} from "lucide-react";

const responsibilityCategories = [
  {
    title: "IT Infrastructure & Operations",
    icon: <Server className="w-4 h-4" />,
    points: [
      "Managed 200+ desktops, laptops, and servers for full production operations",
      "Maintained server room infrastructure, power management, and cable organization",
      "Managed workstation imaging, OS deployment, and hardware lifecycle",
      "Maintained uptime for critical production systems through preventive maintenance",
    ],
  },
  {
    title: "Network & Security",
    icon: <Network className="w-4 h-4" />,
    points: [
      "Designed secure office network with VLAN segmentation for department isolation",
      "Configured Sophos firewall rules and monitored security logs and alerts",
      "Implemented VPN-based remote access for 100+ freelancers and remote employees",
      "Managed access control policies, Wi-Fi access points, and bandwidth optimization",
    ],
  },
  {
    title: "Automation & Productivity",
    icon: <Zap className="w-4 h-4" />,
    points: [
      "Automated IT operations using PowerShell, Bash, and n8n workflows",
      "Built automated alerting for monitoring and ticket escalation via Slack",
      "Streamlined employee onboarding/offboarding processes end-to-end",
      "Created internal tools improving communication and operational efficiency",
    ],
  },
  {
    title: "Support & Operations",
    icon: <Users className="w-4 h-4" />,
    points: [
      "Provided technical support for 200+ systems across office and remote locations",
      "Diagnosed and resolved hardware, software, and network issues",
      "Managed software licensing compliance and vendor procurement coordination",
      "Maintained IT documentation, SOPs, and troubleshooting knowledge base",
    ],
  },
  {
    title: "Hardware Maintenance & Repair",
    icon: <HardDrive className="w-4 h-4" />,
    points: [
      "Diagnosed and repaired 200+ computers and servers — CPU, RAM, storage, PSU, and motherboard-level troubleshooting",
      "Performed RAM, SSD, and GPU upgrades to extend device lifespan across the fleet",
      "Resolved OS issues: boot failures, driver conflicts, system corruption, and fresh installs",
      "Managed all printer support: installation, drivers, network printing, hardware faults, and consumables",
    ],
  },
  {
    title: "Production & Render Infrastructure",
    icon: <Cpu className="w-4 h-4" />,
    highlight: true,
    points: [
      "Built and maintained distributed Unreal Engine render farm infrastructure",
      "Automated render job distribution and monitored node status across the farm",
      "Optimized rendering workflows and cut production turnaround time",
      "Managed render node deployment and centralized job management across the farm",
    ],
  },
  {
    title: "Monitoring & Reliability",
    icon: <Activity className="w-4 h-4" />,
    points: [
      "Implemented centralized monitoring with Zabbix and proactive threshold alerting",
      "Monitored UPS systems and server room temperature conditions continuously",
      "Maintained infrastructure dashboards and reduced incident response time",
      "Improved reliability through real-time alerts and early issue detection",
    ],
  },
  {
    title: "Development & Internal Platforms",
    icon: <Code2 className="w-4 h-4" />,
    points: [
      "Developed tools and web portals using Python, PHP, and MySQL",
      "Hosted and maintained operational web portals on Apache infrastructure",
      "Built LAN communication tools and custom IT monitoring scripts",
      "Created centralized systems for IT asset and license management",
    ],
  },
  {
    title: "Leadership & Management",
    icon: <Shield className="w-4 h-4" />,
    points: [
      "Managed end-to-end IT operations independently across all departments",
      "Planned infrastructure upgrades, scalability improvements, and roadmap",
      "Coordinated IT requirements across production, design, and operations teams",
      "Managed concurrent IT projects, vendor relationships, and procurement cycles",
    ],
  },
  {
    title: "Customer Success Support",
    icon: <FileText className="w-4 h-4" />,
    points: [
      "Researched client and brand backgrounds to structure briefs using a 9-section template",
      "Translated raw inputs — Slack threads, PDF scope decks, style guides — into structured creative briefs",
      "Built market context for US-based client projects and verified deliverable counts before handover",
      "Prepared Stage 1 → Stage 2 handover scripts separating confirmed scope from open client questions",
    ],
  },
];

const achievements = [
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Distributed Render Farm",
    desc: "Built Unreal Engine render farm infrastructure from scratch, cutting production turnaround time.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "IT Workflow Automation",
    desc: "n8n + GLPI + Slack pipelines eliminated all manual ticketing, alerts, and daily reporting.",
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: "200+ Systems Managed",
    desc: "Complete endpoint management across office desktops, laptops, and distributed remote users.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Secure Remote Access",
    desc: "VPN infrastructure enabling 100+ freelancers to work securely from any location.",
  },
  {
    icon: <HardDrive className="w-5 h-5" />,
    title: "Centralized Storage",
    desc: "NAS-based shared storage with automated backup schedules and disaster recovery.",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Proactive Monitoring",
    desc: "Zabbix-based alerting system reducing downtime across production and IT systems.",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Infrastructure Modernization",
    desc: "Led full server room setup, virtualization rollout, and IT process automation.",
  },
];

const previousRoles = [
  {
    title: "IT Administrator",
    company: "Coequal Services",
    period: "Jan 2023 – Sep 2023",
    location: "Bangalore, India",
    points: [
      "Reviewed IT spending plans and identified opportunities for cost-effective improvements",
      "Coordinated on-site IT engineer dispatch and built response playbooks for common issues",
      "Worked directly with client stakeholders to gather feedback and improve IT service policies",
      "Led technical upgrade projects for clients, coordinating with consultants and developers",
      "Diagnosed and resolved hardware and software issues across client environments",
      "Designed and evaluated WAN and LAN connectivity solutions",
      "Analyzed network traffic and performance metrics to identify and resolve bottlenecks",
      "Planned and implemented upgrades to system hardware and software",
    ],
  },
  {
    title: "Office Administrator",
    company: "Mipl Global",
    period: "2021 – 2022",
    location: "Bangalore, India",
    points: [
      "Assisted executive secretary in managing and coordinating schedules, meetings, and travel arrangements",
      "Coordinated client sample preparation and courier & documents pickup",
    ],
  },
  {
    title: "Office Administrator",
    company: "Olympus Medical Systems India Pvt Ltd",
    period: "2019 – 2021",
    location: "Bangalore, India",
    points: [
      "Answered multi-line phone system, routing calls, delivering messages and greeting visitors",
      "Applied advanced administrative and analytical skills in overseeing day-to-day operational activities",
      "Coordinated communications, financial processing, registration, and recordkeeping functions",
      "Maintained electronic and paper filing systems for easy retrieval of information",
      "Assisted in preparation and processing of payroll to facilitate prompt staff payments",
      "Oversaw maintenance of office facilities and equipment by collaborating with repair contractors",
    ],
  },
  {
    title: "Field Representative",
    company: "HBS (Halcyon Business Solutions)",
    period: "2018 – 2019",
    location: "Bangalore, India",
    points: [
      "Traveled daily to visit customer locations and provide on-site support",
      "Strengthened merchandising and promotional strategies to drive customer engagement",
      "Connected with customers to assess satisfaction and resolve service issues",
      "Submitted reports to senior management to aid in business decision-making",
    ],
  },
];

const education = [
  {
    degree: "ITI Diploma in Electronics",
    institution: "ITI",
    period: "2016 – 2017",
  },
  {
    degree: "High School Diploma",
    institution: "St Patrick's Boys High School",
    period: "2015 – 2016",
  },
];

export function Experience() {

  return (
    <section id="experience" className="py-20 bg-white dark:bg-background">
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
            Work Experience
          </h2>
          <div className="w-14 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: "var(--portfolio-accent)" }}></div>
          <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Six years of hands-on IT management — from infrastructure and automation to hardware, security, and cross-team support.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">

          {/* Current Role — House of Blue Beans (HOBB) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-xl border border-border bg-white dark:bg-card shadow-sm overflow-hidden">
              {/* Role header */}
              <div
                className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                style={{ backgroundColor: "var(--portfolio-navy)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold text-white leading-tight"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Manager - IT, Production Automation & Infrastructure
                    </h3>
                    <p className="text-white/70 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Full-stack IT management — infrastructure, automation, security & support
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:items-end shrink-0">
                  <div className="flex items-center gap-2 text-white/80 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Building2 className="w-4 h-4" />
                    <span>House of Blue Beans (HOBB)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <MapPin className="w-4 h-4" />
                    <span>Bangalore, India</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#93c5fd", fontFamily: "'Inter', sans-serif" }}>
                    <Calendar className="w-4 h-4" />
                    <span>Current Position</span>
                  </div>
                </div>
              </div>

              {/* Categorized responsibilities */}
              <div className="px-6 py-6">
                <h4
                  className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-5"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Key Responsibilities
                </h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
                  {responsibilityCategories.map((cat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`rounded-lg p-4 border ${cat.highlight ? "border-blue-200 bg-blue-50/60 dark:border-blue-800/50 dark:bg-blue-950/30" : "border-border/60 bg-secondary/30"}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span style={{ color: "var(--portfolio-accent)" }}>{cat.icon}</span>
                        <h5
                          className="text-xs font-semibold text-foreground leading-tight"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {cat.title}
                          {cat.highlight && (
                            <span className="ml-1.5 inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--portfolio-navy)", color: "#93c5fd" }}>
                              Key
                            </span>
                          )}
                        </h5>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex gap-2 items-start">
                            <div className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: "var(--portfolio-accent)" }} />
                            <span className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Achievements at HOBB */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3
              className="text-lg font-semibold text-foreground mb-5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Key Achievements at HOBB
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievements.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-white dark:bg-card shadow-sm hover:border-primary/25 hover:shadow-md transition-all"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--portfolio-icon-bg)", color: "var(--portfolio-accent)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Previous Roles */}
          <div>
            <h3
              className="text-lg font-semibold text-foreground mb-5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Previous Experience
            </h3>
            <div className="space-y-4">
              {previousRoles.map((role, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-xl border border-border bg-white dark:bg-card shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border bg-secondary/40">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--portfolio-icon-bg)", color: "var(--portfolio-accent)" }}
                      >
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {role.title}
                        </p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {role.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {role.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {role.location}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <ul className="space-y-2">
                      {role.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex gap-2 items-start text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--portfolio-accent)" }} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3
              className="text-lg font-semibold text-foreground mb-5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Education
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-5 rounded-xl border border-border bg-white dark:bg-card shadow-sm hover:border-primary/25 hover:shadow-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--portfolio-icon-bg)", color: "var(--portfolio-accent)" }}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {edu.degree}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {edu.institution}
                    </p>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--portfolio-accent)", fontFamily: "'Inter', sans-serif" }}>
                      <BookOpen className="w-3 h-3" />
                      {edu.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
