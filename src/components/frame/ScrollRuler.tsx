import { useEffect, useRef } from "react";

const MAJOR = Array.from({ length: 21 }, (_, i) => i * 5); // 0, 5, ... 100

/**
 * The right-edge ruler: ticks 0-100 and a blue marker that tracks scroll progress.
 * Wide screens only (there must be room beside the frame). Clicking the rail jumps there.
 */
export function ScrollRuler() {
  const markerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      // Written straight to the DOM: this runs every scroll frame, no React re-render needed
      if (markerRef.current) markerRef.current.style.top = `${p * 100}%`;
      if (labelRef.current) labelRef.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
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

  const jump = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = (e.clientY - rect.top) / rect.height;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: p * max, behavior: "smooth" });
  };

  return (
    <div className="scroll-ruler" aria-hidden="true">
      <div className="scroll-ruler-rail" onClick={jump} title="Jump to this point">
        {MAJOR.map((v) => (
          <div key={v} className="scroll-ruler-tick major" style={{ top: `${v}%` }}>
            {v % 10 === 0 && <span>{v}</span>}
          </div>
        ))}
        {MAJOR.slice(0, -1).flatMap((v) =>
          [1, 2, 3, 4].map((m) => (
            <div key={`${v}-${m}`} className="scroll-ruler-tick" style={{ top: `${v + m}%` }} />
          ))
        )}
        <div ref={markerRef} className="scroll-ruler-marker">
          <span ref={labelRef}>000%</span>
        </div>
      </div>
    </div>
  );
}
