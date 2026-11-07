# PRD: Josh Rochon portfolio site

Status: design approved in mockup, not built yet. Written 2026-11-06.
Owner: Josh Rochon (joshdrochon@gmail.com).

This file is the source of truth for **what the site does, right now**. If the mockup and this file disagree, this file wins. Decisions, reversals and history are in `docs/DECISIONS.md`; components in `docs/COMPONENTS.md`; tokens and theme in `docs/STYLE_GUIDE.md`; tests and budgets in `docs/TESTING.md`; process in `docs/GUARDRAILS.md`.

## 0. Links and files

| What | Where |
|---|---|
| Live mockup (private, Desktop / Tablet / Phone boards) | https://claude.ai/artifact/8G56XTqm8sZQexxSqmdEHX |
| Mockup source (a copy) | `mockup/project/Main.dc.html` (+ `Tablet`/`Phone` wrappers, `canvas.json`) |
| Mockup generator, holds all copy and man-page content as data | `mockup/build.py` |
| Base code to reuse | https://github.com/joshdrochon/joan_portfolio_project (Joan Miguel's site, live at https://joanaberionmiguel.com) |
| Research: what good engineer portfolios do | `docs/research/research-engineer-portfolios.md` |
| Research: visually strong engineer portfolios (screenshotted) | `docs/research/portfolio-design-bar.md` |
| Profile photo (LinkedIn, 200×200 only) | `assets/josh-linkedin-200.jpg` |
| Resume (Google Doc, iSpot version) | https://docs.google.com/document/d/1XaKYBVcyfzoCQMMDW6DHubBnjMSwORHYB2QkVTeh4dc |
| Final resume PDF | `~/Downloads/Josh_Rochon_Resume_iSpot.pdf`. Commit a copy as `public/resume.pdf` at repo setup; the site links `/resume.pdf` |

## 1. Goal and audience

A personal site that gets Josh, a Seattle senior software engineer, hired for senior SWE roles. Readers are hiring managers and engineers who skim for under a minute after reading the resume. The site has to:

1. Say who he is and what level he is on the first screen.
2. Show real projects with one real, sourced number each, readable in under a minute.
3. Let people play KeyBlaster in one click.
4. Link the two published Aim Consulting case studies.
5. Tease Takavay (proprietary, in progress) without revealing anything.
6. Show employment history.
7. Feel memorable and clearly built by an engineer, without hurting speed or accessibility.

From the research: portfolios are seen after the resume, not instead of it. The resume and the site must say the same things.

## 2. Design concept (approved)

Same page layout as Joan's site, re-themed as a developer's terminal.

- **Page:** light theme (white) by default, with a dark theme (§3.10). `JetBrains Mono` for headings, labels and UI; `Inter` for body paragraphs only.
- **Terminal windows:** Tokyo Night colors, dark in both themes. Values: `design/tokens.css`; usage: `docs/STYLE_GUIDE.md`.
- **Contrast:** all text passes WCAG AA 4.5:1. Joan's site used `gray-400` (2.6:1); don't repeat that.
- **Rejected for good** (see `docs/DECISIONS.md` D3–D8): clothesline and polaroids, the sticky note, handwritten fonts, tilted windows, every cursor blinking at once.

## 3. Page structure (top to bottom)

### 3.1 Sound controls (top right)
Two pill buttons, both **on by default** (D72): `clicks: on/off` and `music: on/off`, with `aria-pressed`. Browsers block audio until the visitor clicks, taps or presses a key, so nothing loads or plays before that first interaction; then the clicks load and the music fades in. Either pill turns its sound off.
- Clicks: a soft key click per typed character. Quiet (about 0.15 gain).
- Music: a quiet lo-fi loop. It mutes while the tab is hidden (a link opened in a new tab, another tab, a minimized window) and fades back in on return, so it never plays over KeyBlaster's own music (D83).
- Both come from **ElevenLabs** (sound effects + music). The mockup uses browser-made stand-ins (noise-burst clicks, a 4-note chord) that must not ship.
- Clicks use 3–4 sampled switch clicks picked at random, plus a distinct "thock" for space and enter, and play only while typing.
- Choices are not remembered: both off on every load (D38).

