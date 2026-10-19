import { Section, Reveal, ScrubIn } from "@/components/frame/Section";

const FACTS = [
  { label: "Role", value: "Manager - IT, Production Automation & Infrastructure" },
  { label: "Company", value: "House of Blue Beans (HOBB)" },
  { label: "Location", value: "Hennur, Bangalore, Karnataka" },
  { label: "Experience", value: "6+ Years" },
  { label: "Email", value: "Hemanth2608@hotmail.com" },
  { label: "Phone", value: "+91 80884 61724" },
  { label: "Systems", value: "200+ Managed" },
  { label: "Languages", value: "English, Tamil, Kannada, Hindi, Telugu" },
];

const COMPETENCIES = [
  { title: "Infrastructure at Scale", desc: "200+ endpoints, multi-server environment, and the full network — kept running reliably around the clock." },
  { title: "Remote Workforce Access", desc: "Always-on, zero-downtime VPN connectivity for 100+ distributed freelancers." },
  { title: "IT Automation", desc: "Ticket alerts, daily reports, and workflows fully automated — manual effort reduced to near zero." },
  { title: "Proactive Monitoring", desc: "Real-time alerts across servers, network, and server room environment. Issues resolved before users notice." },
  { title: "Data Protection", desc: "Centralized shared storage, automated backup schedules, and tested disaster recovery procedures." },
  { title: "Software Compliance", desc: "License tracking for Autodesk, Adobe & V-Ray with renewal alerts and complete audit trails." },
];

export function About() {
  return (
    <Section id="about" index="01" label="About" meta="House of Blue Beans · Bangalore">
      {/* Headline, story and portrait */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-12 px-5 md:px-10 pt-14 pb-14 md:pt-20 md:pb-20">
        <Reveal>
          <ScrubIn>
            <h2 className="headline max-w-[14ch]">
              Systems-first. <em>Always</em> on.
            </h2>
          </ScrubIn>
          <p className="lede mt-6 max-w-[38rem]">
            IT professional with a systems-first mindset — building infrastructure that scales, automating what
            slows teams down, and keeping everything running reliably.
          </p>
          <p className="mt-5 max-w-[38rem] text-[var(--muted)] leading-relaxed">
            I manage the complete IT operations at House of Blue Beans (HOBB) — covering 200+ endpoints, multi-server
            infrastructure, network security, and the automation pipelines that keep everything running.
          </p>
          <p className="mt-4 max-w-[38rem] text-[var(--muted)] leading-relaxed">
            My approach is systems-first: build once, automate everything, monitor proactively. Whether it's
            centralized storage, VPN access for 100+ remote freelancers, or real-time infrastructure alerts, every
            solution is built to cut manual work and keep things running without surprises.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="lg:pt-2">
          <figure className="w-[240px] md:w-[300px] lg:w-[340px]">
            <div className="border border-[var(--line-strong)] p-2 bg-[var(--bg-raised)]">
              <img
                src={`${import.meta.env.BASE_URL}profile.jpg`}
                srcSet={`${import.meta.env.BASE_URL}profile-320.jpg 360w, ${import.meta.env.BASE_URL}profile.jpg 720w`}
                sizes="(min-width: 1024px) 322px, (min-width: 768px) 282px, 222px"
                alt="Hemanth K"
                width={720}
                height={1080}
                loading="lazy"
                className="w-full aspect-[2/3] object-cover grayscale-[35%]"
              />
            </div>
            <figcaption className="mono-label text-[var(--muted)] mt-3 flex justify-between">
              <span>Fig. 01</span>
              <span>Hemanth K</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      {/* Quick facts */}
      <div className="hairgrid sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.label} className="px-5 md:px-8 py-6">
            <div className="mono-label text-[var(--muted)]">{f.label}</div>
            <div className="mt-2 text-[var(--ink)] break-words">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Core competencies */}
      <div className="cell-strip mono-label">
        <span>Core competencies</span>
        <span className="text-[var(--faint)]">A — F</span>
      </div>
      <div className="hairgrid md:grid-cols-2 lg:grid-cols-3 border-t-0">
        {COMPETENCIES.map((c, i) => (
          // The fade sits inside the cell: a fading cell would let the grid's line colour show through
          <div key={c.title} className="px-5 md:px-8 py-10">
            <Reveal delay={(i % 3) * 0.06}>
              <div className="mono-label text-[var(--muted)]">{String.fromCharCode(65 + i)}</div>
              <h3 className="mt-6 text-2xl tracking-[-0.02em]">{c.title}</h3>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">{c.desc}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
