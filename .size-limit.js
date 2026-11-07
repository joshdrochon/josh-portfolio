// Budget = JS the home page loads first (docs/TESTING.md §6), read from the prerendered HTML.
import { readFileSync } from "node:fs";

const html = readFileSync(".next/server/app/index.html", "utf8");
const path = [...new Set(html.match(/\/_next\/static\/chunks\/[^"]+\.js/g))].map((src) => `.next${src.slice(6)}`);

export default [{ name: "home first-load JS (gzip)", path, limit: "200 KB", gzip: true }];
