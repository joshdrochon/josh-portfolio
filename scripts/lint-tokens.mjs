// Fails on raw style values outside design/tokens.css (docs/STYLE_GUIDE.md §1, §5).
import { read, srcFiles } from "./lib.mjs";

const APPROVED = Object.keys(JSON.parse(read("design/one-offs.json"))).filter((k) => !k.startsWith("_"));

const RULES = [
  [/#[0-9a-f]{3,8}\b/i, "raw hex color"],
  [/rgba?\(/, "raw rgb()"],
  [/\b\d+(\.\d+)?(px|rem|em|ms)\b/, "raw size or duration"],
  [/font-family\s*:(?!\s*var\(--font-)/, "font-family outside tokens"],
  [/\b[\w:-]+-\[[^\]]+\]/, "arbitrary Tailwind value"],
  [/(?<![\w-])(?:-?[mp][trblxy]?|gap(?:-[xy])?|[hw]|min-[hw]|max-[hw]|size|space-[xy]|inset|top|left|right|bottom)-(?!0\.5\b)\d+\.5\b/, "spacing off the 4px grid"],
];
const oneOffKey = (line) => line.match(/\/\* one-off: ([\w-]+)/)?.[1];

export function findViolations(text) {
  return text.split("\n").flatMap((line, i) =>
    APPROVED.includes(oneOffKey(line)) ? [] : RULES.filter(([re]) => re.test(line)).map(([, why]) => ({ line: i + 1, why, text: line.trim() })),
  );
}

// The two dark-theme blocks in tokens.css must stay identical.
export function darkBlocksDiffer(tokens) {
  const block = (re) => (tokens.match(re)?.[1] ?? "").replace(/\s+/g, " ").trim();
  return block(/:root:not\(\[data-theme="light"\]\)\s*\{([^}]*)\}/) !== block(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = srcFiles();
  const problems = files.flatMap((f) => findViolations(read(f)).map((v) => `${f}:${v.line} ${v.why}: ${v.text}`));
  if (darkBlocksDiffer(read("design/tokens.css"))) problems.push("design/tokens.css: the two dark-theme blocks differ");
  if (problems.length) {
    console.error(problems.join("\n"));
    console.error(`\n${problems.length} token violation(s). Use a token, or use an approved one-off key from design/one-offs.json.`);
    process.exit(1);
  }
  console.log(`lint:tokens ok (${files.length} files)`);
}