### 3.2 Hero
- Big line (a `<p>`, styled): **Senior Software Engineer**, `clamp(28px, 6cqw, 72px)`, bold mono, wraps on phones.
- Round photo, `--size-photo`. The current file is the 200×200 LinkedIn image; a larger original is optional (only sharper on desktop).
- Name as the page's **`<h1>`: Josh Rochon**. Joan's site had two h1s and the name in a `<p>`.
- Prompt line: `$ shipping reliable software from Seattle▮` (static block cursor).
- `whoami` line under the prompt: `Senior SWE · 7 yrs · Starbucks · Microsoft · BECU · Gauntlet AI`. The site says 7 years (D18); the resume says 7+ and the cover letter "over seven years" (Josh updated both, 2026-11-06).

### 3.3 Terminal row (replaces Joan's clothesline cards)
Four identical macOS-style terminal windows: Projects, About Me, Contact, Resume, inside `<section aria-label="Quick links">`.
- **Size:** each window is a fixed 236px tall: title bar, body (`flex:1`, overflow hidden), and a 52px label row. Same width. Never resize while typing.
- **Layout:** 4 across on desktop, 2×2 on tablet, 1 column on phone, with CSS grid and container queries (D29). Breakpoints, from the mockup: 2 columns below 1100px of container width, 1 column below 560px.
- **Content** (command → output):
  - Projects, `~/projects`: `ls projects/` → the first 4 slugs in page order, two per line (`keyblaster/  silent-flow/`, `ship/  clinical-copilot/`), then `+ 6 more`. Computed from the project list, never typed (D44).
  - About, `about.md`: `cat about.md` → `# Josh Rochon`, `Senior SWE · Seattle`, `Howl's dad · snowboarder`, `retro games · light rail` (D82).
  - Contact, `contact.sh`: `./contact.sh` → `> linkedin`, `> github`, `> email` as real links and buttons.
  - Resume, `resume.pdf`: `open resume.pdf` → `opening resume.pdf ...`, `2 pages · updated Nov 2026`.
- **Behavior:**
  - Before a window has typed, it shows its finished output, so it is never empty and never jumps.
  - Each window shows its finished output and **types only while hovered** (or keyboard-focused). Leaving pauses it mid-line; coming back picks up where it stopped. Once finished, the next hover retypes it, unless it typed in the last **3s** (D69).
  - On touch screens a **tap acts as hover**: tapping a window types it, tapping anywhere else pauses it (D69).
  - All JS timings live in `src/lib/motion.ts` (`docs/COMPONENTS.md` §4).
  - Typing speed is a human jitter of 45–120ms per character. After the command, output lines print about 4 ticks apart, then a fresh prompt with the cursor.
  - The hovered or focused window lifts 6px with a deeper shadow. Its cursor is solid and blinks at 530ms (a CSS animation). Every other cursor is a hollow outline that doesn't blink.
  - Key click per typed character only when clicks are on.
  - `prefers-reduced-motion`: no typing, no lift. Text shows at once.
- **Click targets:**
  - The Projects label scrolls to `#projects`.
  - The About Me label opens the `josh(1)` man page.
  - The Contact label copies the email.
  - The Resume label opens `/resume.pdf` in a new tab (D74). Every link that leaves the page opens a new tab; only in-page `#` links stay. Everything clickable shows the hand cursor, and section links scroll smoothly (D75). Pill buttons rise 2px, brighten their outline and cast a soft shadow on hover, and dip slightly when pressed (D76).
  - linkedin and github are links. Email copies to the clipboard and shows its own `✓ copied` (D28), falling back to `mailto:`.
  - Window labels are ≥44px. The three link lines inside the Contact window may be 24px (D32).

### 3.4 Projects (`#projects`)
- Cards are 3 across on desktop, 2 on tablet and 1 on phone. **Takavay, the last card, spans the full row at every width.** Each card has:
  - A dark 180px terminal header: command line, **one big real number**, and a one-line caption that never wraps (`nowrap` + ellipsis; keep captions short).
  - Tags, a mono title, an Inter description, and buttons.
- **Buttons:**
  - **Play now / Try it** (filled) for anything live.
  - **Read more** for everything except Takavay. It links to `#man/<slug>`.
  - **Code** only for public repos.
  - **Model** for Diagnostic Tutor's Hugging Face page, the one link allowed for a private repo (D40).
- **Lazy load:** the first 6 cards render immediately; the rest (Whiteout Ultima, LabelProof, One Ramp, This Portfolio, Takavay) mount only when they reach the screen, then fade in (D73). A `$ loading 5 more projects▮` line, computed from the list, shows until then. This is a visual deferral only; the data still ships with the page (D36).
- Card content is in §5.

