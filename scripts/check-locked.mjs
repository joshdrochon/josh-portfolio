// CI: a PR that changes a locked path must say "Unlock: <path> — approved by Josh" in its body.
import { changedFiles, lockedGlobs, matchesAny } from "./lib.mjs";

const body = process.env.PR_BODY ?? "";
const touched = changedFiles().filter((f) => matchesAny(f, lockedGlobs()));
const missing = touched.filter((f) => !body.includes(`Unlock: ${f}`));
if (missing.length) {
  console.error(`Locked paths changed without an Unlock line:\n${missing.join("\n")}`);
  process.exit(1);
}
console.log(`check:locked ok (${touched.length} locked path(s) changed, all unlocked)`);
