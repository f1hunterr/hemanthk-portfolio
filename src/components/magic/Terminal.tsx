import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export type TerminalLine = { kind: "cmd" | "info" | "ok"; text: string };

const PREFIX: Record<TerminalLine["kind"], string> = { cmd: "$ ", info: "", ok: "✓ " };

// Adapted from Magic UI's Terminal (MIT, https://magicui.design): types an example session once,
// the first time it scrolls into view. Screen readers get the full transcript as a list instead of
// the half-typed text; under reduced motion everything is shown at once.
export function Terminal({ lines, label }: { lines: TerminalLine[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [lineIdx, setLineIdx] = useState(0); // lines fully or partly shown
  const [chars, setChars] = useState(0); // characters typed on the current line

  const done = reduceMotion || lineIdx >= lines.length;

  useEffect(() => {
    if (reduceMotion || !inView || lineIdx >= lines.length) return;
    const current = lines[lineIdx];
    const delay = chars === 0 ? (lineIdx === 0 ? 300 : 380) : current.kind === "cmd" ? 45 : 14;
    const t = setTimeout(() => {
      if (chars < current.text.length) setChars((c) => c + 1);
      else {
        setLineIdx((i) => i + 1);
        setChars(0);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [inView, reduceMotion, lineIdx, chars, lines]);

  const visible = done ? lines.length : Math.min(lineIdx + (chars > 0 ? 1 : 0), lines.length);

  return (
    <div ref={ref} data-terminal role="group" aria-label={label} className="terminal">
      <ol className="sr-only">
        {lines.map((l) => (
          <li key={l.text}>{PREFIX[l.kind] + l.text}</li>
        ))}
      </ol>
      <div aria-hidden="true">
        <div className="terminal-bar">
          <i />
          <i />
          <i />
        </div>
        {lines.slice(0, visible).map((l, i) => {
          const typing = !done && i === lineIdx;
          return (
            <div key={l.text} data-terminal-line className={`terminal-line terminal-${l.kind}`}>
              <span className="terminal-prefix">{PREFIX[l.kind]}</span>
              {typing ? l.text.slice(0, chars) : l.text}
              {typing && <span className="terminal-caret" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
