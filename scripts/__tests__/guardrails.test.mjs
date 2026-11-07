import { describe, expect, it } from "vitest";
import { findViolations, darkBlocksDiffer } from "../lint-tokens.mjs";
import { globToRegExp, lockedGlobs, matchesAny } from "../lib.mjs";

describe("lint-tokens", () => {
  it("flags raw colors, sizes, fonts and arbitrary utilities", () => {
    const why = (s) => findViolations(s).map((v) => v.why);
    expect(why('color: #4B5563;')).toContain("raw hex color");
    expect(why("box-shadow: rgba(0,0,0,.2)")).toContain("raw rgb()");
    expect(why("padding: 14px;")).toContain("raw size or duration");
    expect(why("font-family: Inter;")).toContain("font-family outside tokens");
    expect(why('<p className="p-[14px]" />')).toContain("arbitrary Tailwind value");
  });

  it("accepts tokens and named one-offs", () => {
    expect(findViolations('<p className="p-4 text-text-muted rounded-card" />')).toEqual([]);
    expect(findViolations("outline-offset: 2px; /* one-off: focus ring */")).toEqual([]);
    expect(findViolations("font-family: var(--font-sans);")).toEqual([]);
  });

  it("detects drift between the two dark-theme blocks", () => {
    const same = ':root:not([data-theme="light"]) { --a: 1; }\n:root[data-theme="dark"] { --a: 1; }';
    expect(darkBlocksDiffer(same)).toBe(false);
    expect(darkBlocksDiffer(same.replace("--a: 1; }\n:root[", "--a: 2; }\n:root["))).toBe(true);
  });
});

describe("locked-path matching", () => {
  it("reads locked paths from LOCKED.md list items", () => {
    expect(lockedGlobs("- `src/components/Window.tsx` — 2026-11-20, Josh\n- not a lock")).toEqual(["src/components/Window.tsx"]);
  });

  it("matches globs across folders", () => {
    expect(globToRegExp("src/**/*.tsx").test("src/components/ui/Tag.tsx")).toBe(true);
    expect(globToRegExp("src/*.tsx").test("src/components/Tag.tsx")).toBe(false);
    expect(matchesAny("design/tokens.css", ["docs/**", "design/tokens.css"])).toBe(true);
    expect(globToRegExp("**").test(".github/workflows/ci.yml")).toBe(true);
    expect(globToRegExp("docs/**").test("docs/tickets/T-001.md")).toBe(true);
  });
});
