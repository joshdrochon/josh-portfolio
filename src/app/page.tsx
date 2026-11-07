import Image from "next/image";
import { Card } from "@/components/Card";
import { Controls } from "@/components/Controls";
import { Cursor } from "@/components/Cursor";
import { GitGraph } from "@/components/GitGraph";
import { HireFooter } from "@/components/HireFooter";
import { LazySection } from "@/components/LazySection";
import { ManPage } from "@/components/ManPage";
import { Prompt } from "@/components/Prompt";
import { Section } from "@/components/Section";
import { StatusBar } from "@/components/StatusBar";
import { TerminalWindow } from "@/components/TerminalWindow";
import { Button } from "@/components/Button";
import { Window } from "@/components/Window";
import { caseStudies } from "@/data/case-studies";
import { experience } from "@/data/experience";
import { projects, aboutPage } from "@/data/projects";
import { copyright, hero, hire, LINKS, navTabs, windows } from "@/data/site";
import type { Project } from "@/data/types";
import { cardActions, manPages } from "@/lib/actions";

// The grid has 6 tracks: a card takes 3 on tablet (2 per row) and 2 on desktop (3 per row).
// Cards in a short last row stretch to fill it.
const n = projects.length;
const inShortRow = (i: number, perRow: number) => i >= n - (n % perRow);
const tablet = (i: number) => (inShortRow(i, 2) ? "md:col-span-6" : "md:col-span-3");
const desktop = (i: number) => (!inShortRow(i, 3) ? "lg:col-span-2" : n % 3 === 1 ? "lg:col-span-6" : "lg:col-span-3");

const projectCard = (p: Project, i: number) => (
  <Card key={p.slug} {...p.card} title={p.title} actions={cardActions(p)} className={`col-span-6 ${tablet(i)} ${desktop(i)}`}>
    {p.teaser && (
      <div className="rounded-tile bg-term px-3 py-3 font-mono text-xs leading-term text-term-text">
        <Prompt>{p.teaser.cmd}</Prompt>
        <div className="text-term-red">{p.teaser.error}</div>
      </div>
    )}
  </Card>
);

const cards = projects.map(projectCard);
const firstLazy = projects.findIndex((p) => p.lazy);

export default function Home() {
  return (
    <div className="relative">
      <Controls />
      <main>
        <section id="home" className="flex flex-col items-center px-6 pt-22 pb-4 text-center">
          <p className="mb-7 font-mono text-display leading-tight font-bold tracking-tight text-text">{hero.title}</p>
          <span className="photo-crt">
            <Image src="/josh.jpg" alt={hero.name} width={288} height={288} priority className="block size-photo rounded-round object-cover" />
          </span>
          <h1 className="mt-6 font-mono text-xl font-bold text-text">{hero.name}</h1>
          <p className="mt-2 font-mono text-sm text-text-muted">
            <span className="text-accent">$</span> {hero.prompt}
            <Cursor state="solid" tone="page" />
          </p>
          <p className="mt-2 font-mono text-sm text-text-muted">{hero.whoami}</p>
        </section>

        <section aria-label="Quick links" className="mx-auto grid max-w-row grid-cols-1 gap-7 px-6 pt-6 pb-18 sm:grid-cols-2 lg:grid-cols-4">
          {windows.map((w) => (
            <TerminalWindow key={w.id} config={w} />
          ))}
        </section>

        <Section id="projects" title="Projects">
          <div className="grid grid-cols-6 gap-8">
            {cards.slice(0, firstLazy)}
            <LazySection
              className="col-span-full grid grid-cols-subgrid gap-8"
              placeholder={
                <div className="col-span-full mx-auto max-w-card rounded-card bg-term px-4 py-3 font-mono text-sm text-term-text">
                  <Prompt cursor="solid">loading {n - firstLazy} more projects</Prompt>
                </div>
              }
            >
              {cards.slice(firstLazy)}
            </LazySection>
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <Window title="~/career" className="mx-auto max-w-reading">
            <div className="px-6 pt-5 pb-6 font-mono text-sm leading-body">
              <div className="mb-3">
                <Prompt>git log --graph --career</Prompt>
              </div>
              <GitGraph entries={experience} />
              <div className="mt-4">
                <Button variant="term" action={{ label: "open resume.pdf", href: LINKS.resume }} />
              </div>
            </div>
          </Window>
        </Section>

        <Section id="case-studies" title="Case Studies" subtitle="written by me, published by Aim Consulting">
          <div className="grid gap-8 md:grid-cols-2">
            {caseStudies.map(({ href, ...c }) => (
              <Card key={c.title} {...c} headerSize="sm" actions={[{ label: "Read case study", href, icon: "arrow" }]} />
            ))}
          </div>
        </Section>
      </main>
      <HireFooter session={hire} copyright={copyright} />
      <StatusBar tabs={navTabs} />
      <ManPage pages={[aboutPage, ...manPages(projects)]} />
    </div>
  );
}
