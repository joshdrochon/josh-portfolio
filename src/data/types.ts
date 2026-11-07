// Shared content types (docs/COMPONENTS.md §3). Added as components need them.
export type Action =
  | { label: string; href: string; icon?: "play" | "arrow" }
  | { label: string; copy: "email"; copiedLabel: string };

// Every rendered number names where it comes from; the data test enforces it.
export type Stat = { source: string } & (
  | { text: string }
  | { from: string; to: string; unit?: string }
  | { ours: string; theirs: string }
  | { redacted: true }
);
