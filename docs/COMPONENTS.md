# Component architecture (plan, pre-build)

Written 2026-11-06 from `PRD.md`, `mockup/build.py` and `mockup/project/Main.dc.html`; updated after the doc audit the same day. PRD wins on conflict. Goal: least code that stays readable. Every repeated pattern is one component driven by data.

Totals: **18 components** (8 primitives, 8 composites, 2 section-level), **5 hooks**, **1 provider**, **2 lib helpers** (`theme.ts`, `motion.ts`), **5 data files**.

Owns: components, props, hooks, helpers and data types. Open questions live in PRD §9; decisions in `docs/DECISIONS.md`.

Conventions used below:
- **S** = server component (default), **C** = `"use client"`, **Sh** = shared (no directive, no hooks, safe to render from either side).
- Tokens come from `design/tokens.css`, imported in `globals.css` and mapped via `@theme inline` (see §0).

---

## 0. Tokens

All values come from `design/tokens.css`; the rules are in `docs/STYLE_GUIDE.md`. Tailwind's theme is generated from those tokens, and arbitrary values (`text-[var(--…)]`, `p-[14px]`) are banned by lint. The "Tokens" column in §1 names tokens from that file.

`Tone` (used in data): `"fg" | "muted" | "green" | "blue" | "amber" | "red" | "purple"`. It maps to the `--term-*` tokens through one lookup in `ShellSession`.

---

## 1. Component inventory

