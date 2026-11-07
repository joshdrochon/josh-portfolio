// Turns a project's links into card buttons and man-page SEE ALSO links, with the same labels in both (D77).
import type { Action, ManPageData, Project, ProjectLink } from "@/data/types";

const LABELS: Record<ProjectLink["kind"], string> = { play: "Play now", try: "Try it", open: "Open it", code: "Code", model: "Model" };
const PRIMARY = new Set<ProjectLink["kind"]>(["play", "try", "open"]);

// Primary links (play/try/open) carry the ▶ icon and come first.
function split(p: Project): [Action[], Action[]] {
  const primary = p.links.filter((l) => PRIMARY.has(l.kind)).map((l): Action => ({ label: LABELS[l.kind], href: l.href, icon: "play" }));
  const rest = p.links.filter((l) => !PRIMARY.has(l.kind)).map((l): Action => ({ label: LABELS[l.kind], href: l.href }));
  return [primary, rest];
}

export function cardActions(p: Project): Action[] {
  const [primary, rest] = split(p);
  return [...primary, ...(p.man ? [{ label: "Read more", href: `#man/${p.slug}` }] : []), ...rest];
}

export const manPages = (projects: Project[]): ManPageData[] =>
  projects.flatMap((p) => (p.man ? [{ slug: p.slug, ...p.man, seeAlso: split(p).flat() }] : []));
