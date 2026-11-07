# Decision log (append-only)

Owns: every decision, reversal and the history behind them. The PRD states only the current state. Add new entries at the bottom of the table; never edit or delete an old one. To reverse a decision, add a new entry that points back to it.

## Background (2026-11-06 design session)
1. **Research:** engineer portfolios. The first ranking scored content only and was wrong on looks; nutlope.com was dropped. It was redone with screenshots. Visual bar: brittanychiang.com (polish), rauno.me (striking type), jhey.dev (playful terminal feel). Files: `docs/research/`.
2. **Base:** Josh's earlier build of Joan's site (clothesline + polaroids) was kept as the layout, with "software engineer pizazz" added.
3. **Terminal windows** replaced the polaroids. The clothesline, sticky note, handwritten fonts and tilts were removed one by one (D2–D6).
4. **Interaction:** hover typing with sound and a blinking cursor; the blink was then limited to the active window (D7–D8).
5. **First creative audit (read-only):** text shown by default, the hover cooldown, the correct `ls` count, the h1 fix, a tracking status bar, a fitting Coach Study command, and the planned features in PRD §4.
6. **Content:** projects filled from the local repos (PRD §5). Experience as a git log. Photo from public LinkedIn.
7. **Second, hands-on creative pass** in Chrome: fixed uneven windows, wrapped captions, the empty Takavay card, every Read more opening Ship, dead window labels, the sticky status-bar highlight, touch typing, the graph line, case-study width and repeated numbers, the dead-end footer and the tablet 3+1 wrap. Built the git graph, `./hire.sh` footer, man-page pager and the sticky status bar.
8. **Doc audit:** contradictions across the planning docs fixed; owner decisions D26–D45 applied as leans.

## Log

