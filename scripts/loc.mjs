// Prints total src/ lines so growth is visible on every PR (docs/GUARDRAILS.md §4.7).
import { read, srcFiles } from "./lib.mjs";

const files = srcFiles();
const lines = files.reduce((n, f) => n + read(f).split("\n").length, 0);
console.log(`src: ${files.length} files, ${lines} lines`);
