import { useEffect, useState } from "react";

const bootAlreadyOver = () =>
  !document.getElementById("boot") ||
  document.documentElement.classList.contains("no-boot") ||
  Boolean((window as Window & { __hkBootDone?: boolean }).__hkBootDone);

/** True once the boot screen in index.html starts fading (or if it never showed). */
export function useBootDone() {
  const [bootDone, setBootDone] = useState(bootAlreadyOver);

  useEffect(() => {
    if (bootDone) return;
    const onDone = () => setBootDone(true);
    window.addEventListener("hk:boot-done", onDone);
    return () => window.removeEventListener("hk:boot-done", onDone);
  }, [bootDone]);

  return bootDone;
}