| # | Date | Decision | Why / who |
|---|---|---|---|
| D1 | 2026-11-06 | Keep the layout of Joan's site (hero → row of 4 → projects → …), re-themed as a developer terminal | Josh: "we aren't deviating from the layout" |
| D2 | 2026-11-06 | Terminal windows replace the polaroids | Josh |
| D3 | 2026-11-06 | Remove the clothesline and clothespins | Josh: "makes zero sense" |
| D4 | 2026-11-06 | Contact becomes a terminal window, not a sticky note | Josh |
| D5 | 2026-11-06 | No handwritten fonts. JetBrains Mono for UI, Inter for body copy only | Josh: "doesn't fit" |
| D6 | 2026-11-06 | All windows straight, the same size and aligned (no tilt) | Josh |
| D7 | 2026-11-06 | Windows type on hover and on scroll into view, with key-click sound | Josh, plus the audit (touch has no hover) |
| D8 | 2026-11-06 | Only the active window's cursor blinks; idle cursors are hollow | Josh found all-blinking nauseating |
| D9 | 2026-11-06 | Sound off by default, with separate clicks and music toggles; audio from ElevenLabs | Josh |
| D10 | 2026-11-06 | Read more = a man-page dialog per project, including a BUGS section | Creative audit, approved |
| D11 | 2026-11-06 | Experience shown as a `git log --graph`, with Aim as a branch holding client roles; dates from LinkedIn | Josh, audit |
| D12 | 2026-11-06 | Footer `./hire.sh` call to action; sticky tmux status bar as navigation | Hands-on audit, approved |
| D13 | 2026-11-06 | Code link only for public repos | Josh |
| D14 | 2026-11-06 | Lazy-load the later project cards | Josh |
| D15 | 2026-11-06 | Coach Study stays, but never links to its app and is described generically | Josh |
| D16 | 2026-11-06 | Takavay reveals nothing: redaction bars, `Permission denied`, and the declassify idea dropped | Josh |
| D17 | 2026-11-06 | Ship and Co-pilot have no demo links (both deployments are gone) | Checked live 2026-11-06 |
| D18 | 2026-11-06 | Hero `whoami` line names clients; the site says **7 years** (the resume still says 6+, to be aligned) | Josh |
| D19 | 2026-11-06 | Add Diagnostic Tutor with its demo and Hugging Face model links | Josh |
| D20 | 2026-11-06 | LabelProof card shows Tier A only; the man page shows both tiers | Lean, approved |
| D21 | 2026-11-06 | Experience gaps left as they are | Lean, approved |
| D22 | 2026-11-06 | Light/dark mode with a sun/moon toggle, defaulting to the OS setting; terminal surfaces stay dark | Josh |
| D23 | 2026-11-06 | Tokens-only styling; raw values only as named one-offs | Josh: "nothing inconsistent unless truly a one-off" |
| D24 | 2026-11-06 | Least code without hurting readability, checked on every PR (jscpd, knip, size and complexity gates, /simplify) | Josh |
| D25 | 2026-11-06 | Tests are written before each component; guardrails stop overwrites of locked work | Josh |
| D26 | 2026-11-06 | Man pages open through `#man/<slug>` hash links (deep links, back button closes) | Lean, applied 2026-11-06, Josh may veto |
| D27 | 2026-11-06 | Man page uses the native `<dialog>` with `showModal()` | Lean, applied 2026-11-06, Josh may veto |
| D28 | 2026-11-06 | Each copy button shows its own `✓ copied` (no shared flag) | Lean, applied 2026-11-06, Josh may veto |
| D29 | 2026-11-06 | Layout uses CSS grid with container queries, not the mockup's flex-basis formula | Lean, applied 2026-11-06, Josh may veto |
| D30 | 2026-11-06 | Card big number and man-page tile stay two strings, each with its own `source` | Lean, applied 2026-11-06, Josh may veto |
| D31 | 2026-11-06 | Drop Joan's contact form, API route and nodemailer; copy-to-clipboard covers contact | Lean, applied 2026-11-06, Josh may veto |
| D32 | 2026-11-06 | Touch targets ≥44px everywhere (incl. status-bar tabs, dialog close); only text links inside terminal output may be 24px (WCAG 2.2 AA minimum) | Lean, applied 2026-11-06, Josh may veto |
| D33 | 2026-11-06 | Scroll-into-view retype cooldown is 5s (hover stays 3s) | Lean, applied 2026-11-06, Josh may veto |
| D34 | 2026-11-06 | Theme toggle has a fixed label "Dark mode" plus `aria-pressed` | Lean, applied 2026-11-06, Josh may veto |
| D35 | 2026-11-06 | Closing a man page drops the hash with `history.replaceState`; focus returns to the opener, or to the `#projects` heading on a deep link | Lean, applied 2026-11-06, Josh may veto |
| D36 | 2026-11-06 | Lazy cards are a visual deferral only; their data still ships with the page; no `next/dynamic` for man-page data | Lean, applied 2026-11-06, Josh may veto |
| D37 | 2026-11-06 | "sound by ElevenLabs" joins the © line only when the audio ships | Lean, applied 2026-11-06, Josh may veto |
| D38 | 2026-11-06 | Sound and music choices are not remembered; both off on every load | Lean, applied 2026-11-06, Josh may veto |
| D39 | 2026-11-06 | Status-bar sound text is plain text (not clickable); theme isn't shown there | Lean, applied 2026-11-06, Josh may veto |
| D40 | 2026-11-06 | Diagnostic Tutor's Hugging Face `Model` link is allowed although its repo is private (exception to D13) | Lean, applied 2026-11-06, Josh may veto |
| D41 | 2026-11-06 | Man-page dialog is labelled by the NAME line text, not the word "NAME" | Lean, applied 2026-11-06, Josh may veto |
| D42 | 2026-11-06 | Fonts: JetBrains Mono 400/700, Inter 400/600 | Lean, applied 2026-11-06, Josh may veto |
| D43 | 2026-11-06 | One kebab-case slug per project everywhere (PRD §5 table); About's slug is `josh` | Doc audit fix |
| D44 | 2026-11-06 | `ls projects/` shows the first 4 slugs in page order; Takavay is last and spans the full row at every width | Doc audit fix |
| D45 | 2026-11-06 | Mockup values normalized onto the token scale (name 20px, man paragraphs 14px, hero prompt 13px muted, tag padding 4/12, button gaps 8, case-study padding 72) | Doc audit fix |
| D46 | 2026-11-06 | Years aligned: resume "7+ years", cover letter "over seven years", site "7 yrs" (closes the open item in D18) | Josh |
| D47 | 2026-11-06 | Host on Vercel at `josh-rochon.vercel.app`; buy a custom domain later if wanted | Josh |
| D48 | 2026-11-06 | No hidden "type keyblaster" shortcut. The KeyBlaster card's Play button is the only way in. PRD §4 relabeled "proposed, not approved" | Josh: "not wanted" |
| D49 | 2026-11-06 | Add a "This Portfolio" card with a recursion/stack-overflow joke, beside Takavay in the last row (Takavay no longer spans the full row; replaces that part of D44) | Josh |
| D50 | 2026-11-06 | KeyBlaster is desktop only: "Desktop only" tag, and no Play link on touch devices | Josh |
| D51 | 2026-11-06 | Typing animation is hidden from screen readers; the final text is read once | Lean, approved |
| D52 | 2026-11-06 | Terminal-style link preview image and `>_` icon set (design/brand/) | Lean, approved |
| D53 | 2026-11-06 | Vercel Web Analytics (cookieless) | Josh |
| D54 | 2026-11-06 | Generate sound with ElevenLabs using the existing key from keyblaster/.env; never commit the key | Josh |
| D55 | 2026-11-06 | Read more stays a pop-up dialog with a shareable hash link; no per-project pages | Lean, approved |
| D56 | 2026-11-06 | Takavay copy drops "commits are landing every week" (unverified claim) | Lean, applied; Josh may veto |
| D57 | 2026-11-06 | First-load JS budget 200 KB gzipped (measured empty-page baseline 186 KB: React 19 + Next.js runtime). The 90 KB target was unreachable on Next.js | Measured; Josh may change the number |
| D58 | 2026-11-06 | One-offs must use a key from `design/one-offs.json`; free-text one-off comments are rejected by lint | /simplify review |
| D59 | 2026-11-06 | Vercel Analytics renders only on Vercel (`process.env.VERCEL`), so local and CI runs have no 404 | /simplify review |
| D60 | 2026-11-06 | First-load JS limit raised to 220 KB: the full page measured 205.5 KB (React + Next runtime ≈186 KB, our components ≈19 KB). Applies the earlier 220 KB lean | Josh: "keep going, you don't need me" |
| D61 | 2026-11-06 | The lazy section's observer margin reaches far above the screen, so a section already scrolled past (fast scroll, anchor jump) still loads | Found by e2e |
| D62 | 2026-11-06 | BigStat gains an `error` (red) variant for This Portfolio's RangeError; edited a locked file | Josh: "keep going, you don't need me" |
| D63 | 2026-11-06 | `ls projects/` shows the first 3 slugs, then "+ N more" (replaces "first 4" in D44): "clinical-copilot/" made the second line too wide for the window | Found in screenshot review |
| D64 | 2026-11-06 | Global focus ring lives in `@layer base` so component utilities can override it (the man page body showed a stray outline) | Found in screenshot review |
| D65 | 2026-11-06 | Lighthouse CI uses real (devtools) throttling, not the simulated estimate. Simulated mobile LCP was 2.9 s; real Chrome on the same slow-4G + 4x CPU profile paints the LCP element (the photo) at 0.64–1.45 s. Budgets unchanged | Measured |
| D66 | 2026-11-06 | Music is a 3-minute ElevenLabs track (same prompt) with a 3 s crossfade at the loop point, at -18.4 LUFS (old track -16.9). The old 60 s track ended in ~8 s of near-silence, which sounded broken on loop | Josh |
| D67 | 2026-11-06 | Hero photo is the 800 px LinkedIn original (was 200 px, blurry at 288 px display) | Josh |
| D68 | 2026-11-06 | Hero windows type on scroll-in only the first time; afterwards only hover or focus retypes them (replaces the 5 s scroll retype in D33) | Josh: scrolling up set them all off |
| D69 | 2026-11-06 | Hero windows never type on their own: they type only while hovered or focused, pause on leave and resume where they stopped; on touch a tap acts as hover and a tap elsewhere pauses (replaces D7's scroll typing and D68) | Josh; tap = hover chosen by Josh |
| D70 | 2026-11-06 | Hero photo gets CRT scanlines, a green vignette and glow, all cleared on hover | Josh picked "scanline glow" |
| D71 | 2026-11-06 | Terminal surfaces (windows, cards, man page) stay dark in light mode, confirming D22 | Josh |
