import { defineConfig } from "@playwright/test";

// Browser tests run against the real production build (vite preview), not the dev server.
// Locally they use the installed Microsoft Edge (no browser download); set PW_CHANNEL to override.
const PORT = 4180;

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: process.env.PW_CHANNEL ?? "msedge",
    viewport: { width: 1440, height: 600 },
  },
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}/hemanthk-portfolio/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
