// Shared helpers for the guardrail scripts.
import { globSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

export const read = (p) => readFileSync(p, "utf8");

// Source files under src/, tests excluded.
export const srcFiles = (pattern = "src/**/*.{ts,tsx,css}") => globSync(pattern).filter((f) => !f.includes("__tests__"));

// Minimal glob → RegExp: ** spans folders (dot-folders too, unlike path.matchesGlob), * stays inside one.
export function globToRegExp(glob) {
  const body = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "\u0000")
    .replace(/\*\*/g, "\u0001")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, "(?:.*/)?")
    .replace(/\u0001/g, ".*");
  return new RegExp(`^${body}$`);
}

export function matcher(globs) {
  const res = globs.map(globToRegExp);
  return (path) => res.some((re) => re.test(path));
}

export const matchesAny = (path, globs) => matcher(globs)(path);

export function lockedGlobs(text = read("docs/LOCKED.md")) {
  return [...text.matchAll(/^- `([^`]+)`/gm)].map((m) => m[1]);
}

export function changedFiles(base = process.env.BASE_REF ?? "origin/main") {
  return execSync(`git diff --name-only ${base}...HEAD`, { encoding: "utf8" }).split("\n").filter(Boolean);
}
