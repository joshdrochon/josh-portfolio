// Claude Code PreToolUse hook: blocks Edit/Write on paths listed in docs/LOCKED.md.
// Bash can bypass this; the real gate is check-locked.mjs in CI (docs/GUARDRAILS.md §2).
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { lockedGlobs, matchesAny } from "./lib.mjs";

const file = JSON.parse(readFileSync(0, "utf8") || "{}").tool_input?.file_path;
const path = file && relative(process.cwd(), file);
if (path && matchesAny(path, lockedGlobs())) {
  console.error(`${path} is locked (docs/LOCKED.md). Ask Josh to approve an unlock before editing it.`);
  process.exit(2);
}
