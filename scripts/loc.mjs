// Prints total src/ lines so growth is visible on every PR (docs/GUARDRAILS.md §4.7).
import { read, walk } from "./lib.mjs";

const files = walk("src").filter((f) => /\.(tsx?|css)$/.test(f));
const lines = files.reduce((n, f) => n + read(f).split("\n").length, 0);
console.log(`src: ${files.length} files, ${lines} lines`);
