const SECTIONS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const CONNECT = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/hemanth-k-8609b4255" },
  { name: "GitHub", href: "https://github.com/f1hunterr" },
  { name: "WhatsApp", href: "https://wa.me/918088461724" },
  { name: "Email", href: "mailto:Hemanth2608@hotmail.com" },
];

export function Footer() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 49, behavior: "smooth" });
  };

  const linkClass = "text-[var(--muted)] hover:text-[var(--ink)] transition-colors";

  return (
    <footer className="relative cross-top border-t border-[var(--line)]">
      <div className="hairgrid md:grid-cols-[2fr_1fr_1fr_1fr] border-t-0">
        <div className="px-5 md:px-10 py-10">
          <div className="display-wide text-[22px] text-[var(--ink-strong)]">Hemanth K</div>
          <p className="mt-4 max-w-[22rem] text-[var(--muted)] leading-relaxed">
            Manager - IT, Production Automation &amp; Infrastructure | House of Blue Beans (HOBB)
          </p>
          <p className="mt-5 mono-label text-[var(--muted)]">Hennur, Bangalore, Karnataka</p>
        </div>

        <div className="px-5 md:px-8 py-10">
          <h3 className="mono-label text-[var(--muted)] font-medium">Sections</h3>
          <ul className="mt-5 space-y-2">
            {SECTIONS.map((l) => (
              <li key={l.name}>
                <a href={l.href} onClick={(e) => scrollTo(e, l.href)} className={linkClass}>
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-5 md:px-8 py-10">
          <h3 className="mono-label text-[var(--muted)] font-medium">Connect</h3>
          <ul className="mt-5 space-y-2">
            {CONNECT.map((l) => (
              <li key={l.name}>
                <a
                  href={l.href}
                  className={linkClass}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-5 md:px-8 py-10">
          <h3 className="mono-label text-[var(--muted)] font-medium">Contact</h3>
          <ul className="mt-5 space-y-2 text-[var(--muted)]">
            <li className="break-words">Hemanth2608@hotmail.com</li>
            <li>+91 80884 61724</li>
            <li>
              <a href={`${import.meta.env.BASE_URL}resume.html`} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Resume ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-5 md:px-10 py-5 border-t border-[var(--line)] mono-label text-[var(--muted)]">
        <span>© 2026 Hemanth K</span>
        <span>IT Infrastructure · Automation · Systems Administration</span>
      </div>
    </footer>
  );
}
