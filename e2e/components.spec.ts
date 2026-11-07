import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Baselines are made in the Playwright Linux image (npm run e2e:update) so they match CI exactly.
test("component gallery matches its baseline and has no serious accessibility issues", async ({ page }) => {
  await page.goto("/dev/components");
  await expect(page).toHaveScreenshot("gallery.png", { fullPage: true });
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
});
