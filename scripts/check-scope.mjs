// CI: changed files must fall inside the ticket's declared paths (docs/GUARDRAILS.md §2.4, §6).
import { existsSync } from "node:fs";
import { changedFiles, matcher, read } from "./lib.mjs";

// Always allowed: the decision log, the ticket itself, screenshot baselines, the lockfile.
const ALWAYS = ["docs/DECISIONS.md", "docs/tickets/*.md", "e2e/**/*-snapshots/**", "package-lock.json"];

const id = (process.env.PR_TITLE ?? "").match(/^(T-\d{3})/)?.[1];
const ticket = id && `docs/tickets/${id}.md`;
if (!ticket || !existsSync(ticket)) {
  console.error(`PR title must start with an existing ticket id, e.g. "T-012 Build TerminalWindow" (got "${process.env.PR_TITLE ?? ""}").`);
  process.exit(1);
}
const paths = JSON.parse(read(ticket).match(/^paths:\s*(\[.*\])/m)?.[1] ?? "[]");
if (paths.includes("**")) {
  console.error(`${ticket} declares "**", which disables the scope check. List the real paths.`);
  process.exit(1);
}
const inScope = matcher([...paths, ...ALWAYS]);
const outside = changedFiles().filter((f) => !inScope(f));
if (outside.length) {
  console.error(`Files outside ${id}'s declared paths:\n${outside.join("\n")}\nAdd them to the ticket or explain in the PR.`);
  process.exit(1);
}
console.log(`check:scope ok (${id})`);