### 3.5 Read more = man page overlay
A modal styled as a Unix manual page, what `man ship` prints in a terminal. Engineers recognise it. The BUGS section is the "senior" signal: it shows honesty and tradeoffs.
- **Layout:**
  - Native `<dialog>` (D27): a terminal window, max 860px wide, over a dimmed, blurred backdrop (6px, D78). The title bar reads `man <slug>` with a `q · close` button (≥44px).
  - Header row: `NAME(1)   meta   NAME(1)`.
  - Sections: **NAME, SYNOPSIS** (number tiles), **DESCRIPTION, DESIGN DECISIONS, BUGS, STACK, SEE ALSO**. Sections without facts are omitted.
  - SEE ALSO shows the same buttons, with the same labels, as the project's card (D77).
  - For private repos, SEE ALSO says "private repo · walkthrough on request".
- **Pager footer** (inverted bar): `Manual page ship(1) · 42% · j/k scroll · q quit`. The percentage tracks scroll.
- **Keys:** `j`/`↓` and `k`/`↑` scroll, space pages down, `q`/`Esc` close.
- **Opening and closing:** each page opens on `#man/<slug>` (D26), so deep links work. Closing drops the hash with `history.replaceState` (D35).
- **Accessibility:**
  - Labelled by the NAME line text, for example "ship — …" (D41).
  - Focus moves in, is trapped, and returns to the opener; on a deep link it goes to the `#projects` heading (D35).
  - The page behind can't scroll (`html` is locked while the dialog is open, with a stable scrollbar gutter, D78); the dialog scrolls inside and fits `100dvh`. Joan's modals broke on phone landscape and with the iOS keyboard.
- Planned: a View Transition that grows the man page out of the card header, with a plain fade under reduced motion.
- All man-page copy is in `mockup/build.py` → `MAN`, to be ported to `src/data/projects.ts`.

### 3.5a Extras approved 2026-11-06
- **This Portfolio card** (D49): the site lists itself as a project, with a recursion joke. The header shows a red `RangeError` and "Maximum call stack size exceeded". BUGS: "No base case… The base case is you closing the tab." Its stat is a joke, not a measured number, so it is exempt from the `source` rule and marked `joke: true` in the data.
- **KeyBlaster is desktop only** (D50): it needs a physical keyboard. The card shows a "Desktop only" tag. On touch-only devices (`(hover: none) and (pointer: coarse)`), the Play button becomes a disabled-looking note, "Needs a keyboard: play on a computer", and is not a link.
- **Screen readers and typing** (D51): every animated terminal line is `aria-hidden`, and the finished text sits beside it in a visually hidden element, so it is read once and never letter by letter. Status changes such as "copied" use one polite `aria-live` region.
- **Link preview and icons** (D52): files are in `design/brand/`.
  - `og.png`, 1200×630: a terminal `whoami` with the photo and URL.
  - `icon.svg` (`>_` prompt), `favicon-32.png`, `apple-touch-icon.png` (180), `icon-512.png`.
  - The sources are `og.html` and `icon.svg`, rendered with headless Chrome.
  - Wire them up through Next.js metadata (`openGraph`, `twitter: summary_large_image`, `icons`).
- **Visitor stats** (D53): Vercel Web Analytics. It is cookieless, so there is no consent banner.
- **Sound files** (D54): generated with ElevenLabs. The key is in `keyblaster/.env` (`ELEVENLABS_API_KEY`). Copy it into this repo's `.env.local`, which is gitignored, only while generating. Commit only the resulting audio files, never the key.
- **Read more** stays a pop-up dialog (D55): `#man/<slug>`, full screen on phones. No separate project pages.

### 3.6 Experience (`#experience`)
A terminal window `~/career` running `git log --graph --career`, drawn as a real graph:
- A continuous trunk line with a dot per job.
- **Aim Consulting** as a branch, with a curved branch-off and its own blue line, holding the client roles.
- A per-row layout: dates in amber, org in white bold, role in blue, one-line note in muted.
- Ends with an `open resume.pdf` button.
- Org names render in `--term-bright`.

