// Site-wide copy and links (docs/COMPONENTS.md §3). Written once, used everywhere.
import type { NavTab, ShellConfig, TerminalWindowConfig } from "./types";
import { projects } from "./projects";

export const EMAIL = "joshdrochon@gmail.com";
export const LINKS = {
  linkedin: "https://www.linkedin.com/in/josh-rochon",
  github: "https://github.com/joshdrochon",
  resume: "/resume.pdf",
};

export const hero = {
  title: "Senior Software Engineer",
  name: "Josh Rochon",
  prompt: "shipping reliable software from Seattle",
  whoami: "Senior SWE · 7 yrs · Starbucks · Microsoft · BECU · Gauntlet AI",
};

// `ls projects/`: the first three slugs (all that fit the window), then a count of the rest (PRD §3.3, D63).
const [a, b, c] = projects.map((p) => `${p.slug}/`);

export const windows: TerminalWindowConfig[] = [
  {
    id: "projects",
    title: "~/projects",
    cmd: "ls projects/",
    lines: [{ text: `${a}  ${b}`, tone: "amber" }, { text: c, tone: "amber" }, { text: `+ ${projects.length - 3} more`, tone: "muted" }],
    label: { label: "Projects", href: "#projects" },
  },
  {
    id: "about",
    title: "about.md",
    cmd: "cat about.md",
    lines: [{ text: "# Josh Rochon", tone: "blue" }, { text: "Senior Software Engineer" }, { text: "Seattle · 7 years", tone: "muted" }],
    label: { label: "About Me", href: "#man/josh" },
  },
  {
    id: "contact",
    title: "contact.sh",
    cmd: "./contact.sh",
    lines: [
      { text: "", action: { label: "> linkedin", href: LINKS.linkedin } },
      { text: "", action: { label: "> github", href: LINKS.github } },
      { text: "", action: { label: "> email", copy: "email", copiedLabel: "✓ copied" } },
    ],
    label: { label: "Contact", copy: "email", copiedLabel: "✓ copied" },
  },
  {
    id: "resume",
    title: "resume.pdf",
    cmd: "open resume.pdf",
    lines: [{ text: "opening resume.pdf ...", tone: "green" }, { text: "2 pages · updated Nov 2026", tone: "muted" }],
    label: { label: "Resume", href: LINKS.resume },
  },
];

export const hire: ShellConfig = {
  cmd: "./hire.sh",
  lines: [
    { text: "", action: { label: `> ${EMAIL}`, copy: "email", copiedLabel: `✓ copied ${EMAIL}` } },
    { text: "", action: { label: "> linkedin.com/in/josh-rochon", href: LINKS.linkedin } },
    { text: "", action: { label: "> resume.pdf", href: LINKS.resume } },
    { text: "open to senior software engineering roles", tone: "green" },
  ],
};

export const copyright = "© 2026 Josh Rochon · built with Next.js";

export const navTabs: NavTab[] = [
  { id: "home", label: "0:home" },
  { id: "projects", label: "1:projects" },
  { id: "experience", label: "2:experience" },
  { id: "case-studies", label: "3:case-studies" },
  { id: "contact", label: "4:contact" },
];
