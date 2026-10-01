import { useEffect, useRef } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate on non-touch devices for users who haven't asked for reduced motion
    // (must match the cursor: none media query in index.css)
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotScale = 1;
    let ringScale = 1;
    let hovering = false;
    let clicking = false;
    let entered = false;
    let rafId = 0;

    // Run the animation loop only while something is still moving
    function wake() {
      if (!rafId) rafId = requestAnimationFrame(animate);
    }

    const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']";

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!entered) {
        entered = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      const target = document.elementFromPoint(e.clientX, e.clientY);
      hovering = !!target?.closest(INTERACTIVE);
      wake();
    }

    function onMouseDown() { clicking = true; wake(); }
    function onMouseUp() { clicking = false; wake(); }

    function animate() {
      // Lerp ring position toward dot
      ringX = lerp(ringX, mouseX, 0.25);
      ringY = lerp(ringY, mouseY, 0.25);

      // Lerp scales for smooth click/hover transitions
      const targetDotScale = clicking ? 0.5 : 1;
      const targetRingScale = clicking ? 0.7 : hovering ? 1.5 : 1;
      dotScale = lerp(dotScale, targetDotScale, 0.2);
      ringScale = lerp(ringScale, targetRingScale, 0.15);

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${dotScale})`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${ringScale})`;
      ring.style.borderColor = hovering
        ? "var(--portfolio-accent)"
        : "rgba(255, 255, 255, 0.75)";

      const settled =
        Math.abs(ringX - mouseX) < 0.1 && Math.abs(ringY - mouseY) < 0.1 &&
        Math.abs(dotScale - targetDotScale) < 0.001 && Math.abs(ringScale - targetRingScale) < 0.001;
      rafId = settled ? 0 : requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Inner dot — mix-blend-mode keeps it visible on any background */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "white",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          willChange: "transform",
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Outer ring — lerp trails the dot */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2px solid rgba(255, 255, 255, 0.75)",
          backgroundColor: "transparent",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 0,
          willChange: "transform",
          transition: "border-color 0.2s ease, opacity 0.3s ease",
        }}
      />
    </>
  );
}
