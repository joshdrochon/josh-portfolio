import type { ReactNode } from "react";
import type { Action, CardContent } from "@/data/types";
import { BigStat } from "./BigStat";
import { Button } from "./Button";
import { Tag } from "./Tag";

type Props = CardContent & {
  title: string;
  actions: Action[];
  headerSize?: "lg" | "sm";
  className?: string;
  children?: ReactNode;
};

const LINE = "truncate font-mono text-xs text-term-muted";

// One card for every project and case study: a terminal header with one number, then the write-up.
export function Card({ cmd, stat, caption, tags, title, desc, actions, headerSize = "lg", className = "", children }: Props) {
  return (
    <article className={`flex min-w-0 flex-col overflow-hidden rounded-card border border-border bg-surface ${className}`}>
      <div className={`flex flex-col justify-between bg-term px-5 py-4 ${headerSize === "lg" ? "h-card-header" : "h-case-header"}`}>
        <div className={LINE}>{cmd}</div>
        <BigStat stat={stat} />
        <div className={LINE}>{caption}</div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <h3 className="font-mono text-xl leading-tight font-bold text-text">{title}</h3>
        <p className="text-md leading-body text-text-muted">{desc}</p>
        {children}
        <div className="mt-auto flex flex-wrap gap-3 pt-1">
          {actions.map((a) => (
            <Button key={a.label} action={a} variant={"icon" in a && a.icon === "play" ? "primary" : "secondary"} />
          ))}
        </div>
      </div>
    </article>
  );
}