| # | Name | Kind | Used in (mockup) | Props | S/C | Tokens |
|---|---|---|---|---|---|---|
| 1 | `Window` | UI primitive | 4 top windows, Experience `~/career`, man page | `{ title: ReactNode; actions?: ReactNode; className?: string; children: ReactNode }` | Sh | `--term-bg`, `--term-chrome`, `--color-window-outline`, `--term-muted`, `--term-dot-*`, `--shadow-window` |
| 2 | `Prompt` | UI primitive | window cmd + trailing prompt (×8), Experience, hire.sh, loading line, Takavay block | `{ children?: ReactNode; cursor?: CursorState }` renders `josh ~ $ {children}{cursor}` | Sh | `--term-green`, `--term-blue` |
| 3 | `Cursor` | UI primitive | windows (×8), loading line, hero, hire.sh | `{ state: "idle" \| "active" \| "typing" \| "solid"; tone?: "term" \| "page" }` idle = hollow still; active = solid + CSS blink 530ms; typing/solid = solid still. Size in `em`. | Sh | `--term-text`, `--term-dim`, `--color-text`, `--size-cursor-*` |
| 4 | `Tag` | UI primitive | every card (48 pills) | `{ children: string }` | S | `--color-text-muted`, `--color-border-strong`, `--font-mono` |
| 5 | `Button` | UI primitive | Play/Try (×4), Read more (×9), Code/Model (×5), Read case study (×2), `open resume.pdf` + SEE ALSO pills, contact/hire link lines, window labels | `{ action: Action; variant: "primary" \| "secondary" \| "term" \| "link" \| "label"; className?: string }` → renders `<a>`, or `CopyEmailButton` when `action.copy` | S | `--color-primary-bg/fg`, `--color-control`, `--color-text-strong`, `--term-faint`, `--term-blue`, `--term-bright`, `--font-mono` |
| 6 | `CopyEmailButton` | UI primitive | contact.sh `> email`, Contact label, hire.sh email line | `{ label: string; copiedLabel: string; className: string }`; its own `copied` state (D28) and an `aria-live="polite"` region announcing the change | C | (from Button variant) |
| 7 | `TogglePill` | UI primitive | `clicks:` `music:` and the new sun/moon theme toggle | `{ pressed: boolean \| null; onToggle(): void; icon: "speaker" \| "note" \| "theme"; label?: string; ariaLabel?: string }`; `aria-pressed` omitted while `null` (server); `"theme"` renders both sun and moon and CSS shows one (STYLE_GUIDE §6) | C | `--color-bg`, `--color-border-strong`, `--color-text` |
| 8 | `BigStat` | UI primitive | card header big line (10 projects + 2 cases) | `{ stat: Stat }` (see §3) handles plain, before→after, vs, redacted | Sh | `--term-green`, `--term-red`, `--term-muted`, `--term-redact` |
| 9 | `Card` | composite | 10 project cards **and** 2 case-study cards | `{ cmd: string; stat: Stat; caption: string; tags: string[]; title: string; desc: string; actions: Action[]; headerSize?: "lg" \| "sm"; children?: ReactNode }` | S | `--term-bg`, `--term-muted`, `--color-surface`, `--color-border`, `--color-text-muted`, `--color-window-outline` |
| 10 | `ShellSession` | composite (render only) | inside top windows **and** hire.sh footer | `{ cmd: string; lines: OutputLine[]; view: TypewriterView; trailingPrompt?: boolean; activeCursor?: boolean }` | Sh | `--term-*` via `Tone` |
| 11 | `TerminalWindow` | composite | Projects, About Me, Contact, Resume | `{ config: TerminalWindowConfig; index: number }` (index → 250ms stagger) | C | `--shadow-window`, `--shadow-window-hover`, `--lift-hover`, `--term-*` |
| 12 | `ManPage` | composite (dialog host) | Read more overlay + About `josh(1)` | `{ pages: ManPageData[] }`; native `<dialog>` + `showModal()` (D27); opens on `#man/<slug>` (D26); close → `history.replaceState` drops the hash, focus returns to the opener or, on a deep link, the `#projects` heading (D35); `aria-labelledby` points at the NAME line text (D41) | C | `--term-*`, `--shadow-dialog`, `--color-scrim`, `--font-sans` (paragraphs) |
| 13 | `GitGraph` | composite | Experience | `{ entries: ExperienceEntry[] }` (CommitRow is a local function) | S | `--term-amber`, `--term-blue`, `--term-purple`, `--term-green`, `--term-redact`, `--term-bright`, `--term-bg` |
| 14 | `StatusBar` | composite | tmux bar | `{ tabs: NavTab[] }`; `<nav aria-label="Site sections">`, `position: sticky; bottom: 0`; tabs ≥44px (D32); sound text is plain text (D39) | C | `--term-bg`, `--term-border`, `--term-muted`, `--term-green` |
| 15 | `LazySection` | composite | last 5 project cards | `{ placeholder: ReactNode; className?: string; children: ReactNode }`; visual deferral only, data still ships with the page (D36) | C | `--width-card` |
| 16 | `Controls` | composite | top-right cluster | none; composes 3× `TogglePill` from `useSound` and `useTheme()` (theme pill: label "Dark mode") | C | — |
| 17 | `Section` | section | Projects, Experience, Case Studies | `{ id: string; title: string; subtitle?: string; width?: "grid" \| "narrow"; children: ReactNode }` (h2 + max-width wrapper) | S | `--color-text`, `--color-text-muted`, `--font-mono`, `--text-h2` |
| 18 | `HireFooter` | section | `#contact` footer | `{ session: ShellConfig; copyright: string }` | C | term-* |

Hero, terminal-row wrapper, grids and the © line are inline JSX in `page.tsx` (see §7).

---

## 2. Composition tree

```
app/layout.tsx (S)  fonts, metadata, no-flash theme <script>, <SoundProvider>
└─ app/page.tsx (S)
   ├─ Controls (C) ── TogglePill ×3 (clicks, music, theme)
   ├─ <section #home> Hero, inline: <p> title · next/image · <h1> · <p> $ … <Cursor solid tone=page> · whoami
   ├─ <section aria-label="Quick links"> terminal row (grid 4/2/1)
   │   └─ windows.map → TerminalWindow (C)
   │        └─ Window ── ShellSession ── Prompt + Cursor, OutputLine → text | Button(link)
   │                  └─ label row: Button(variant="label", action)
   ├─ Section #projects
   │   ├─ eager.map → Card ── BigStat, Tag[], Button[]   (Takavay: children = dark block with Prompt)
   │   └─ LazySection (C) placeholder = dark box: Prompt "loading 4 more projects" + Cursor solid
   │        └─ lazy.map → Card   (Takavay, last: spans all columns at every width, `col-span-full`)
   ├─ Section #experience width=narrow
   │   └─ Window title="~/career" ── Prompt "git log --graph --career" · GitGraph · Button(term, /resume.pdf)
   ├─ Section #case-studies subtitle="written by me, published by Aim Consulting"
   │   └─ caseStudies.map → Card headerSize="sm"
   ├─ HireFooter (C) #contact ── ShellSession (no trailing prompt) · © line
   ├─ StatusBar (C) ── [josh] · tabs → <a> · clock · sound status
   └─ ManPage (C) ── <dialog> ── Window title="man <name>" actions=q·close
                     header row · NAME · SYNOPSIS tiles · sections.map · pager footer
```

