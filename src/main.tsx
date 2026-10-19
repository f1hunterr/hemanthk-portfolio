import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Tell the boot screen (index.html) the page is drawn: wait one frame after React commits
requestAnimationFrame(() => {
  (window as Window & { __hkAppReady?: boolean }).__hkAppReady = true;
  window.dispatchEvent(new Event("hk:app-ready"));
});