Entries (from the resume):
| Dates | Org | Role | Note |
|---|---|---|---|
| Jul 2026 – Sep 2026 | Gauntlet AI | AI Engineering Fellow | Shipped a deployed project every week. Capstone voted #1 by the cohort and staff. |
| Aug 2021 – Apr 2026 | Aim Consulting | Senior Consultant, Solutions | Senior engineer on client teams. Mentored junior consultants and wrote runbooks for live systems. |
| Aug 2024 – Jan 2026 | Starbucks | Senior React Engineer | Staffing app that replaced Excel across 10,000+ stores, 100% manager adoption. |
| Aug 2023 – Jul 2024 | Microsoft | .NET Developer | Moved 22+ projects off retired auth to clear a security SLA; added 100+ unit tests. |
| Jul 2022 – Aug 2023 | BECU | Full-Stack ASP.NET MVC Developer | Online banking APIs and features for tens of thousands of members; on call for a major launch. |
| Oct 2021 – May 2022 | Purple | Frontend Developer | Ran 5+ sale-promotion releases; co-led the Presidents' Day Sale site. |
| Nov 2020 – Apr 2021 | Coding Dojo | Full-stack Python/Django certificate | Added Python and Django to a React and .NET background. |
| Jan 2019 – Mar 2020 | RedAwning | Software Developer | Owned the bookings calendar in the property manager portal; cut click lag by about a second. |
| Jun 2018 – Dec 2018 | GIVE Volunteers | Junior Software Developer | Built and deployed a full-stack volunteer portal with a team of four. |

The client-role dates come from Josh's LinkedIn, read 2026-11-06. Coding Dojo was added to explain the 2020–21 gap. LinkedIn also lists Chariot Destinations (Web Developer, part-time, Sep–Dec 2018), which is not on the resume, so it stays off the site to keep the two consistent.

### 3.7 Case studies (`#case-studies`)
"written by me, published by Aim Consulting". Two cards, the same width as the project grid (two columns on desktop and tablet, one on phone), with a 150px header (project cards use 180px). Their numbers must **not** repeat the Experience lines word for word.
- **Modernizing Staff Planning with React**:
  - Header: `$ grep sessions analytics.log` / **43,000+ sessions** / "after rollout to 10,000+ stores".
  - Tags: React, GraphQL, 2025.
  - Copy: "Replaced store managers' Excel staffing process for a national beverage retailer, from a 400-store pilot to full rollout."
  - Link: https://aimconsulting.com/insights/modernizing-staff-planning-with-react-case-study/
- **Compliance and Technical Debt Resolved**:
  - Header: `$ git diff --stat auth/` / **ADAL → MSAL** / "retired auth replaced to clear a security SLA".
  - Tags: .NET, Azure.Identity, 2024.
  - Copy: "Took over 22 legacy .NET projects nobody had maintained, rebuilt their toolchains and moved them off deprecated packages to meet a security deadline."
  - Link: https://aimconsulting.com/insights/compliance-technical-debt-resolved-case-study/
- Josh is the sole author of both, which was verified earlier.

### 3.8 Footer (`#contact`): `./hire.sh`
A dark band. When it scrolls into view it types `./hire.sh`, then prints:
- `> joshdrochon@gmail.com` (click copies, then shows `✓ copied …`)
- `> linkedin.com/in/josh-rochon`
- `> resume.pdf`
- `open to senior software engineering roles` (green)

The © line follows: "© 2026 Josh Rochon · built with Next.js". "· sound by ElevenLabs" is added only once the audio ships (D37). The page must end with a call to action, not with nothing to click. Each copy line shows its own `✓ copied`; the hire.sh link lines may be 24px (D32).

### 3.9 tmux status bar (sticky navigation)
A `<nav aria-label="Site sections">` that sticks to the bottom of the viewport (`position: sticky; bottom: 0`). It shows `[josh]` and then the tabs `0:home 1:projects 2:experience 3:case-studies 4:contact`, each ≥44px tall (D32):
- The tab for the section in view is green with `*` and `aria-current="location"`, tracked by IntersectionObserver with `rootMargin: -45% 0 -50% 0`.
- Each tab is a link to its section.
- Right side: `seattle 3:52 PM · sound off/on`, a live Pacific time clock updated every 30s. The sound text is plain text, not a control (D39).

### 3.10 Theme (light / dark)
A sun/moon toggle in the top-right cluster, next to the sound pills. Defaults to the OS setting; a click overrides it and is remembered; no flash on load. Only page colors change; terminal windows stay dark. Full spec: `docs/STYLE_GUIDE.md` §6 (look, accessibility) and `docs/COMPONENTS.md` §4 (API).

