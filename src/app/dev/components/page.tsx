import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BigStat } from "@/components/BigStat";
import { Button } from "@/components/Button";
import { Cursor } from "@/components/Cursor";
import { Prompt } from "@/components/Prompt";
import { Tag } from "@/components/Tag";
import { TogglePill } from "@/components/TogglePill";
import { Window } from "@/components/Window";

// Every component state, for screenshot baselines (docs/TESTING.md §5). Returns 404 unless SHOW_GALLERY=1.

const Row = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="font-mono text-xs text-text-muted">{title}</h2>
    <div className="flex flex-wrap items-center gap-4">{children}</div>
  </section>
);

const noop = async () => {
  "use server";
};

export default function Gallery() {
  if (process.env.SHOW_GALLERY !== "1") notFound();
  return (
    <main className="mx-auto flex max-w-content flex-col gap-10 p-6 font-mono">
      <h1 className="text-xl font-bold text-text">Component gallery</h1>
      <Row title="Window + Prompt + Cursor">
        <Window title="~/projects" className="w-full max-w-card">
          <div className="flex flex-col p-4 text-sm leading-term">
            {(["idle", "active", "typing", "solid"] as const).map((s) => (
              <Prompt key={s} cursor={s}>
                cursor {s}
              </Prompt>
            ))}
            <span>
              page cursor <Cursor state="solid" tone="page" />
            </span>
          </div>
        </Window>
      </Row>
      <Row title="Tag">
        {["TypeScript", "Desktop only", "#1 capstone"].map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </Row>
      <Row title="Button (page)">
        <Button variant="primary" action={{ label: "Play now", href: "#", icon: "play" }} />
        <Button variant="secondary" action={{ label: "Read more", href: "#" }} />
        <Button variant="secondary" action={{ label: "Read case study", href: "#", icon: "arrow" }} />
      </Row>
      <Row title="Button (terminal)">
        <Window title="contact.sh" className="w-full max-w-card">
          <div className="flex flex-col items-start p-4 text-sm">
            <Button variant="link" action={{ label: "> linkedin", href: "#" }} />
            <Button variant="link" action={{ label: "> email", copy: "email", copiedLabel: "✓ copied" }} />
            <Button variant="term" action={{ label: "code", href: "#" }} />
            <Button variant="label" action={{ label: "Contact", href: "#" }} />
          </div>
        </Window>
      </Row>
      <Row title="TogglePill">
        <TogglePill pressed={false} onToggle={noop} icon="speaker" label="clicks: off" />
        <TogglePill pressed={true} onToggle={noop} icon="note" label="music: on" />
        <TogglePill pressed={null} onToggle={noop} icon="theme" ariaLabel="Dark mode" />
      </Row>
      <Row title="BigStat">
        <div className="flex w-full flex-col gap-4 rounded-card bg-term p-5">
          <BigStat stat={{ text: "4,500+ tests", source: "gallery" }} />
          <BigStat stat={{ from: "1,276", to: "103", unit: "ms", source: "gallery" }} />
          <BigStat stat={{ ours: "86%", theirs: "71.5%", source: "gallery" }} />
          <BigStat stat={{ redacted: true, source: "gallery" }} />
        </div>
      </Row>
    </main>
  );
}
