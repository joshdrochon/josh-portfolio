// Shared helpers for the guardrail scripts.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

export const read = (p) => readFileSync(p, "utf8");

export function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// Minimal glob → RegExp: ** spans folders, * stays inside one.
export function globToRegExp(glob) {
  const body = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "\u0000")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, "(?:.*/)?");
  return new RegExp(`^${body}$`);
}

export const matchesAny = (path, globs) => globs.some((g) => globToRegExp(g).test(path));

export function lockedGlobs(text = read("docs/LOCKED.md")) {
  return [...text.matchAll(/^- `([^`]+)`/gm)].map((m) => m[1]);
}

export function changedFiles(base = process.env.BASE_REF ?? "origin/main") {
  return execSync(`git diff --name-only ${base}...HEAD`, { encoding: "utf8" }).split("\n").filter(Boolean);
}