## 4. Proposed features (from the creative audits; NOT approved — Josh decides each before it is built)
From the creative audits. Build after the core page is done:
1. **Command palette in the status bar:** press `:` (or `/`) to type `help`, `ls`, `man ship`, `open resume`, `contact --copy`, `theme dark`, `sound on`, `keyblaster`. Unknown input gets "command not found, did you mean `man ship`?" with a fuzzy match. Use a real labelled `<input>` and a visible "press : for commands" hint.
2. ~~Declassify Takavay~~ **Dropped.** Takavay can't reveal much (Josh, 2026-11-06). The card stays as it is: redaction bars, `status: building`, and an `ls: takavay/: Permission denied` block.
3. ~~Dark mode~~ **Moved into core scope: §3.10.**
4. **Ship count-down:** 1,276 → 103 animates once on scroll into view, about 600ms. Skip it under reduced motion.
5. **Console hello:** a short `console.log` greeting for devtools users with the repo link. (The "type keyblaster to launch the game" shortcut was rejected, D48.)
6. **404 page:** `zsh: command not found: /foo` plus "did you mean" links ranked by edit distance.
7. **Footer stats:** real page weight and Lighthouse score, read from the actual build, never typed by hand.
8. **"PRESS ANY KEY":** a keypress while the KeyBlaster card is focused starts a 15s demo round in the header.

## 5. Project content (facts and sources)
Rule: **every number must be recorded in the repo or resume. Never estimate.** File references are from a read-only scan on 2026-11-06. Repos are in `~/Desktop/Developer/`.

Slugs (D43) are used everywhere: ids, `#man/<slug>`, the man title bar, `ls` output and tests.

