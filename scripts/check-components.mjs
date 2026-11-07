// CI: every component file must be listed in docs/COMPONENTS.md (no accidental components).
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { read, walk } from "./lib.mjs";

const doc = read("docs/COMPONENTS.md");
const files = existsSync("src/components") ? walk("src/components").filter((f) => f.endsWith(".tsx") && !f.includes("__tests__")) : [];
const missing = files.filter((f) => !doc.includes(`\`${basename(f, ".tsx")}\``));
if (missing.length) {
  console.error(`Components not in docs/COMPONENTS.md:\n${missing.join("\n")}`);
  process.exit(1);
}
console.log(`check:components ok (${files.length} components)`);
