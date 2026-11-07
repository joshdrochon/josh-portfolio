# Guardrails: no drift, no overwrites, least code

Owns: the CI gates, the repo files that enforce them, and the PR process. Token rules live in `STYLE_GUIDE.md`. Test content and performance budgets live in `TESTING.md`. This file only says where each gate runs.

## 1. One source of truth per thing
| Thing | Owner | Everyone else |
|---|---|---|
| What the site does (current state) | `PRD.md` | points to it |
| Decisions, reversals, history | `docs/DECISIONS.md` | points to it |
| Token values | `design/tokens.css` | names tokens only |
| Token rules, theme look | `docs/STYLE_GUIDE.md` | points to it |
| Components, props, hooks, data types | `docs/COMPONENTS.md` | points to it |
| Tests, budgets, screenshot widths | `docs/TESTING.md` | points to it |
| Copy, numbers, links | `src/data/*.ts` (ported from `mockup/build.py`) | never typed in JSX |

When code and an owner disagree, the code is wrong. Change the owner doc first, in the same PR.

## 2. Stop overwrites of finished work
1. **Branches and PRs.** `main` is protected: CI must pass, no force-push, nothing lands directly. Each AI session works on its own branch or worktree, so a bad run can be thrown away.
2. **Lock list** (`docs/LOCKED.md`, spec in §6). Changing a locked path needs Josh's written OK in the PR.
   - **What enforces it:**
     - **CI** is the real gate. `scripts/check-locked.mjs` fails the PR if it touches a locked path and the PR body lacks the line `Unlock: <path> — approved by Josh`.
     - A Claude Code **`PreToolUse` hook** stops agents early on Edit/Write. **It can be bypassed**, by Bash (`sed -i`, `cat >`) or by a person, so it's a speed bump, not a lock.
     - **CODEOWNERS** adds Josh as required reviewer, but GitHub won't let him approve his own PR. While he is the only human, CI's `Unlock:` line is the gate.
3. **Tests as tripwires.** Finished components have behavior tests plus screenshot baselines (`TESTING.md` §5). A silent overwrite fails CI.
4. **Small PRs, declared paths.** Every PR names one ticket. The ticket file declares the paths it may touch (spec in §6). `scripts/check-scope.mjs` fails the PR if it changes files outside them, except `docs/DECISIONS.md` and test baselines.
5. **Read before edit.** The repo's `CLAUDE.md` (spec in §6) tells agents to read the target file, `COMPONENTS.md` and `LOCKED.md` first, and to extend an existing component instead of creating a near-copy.

