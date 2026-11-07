// CI: changed files must fall inside the ticket's declared paths (docs/GUARDRAILS.md §6).
import { existsSync } from "node:fs";
import { changedFiles, matchesAny, read } from "./lib.mjs";

const id = (process.env.PR_TITLE ?? "").match(/^(T-\d{3})/)?.[1];
if (!id) {
  console.error('PR title must start with a ticket id, e.g. "T-012 Build TerminalWindow".');
  process.exit(1);
}
const ticket = `docs/tickets/${id}.md`;
if (!existsSync(ticket)) {
  console.error(`${ticket} not found.`);
  process.exit(1);
}
const paths = JSON.parse(read(ticket).match(/^paths:\s*(\[.*\])/m)?.[1] ?? "[]");
const outside = changedFiles().filter((f) => f !== ticket && !matchesAny(f, paths));
if (outside.length) {
  console.error(`Files outside ${id}'s declared paths:\n${outside.join("\n")}\nAdd them to the ticket or explain in the PR.`);
  process.exit(1);
}
console.log(`check:scope ok (${id})`);
