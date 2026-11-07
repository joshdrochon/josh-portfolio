import { defineConfig, devices } from "@playwright/test";

// Widths from docs/TESTING.md §5; each runs in light and dark.
const widths = { phone: 390, tablet: 834, desktop: 1440 };
const schemes = ["light", "dark"] as const;

export default defineConfig({
  testDir: "e2e",
  webServer: { command: "npx next start -p 4317", url: "http://localhost:4317", reuseExistingServer: !process.env.CI },
  use: { baseURL: "http://localhost:4317" },
  projects: Object.entries(widths).flatMap(([name, width]) =>
    schemes.map((colorScheme) => ({
      name: `${name}-${colorScheme}`,
      use: { ...devices["Desktop Chrome"], viewport: { width, height: 900 }, colorScheme },
    })),
  ),
});
