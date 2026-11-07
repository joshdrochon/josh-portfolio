# Test plan

Owns: what is tested, performance budgets, screenshot widths and themes. Where each gate runs is in `GUARDRAILS.md` §3.

Tests are written **before** each component and must fail first. They test behavior a visitor or screen reader would notice, not class names, so restyling doesn't break them. No snapshot tests of markup; Joan's repo had 1,711 lines of them and they taught people to press "u".

**Tools:**
- Kept from the base repo: **Vitest + React Testing Library + user-event**, with `src/test/setup.tsx` (it already mocks `next/image`).
- Added: **Playwright** (end-to-end and screenshots), **@axe-core/playwright**, **Lighthouse CI**.
- Fake timers for anything timed. Timing values are imported from `src/lib/motion.ts`, never retyped in tests.
- `matchMedia` and `IntersectionObserver` get small shared mocks in `setup.tsx`.

Names match `docs/COMPONENTS.md`. Unit tests live in `__tests__/` next to the code.

## 1. Primitives
- **Window**
  - Renders the title and three dots, which are `aria-hidden`.
  - Renders its children and `actions`.
- **Prompt**
  - Renders `josh ~ $` then its children.
  - Renders a cursor only when one is passed.
- **Cursor**
  - `idle`: hollow, no blink.
  - `active`: solid, with the blink class.
  - `typing` and `solid`: solid, no blink.
  - Always `aria-hidden`.
- **Tag**
  - Renders its text.
- **Button**
  - With `href`, renders a real `<a>` with that href.
  - A `copy` action renders a `<button>`.
  - Each variant gets its own style hook.
  - External links get `rel="noopener noreferrer"`.
- **CopyEmailButton**
  - Click writes the address to the clipboard (mocked) and shows **its own** copied label (D28).
  - Other copy buttons are unchanged.
  - The label resets after `COPY_RESET_MS`.
  - When the clipboard API is missing or rejects, falls back to `mailto:`.
  - The change is announced through its `aria-live="polite"` region.
- **TogglePill**
  - Has the `button` role.
  - `aria-pressed` follows `pressed`.
  - Click, Space or Enter calls `onToggle` once.
  - Theme pill: fixed accessible name "Dark mode", and `aria-pressed` true when dark (D34).
- **BigStat**
  - Plain value.
  - from → to: "from" has a strike-through and an accessible text "from X to Y".
  - ours vs theirs: renders both.
  - Redacted: `role="img"` with label "Redacted text".

## 2. Hooks, provider, helpers
- **useReducedMotion**
  - Reflects the media query and updates on change.
  - `false` on the server.
- **useInView**
  - Becomes true on intersection.
  - With `once`, stays true.
  - Without `IntersectionObserver`, true.
  - Disconnects on unmount.
- **useActiveSection**
  - Returns the id crossing the middle band and updates on scroll (observer mocked).
- **useTypewriter**
  - Types the command one character at a time, each delay inside `TYPE_MIN_MS`–`TYPE_MAX_MS`.
  - Prints output lines `TICKS_PER_LINE` ticks apart, then marks done.
  - `start()` while typing does nothing.
  - Retype: hover or focus needs `HOVER_COOLDOWN_MS` (3s) since the last run; scroll into view needs `VIEW_COOLDOWN_MS` (5s) (PRD §3.3).
  - Reduced motion: done immediately, no timers.
  - Calls `onChar` once per command character, never for output lines.
  - `pause()` freezes it mid-run; `resume()` continues from the same tick (D69).
  - Unmount clears every timer.
- **useCopyEmail**
  - Same contract as CopyEmailButton, at hook level.
- **SoundProvider / useSound**
  - Both toggles on at every load, with nothing persisted (D38, D72).
  - Nothing fetched, created or played before the first click or key (fetch mocked).
  - The first click anywhere resumes the AudioContext, loads the clicks and starts the music; later clicks start nothing new.
  - Turning a sound off before the first click keeps it silent.
  - `playKey()` does nothing while clicks are off.
  - Music stops and starts again from its pill.
- **Theme helper** (`lib/theme.ts`)
  - Saved choice, else OS preference.
  - `setTheme` sets `data-theme` and saves it.
  - Survives `localStorage` throwing.
  - Playwright: the first paint is already in the saved theme, with no flash.

## 3. Composites
- **Card**
  - Renders cmd, stat, caption, tags, title and description from props.
  - Renders only the actions its `links` produce:
    - no `code` button unless the project has a `code` link (public repo);
    - a `model` link renders even though the repo is private (D40);
    - no play/try button without a `play`/`try` link.
  - Read more is a link to `#man/<slug>`.
- **ShellSession**
  - Renders the partial command and the visible lines from the view.
  - Link lines are real links or buttons.
  - The trailing prompt appears only when done.
  - Only the active window's cursor blinks.
