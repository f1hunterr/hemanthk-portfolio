import { Section, SectionIntro, Reveal } from "@/components/frame/Section";

const skillCategories = [
  { title: "IT Infrastructure", skills: ["System Administration", "IT Asset Management", "Access Control", "Backup Management", "GLPI", "User & Domain Management"] },
  { title: "Networking & Security", skills: ["VLAN Configuration", "Switch Management", "Sophos Firewall", "Tailscale VPN", "WireGuard", "Access Point Management", "User Permission Management"] },
  { title: "Servers & Virtualization", skills: ["TrueNAS", "Proxmox", "VMware ESXi", "Windows Server", "Linux (Debian/Ubuntu)", "NAS Storage", "Disaster Recovery"] },
  { title: "Automation & Scripting", skills: ["n8n Workflows", "GLPI Automation", "Slack Integrations", "PowerShell Scripting", "Bash Scripting"] },
  { title: "Monitoring", skills: ["Zabbix", "Infrastructure Alerting", "SNMP Monitoring", "Temperature Monitoring", "UPS Monitoring", "Dashboard Management"] },
  { title: "Storage & Backup", skills: ["NAS Administration", "Backup Planning", "Backup Monitoring", "Data Recovery", "Shared Storage", "RAID Management"] },
  { title: "Software & Licensing", skills: ["Autodesk License Management", "Adobe License Management", "V-Ray License Management", "License Tracking", "Asset Lifecycle Management"] },
  { title: "Cloud & DNS", skills: ["Microsoft Azure", "Google Cloud (GCP)", "Cloudflare", "Amazon S3", "Reverse Proxy", "DNS Management"] },
  { title: "Development", skills: ["PHP", "MySQL", "Apache", "Python", "HTML / CSS / JS", "Internal Web Portals"] },
];

export function Skills() {
  return (
    <Section id="skills" index="02" label="Skills" meta="Tools used every day">
      <SectionIntro
        title={<>The <em>stack</em> behind it.</>}
        lede="The tools and technologies used daily to manage, secure, and automate IT infrastructure at scale."
      />
      <div className="hairgrid">
        {skillCategories.map((cat, idx) => (
          <div key={cat.title} className="grid md:grid-cols-[320px_1fr] gap-x-10 gap-y-3 px-5 md:px-10 py-7">
            <Reveal className="flex items-baseline gap-4">
              <span className="mono-label text-[var(--muted)] w-6">{String(idx + 1).padStart(2, "0")}</span>
              <h3 className="text-xl tracking-[-0.02em]">{cat.title}</h3>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-[var(--ink)] leading-relaxed md:pt-[3px]">
                {/* Each skill keeps its separator; the space after each one is where lines may wrap */}
                {cat.skills.map((s, i) => (
                  <span key={s}>
                    <span className="whitespace-nowrap">
                      {s}
                      {i < cat.skills.length - 1 && <span className="text-[var(--faint)] ml-2">/</span>}
                    </span>{" "}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
