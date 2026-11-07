import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The status-bar clock changes every minute, so screenshots mask it.
const clock = (page: Page) => page.locator("nav[aria-label='Site sections'] span.ml-auto");

// Reduced motion: no typing, so screenshots are stable. Scrolling to the end mounts the lazy cards.
async function load(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("heading", { name: "Case Studies" }).scrollIntoViewIfNeeded();
  await page.locator("footer#contact").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Takavay" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
}

test("home page matches its baseline and has no serious accessibility issues", async ({ page }) => {
  await load(page);
  await expect(page).toHaveScreenshot("home.png", { fullPage: true, mask: [clock(page)] });
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
});

test("the four windows are the same height", async ({ page }) => {
  await load(page);
  const heights = await page.locator("section[aria-label='Quick links'] .rounded-window").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  expect(new Set(heights).size).toBe(1);
});

test("every Read more opens its own man page, and q closes it", async ({ page }) => {
  await load(page);
  const links = page.getByRole("link", { name: "Read more" });
  const count = await links.count();
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute("href");
    await links.nth(i).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(`man ${href!.slice(5)}`)).toBeVisible();
    await page.keyboard.press("q");
    await expect(dialog).toBeHidden();
  }
});

test("man page matches its baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#man/ship");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveScreenshot("man-ship.png", { mask: [clock(page)] });
});

test("everything clickable shows the hand cursor (D75)", async ({ page }) => {
  await load(page);
  const cursors = await page.locator("a[href], button").evaluateAll((els) => els.map((e) => `${getComputedStyle(e).cursor} ${e.textContent?.trim().slice(0, 30)}`));
  expect(cursors.filter((c) => !c.startsWith("pointer"))).toEqual([]);
});

test("pill buttons rise on hover (D76)", async ({ page }) => {
  await page.goto("/");
  const pill = page.getByRole("button", { name: /clicks:/ });
  const transform = () => pill.evaluate((e) => getComputedStyle(e).transform);
  expect(await transform()).toBe("none");
  await pill.hover();
  await expect.poll(transform).not.toBe("none");
});

test("an open man page blurs the page behind it, which can't scroll (D78)", async ({ page }) => {
  await page.goto("/#man/ship");
  await expect(page.getByRole("dialog")).toBeVisible();
  const blur = await page.evaluate(() => getComputedStyle(document.querySelector("dialog")!, "::backdrop").backdropFilter);
  expect(blur).toContain("blur");
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(5, 5);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => scrollY)).toBe(before);
});
