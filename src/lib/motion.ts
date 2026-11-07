// The only home of JS timing constants (docs/COMPONENTS.md §4). CSS motion lives in design/tokens.css.
export const TYPE_MIN_MS = 45; // fastest keystroke
export const TYPE_MAX_MS = 120; // slowest keystroke
export const LINE_TICK_MS = 55; // one tick while printing output
export const TICKS_PER_LINE = 4; // ticks between output lines
export const START_DELAY_MS = 120; // pause before the first keystroke
export const HOVER_COOLDOWN_MS = 3000; // min gap before a finished window retypes
export const COPY_RESET_MS = 2500; // "✓ copied" shows this long
export const CLOCK_MS = 30000; // status-bar clock refresh
// Top margin reaches far above the screen, so a section already scrolled past (fast scroll, anchor jump) still loads.
export const LAZY_ROOT_MARGIN = "10000% 0% 0%"; /* one-off: lazy-margin */
export const ACTIVE_SECTION_MARGIN = "-45% 0% -50% 0%";
