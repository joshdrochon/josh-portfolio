import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Least-code gates (docs/GUARDRAILS.md §4). Exceeding one needs an eslint-disable with a reason.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "max-lines": ["error", { max: 250, skipBlankLines: true, skipComments: true }],
      complexity: ["error", 10],
      "max-depth": ["error", 3],
      "max-params": ["error", 4],
    },
  },
  {
    files: ["src/components/**/*.tsx"],
    ignores: ["**/__tests__/**"],
    rules: { "max-lines": ["error", { max: 150, skipBlankLines: true, skipComments: true }] },
  },
  // Content files are data, not logic: no length cap.
  { files: ["src/data/*.ts"], rules: { "max-lines": "off" } },
  { files: ["*.config.*", ".size-limit.js"], rules: { "import/no-anonymous-default-export": "off" } },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "mockup/**", "design/brand/**"]),
]);
