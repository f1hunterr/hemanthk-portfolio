import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Github } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const NAV_HEIGHT = 49;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        // Measured from the viewport, not offsetTop: sections sit inside the positioned frame
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const resumeHref = `${import.meta.env.BASE_URL}resume.html`;
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--line)] backdrop-blur-md"
      style={{ height: NAV_HEIGHT, backgroundColor: "color-mix(in oklab, var(--bg) 95%, transparent)" }}
    >
      <div className="flex h-full items-stretch">
        {/* Name */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, "#home")}
          className="flex items-center px-5 md:px-6 border-r border-[var(--line)] display-wide text-[15px] text-[var(--ink-strong)] whitespace-nowrap"
          data-testid="link-logo"
        >
          Hemanth K
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-stretch px-2" aria-label="Sections">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center px-[10px] mono-label transition-colors ${
                  isActive ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
                data-testid={`link-nav-${link.name.toLowerCase()}`}
              >
                <span
                  className={`px-[6px] py-[2px] ${isActive ? "bg-[var(--invert-bg)] text-[var(--invert-fg)]" : ""}`}
                >
                  {link.name}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Right-hand cells */}
        <a
          href="https://github.com/f1hunterr"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex w-12 items-center justify-center border-l border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          aria-label="GitHub"
        >
          <Github size={16} />
        </a>
        <button
          onClick={toggleTheme}
          className="flex w-12 items-center justify-center border-l border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          title={theme === "dark" ? "Light theme" : "Dark theme"}
        >
          <ThemeIcon size={16} />
        </button>
        <a
          href={resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center px-6 bg-[var(--invert-bg)] text-[var(--invert-fg)] mono-label font-bold hover:opacity-85 transition-opacity"
          data-testid="button-download-resume-nav"
        >
          Resume
        </a>
        <button
          className="lg:hidden flex w-12 items-center justify-center border-l border-[var(--line)] text-[var(--ink)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden absolute top-full left-0 right-0 bg-[var(--bg)] border-b border-[var(--line)]">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="flex items-center justify-between h-12 px-5 border-b border-[var(--line)] mono-label text-[var(--ink)]"
            >
              {link.name}
              <span className="text-[var(--faint)]">{String(i).padStart(2, "0")}</span>
            </a>
          ))}
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-12 bg-[var(--invert-bg)] text-[var(--invert-fg)] mono-label font-bold"
          >
            Download Resume
          </a>
        </div>
      )}
    </header>
  );
}
