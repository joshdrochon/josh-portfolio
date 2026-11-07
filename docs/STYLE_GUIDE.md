# Style guide

Owns: how tokens are used, the token rules, and the theme toggle's look and behavior. Token **values** live only in `design/tokens.css`; this file names tokens and never repeats their values. CI gates that enforce these rules are configured as described in `docs/GUARDRAILS.md` §6.

If something looks different from its siblings, that's a bug unless §4 lists it as a one-off.

## 1. The rules

1. **No raw values in components.** `src/components/**` and `src/app/**/*.tsx` may not contain a hex color, `rgb(`/`rgba(`, a px/rem/em/ms value, or a font name. Use a Tailwind utility generated from the tokens (`bg-term-bg`, `rounded-card`, `text-xs`, `p-4`).
2. **Arbitrary-value utilities are banned**, for example `p-[14px]`, `text-[#123]` and `text-[var(--x)]`.
3. **Where `var(--token)` is allowed:**
   - in CSS files (`globals.css`);
   - in a `style` prop, only for a value computed at runtime (for example a transform driven by state).
4. **Use the scale, don't invent.** There's no 14px space token; use `p-3` (12px) or `p-4` (16px). If neither works in several places, add a token to `design/tokens.css` in the same PR, with a comment saying where it's used.
5. **One-offs are allowed but named.** A value used in exactly one place may be raw only on a line carrying `/* one-off: <reason> */`, and only if it's listed in §4. The lint check accepts nothing else.
6. **Semantic tokens over palette tokens.** Page parts use `--color-*`, terminal parts use `--term-*`. Theme switching depends on it.
7. **Contrast is part of the token.** Every text/background pair below was checked at 4.5:1 or better (3:1 for the focus ring). A new pair must be checked in the PR.

Mockup values that were normalized onto the scale are noted in `tokens.css` comments. The visible changes:
- the name drops from 22 to 20px;
- man paragraphs drop from 14.5 to 14px;
- the hero prompt drops from 14 to 13px and uses `--color-text-muted`, not #374151;
- tag padding changes from 4/10 to 4/12px;
- button gaps change from 6/10 to 8px;
- case-study bottom padding drops from 80 to 72px.

## 2. Typography

| Use | Font | Token | Weight |
|---|---|---|---|
| Hero title | mono | `--text-display` | bold, tracking −1px (one-off) |
| Section heading (h2) | mono | `--text-h2` | bold, `--tracking-tight` |
| Name (h1), card titles, window labels | mono | `--text-xl` | bold |
| Big number in a card header | mono | `--text-metric` | bold |
| Man-page tile value | mono | `--text-lg` | bold |
| Body paragraphs (cards, man page) | **sans** | `--text-md`, `--leading-body` | regular |
| Terminal body, hero prompt, whoami, meta lines | mono | `--text-sm` | regular |
| Captions, buttons, status bar | mono | `--text-xs` | regular |
| Tags, title-bar titles, tile labels | mono | `--text-2xs` | regular |

- Inter is only for running prose; everything else is JetBrains Mono.
- No handwritten or display fonts (D5).
- Load fonts with `next/font`: JetBrains Mono at 400 and 700, Inter at 400 and 600 (D42). Nothing else is preloaded.

## 3. Color usage

Values and the full Tokyo Night palette are in `design/tokens.css`.

| Token | Used for | Contrast checked |
|---|---|---|
| `--color-bg` / `--color-surface` | page / card body | — |
| `--color-text` | headings | 18.9:1 light, 10.6:1 dark |
| `--color-text-muted` | body, captions, tags, hero prompt | 7.6:1 light, 8.1:1 dark |
| `--color-text-strong` | button labels | 14.7:1 light |
| `--color-border` / `--color-border-strong` | card outline / tag and toggle outline | decorative |
| `--color-control` | secondary button outline | decorative |
| `--color-accent` | hero `$` | 5.0:1 light, 9.4:1 dark |
| `--color-primary-bg/fg` | filled Play / Try button | 11.1:1 dark |
| `--color-focus` | focus ring on page surfaces | 5.2:1 light, 6.8:1 dark |
| `--color-window-outline` | terminal window and card-header outline | needed in dark: `--term-bg` on `--color-bg` is only 1.05:1 |
| `--term-text` / `--term-muted` | terminal text / captions | 8.5:1 muted |
| `--term-bright` | org names, man headings, window labels | 18:1 |
| `--term-blue` / `--term-focus` | links, paths, roles / focus ring in terminals | 7.1:1 |
| `--term-dim` / `--term-faint` | hollow cursor / outline pills on dark | decorative |

**Each color keeps one meaning:**
- green: success, "after", the user;
- red: "before", errors;
- amber: dates, directories, the stack line;
- blue: links, paths, roles;
- purple: pre-Aim history.

Don't use a color outside its meaning.

## 4. Shape, depth, motion, focus

