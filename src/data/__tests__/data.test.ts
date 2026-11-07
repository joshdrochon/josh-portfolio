import { describe, expect, it } from "vitest";
import claims from "../../../content/claims.json";
import { projects, aboutPage } from "../projects";
import { caseStudies } from "../case-studies";
import { experience } from "../experience";
import { hero, windows } from "../site";
import type { Stat } from "../types";

const statText = (s: Stat) =>
  "text" in s ? s.text : "from" in s ? `${s.from} → ${s.to}${s.unit ? ` ${s.unit}` : ""}` : "ours" in s ? `${s.ours} vs ${s.theirs}` : "error" in s ? s.error : "[redacted]";

describe("content data (docs/TESTING.md §4)", () => {
  it("has unique slugs, each with a title, stat, caption and sourced numbers", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    for (const p of projects) {
      expect(p.title && p.card.caption && p.card.stat.source).toBeTruthy();
      p.man?.tiles.forEach((t) => expect(t.source, `${p.slug} tile ${t.k}`).toBeTruthy());
    }
    aboutPage.tiles.forEach((t) => expect(t.source).toBeTruthy());
    caseStudies.forEach((c) => expect(c.stat.source).toBeTruthy());
  });

  it("links code only for public repos, never links Coach Study, and gives Takavay no man page", () => {
    for (const p of projects) {
      if (p.links.some((l) => l.kind === "code")) expect(claims.publicRepos).toContain(p.slug);
    }
    expect(projects.find((p) => p.slug === "coach-study")!.links).toEqual([]);
    expect(projects.find((p) => p.slug === "takavay")!.man).toBeUndefined();
  });

  it("uses https for every external link", () => {
    const hrefs = [...projects.flatMap((p) => p.links.map((l) => l.href)), ...caseStudies.map((c) => c.href), ...(aboutPage.seeAlso ?? []).map((l) => l.href)];
    hrefs.filter((h) => !h.startsWith("#") && !h.startsWith("/")).forEach((h) => expect(h).toMatch(/^https:\/\//));
  });

  it("derives the projects window from the list instead of hard-coding it", () => {
    const lines = windows.find((w) => w.id === "projects")!.lines.map((l) => l.text);
    expect(lines.join(" ")).toContain(`${projects[0].slug}/`);
    expect(lines.at(-1)).toBe(`+ ${projects.length - 3} more`);
  });

  it("matches the claims kept in step with the resume", () => {
    expect(hero.whoami).toContain(`${claims.years} yrs`);
    claims.clients.forEach((c) => expect(experience.map((e) => e.org)).toContain(c));
    expect(Object.fromEntries(projects.map((p) => [p.slug, statText(p.card.stat)]))).toEqual(claims.headline);
  });
});
