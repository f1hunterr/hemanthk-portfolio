import { useEffect, useState } from "react";
import { SECTIONS, useActiveSection, scrollToSection } from "@/hooks/use-active-section";

const ITEMS = SECTIONS.filter((s) => s.id !== "home");
const HIDE_AFTER_MS = 1500;

/**
 * Bottom-right index of sections: the current one large and solid, the rest small and faint.
 * It shows while the page is scrolling and fades out once scrolling stops (hovering it keeps it
 * open), so it never sits over text someone is reading. Wide screens only.
 */
export function SectionIndex() {
  const active = useActiveSection();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), HIDE_AFTER_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  // Nothing to point at while the hero fills the screen
  if (active === "home") return null;

  return (
    <nav
      className={`section-index ${visible || hovered ? "is-visible" : ""}`}
      aria-label="Section index"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {ITEMS.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => scrollToSection(s.id)}
          className={`section-index-item display-wide ${active === s.id ? "is-active" : ""}`}
          aria-current={active === s.id ? "true" : undefined}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}
