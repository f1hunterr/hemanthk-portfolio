import { Section, SectionIntro, Reveal } from "@/components/frame/Section";

const responsibilityCategories = [
  {
    title: "IT Infrastructure & Operations",
    points: [
      "Managed 200+ desktops, laptops, and servers for full production operations",
      "Maintained server room infrastructure, power management, and cable organization",
      "Managed workstation imaging, OS deployment, and hardware lifecycle",
      "Maintained uptime for critical production systems through preventive maintenance",
    ],
  },
  {
    title: "Network & Security",
    points: [
      "Designed secure office network with VLAN segmentation for department isolation",
      "Configured Sophos firewall rules and monitored security logs and alerts",
      "Implemented VPN-based remote access for 100+ freelancers and remote employees",
      "Managed access control policies, Wi-Fi access points, and bandwidth optimization",
    ],
  },
  {
    title: "Automation & Productivity",
    points: [
      "Automated IT operations using PowerShell, Bash, and n8n workflows",
      "Built automated alerting for monitoring and ticket escalation via Slack",
      "Streamlined employee onboarding/offboarding processes end-to-end",
      "Created internal tools improving communication and operational efficiency",
    ],
  },
  {
    title: "Support & Operations",
    points: [
      "Provided technical support for 200+ systems across office and remote locations",
      "Diagnosed and resolved hardware, software, and network issues",
      "Managed software licensing compliance and vendor procurement coordination",
      "Maintained IT documentation, SOPs, and troubleshooting knowledge base",
    ],
  },
  {
    title: "Hardware Maintenance & Repair",
    points: [
      "Diagnosed and repaired 200+ computers and servers — CPU, RAM, storage, PSU, and motherboard-level troubleshooting",
      "Performed RAM, SSD, and GPU upgrades to extend device lifespan across the fleet",
      "Resolved OS issues: boot failures, driver conflicts, system corruption, and fresh installs",
      "Managed all printer support: installation, drivers, network printing, hardware faults, and consumables",
    ],
  },
  {
    title: "Production & Render Infrastructure",
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
    points: [
      "Implemented centralized monitoring with Zabbix and proactive threshold alerting",
      "Monitored UPS systems and server room temperature conditions continuously",
      "Maintained infrastructure dashboards and reduced incident response time",
      "Improved reliability through real-time alerts and early issue detection",
    ],
  },
  {
    title: "Development & Internal Platforms",
    points: [
      "Developed tools and web portals using Python, PHP, and MySQL",
      "Hosted and maintained operational web portals on Apache infrastructure",
      "Built LAN communication tools and custom IT monitoring scripts",
      "Created centralized systems for IT asset and license management",
    ],
  },
  {
    title: "Leadership & Management",
    points: [
      "Managed end-to-end IT operations independently across all departments",
      "Planned infrastructure upgrades, scalability improvements, and roadmap",
      "Coordinated IT requirements across production, design, and operations teams",
      "Managed concurrent IT projects, vendor relationships, and procurement cycles",
    ],
  },
  {
    title: "Customer Success Support",
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
    title: "Distributed Render Farm",
    desc: "Built Unreal Engine render farm infrastructure from scratch, cutting production turnaround time.",
  },
  {
    title: "IT Workflow Automation",
    desc: "n8n + GLPI + Slack pipelines eliminated all manual ticketing, alerts, and daily reporting.",
  },
  {
    title: "200+ Systems Managed",
    desc: "Complete endpoint management across office desktops, laptops, and distributed remote users.",
  },
  {
    title: "Secure Remote Access",
    desc: "VPN infrastructure enabling 100+ freelancers to work securely from any location.",
  },
  {
    title: "Centralized Storage",
    desc: "NAS-based shared storage with automated backup schedules and disaster recovery.",
  },
  {
    title: "Proactive Monitoring",
    desc: "Zabbix-based alerting system reducing downtime across production and IT systems.",
  },
  {
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
    <Section id="experience" index="04" label="Experience" meta="Current role + previous">
      <SectionIntro
        title={<>Hands-on, <em>end to end.</em></>}
        lede="Six years of hands-on IT management — from infrastructure and automation to hardware, security, and cross-team support."
      />

      {/* Current role */}
      <div className="border-t border-[var(--line)] px-5 md:px-10 py-10 md:py-12 bg-[var(--bg-raised)]">
        <Reveal>
          <p className="mono-label text-[var(--muted)] flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-2 text-[var(--ok)]">
              <span className="h-2 w-2 rounded-full bg-[var(--ok)]" /> Current
            </span>
            <span className="text-[var(--faint)]">·</span> House of Blue Beans (HOBB)
            <span className="text-[var(--faint)]">·</span> Bangalore, India
          </p>
          <h3 className="mt-5 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.08] tracking-[-0.03em] max-w-[22ch]">
            Manager - IT, Production Automation &amp; Infrastructure
          </h3>
          <p className="mt-3 text-[var(--muted)]">
            Full-stack IT management — infrastructure, automation, security &amp; support
          </p>
        </Reveal>
      </div>

      {/* Responsibilities: 10 areas, so 2 columns keep the grid even */}
      <div className="cell-strip mono-label border-t border-[var(--line)]">
        <span>Key responsibilities</span>
        <span className="text-[var(--faint)]">{String(responsibilityCategories.length).padStart(2, "0")} areas</span>
      </div>
      <div className="hairgrid md:grid-cols-2 border-t-0">
        {responsibilityCategories.map((cat, idx) => (
          <div key={cat.title} className="px-5 md:px-8 py-8">
            <Reveal delay={(idx % 2) * 0.05}>
              <div className="flex items-baseline justify-between gap-4">
                <h4 className="text-lg tracking-[-0.02em]">
                  <span className="mono-label text-[var(--muted)] mr-3">{String(idx + 1).padStart(2, "0")}</span>
                  {cat.title}
                </h4>
                {cat.highlight && <span className="mono-label text-[var(--accent-ink)] shrink-0">Key</span>}
              </div>
              <ul className="mt-4 space-y-2">
                {cat.points.map((point) => (
                  <li key={point} className="grid grid-cols-[18px_1fr] text-[15px] leading-relaxed text-[var(--muted)]">
                    <span className="text-[var(--faint)]">—</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="cell-strip mono-label">
        <span>Key achievements at HOBB</span>
        <span className="text-[var(--faint)]">A — {String.fromCharCode(64 + achievements.length)}</span>
      </div>
      <div className="hairgrid border-t-0">
        {achievements.map((item, idx) => (
          <div key={item.title} className="grid md:grid-cols-[48px_320px_1fr] gap-x-6 gap-y-1 px-5 md:px-10 py-5">
            <span className="mono-label text-[var(--muted)] pt-[5px]">{String.fromCharCode(65 + idx)}</span>
            <h4 className="text-lg tracking-[-0.02em]">{item.title}</h4>
            <p className="text-[var(--muted)] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Previous roles */}
      <div className="cell-strip mono-label">
        <span>Previous experience</span>
        <span className="text-[var(--faint)]">{String(previousRoles.length).padStart(2, "0")} roles</span>
      </div>
      <div className="hairgrid border-t-0">
        {previousRoles.map((role) => (
          <div key={role.company} className="grid md:grid-cols-[200px_1fr] gap-x-10 gap-y-3 px-5 md:px-10 py-8">
            <div className="mono-label text-[var(--muted)] pt-[6px]">{role.period}</div>
            <Reveal>
              <h4 className="text-xl tracking-[-0.02em]">{role.title}</h4>
              <p className="mt-1 text-[var(--muted)]">
                {role.company} <span className="text-[var(--faint)]">·</span> {role.location}
              </p>
              <ul className="mt-4 grid lg:grid-cols-2 gap-x-10 gap-y-2">
                {role.points.map((point) => (
                  <li key={point} className="grid grid-cols-[18px_1fr] text-[15px] leading-relaxed text-[var(--muted)]">
                    <span className="text-[var(--faint)]">—</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="cell-strip mono-label">
        <span>Education</span>
        <span className="text-[var(--faint)]">{String(education.length).padStart(2, "0")}</span>
      </div>
      <div className="hairgrid border-t-0">
        {education.map((edu) => (
          <div key={edu.degree} className="grid md:grid-cols-[200px_1fr] gap-x-10 gap-y-1 px-5 md:px-10 py-6">
            <div className="mono-label text-[var(--muted)] pt-[5px]">{edu.period}</div>
            <div>
              <h4 className="text-lg tracking-[-0.02em]">{edu.degree}</h4>
              <p className="text-[var(--muted)]">{edu.institution}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
