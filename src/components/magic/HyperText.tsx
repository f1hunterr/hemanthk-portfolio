import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Adapted from Magic UI's Hyper Text (MIT, https://magicui.design): on hover the characters scramble
// and decode back, left to right. Screen readers always get the real text from a visually hidden copy.
export function HyperText({ text, className }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);
  useEffect(() => setShown(text), [text]);

  const scramble = () => {
    if (reduceMotion) return;
    clearInterval(timer.current);
    let frame = 0;
    timer.current = setInterval(() => {
      frame += 1;
      const settled = Math.floor(frame / 2); // two frames per character
      setShown(
        text
          .split("")
          .map((ch, i) => (ch === " " || ch === "/" || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (settled >= text.length) {
        clearInterval(timer.current);
        setShown(text);
      }
    }, 30);
  };

  return (
    <span data-hyper className={className} onMouseEnter={scramble}>
      {/* Real text for screen readers (aria-label is not allowed on a plain span); the scramble is visual only */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
