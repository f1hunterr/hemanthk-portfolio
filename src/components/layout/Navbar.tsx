import { useState, useEffect } from "react";
import { Menu, X, Download, Sun, Moon, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const THEME_OPTIONS = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleDownloadResume = () => {
    window.open(`${import.meta.env.BASE_URL}resume.html`, "_blank", "noopener,noreferrer");
  };

  const cycleTheme = () => {
    const idx = THEME_OPTIONS.findIndex((t) => t.value === theme);
    setTheme(THEME_OPTIONS[(idx + 1) % THEME_OPTIONS.length].value);
  };

  const CurrentThemeIcon =
    THEME_OPTIONS.find((t) => t.value === theme)?.icon ?? Sun;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-white/80 dark:bg-background/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, "#home")}
          className="flex items-center gap-2.5 text-foreground"
          data-testid="link-logo"
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: "var(--portfolio-navy)", fontFamily: "'Poppins', sans-serif" }}
          >
            HK
          </span>
          <span
            className="font-semibold text-base hidden lg:inline-block"
            style={{ color: "var(--portfolio-accent)", fontFamily: "'Poppins', sans-serif" }}
          >
            Hemanth K
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                style={
                  isActive
                    ? { backgroundColor: "var(--portfolio-navy)", fontFamily: "'Inter', sans-serif" }
                    : { fontFamily: "'Inter', sans-serif" }
                }
                data-testid={`link-nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={`Theme: ${theme} — click to cycle`}
            aria-label="Toggle theme"
          >
            <CurrentThemeIcon size={18} />
          </button>

          <a
            href="https://github.com/f1hunterr"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>

          <Button
            size="sm"
            className="gap-2 font-medium text-white"
            style={{ backgroundColor: "var(--portfolio-navy)", fontFamily: "'Inter', sans-serif" }}
            onClick={handleDownloadResume}
            data-testid="button-download-resume-nav"
          >
            <Download size={15} />
            Resume
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-background border-b border-border shadow-md py-4 px-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="px-4 py-2.5 text-sm font-medium text-foreground rounded-lg hover:bg-secondary transition-colors block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.name}
            </a>
          ))}

          {/* Theme switcher row */}
          <div className="flex gap-2 mt-1">
            {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  theme === value
                    ? "text-white"
                    : "text-muted-foreground bg-secondary hover:text-foreground"
                }`}
                style={
                  theme === value
                    ? { backgroundColor: "var(--portfolio-navy)" }
                    : {}
                }
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <Button
            className="w-full mt-1 gap-2 text-white"
            style={{ backgroundColor: "var(--portfolio-navy)" }}
            onClick={handleDownloadResume}
          >
            <Download size={16} />
            Download Resume
          </Button>
        </div>
      )}
    </header>
  );
}
