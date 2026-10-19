import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Magic UI's Glyph Matrix: a canvas grid of faint glyphs that shift a few at a time.
// Adapted: one still frame under reduced motion, and no ticking while off screen or in a hidden tab.

interface GlyphMatrixProps extends React.HTMLAttributes<HTMLCanvasElement> {
  /** Characters to randomly pick from */
  glyphs?: string;
  /** Cell size in px (also font size) */
  cellSize?: number;
  /** Probability (0-1) a cell mutates each tick */
  mutationRate?: number;
  /** Tick interval in ms */
  interval?: number;
  /** Fade out toward bottom (0 = no fade) */
  fadeBottom?: number;
  /** Glyph color (any CSS color) */
  color?: string;
}

export function GlyphMatrix({
  glyphs = "01·•+*/\\<>=",
  cellSize = 14,
  mutationRate = 0.04,
  interval = 90,
  fadeBottom = 0.6,
  color = "#6B7280",
  className,
  style,
  ...props
}: GlyphMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Kept in a ref so a theme change recolours the next frame without restarting
  const rgbaRef = useRef({ r: 107, g: 114, b: 128, a: 1 });
  const redrawRef = useRef<() => void>(() => {});

  // Resolve any CSS colour to RGBA by painting one pixel
  useEffect(() => {
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    const p = probe.getContext("2d", { willReadFrequently: true });
    if (!p) return;
    p.fillStyle = "#6B7280"; // an invalid colour keeps this fallback
    p.fillStyle = color;
    p.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = p.getImageData(0, 0, 1, 1).data;
    rgbaRef.current = { r, g, b, a: a / 255 };
    redrawRef.current();
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0, rows = 0;
    let cells: string[] = [];
    let alphas: number[] = [];
    let raf = 0, last = 0;
    let inView = false;

    const pick = () => glyphs[Math.floor(Math.random() * glyphs.length)];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cellSize);
      rows = Math.ceil(h / cellSize);
      cells = Array.from({ length: cols * rows }, pick);
      alphas = Array.from({ length: cols * rows }, () => 0.05 + Math.random() * 0.35);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.font = `${cellSize - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      const { r, g, b, a: ca } = rgbaRef.current;
      for (let y = 0; y < rows; y++) {
        const fade = fadeBottom > 0 ? 1 - (y / rows) * fadeBottom : 1;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alphas[i] * fade * ca})`;
          ctx.fillText(cells[i], x * cellSize, y * cellSize);
        }
      }
    };
    redrawRef.current = draw;

    const tick = (t: number) => {
      if (t - last >= interval) {
        last = t;
        const total = cols * rows;
        const n = Math.max(1, Math.floor(total * mutationRate));
        for (let k = 0; k < n; k++) {
          const i = Math.floor(Math.random() * total);
          cells[i] = pick();
          alphas[i] = 0.05 + Math.random() * 0.45;
        }
        draw();
      }
      raf = requestAnimationFrame(tick);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!still && inView && !document.hidden) raf = requestAnimationFrame(tick);
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      redrawRef.current = () => {};
    };
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom]);

  return (
    <canvas
      ref={canvasRef}
      data-glyph-matrix
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      {...props}
    />
  );
}
