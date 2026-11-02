import { useEffect, useState } from "react";

const TYPE_MS = 80;
const HOLD_FULL_WORD_MS = 1900;
const PAUSE_BEFORE_DELETE_MS = 100;
const DELETE_MS = 40;

type Phase = "typing" | "pause" | "deleting";

/** Types each word out, holds it, deletes it, then moves to the next. Stops while `paused`. */
export function useTypewriter(words: string[], paused: boolean) {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (paused) return;
    const current = words[wordIdx];
    let timer: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      timer = displayed.length < current.length
        ? setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), TYPE_MS)
        : setTimeout(() => setPhase("pause"), HOLD_FULL_WORD_MS);
    } else if (phase === "pause") {
      timer = setTimeout(() => setPhase("deleting"), PAUSE_BEFORE_DELETE_MS);
    } else if (displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETE_MS);
    } else {
      setWordIdx((i) => (i + 1) % words.length);
      setPhase("typing");
    }
    return () => clearTimeout(timer);
  }, [displayed, phase, wordIdx, paused, words]);

  return displayed;
}