| # | Project | Slug | Card header (cmd / big / caption) | Links | Repo |
|---|---|---|---|---|---|
| 1 | **KeyBlaster** | `keyblaster` | `$ npm test -- src/engine` / **4,500+ tests** / 95% coverage gate on the game engine | Play https://keyblaster.vercel.app · Code github.com/joshdrochon/keyblaster | public |
| 2 | **Silent Flow** (capstone, #1) | `silent-flow` | `$ python eval.py --adapter josh` / **23.3% → 18.9%** / word error rate · p = 0.014 | none | private |
| 3 | **Ship** | `ship` | `$ diff p95_before p95_after` / **1,276 → 103 ms** / p95 API latency | Code github.com/joshdrochon/ship | public (main remote on Gauntlet GitLab) |
| 4 | **Clinical Co-pilot** | `clinical-copilot` | `$ git push # runs the eval gate` / **96/96 passed** / pass/fail rubrics across 69 eval cases | none | Gauntlet GitLab only |
| 5 | **Diagnostic Tutor** | `diagnostic-tutor` | `$ eval --arm adversarial --n 200` / **86% vs 71.5%** / held the rule vs Claude Sonnet · p < 0.001 | Try https://joshdrochon--diagnostic-tutor-ui-web.modal.run/ (200 on 2026-11-06) · Model https://huggingface.co/all-the-smiles/diagnostic-tutor-qwen3-1.7b | Gauntlet GitLab only (model public on HF) |
| 6 | **Coach Study** | `coach-study` | `$ npm run eval:golden` / **97.9%** / grader agreement on 570 checked verdicts | none, ever (proprietary app) | private |
| 7 | **Whiteout Ultima** (lazy) | `whiteout-ultima` | `$ npm run serve` / **No engine** / Three.js · raw GLSL · hand-written physics | none (no Play link, D81) | private |
| 8 | **LabelProof** (lazy) | `labelproof` | `$ pytest tests/accuracy` / **100%** / Tier A accuracy · 175 rows | Try https://labelproof.fly.dev · Code github.com/joshdrochon/labelproof | public |
| 9 | **One Ramp** (lazy) | `one-ramp` | `$ attach --receipt` / **1 click** / Gmail receipt → Ramp card charge | Code github.com/joshdrochon/one-ramp-extension | public |
| 10 | **This Portfolio** (lazy, last row, beside Takavay) | `josh-portfolio` | `$ open joshrochon.com` / **RangeError** (red) / Maximum call stack size exceeded | Open it → `#home` · Code github.com/joshdrochon/josh-portfolio · man page SEE ALSO links to itself | public |
| 11 | **Takavay** (lazy, last row, beside This Portfolio) | `takavay` | `$ cat takavay/README.md` / redaction bars / status: building | none | proprietary |

The About man page uses slug `josh`.

Card descriptions and man-page text are written out in full in `mockup/build.py` (the `card(...)` calls and the `MAN` dict). Key sourced facts:

- **KeyBlaster:**
  - What it is: a typing game for kids in grades 2–5 who fly from Earth to Pluto by typing the words on falling asteroids. Built for the Nerdy AI Hackathon.
  - Numbers:
    - 4,500+ unit tests behind a 95% coverage gate on `src/engine` (README.md:89).
    - Difficulty holds success near 85% (README.md:43).
    - The AI call has a 1500ms timeout with a shipped fallback (README.md:59).
  - Design: every AI sentence passes 7 checks (allowlist, shape, length, word pool, banned content, reuse, absence), and the model is never in the game loop (README.md:55-59, api/coach.ts).
  - Stack: TypeScript, Phaser 3, Vite, Vitest, Playwright, Claude API (haiku-4-5), Vercel.
  - Commits: Sep 16 – Oct 14 2026, 202 of 204 by Josh.
- **Silent Flow:**
  - Word error rate 23.30% → 18.86%, p = 0.0135, n = 69 (EXPERIMENTS.md:16).
  - Perfect transcripts 31.9% → 44.9% (same line).
  - Error rate varies 2.8× across speakers, 4.15–11.58% (README.md:20-27).
  - Adapters are 0.4 MB per user (README.md:57).
  - "Under 3 minutes of my own video": the resume, and "usable adaptation data is 2.82 minutes" (EXPERIMENTS.md:430).
  - Bugs: two ideas are marked DEAD with p-values. It isn't real-time yet. The 6.88% baseline doesn't match the published 4.8%.
  - Stack: Python, PyTorch (Conformer, LoRA), MediaPipe, FastAPI WebSocket, React + Vite.
  - Commits: Aug 30 – Sep 10 2026, all 58 by Josh.
  - "Capstone voted #1" comes from the resume and Josh, not the repo. **Upstream code is non-commercial only** (README licence); this only matters if it's sold.
- **Ship:**
  - p95 1275.7 / 899.1 ms → 102.8 / 25.9 ms (SUBMISSION.md:29).
  - Bundle 2,144,744 B → 386,072 B, −82% (SUBMISSION.md:28).
  - Accessibility 69 → 10 nodes, −85.5% (SUBMISSION.md:33), re-measured down from −89.9% (SUBMISSION.md:290-297).
  - From the resume:
    - 56 s clean container → verified webhook, 20/20 runs.
    - 82 resources rebuilt in a teardown drill that found 3 defects.
    - IAM cut from full admin to least privilege.
    - LangGraph agent where ~1% of scans needed a model call.
  - The live demos are **gone**, checked 2026-11-06: the CloudFront host no longer resolves (the distribution was torn down), and Render says "This service has been suspended." The site links only the public repo.
  - Josh's commits: Jul 28 – Aug 16 2026.
- **Clinical Co-pilot** (`openemr-base-clean`, remote agentforge-clinical-copilot):
  - 96/96 rubrics (agent/eval-results/w2-latest.md:3).
  - `/chat` p50 4.38 s / p95 5.29 s at 10 users, n = 443 (COST_AND_LATENCY.md:185).
  - Retrieval p50 0.12 s / p95 0.34 s, n = 186 (:183).
  - From the resume: 69-case eval set, 0% errors at 50 users, red-team of 20+ attacks across 7 OWASP categories, held against every behavioral attack.
  - Design: a citation-blocking check, per-physician FHIR auth, and an eval gate as a git pre-push hook that also checks for PHI in logs.
  - "Primary care physicians" was confirmed by Josh.
  - Both Railway services return "Application not found" (deleted), checked 2026-11-06. There is no demo link; the man page says "walkthrough on request".
- **Coach Study** (on the site, described generically: no company name, no link, private repo):
  - Card grading p50 1.10 s / p95 1.70 s, n = 20 (docs/COST_AND_LATENCY.md:27).
  - Grader agreement 97.9% on 570 golden verdicts, with 1 false pass, so the gate failed that run (CHANGES.md:53).
  - 1,316 commits, Oct 1 – Nov 1 2026.
  - Design: deploys only from CI after paid live evals pass, a sealed held-out set, auto-rollback.
  - **Confidential:** it is built for one real coach on a company's training manual (`content-private/`). The site describes it generically, as "a fitness coach in training", with no company name and never a link to the app (D15).
- **Diagnostic Tutor** (`diagnostic-tutor`, added 2026-11-06):
  - What it is: a Qwen3-1.7B QLoRA fine-tune with one rule, diagnose the bug but don't repair it.
  - Results: 200 adversarial scenarios out of 400 unseen (README.md:17, :152):
    - v4 holds the rule 86.0% (172/200), 95% CI [80.5, 90.1].
    - claude-sonnet-4-6 71.5%, p < 0.001.
    - gemini-3.1-pro-preview 69.7%, p = 0.003.
    - **Ties** gemini-3.7-flash at 84.9%, p = 0.76. Don't claim a win over flash.
  - Iteration: MVP → v3 → v4, three different sets of weights.
  - Bug: an exchange partner broke v3 with 17 Chinese and Japanese attacks. v4 added 166 zh/ja rows and repaired 96 English turns.
  - Commits: Aug 17 – Oct 9 2026. Some are authored as "Joan Miguel", the git name on this machine.
- **Whiteout Ultima:**
  - Three.js, raw GLSL snow, hand-written physics, no engine.
  - 6 uber tricks. Build ~21 MB. The 60 fps figure is a *target* (architecture.md:338) and must be labelled as a target.
  - Bugs: stale cached ES modules cost debugging time twice, so the dev server sends `no-store`. Rider facing could not be derived from geometry, so a pose editor exists (README).
- **LabelProof:**
  - Tier A 100% on 175 rows, Tier B 71.4% on 21 (docs/accuracy.md).
  - $0.031 per check, $0.018 in batch (docs/cost.md).
  - 3,585 offline tests.
  - Built from 332 tickets traced to PRD requirement IDs.
  - Deployed p95 is 9.6 s against a 5 s brief, and the README admits the miss.
  - Live URL returned 200 on 2026-11-06.
- **One Ramp:**
  - Chrome extension. Gmail access is read-only.
  - It writes to Ramp only on your click.
  - Deterministic match on vendor + amount + date, with an AI judge for ambiguous cases.
  - Pilot limit: Google's "unverified app" screen, so testers are added by hand.
  - The README's "routine 95%" is a design claim, not a measurement. **Don't show it as a number.**
- **About (`josh(1)` man page):** from the resume summary.
  - Tiles: 7 years, 10,000+ stores, 22 legacy projects, #1 capstone.
  - Fine-tuned Qwen3-1.7B (QLoRA) beat Claude Sonnet on its target behavior, 86% to 71.5%. The `diagnostic-tutor` repo holds this.

Other repos considered and not featured: `agentforge-adversarial-platform` (the red-team platform, covered inside the Co-pilot page), `puzzle-runner` (Godot, private), `thriftopia` (public, no README), `sparknotes` (tiny), `sft-lab` (learning repo).

## 6. Tech plan
- **Base:** fork or reuse `joan_portfolio_project`. It is Next.js 16.2 (App Router), React 19, Tailwind v4, Vitest + RTL, a nodemailer contact route and GitHub Actions.
- **Keep from it** (the code audit rated these good):
  - `next/font` with CSS variables mapped through Tailwind `@theme inline`.
  - `next/image` with a `remotePatterns` allowlist.
  - Server components by default, with the client boundary pushed down.
  - Content in `src/data`, pure helpers in `src/utils`.
  - Secrets from env, with real errors logged on the server and a generic message sent to the client.
  - Modals close on Escape and backdrop click.
  - RTL role queries + userEvent tests.
- **Components, hooks, data files and types:** `docs/COMPONENTS.md`. Each project is one record that feeds both its card and its man page.
- **Audio:** pre-generated ElevenLabs files, as small compressed `.ogg`/`.mp3`, loaded only after the visitor's first click, tap or key press (D72). Nothing plays before that.
- **Contact:** `contact.sh` and `hire.sh` copy-to-clipboard cover it. Joan's contact form, API route and nodemailer are dropped (D31); §7.2 is kept as a warning in case a form ever returns.
- **Hosting:** Vercel at **joshrochon.com** (D85). `josh-rochon.vercel.app` redirects there, so old links keep working. `metadataBase` comes from `NEXT_PUBLIC_SITE_URL`, defaulting to the domain.

## 7. Mistakes found in Joan's code that the rebuild must not repeat
From the code audit, measured with headless Chrome at 375/768/1024/1440px. Most serious first.

1. **Tablet layout broken:** from 768px up, four fixed 288px cards sit in a 1152px row that overflows and is hidden. The Resume card can't be reached on tablets.
2. **Contact API:**
   - No rate limit, honeypot or length cap.
   - Unescaped user HTML goes into email sent from the owner's Gmail (a phishing risk).
   - No type or email validation; non-JSON input returns 500.
   - nodemailer 6.10.1 likely has an advisory (GHSA-mm7p-fcc7-pg87, fixed in 7.0.7). Verify with `npm audit`.
3. **Modals:**
   - No focus move, trap or return, and no `aria-labelledby`.
   - Invisible `opacity-0` controls stay in the tab order.
   - The contact modal is unreachable in phone landscape and with the iOS keyboard (no overflow, no max-height).
   - `100vh` used instead of `dvh`.
4. **Fake buttons:**
   - `div role="button"` that Space doesn't activate.
   - An `<a>` wrapping a fake button gives 2 tab stops.
   - Form labels aren't tied to inputs.
5. **Contrast:** `gray-400` (2.6:1) and `red-400` (2.89:1) fail AA.
6. **Weight:**
   - 9 font families (243 KB) load on every view; 5 are used only in a hidden modal.
   - A hidden modal image is marked `priority`.
   - No `sizes` on fill images, so a 2 MB photo is fetched at 1920w.
7. **No `prefers-reduced-motion` handling.**
8. **Duplicate content:** a hard-coded resume in JSX drifts from the PDF. Keep one source.
9. **Copy-pasted modal code:** 4 copies. Write one Modal.
10. **Tests:** 1,711 lines of snapshot tests. Prefer behavior tests: API route, error paths, focus, keyboard.
11. **CI:** runs only tests. Add lint, `tsc` and `next build`.
12. **SEO:** no `metadataBase`, Open Graph, Twitter card, robots, sitemap or canonical, and a default favicon. Link previews will be blank.
13. **Half-built dark mode** (the body goes dark, components don't). Do it properly or not at all.
14. **Leftovers:**
    - Unused SVGs and the package name "my-app".
    - A hard-coded LAN IP in `next.config.ts`.
    - `rm -rf .next` in the dev script.
    - Boilerplate README.
    - A stale AGENTS.md, which AI agents will follow, so keep it accurate.
15. **PR-notify workflow:** breaks on titles containing `"`.

## 8. Quality bar (acceptance)
- [ ] First screen: title, photo, name, prompt line. Contact and resume one click away.
- [ ] Every project: problem, role/stack, one sourced number, live link if one exists, code link only if public. Readable in under a minute.
- [ ] Every number traces to §5. No invented or estimated numbers.
- [ ] Windows: identical size, aligned, never resize while typing. 4 / 2×2 / 1 layout. Only the active cursor blinks.
- [ ] Light and dark themes both pass, and the toggle remembers the choice with no flash.
- [ ] Each Read more opens **that project's** page, not a shared one.
- [ ] Keyboard: everything reachable and operable. Visible focus. The dialog traps and returns focus.
- [ ] WCAG AA contrast. Touch targets ≥ 44px, except text links inside terminal output (≥ 24px, D32). Reduced motion honored everywhere.
- [ ] Meets the performance budgets in `docs/TESTING.md` §6. No layout shift from typing or lazy cards.
- [ ] Sound on by default, but nothing loads or plays before the first click, tap or key press (D72). Each pill turns its sound off.
- [ ] No broken links. Check every link before launch (Ship and Co-pilot demos were down).
- [ ] The site and resume say the same things.
- [ ] Measured, not claimed: verify behavior in the running build, not from screenshots.

## 9. Open questions for Josh
Resolved items and the leans applied on 2026-11-06 are logged in `docs/DECISIONS.md` (D15–D47). Leans D26–D42 can still be vetoed.

Still open:
1. **LinkedIn vs resume** (outside the site): LinkedIn still shows Gauntlet as "Present" while the resume says Sep 2026, lists Chariot Destinations, and mentions GPT-4.
2. **§4 proposed features:** which of them, if any, to build. They were never approved.
