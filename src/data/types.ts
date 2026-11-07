// Shared content types (docs/COMPONENTS.md §3).
export type Tone = "fg" | "muted" | "green" | "blue" | "amber" | "red" | "purple";

export type Action =
  | { label: string; href: string; icon?: "play" | "arrow" }
  | { label: string; copy: "email"; copiedLabel: string };

// Every rendered number names where it comes from; the data test enforces it.
export type Stat = { source: string } & (
  | { text: string }
  | { from: string; to: string; unit?: string }
  | { ours: string; theirs: string }
  | { error: string } // red, e.g. This Portfolio's RangeError joke
  | { redacted: true }
);

// "code" only for public repos; "model" is allowed for a private repo (D40); "open" is This Portfolio's self-link.
export type ProjectLink = { kind: "play" | "try" | "open" | "code" | "model"; href: string };

type ManSection = { title: string } & ({ paras: string[] } | { bullets: string[] } | { mono: string });

export type ManPageData = {
  slug: string;
  title: string;
  meta: string;
  tiles: { k: string; v: string; source: string }[];
  sections: ManSection[];
  seeAlso?: { label: string; href: string }[];
};

// The terminal-header card shape shared by projects and case studies.
export type CardContent = { cmd: string; stat: Stat; caption: string; tags: string[]; desc: string };

export type Project = {
  slug: string;
  title: string;
  card: CardContent;
  links: ProjectLink[];
  man?: Omit<ManPageData, "slug">;
  lazy?: boolean;
  teaser?: { cmd: string; error: string };
};

export type CaseStudy = CardContent & { title: string; href: string };

export type ExperienceEntry = { dates: string; org: string; role: string; note: string; lane: "now" | "aim" | "client" | "early" };

export type OutputLine = { text: string; tone?: Tone; action?: Action };

export type ShellConfig = { cmd: string; lines: OutputLine[] };

export type TerminalWindowConfig = ShellConfig & {
  id: "projects" | "about" | "contact" | "resume";
  title: string;
  label: Action;
};

export type NavTab = { id: string; label: string };