## 3. Stop drift from the PRD and design
Each gate below runs in CI on every PR unless noted. What each one checks is defined in `TESTING.md`.
1. Accessibility (axe), data integrity (`TESTING.md` §4) and Lighthouse budgets (`TESTING.md` §6, which uses TBT because lab Lighthouse can't measure INP).
2. Screenshot baselines (`TESTING.md` §5). Updating a baseline needs a PR note saying what changed and why.
3. Token lint (`STYLE_GUIDE.md` §1).
4. **Component registry:** `scripts/check-components.mjs` fails if a file in `src/components/` isn't listed in `COMPONENTS.md` §1. New components are a design decision, not an accident.
5. **Claims sync:** `content/claims.json` must match what `src/data` renders (`TESTING.md` §4).
6. **Link checker:** runs **nightly and before launch**, not per PR (`TESTING.md` §5), so an outside site being down doesn't block work.
7. **Decisions:** every new or reversed decision is logged in `docs/DECISIONS.md` in the same PR.

## 4. Least code, checked on every PR
Goal: as little code as possible without becoming hard to read.
1. **Duplication:** `jscpd` fails above 1% duplicated lines or on any clone of 8+ lines.
2. **Size and complexity** (ESLint):
   - `max-lines` 150 per component file and 250 per file otherwise;
   - `complexity` 10, `max-depth` 3, `max-params` 4.

   Exceeding one needs an `eslint-disable` with a reason.
3. **Unused code:** `knip` (unused files, exports, dependencies), plus `tsc --noEmit` with `noUnusedLocals` and `noUnusedParameters`.
4. **Bundle:** `size-limit` caps first-load JS (`TESTING.md` §6).
5. **Simplify pass:** run `/simplify` before opening a PR and apply what it finds (checkbox in the template).
6. **Readability:** reject clever one-liners that need a comment to explain them. Names come from `COMPONENTS.md`.
7. **Line count:** CI prints total `src/` lines and the change per PR.

## 5. PR template (`.github/pull_request_template.md`)
```
Ticket: T-___   PRD §___
- [ ] Only the ticket's declared paths changed (or explained below)
- [ ] No locked path changed, or "Unlock: <path> — approved by Josh" is below
- [ ] Tests written first and seen failing
- [ ] lint, lint:tokens, tsc, test, jscpd, knip, size-limit, build all pass
- [ ] Screenshots unchanged, or baseline update explained
- [ ] /simplify run, findings applied
- [ ] Owner docs updated (PRD / COMPONENTS / STYLE_GUIDE / TESTING / DECISIONS)
```

## 6. Order of work
**Step 1: repo setup.** Fork the base repo, strip Joan's content, and create these files exactly as specified:

- **`docs/LOCKED.md`**: one locked path per line, as a markdown list item with a backticked path or glob, then the date and approver:
  `` - `src/components/Window.tsx` — 2026-11-20, Josh ``
  Both scripts read only lines matching `` ^- `([^`]+)` ``.
- **`.claude/settings.json`** hook: a `PreToolUse` hook with matcher `Edit|Write|MultiEdit` that runs `node scripts/guard-locked.mjs`. The script reads the tool input JSON from stdin, matches `file_path` against the LOCKED.md globs, and exits with code 2 and a message naming the lock when it matches. As §2.2 says, Bash can bypass it.
- **`.github/CODEOWNERS`**: `@joshdrochon` for `docs/LOCKED.md`, `design/tokens.css`, `docs/*.md` and every locked path. This is advisory while Josh is the only human (§2.2).
- **`.github/pull_request_template.md`**: §5 verbatim.
- **Tickets:** `docs/tickets/T-###.md`, each with front matter:
  ```
  ---
  id: T-012
  prd: "3.3"
  paths: ["src/components/TerminalWindow.tsx", "src/components/__tests__/TerminalWindow.test.tsx"]
  ---
  ```
  The PR title starts with the ticket id. `check-scope.mjs` reads `paths`.
- **Repo `CLAUDE.md`** (replaces Joan's AGENTS.md and CLAUDE.md), with these sections:
  1. Owner docs table from §1.
  2. Before editing: read the file, `COMPONENTS.md` and `LOCKED.md`. Never edit a locked path.
  3. Reuse: extend an existing component; a new component needs a `COMPONENTS.md` entry in the same PR.
  4. Styling: tokens only (`STYLE_GUIDE.md` §1).
  5. Tests first (`TESTING.md`).
  6. Content only in `src/data`, and every number needs a `source`.
  7. Least code (§4). Run `/simplify` before the PR.
  8. Never invent facts. Ask.
- **`content/claims.json`**, read by the data-integrity test:
  ```json
  { "years": "7", "clients": ["Starbucks","Microsoft","BECU","Purple"],
    "headline": { "<slug>": "<card stat text>" } }
  ```
  Every key must match what `src/data` renders. The file is updated whenever the resume or site claims change.
- **Configs:**
  - **`lint:tokens`:** `scripts/lint-tokens.mjs` over `src/**/*.{ts,tsx,css}` except `design/tokens.css`. It fails on `#[0-9a-f]{3,8}\b`, `rgba?\(`, `\d+(px|rem|em|ms)\b`, `font-family`, and arbitrary utilities `\w-\[` (except lines with `/* one-off:`). It also fails if the two dark blocks in `tokens.css` differ.
  - **`.jscpd.json`:** `{ "threshold": 1, "minLines": 8, "path": ["src"], "ignore": ["**/__tests__/**"] }`.
  - **`knip.json`:** entry `src/app/**/{page,layout,not-found}.tsx`, project `src/**/*.{ts,tsx}`.
  - **`.size-limit.json`:** `[{ "path": ".next/static/chunks/**/*.js", "limit": "90 KB", "gzip": true }]`. Tighten after the first measured build.
  - **`lighthouserc.json`:** URLs `/` at mobile preset, with the assertions in `TESTING.md` §6.
  - **ESLint:** the rules in §4.
- **CI workflow:** steps in order are install, lint, lint:tokens, tsc, test, jscpd, knip, build, size-limit, Playwright (e2e + screenshots + axe), lhci, then check-locked, check-scope and check-components. A nightly workflow runs the link checker.

**Steps 2–5:**
2. Write tests from `TESTING.md` for the primitives, and see them fail.
3. Build the primitives until green, take baselines, and add them to `LOCKED.md`.
4. Repeat for composites, sections and the page.
5. Run the PRD §8 acceptance pass, then launch.