---

## 3. Data model

```ts
// src/data/types.ts
type Tone = "fg" | "muted" | "green" | "blue" | "amber" | "red" | "purple";

type Action =
  | { label: string; href: string; icon?: "play" | "arrow" }        // links, #projects, #man/<slug>, /resume.pdf
  | { label: string; copy: "email"; copiedLabel: string };

type Stat = { source: string } & (               // source: "README.md:89" or "resume"; data test requires it
  | { text: string }                              // "4,500+ tests"
  | { from: string; to: string; unit?: string }   // 23.3% → 18.9%, 1,276 → 103 ms
  | { ours: string; theirs: string }              // 86% vs 71.5%
  | { redacted: true }                            // Takavay (source: "n/a")
);

type ProjectLink = { kind: "play" | "try" | "code" | "model"; href: string };
// "code" only for public repos; "model" is allowed for a private repo (D40)
// labels derived once: card {play:"Play now", try:"Try it", code:"Code", model:"Model"}
//                      man  {play:"play it",  try:"try it", code:"code", model:"model on Hugging Face"}

type ManSection =
  | { title: string; paras: string[] }
  | { title: string; bullets: string[] }
  | { title: "STACK"; mono: string };
// SEE ALSO is NOT stored: generated from Project.links; empty → "private repo · walkthrough on request".

type ManPageData = {
  slug: string;                 // PRD §5 slug table; "ship" → #man/ship, man title bar, NAME(1); About = "josh"
  title: string;                // NAME line
  meta: string;                 // header centre
  tiles: { k: string; v: string; source: string }[];
  sections: ManSection[];       // DESCRIPTION, DESIGN DECISIONS, BUGS, STACK — omitted if absent
  seeAlso?: Action[];           // only for the about page (resume, linkedin, github)
};

type Project = {
  slug: string;                 // one slug everywhere (id, deep link, man name, ls output)
  title: string;                // "Clinical Co-pilot"
  card: { cmd: string; stat: Stat; caption: string; tags: string[]; desc: string };
  links: ProjectLink[];         // drives card buttons AND man SEE ALSO; "code" present ⇒ public repo
  man?: Omit<ManPageData, "slug">;  // absent ⇒ no Read more (Takavay)
  lazy?: boolean;               // last 4
  teaser?: { cmd: string; error: string }; // Takavay "ls takavay/: Permission denied"
};

type CaseStudy = { cmd: string; stat: Stat; caption: string; tags: string[]; title: string; desc: string; href: string };

type ExperienceEntry = {
  dates: string; org: string; role: string; note: string;
  lane: "now" | "aim" | "client" | "early";   // dot colour: green / blue / blue on branch / purple
};

type OutputLine = { text: string; tone?: Tone; action?: Action };

type ShellConfig = { cmd: string; lines: OutputLine[] };

type TerminalWindowConfig = ShellConfig & {
  id: "projects" | "about" | "contact" | "resume";
  title: string;                // "~/projects"
  label: Action;                // Projects → #projects, About Me → #man/josh, Contact → copy, Resume → /resume.pdf (all ≥44px)
};

type NavTab = { id: string; label: string };   // "1:projects"; href = `#${id}`
```

| File | Exports |
|---|---|
| `src/data/types.ts` | all types above |
| `src/data/site.ts` | `EMAIL`, `LINKS` (linkedin, github, resume), hero strings, `whoami`, `windows: TerminalWindowConfig[]`, `hire: ShellConfig`, `copyright`, `navTabs: NavTab[]` |
| `src/data/projects.ts` | `projects: Project[]` (order = page order), `aboutPage: ManPageData` |
| `src/data/experience.ts` | `experience: ExperienceEntry[]` |
| `src/data/case-studies.ts` | `caseStudies: CaseStudy[]` |

Derived, never typed by hand:
- `~/projects` output: the first 4 slugs in page order as two lines of two (`keyblaster/  silent-flow/`, `ship/  clinical-copilot/`) + `+ ${projects.length - 4} more` (PRD §3.3).
- `loading N more projects`: N = `projects.filter(p => p.lazy).length`.
- Card buttons: `links` (play/try = primary, first) + `Read more` (`#man/<slug>`, if `man`) + code/model (secondary).
- Man SEE ALSO: from `links`.
- Man header `NAME(1)`: `slug.toUpperCase()`.

