import { createRoot } from "react-dom/client";
import App from "./App";
import { markInstantStart } from "./lib/prerender";
import "./index.css";

const root = document.getElementById("root")!;
// Read before React replaces the prerendered markup
markInstantStart(root);
createRoot(root).render(<App />);

// Tell the boot screen (index.html) the page is drawn: wait one frame after React commits
requestAnimationFrame(() => {
  (window as Window & { __hkAppReady?: boolean }).__hkAppReady = true;
  window.dispatchEvent(new Event("hk:app-ready"));
});
