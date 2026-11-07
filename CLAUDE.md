# Rules for AI agents (and people) working in this repo

## 1. Where things live (one owner each)
| Thing | Owner |
|---|---|
| What the site does | `PRD.md` |
| Components and props | `docs/COMPONENTS.md` |
| Every style value | `design/tokens.css`, rules in `docs/STYLE_GUIDE.md` |
| Tests | `docs/TESTING.md` |
| Process, gates | `docs/GUARDRAILS.md` |
| Why things are the way they are | `docs/DECISIONS.md` (append-only) |
| Copy and numbers | `src/data/*.ts` |

If the code disagrees with one of these, the code is wrong.

## 2. Before editing
Read the file, `docs/COMPONENTS.md` and `docs/LOCKED.md` first. Never edit a locked path. Ask Josh to unlock it.

## 3. Reuse
Extend an existing component. Never make a near-copy. A new component needs a `docs/COMPONENTS.md` entry in the same PR, and CI checks this.

## 4. Styling
Tokens only (`docs/STYLE_GUIDE.md` §1). No raw colors, sizes or fonts, and no arbitrary Tailwind values. A true one-off carries `/* one-off: <key> */` with a key from `design/one-offs.json`.

## 5. Tests first
Write the tests from `docs/TESTING.md` before the component, and see them fail.

## 6. Content
Copy and numbers live only in `src/data`. Every number needs a `source`.

## 7. Least code
Gates: jscpd, knip, size-limit, and ESLint size and complexity limits. Run `/simplify` before opening a PR.

## 8. Facts
Never invent facts, numbers, links or dates. Ask.

## Workflow
Work on a branch. The PR title starts with the ticket id (`docs/tickets/T-###.md`). Fill in the PR template. `npm run verify` runs the local gates.