- **Radius:**
  - `--radius-card`: cards.
  - `--radius-window`: terminal windows and the dialog.
  - `--radius-tile`: tiles and inline terminal blocks.
  - `--radius-pill`: every tag, button and toggle.
  - `--radius-round`: photo and dots.
  - `--radius-hair`: redaction bars.
- **Shadow:**
  - `--shadow-window` at rest, `--shadow-window-hover` on hover or keyboard focus.
  - `--shadow-dialog` for the man page.
  - `--shadow-photo` for the photo.
  - Cards use a border, not a shadow.
- **Spacing:** the 4px grid only. Tailwind's default spacing (`p-1` = 4px) is that grid, so `--space-N` and `p-N` are the same value.
  - Card body `p-5`/`p-6`.
  - Card header `p-4`/`p-5`.
  - Section bottom `pb-18`.
  - Card gaps `gap-8`.
  - Window gaps `gap-7`.
- **Motion (CSS):**
  - Hover lift: `--lift-hover` over `--duration-fast`.
  - Cursor blink: `--duration-blink`, as a CSS animation, never a JS timer.
  - `prefers-reduced-motion` zeroes both.
  - JS timings (typing jitter, cooldowns, stagger) live in `src/lib/motion.ts` (`docs/COMPONENTS.md` §4).
- **Focus:** every focusable element gets `outline: var(--size-focus-ring) solid` with the same offset.
  - `--color-focus` on page surfaces, `--term-focus` inside terminal surfaces.
  - Never `outline: none` without a replacement.
- **Touch targets** (D32): every interactive element is at least `--size-touch` (44px) in its smaller dimension, including status-bar tabs and the dialog's close button. The single exception is **text links inside terminal output** (`> linkedin`, `> github`, `> email`, hire.sh lines). They may be 24px tall, the WCAG 2.2 AA target-size minimum, because the fixed 236px windows can't fit three 44px rows.

**Approved one-offs**, the only raw values allowed:
| Where | Value | Why |
|---|---|---|
| Hero title tracking | −1px | display size only |
| Git-graph branch curve | radius `0 0 0 10px` / `0 10px 0 0` | draws the branch-off |
| Graph dot ring | `0 0 0 3px var(--term-bg)` | punches the dot out of the line |
| Hollow cursor | `inset 0 0 0 1px var(--term-dim)` | unfocused-terminal look |
| Redaction bar widths | 50–170px | must look like uneven words |

## 5. Tokens → Tailwind

`src/app/globals.css` imports `design/tokens.css`, then maps tokens into Tailwind v4 namespaces in one `@theme inline` block:
- **Colors:** `--color-term-bg: var(--term-bg);` and so on, one line per `--term-*` token. This gives `bg-term-bg`, `text-term-blue` and the like. Page `--color-*` tokens are already in the namespace.
- **Radius, shadow, text, font:** `tokens.css` already uses Tailwind's `--radius-*`, `--shadow-*`, `--text-*` and `--font-*` names, so they generate utilities directly.
- **Spacing:** use Tailwind's built-in scale, which matches `--space-*`. Don't redefine `--spacing`.
- **Sizes, widths, leading, tracking:** map the few used by utilities (`--width-content`, `--width-card`, `--size-touch`) as `--container-*` or `--spacing-*` entries. Use the rest in `globals.css`.
- **Container units:** `--text-display`, `--text-h2` and `--size-photo` use `cqw`. The page wrapper in `layout.tsx` carries `@container` (`container-type: inline-size`). Without it, those sizes fall back to the viewport.

## 6. Theme (light / dark) and the sun/moon toggle

Owns the look and accessibility. The API (`src/lib/theme.ts`) is in `docs/COMPONENTS.md` §4.

- **Default:** follows the OS (`prefers-color-scheme`). A visitor's click overrides it.
- **Toggle:**
  - An icon button in the top-right cluster, next to the sound pills.
  - Both icons are rendered; CSS shows the **moon** when the page is light and the **sun** when it is dark, keyed off `[data-theme]` and the media query. The server never has to know the theme, so the icon can't cause a hydration mismatch.
- **Accessibility (D34):**
  - Fixed `aria-label="Dark mode"` plus `aria-pressed` (true when dark).
  - `aria-pressed` comes from `useSyncExternalStore` on `<html data-theme>`, with a `null` server snapshot, so it's correct after hydration without a mismatch.
  - 44px target.
  - Icon cross-fade over `--duration-fast`, none under reduced motion.
- **Saving:**
  - A click sets `<html data-theme="light|dark">` and saves it to `localStorage`, wrapped in try/catch.
  - A tiny inline script in `<head>` applies the saved choice before first paint (no flash).
- **What changes:** only the page `--color-*` tokens. Terminal surfaces stay dark, and `--color-window-outline` keeps them visible on the dark page.
- The planned `theme dark` command (PRD §4.1) calls the same `setTheme`.
