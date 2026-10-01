import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

const W = 560;
const H = 450;
const CX = W / 2;
const CY = H / 2;
const CORE_R = 36;
const SPAWN_MS = 1100;
const BETWEEN_MS = 2400;
const FRAME_MS = 1000 / 60;

type TType = "virus" | "ddos" | "ransom" | "zeroday";
type GState = "idle" | "playing" | "between" | "over";

interface Threat {
  id: number; x: number; y: number; dx: number; dy: number;
  r: number; hp: number; maxHp: number;
  color: string; label: string; pts: number; flash: number;
}
interface Particle {
  x: number; y: number; vx: number; vy: number;
  alpha: number; r: number; color: string;
}
interface GS {
  state: GState; threats: Threat[]; particles: Particle[];
  score: number; lives: number; wave: number;
  queue: TType[]; spawnT: number; betweenT: number; nextId: number;
}

const TCFG: Record<TType, { color: string; r: number; spd: number; hp: number; label: string; pts: number }> = {
  virus:   { color: "#ef4444", r: 14, spd: 1.1,  hp: 1, label: "VIRUS",  pts: 10 },
  ddos:    { color: "#f97316", r: 19, spd: 0.8,  hp: 2, label: "DDoS",   pts: 25 },
  ransom:  { color: "#a855f7", r: 23, spd: 0.55, hp: 3, label: "RANSOM", pts: 50 },
  zeroday: { color: "#eab308", r: 12, spd: 1.9,  hp: 1, label: "0-DAY",  pts: 40 },
};

const WAVES: TType[][] = [
  ["virus","virus","virus","virus","virus"],
  ["virus","virus","virus","ddos","ddos"],
  ["virus","ddos","ddos","ransom","ransom"],
  ["virus","ddos","ransom","zeroday","zeroday"],
  ["ddos","ddos","ransom","ransom","zeroday","zeroday","virus"],
  ["ddos","ransom","ransom","zeroday","zeroday","zeroday","virus","virus"],
];

function spawnThreat(type: TType, id: number): Threat {
  const c = TCFG[type];
  const edge = Math.floor(Math.random() * 4);
  let x = 0, y = 0;
  if (edge === 0)      { x = Math.random() * W; y = -c.r; }
  else if (edge === 1) { x = W + c.r; y = Math.random() * H; }
  else if (edge === 2) { x = Math.random() * W; y = H + c.r; }
  else                 { x = -c.r; y = Math.random() * H; }
  const spd = c.spd * (0.85 + Math.random() * 0.3);
  const ang = Math.atan2(CY - y, CX - x);
  return { id, x, y, dx: Math.cos(ang) * spd, dy: Math.sin(ang) * spd, r: c.r, hp: c.hp, maxHp: c.hp, color: c.color, label: c.label, pts: c.pts, flash: 0 };
}

function makeGS(): GS {
  return { state: "idle", threats: [], particles: [], score: 0, lives: 3, wave: 0, queue: [], spawnT: SPAWN_MS, betweenT: 0, nextId: 0 };
}

function launchWave(gs: GS, waveIdx: number) {
  const cfg = WAVES[Math.min(waveIdx, WAVES.length - 1)];
  gs.queue = [...cfg].sort(() => Math.random() - 0.5);
  gs.spawnT = SPAWN_MS;
  gs.betweenT = 0;
  gs.state = "playing";
  gs.wave = waveIdx;
}

function burst(gs: GS, x: number, y: number, color: string, count = 10) {
  for (let i = 0; i < count; i++) {
    const ang = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const spd = 1.5 + Math.random() * 2.5;
    gs.particles.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, alpha: 1, r: 2 + Math.random() * 3, color });
  }
}

