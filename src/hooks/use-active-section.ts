import { useEffect, useState } from "react";

export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const NAV_HEIGHT = 49;

/** The section whose top has passed just under the nav bar. Shared by the nav and the section index. */
export function useActiveSection(): string {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // Measured from the viewport, not offsetTop: sections sit inside the positioned frame
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(SECTIONS[i].id);
          return;
        }
      }
      setActive("home");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT, behavior: "smooth" });
}
