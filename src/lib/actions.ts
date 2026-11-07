// Turns a project's links into card buttons and man-page SEE ALSO links (written once, used twice).
import type { Action, ManPageData, Project, ProjectLink } from "@/data/types";

const CARD = { play: "Play now", try: "Try it", open: "Open it", code: "Code", model: "Model" };
const MAN = { play: "play it", try: "try it", open: "open it", code: "code", model: "model on Hugging Face" };
const PRIMARY = new Set<ProjectLink["kind"]>(["play", "try", "open"]);

export function cardActions(p: Project): Action[] {
  const primary = p.links.filter((l) => PRIMARY.has(l.kind)).map((l): Action => ({ label: CARD[l.kind], href: l.href, icon: "play" }));
  const rest = p.links.filter((l) => !PRIMARY.has(l.kind)).map((l): Action => ({ label: CARD[l.kind], href: l.href }));
  return [...primary, ...(p.man ? [{ label: "Read more", href: `#man/${p.slug}` }] : []), ...rest];
}

export const manPages = (projects: Project[]): ManPageData[] =>
  projects.flatMap((p) => (p.man ? [{ slug: p.slug, ...p.man, seeAlso: p.links.map((l) => ({ label: MAN[l.kind], href: l.href })) }] : []));
