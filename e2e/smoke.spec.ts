import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Vercel serves /_vercel/* (analytics) only in its own hosting, so it 404s locally and in CI.
const isVercelOnly = (url: string) => new URL(url).pathname.startsWith("/_vercel/");

test("home loads with no errors and no serious accessibility issues", async ({ page }) => {
  const failures: string[] = [];
  page.on("pageerror", (e) => failures.push(e.message));
  page.on("response", (r) => r.status() >= 400 && !isVercelOnly(r.url()) && failures.push(`${r.status()} ${r.url()}`));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Josh Rochon" })).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
  expect(failures).toEqual([]);
});