- **TerminalWindow**
  - Before typing, shows the finished output.
  - Shows finished output and never types on its own (D69).
  - Types only while the mouse is over it; leaving pauses it, re-entering resumes from the same point.
  - On touch, a tap types it and a tap elsewhere pauses it.
  - Keyboard focus lifts it and gives it the hover shadow.
  - The label action works: Projects goes to `#projects`, About opens `#man/josh`, Contact copies the email, Resume goes to `/resume.pdf`.
- **ManPage**
  - Opens on `#man/<slug>`.
  - Closes on `q`, Escape, the close button or a backdrop click; closing removes the hash with `history.replaceState`.
  - Focus moves in, is trapped, and returns to the opener. With no opener (deep link), focus goes to the `#projects` heading (D35).
  - Accessible name is the NAME line text (for example "ship — …"), not "NAME" (D41).
  - `j`/`k`/arrows scroll, space pages down, and the pager percentage follows scroll.
  - Empty sections aren't rendered. Private projects show "private repo · walkthrough on request".
  - Every slug in the PRD §5 table opens its page, and an unknown slug opens nothing.
- **GitGraph**
  - Renders the entries in order with dates, org, role and note.
  - Aim's clients sit inside the branch.
  - Dots are `aria-hidden`, and the entries are a real list.
- **StatusBar**
  - Tabs are links to the section ids.
  - The active one has `aria-current="location"` and the marker.
  - The clock updates every `CLOCK_MS`.
  - The sound text reads "sound on" or "sound off" and isn't interactive (D39).
- **LazySection**
  - Placeholder until in view, then mounts its children once.
  - The placeholder count equals the number of lazy projects.
- **Controls**
  - Clicks, music and theme toggles are wired to sound and theme.
- **Section**
  - `h2`, optional subtitle, and the anchor id.
- **HireFooter**
  - Types `./hire.sh` when in view, then shows email (copy, with its own copied label), LinkedIn, resume and the "open to" line.
  - Reduced motion shows everything at once.

## 4. Data integrity
- **Projects:**
  - Every project has a unique kebab-case slug matching the PRD §5 slug table, plus a title, a stat and a caption.
  - **Every `Stat` and every man-page tile has a non-empty `source`** (file:line or "resume"), which enforces PRD §5.
  - `code` links exist only on public repos (KeyBlaster, Ship, LabelProof, One Ramp).
  - Coach Study has no play, try, code or model link.
  - Takavay has no man page, and it's the last project.
  - The projects window shows the first 4 slugs in page order plus "+ N more", and the lazy count, all computed.
- **Claims:**
  - `content/claims.json` matches what `src/data` renders (years, clients, each headline stat).
  - Until the resume is aligned, this test also flags that the resume says 6+ while the site says 7 (PRD §9).
- **URLs:** every URL in the data is https, except same-site paths.

## 5. End-to-end (Playwright)
Run at **390 / 834 / 1440** wide, in **light and dark**.
- **Health:** no console errors; axe finds no serious or critical issues on the page or with a man page open.
- **Window layout:**
  - 4 across at 1440, 2×2 at 834, 1 column at 390.
  - Every window has the same height, and that height doesn't change while typing.
- **Card layout:**
  - 3, 2 and 1 columns.
  - Takavay spans the full row at every width.
  - Captions never wrap.
- **Touch targets** (D32): every control is at least 44px, except text links inside terminal output, which are at least 24px.
- **Keyboard:**
  - Tab reaches every control in order, and focus is visible on each.
  - Every Read more opens its own project's page.
- **Man page on a phone:**
  - Fits in `100dvh`.
  - The page behind can't scroll.
  - The dialog scrolls internally.
- **Theme:** the toggle switches the theme and the choice survives a reload with no flash.
- **Lazy cards:** they mount only once on screen and fade in (D73), and mounting causes no layout shift (CLS 0 measured around it).
- **Status bar:** follows scroll; tabs jump to sections.
- **Screenshot baselines:**
  - Every section and one man page.
  - The `/dev/components` page (all component states, dev-only, `notFound()` in production).
  - Any difference fails until the baseline update is approved.
- **Link check:** every href returns 2xx or 3xx. Runs nightly and before launch, not per PR.

## 6. Performance budgets
- Lighthouse runs with real throttling (`throttlingMethod: devtools`, D65): the simulated estimate put the photo behind every script and over-reported LCP.
- **Lighthouse CI, mobile preset:**
  - LCP ≤ 2.5s, CLS ≤ 0.1.
  - TBT < 200ms, as the lab stand-in for INP, which lab runs can't measure.
  - Accessibility score 100.
- **`size-limit`:** first-load JS for the home page, read from the prerendered HTML (`.size-limit.js`). Measured 2026-11-06: **186 KB gzipped on an empty page**, almost all React 19 and the Next.js runtime, so the earlier 90 KB target can't be met with Next.js. Limit is **220 KB** (D57, D60). Our own code may add at most the headroom.
- **Audio:** files never appear in the initial request list.

## 7. What not to test
- Exact colors, pixel sizes and class names. Tokens, lint and screenshots cover those.
- Third-party sites' content.
- Snapshot dumps of markup.