export function NetworkDefenseGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS>(makeGS());
  const rafRef = useRef<number>(0);
  const lastTRef = useRef<number>(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = W / rect.width;
    const sy = H / rect.height;
    const cx = (e.clientX - rect.left) * sx;
    const cy = (e.clientY - rect.top) * sy;
    const gs = gsRef.current;

    if (gs.state === "idle" || gs.state === "over") {
      const fresh = makeGS();
      launchWave(fresh, 0);
      gsRef.current = fresh;
      return;
    }
    if (gs.state !== "playing") return;

    for (let i = gs.threats.length - 1; i >= 0; i--) {
      const t = gs.threats[i];
      if (Math.hypot(cx - t.x, cy - t.y) <= t.r + 5) {
        t.hp--;
        t.flash = 90;
        if (t.hp <= 0) {
          burst(gs, t.x, t.y, t.color, 12);
          gs.score += t.pts;
          gs.threats.splice(i, 1);
        }
        break;
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const pls = () => (Math.sin(Date.now() / 380) + 1) / 2;

    const draw = () => {
      const gs = gsRef.current;

      // Background
      ctx.fillStyle = "#091525";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(25,75,125,0.28)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Pulse ring from core
      const p = pls();
      ctx.strokeStyle = `rgba(30,120,200,${0.12 - p * 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(CX, CY, CORE_R + 18 + p * 110, 0, Math.PI * 2);
      ctx.stroke();

      // Particles
      for (const pt of gs.particles) {
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Threats
      for (const t of gs.threats) {
        ctx.save();
        const col = t.flash > 0 ? "#ffffff" : t.color;
        ctx.shadowColor = col;
        ctx.shadowBlur = 14;
        ctx.globalAlpha = 0.88;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        if (t.hp < t.maxHp) {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(t.x - t.r, t.y - t.r - 7, t.r * 2, 3);
          ctx.fillStyle = col;
          ctx.fillRect(t.x - t.r, t.y - t.r - 7, t.r * 2 * (t.hp / t.maxHp), 3);
        }
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(7, Math.floor(t.r * 0.52))}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(t.label, t.x, t.y);
        ctx.restore();
      }

      // Core shield ring
      const shieldCol = gs.lives > 1 ? "#22c55e" : "#ef4444";
      ctx.save();
      ctx.strokeStyle = shieldCol;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.45 + pls() * 0.35;
      ctx.beginPath();
      ctx.arc(CX, CY, CORE_R + 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      const grad = ctx.createRadialGradient(CX, CY, 4, CX, CY, CORE_R);
      grad.addColorStop(0, "#1e3a5f");
      grad.addColorStop(1, "#0a1e3f");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(CX, CY, CORE_R, 0, Math.PI * 2);
      ctx.fill();
      // Server icon lines
      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      for (const oy of [-10, 0, 10]) {
        ctx.beginPath(); ctx.moveTo(CX - 14, CY + oy); ctx.lineTo(CX + 14, CY + oy); ctx.stroke();
      }
      ctx.fillStyle = "#4ade80";
      for (const oy of [-10, 0, 10]) {
        ctx.beginPath(); ctx.arc(CX + 9, CY + oy, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = "#93c5fd";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("CORE", CX, CY + CORE_R + 5);
      ctx.restore();

      // HUD
      if (gs.state === "playing" || gs.state === "between") {
        ctx.fillStyle = "rgba(9,21,37,0.82)";
        ctx.fillRect(0, 0, W, 32);
        ctx.font = "bold 11px monospace";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#93c5fd";
        ctx.textAlign = "left";
        ctx.fillText(`WAVE ${gs.wave + 1}`, 12, 16);
        ctx.fillStyle = "#f8fafc";
        ctx.textAlign = "center";
        ctx.fillText(`SCORE  ${gs.score}`, CX, 16);
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(W - 14 - i * 18, 16, 6, 0, Math.PI * 2);
          ctx.fillStyle = i < gs.lives ? "#22c55e" : "#374151";
          ctx.fill();
        }
      }

      // Overlays
      if (gs.state === "idle") {
        ctx.fillStyle = "rgba(9,21,37,0.9)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#93c5fd";
        ctx.font = "bold 24px monospace";
        ctx.fillText("NETWORK DEFENSE", CX, CY - 80);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "12px monospace";
        ctx.fillText("Protect the core server from incoming threats.", CX, CY - 48);
        ctx.fillText("Click threats to block and destroy them.", CX, CY - 28);
        const legend: [string, string][] = [["VIRUS","fast · 1 hit · 10pts"], ["DDoS","medium · 2 hits · 25pts"], ["RANSOM","slow · 3 hits · 50pts"], ["0-DAY","very fast · 1 hit · 40pts"]];
        const colors = ["#ef4444","#f97316","#a855f7","#eab308"];
        legend.forEach(([name, desc], i) => {
          const y = CY + 5 + i * 19;
          ctx.fillStyle = colors[i];
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "right";
          ctx.fillText(name, CX - 4, y);
          ctx.fillStyle = "#64748b";
          ctx.font = "10px monospace";
          ctx.textAlign = "left";
          ctx.fillText(desc, CX + 8, y);
        });
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("[ CLICK TO START ]", CX, CY + 90);
      }

      if (gs.state === "between") {
        ctx.fillStyle = "rgba(9,21,37,0.65)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 22px monospace";
        ctx.fillText(`WAVE ${gs.wave + 1} CLEARED`, CX, CY - 15);
        ctx.fillStyle = "#93c5fd";
        ctx.font = "13px monospace";
        ctx.fillText("Preparing next wave...", CX, CY + 16);
      }

      if (gs.state === "over") {
        ctx.fillStyle = "rgba(9,21,37,0.92)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 24px monospace";
        ctx.fillText("BREACH DETECTED", CX, CY - 72);
        ctx.fillStyle = "#f8fafc";
        ctx.font = "13px monospace";
        ctx.fillText("The core network has been compromised.", CX, CY - 42);
        ctx.fillStyle = "#93c5fd";
        ctx.font = "bold 20px monospace";
        ctx.fillText(`SCORE:  ${gs.score}`, CX, CY + 2);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "13px monospace";
        ctx.fillText(`Waves cleared: ${gs.wave}`, CX, CY + 30);
        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 14px monospace";
        ctx.fillText("[ CLICK TO RETRY ]", CX, CY + 66);
      }
    };

    const loop = (ts: number) => {
      const delta = Math.min(ts - lastTRef.current, 50);
      lastTRef.current = ts;
      const gs = gsRef.current;
      // Speeds are tuned per 60fps frame; scale by elapsed time so high-refresh displays aren't faster
      const f = delta / FRAME_MS;

      if (gs.state === "playing") {
        gs.spawnT += delta;
        if (gs.spawnT >= SPAWN_MS && gs.queue.length > 0) {
          gs.spawnT = 0;
          gs.threats.push(spawnThreat(gs.queue.shift()!, gs.nextId++));
        }

        for (let i = gs.threats.length - 1; i >= 0; i--) {
          const t = gs.threats[i];
          t.x += t.dx * f;
          t.y += t.dy * f;
          if (t.flash > 0) t.flash -= delta;
          if (Math.hypot(t.x - CX, t.y - CY) < CORE_R + t.r * 0.55) {
            burst(gs, t.x, t.y, "#ef4444", 6);
            gs.threats.splice(i, 1);
            gs.lives = Math.max(0, gs.lives - 1);
            if (gs.lives === 0) gs.state = "over";
          }
        }

        if (gs.state === "playing" && gs.queue.length === 0 && gs.threats.length === 0) {
          gs.state = "between";
          gs.betweenT = 0;
        }
      }

      if (gs.state === "between") {
        gs.betweenT += delta;
        if (gs.betweenT >= BETWEEN_MS) launchWave(gs, gs.wave + 1);
      }

      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        p.x += p.vx * f; p.y += p.vy * f;
        const drag = Math.pow(0.93, f);
        p.vx *= drag; p.vy *= drag;
        p.alpha -= 0.022 * f;
        if (p.alpha <= 0) gs.particles.splice(i, 1);
      }

      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(ts => { lastTRef.current = ts; loop(ts); });
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Modal behaviour: Esc closes, page behind doesn't scroll, focus moves in and is restored on close
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") { e.preventDefault(); closeRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="network-defense-title"
        className="relative rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
        style={{ background: "#091525", maxWidth: W }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span id="network-defense-title" className="text-sm font-bold text-white tracking-widest" style={{ fontFamily: "'Courier New', monospace" }}>NETWORK DEFENSE</span>
            <span className="text-xs text-slate-400 hidden sm:inline" style={{ fontFamily: "'Inter', sans-serif" }}>Click threats before they reach the core</span>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close game"
          >
            <X size={15} />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          style={{ display: "block", width: "100%" }}
        />
      </div>
    </div>
  );
}