Content written once that the mockup holds twice: project links (card buttons + SEE ALSO, 6 projects), email/linkedin/github/resume URLs (windows, hire, About SEE ALSO, labels: 9 places), project count (ls + loading line). Card big number vs SYNOPSIS tile repeat the same fact in different formats (`86%` vs `86.0%`, `No engine` vs `none`), so they stay two strings, each with its own `source` (D30).

---

## 4. Hooks and provider contracts

**`useReducedMotion(): boolean`** (`src/hooks/useReducedMotion.ts`)
- `useSyncExternalStore` on `matchMedia("(prefers-reduced-motion: reduce)")`. Server snapshot `false`.
- Lift, shadow and blink are CSS under `@media (prefers-reduced-motion: no-preference)`, so they need no JS.

**`useInView(ref, opts): boolean`** (`src/hooks/useInView.ts`)
- In: `{ threshold?: number; rootMargin?: string; once?: boolean }`.
- Out: `true` while intersecting (or latched `true` with `once`). No `IntersectionObserver` → `true`.
- Users: TerminalWindow (0.6), HireFooter (once), LazySection (once, `200px`). Later: Ship count-down.

**`useActiveSection(ids: string[], rootMargin = "-45% 0px -50% 0px"): string`** (`src/hooks/useActiveSection.ts`)
- One observer, finds elements by `document.getElementById`, so sections need no refs. Returns the current id, default `ids[0]`.

**`useTypewriter(opts): TypewriterView & { start(): void }`** (`src/hooks/useTypewriter.ts`)
- In: `{ cmd: string; lineCount: number; onChar?: () => void }`. `start(reason: "view" | "hover")` picks the cooldown: `VIEW_COOLDOWN_MS` or `HOVER_COOLDOWN_MS`.
- Out (`TypewriterView`): `{ cmdShown: string; linesShown: number; typing: boolean; done: boolean }`.
- First render: full text (`done: true`), so the window is never empty and never jumps.
- `start()` is a no-op while typing or within its cooldown. Timings come from `src/lib/motion.ts`. `onChar` per command char (key click).
- Reduced motion: `start()` does nothing, view stays complete.
- Timers cleared on unmount.

**`useTypeOnView(ref, { cmd, lineCount, delayMs?, threshold?, once? })`** (`src/hooks/useTypewriter.ts`)
- `useTypewriter` + `useInView` + `useSound().playKey`: types once the element scrolls into view, after `delayMs`. Used by TerminalWindow (stagger, threshold) and HireFooter (once), so neither repeats the wiring.

**`useCopyEmail(): { copied: boolean; copy(): void }`** (`src/hooks/useCopyEmail.ts`)
- `navigator.clipboard.writeText(EMAIL)`; on reject/throw → `location.href = "mailto:…"`. `copied` resets after 2.5s.

**`SoundProvider` / `useSound()`** (`src/providers/SoundProvider.tsx`, C)
- Out: `{ clicks: boolean; music: boolean; toggleClicks(): void; toggleMusic(): void; playKey(kind?: "key" \| "thock"): void }`.
- One `AudioContext`, created inside the first toggle click (user gesture). ElevenLabs files fetched only after a toggle turns on. 3–4 key samples picked at random, `thock` for space/enter, gain ≈ 0.15. Music loop fades in/out.
- `playKey` is a no-op when clicks are off or nothing is loaded. Both off on every load (no persistence stated in PRD).
- Reduced motion: no effect on sound (typing does not run, so no clicks fire).

