// Claude Code PreToolUse hook: blocks Edit/Write on paths listed in docs/LOCKED.md.
// Bash can bypass this; the real gate is check-locked.mjs in CI (docs/GUARDRAILS.md §2).
import { relative } from "node:path";
import { lockedGlobs, matchesAny } from "./lib.mjs";

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  const file = JSON.parse(input || "{}").tool_input?.file_path;
  if (!file) process.exit(0);
  const path = relative(process.cwd(), file);
  if (matchesAny(path, lockedGlobs())) {
    console.error(`${path} is locked (docs/LOCKED.md). Ask Josh to approve an unlock before editing it.`);
    process.exit(2);
  }
});
