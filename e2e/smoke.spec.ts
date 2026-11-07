import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home loads with no errors and no serious accessibility issues", async ({ page }) => {
  const failures: string[] = [];
  page.on("pageerror", (e) => failures.push(e.message));
  page.on("response", (r) => r.status() >= 400 && failures.push(`${r.status()} ${r.url()}`));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Josh Rochon" })).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
  expect(failures).toEqual([]);
});

test("a saved theme is applied before first paint (no flash)", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/", { waitUntil: "commit" });
  await page.waitForFunction(() => document.body !== null);
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
  const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(bg).toBe("rgb(26, 27, 38)");
});