**`src/lib/motion.ts`**: the only home of JS timing constants (values from `mockup/build.py`):
`TYPE_MIN_MS = 45`, `TYPE_MAX_MS = 120`, `LINE_TICK_MS = 55`, `TICKS_PER_LINE = 4`, `START_DELAY_MS = 120`, `STAGGER_MS = 250`, `HOVER_COOLDOWN_MS = 3000`, `VIEW_COOLDOWN_MS = 5000`, `COPY_RESET_MS = 2500`, `CLOCK_MS = 30000`, `LAZY_ROOT_MARGIN = "200px"`, `WINDOW_THRESHOLD = 0.6`, `ACTIVE_SECTION_MARGIN = "-45% 0px -50% 0px"`. CSS motion (lift, blink) is tokenized in `tokens.css` instead.

**Theme helper (not a provider)** (`src/lib/theme.ts`)
- `getTheme(): "light" | "dark"`, `setTheme(t)` sets `<html data-theme>` and stores the choice; `themeScript: string` is inlined in `layout.tsx` `<head>` so the first paint has the right theme (no flash). Initial value: stored choice, else `prefers-color-scheme`.
- `useTheme(): "light" | "dark" | null`: `useSyncExternalStore` over a `MutationObserver` on `<html data-theme>` (plus the media query); server snapshot `null`, so the toggle's `aria-pressed` is set after hydration without a mismatch.
- Used by the theme `TogglePill` now and the `theme dark` command later. Look and a11y: STYLE_GUIDE §6.

---

## 5. Folder layout

```
src/
  app/
    layout.tsx            fonts (JetBrains Mono, Inter only), metadata/OG, themeScript, SoundProvider
    page.tsx              composition (§2), hero + grids inline
    globals.css           imports design/tokens.css, @theme inline map (STYLE_GUIDE §5), cursor blink keyframes, dialog/backdrop, focus ring, reduced-motion rules
    dev/components/page.tsx  dev-only gallery of every component state for screenshot baselines; notFound() in production
    not-found.tsx         later (PRD §4.6)
    robots.ts sitemap.ts  PRD §7.12
    (page wrapper carries @container so cqw tokens work; STYLE_GUIDE §5)
  components/
    Window.tsx Prompt.tsx Cursor.tsx Tag.tsx Button.tsx CopyEmailButton.tsx
    TogglePill.tsx BigStat.tsx Card.tsx ShellSession.tsx TerminalWindow.tsx
    ManPage.tsx GitGraph.tsx StatusBar.tsx LazySection.tsx Controls.tsx
    Section.tsx HireFooter.tsx
    __tests__/            behavior tests only (RTL roles + userEvent)
  hooks/                  useReducedMotion useInView useActiveSection useTypewriter useCopyEmail (+ __tests__)
  providers/SoundProvider.tsx
  lib/theme.ts lib/motion.ts
  data/                   types.ts site.ts projects.ts experience.ts case-studies.ts (+ __tests__/data.test.ts)
public/
  resume.pdf  josh.jpg  audio/*.ogg|mp3  og.png
```

Flat `components/`: 18 files does not need `ui/` vs `sections/` folders.

**Base repo (`joan_portfolio_project`): keep vs replace**

| Keep (adapt) | Replace / delete |
|---|---|
| `next/font` + `@theme inline` pattern (swap 9 families for 2) | all of `src/components/*` (PolaroidCard + CSS module, CardsSection, Hero/Projects sections, 4 modals, ProjectCard) |
| `next.config.ts` `images` (drop LAN IP; local photo needs no `remotePatterns`) | `src/data/about.ts` (Joan's copy) |
| `vitest.config.ts`, `src/test/setup.tsx` (next/image mock; add matchMedia + IntersectionObserver mocks) | all 7 snapshot tests + `__snapshots__` |
| `tsconfig.json` (`@/` alias), `eslint.config.mjs` | `src/utils/text.ts` `truncate` (captions use CSS ellipsis) |
| `.github/workflows/ci.yml` (add lint, `tsc`, `next build`) | `pr-notify.yml` (fix `"` in titles, or drop) |
| — | package name `my-app`, `rm -rf .next` dev script, README, AGENTS.md, CLAUDE.md (rewrite per GUARDRAILS §6), `api/contact/route.ts` + nodemailer (form dropped, D31) |

---

## 6. Reuse map

Line counts are from `Main.dc.html` (820 lines, ~560 of markup).

| Pattern in mockup | Occurrences | Replaced by | Markup removed (approx.) |
|---|---|---|---|
| Card with dark header (`<article>`, project + case variants) | 12 × ~21 lines = 252 | `Card` (+ data) | ~230 lines |
| Window shell + typing body + label row | 4 × ~16 = 66 | `TerminalWindow` | ~50 |
| Title bar with 3 dots | 6 (4 windows, career, man) | `Window` | ~25 |
| Commit row (dot + dates/org/role/note) | 9 × 9 = 81 | `GitGraph` row loop | ~70 |
| Tag pill | 48 | `Tag` | 48 inline style blocks |
| Pill buttons (Play ×4, Read more ×9, Code/Model ×5, case ×2, term pills) | ~22 | `Button` variants | ~22 style blocks |
| Link-styled lines (`> linkedin` etc.) | 6 | `Button variant="link"` via `OutputLine.action` | 6 |
| `josh ~ $` prompt | 12 | `Prompt` | 12 |
| Block cursor (hollow, solid, page) | 11 | `Cursor` | 11; JS blink timer → CSS |
| Window label (Projects/About/Contact/Resume) | 4 | `Button variant="label"` | 4 |
| Before→after / vs big number | 3 | `BigStat` | 3 |
| Section `<h2>` + width wrapper | 3 | `Section` | 3 |
| Sound pills (+ new theme pill) | 2 (+1) | `TogglePill` | 2 |
| Typing state machine (`type`, `typeHire`, `view`) | 2 copies in JS | `useTypewriter` + `ShellSession` | ~60 JS lines |
| IntersectionObserver setups (`observeOnce`, `observeWindow`, `observeSection`) | 3 copies | `useInView`, `useActiveSection` | ~45 JS lines |
| Email links / copy (`copyEmail`, label strings) | 3 call sites | `CopyEmailButton` + `useCopyEmail` | — |
| Project links typed in card AND man SEE ALSO | 6 projects × 2 | `Project.links` | 6 duplicated records |
| Status-bar tabs, man sections, tiles | already loops | `navTabs` map, `ManPage` map | — |

---

## 7. Do not create

| Looks like a component | Keep it as | Reason |
|---|---|---|
| `Hero` | inline JSX in `page.tsx` | used once, ~10 lines, no state |
| `TerminalRow`, `ProjectGrid`, `CaseGrid` | a `<div className="grid …">` | layout only; 3 grid class strings |
| `ProjectCard`, `CaseStudyCard` | `<Card {...}>` | same markup; difference is data + `headerSize` |
| Generic `Modal` | `ManPage` on native `<dialog>` | one dialog today; extract only if the KeyBlaster overlay (§4.5) gets built |
| `ManSection`, `SynopsisTile`, `CommitRow`, `Dots` | local functions in their one file | single consumer each |
| `TakavayTeaser` | `Card` `children` (Prompt + red line) | one-off 3 lines |
| `RedactionBars` | `BigStat` `{ redacted: true }` branch | one use |
| `ThemeProvider` / `ThemeContext` | `lib/theme.ts` + `data-theme` | CSS does the work; React state not needed |
| `ManPageProvider` / open-man context | `#man/<slug>` hash links | links work from server components; back button closes; deep links for free |
| `useClock` | 6 lines inside `StatusBar` | single consumer |
| `CountUp` (Ship 1,276 → 103) | wait for PRD §4.4 | not in core scope |
| `Copyright`, `LoadingLine`, `WhoAmI` | inline | one line each |
| `src/utils/*` | none yet | nothing pure is shared yet |

---

## 8. Open questions and decisions

The ambiguities this file used to list were resolved on 2026-11-06 (DECISIONS.md D26–D45). Anything still open is in PRD §9.
