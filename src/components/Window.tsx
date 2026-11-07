import type { ReactNode } from "react";

type Props = { title: ReactNode; actions?: ReactNode; className?: string; children: ReactNode };

const DOTS = ["bg-dot-close", "bg-dot-min", "bg-dot-max"];

// macOS-style terminal window chrome, reused by every terminal surface on the page.
export function Window({ title, actions, className = "", children }: Props) {
  return (
    <div className={`overflow-hidden rounded-window border border-window-outline bg-term text-term-text shadow-window ${className}`}>
      <div className="flex items-center gap-2 border-b border-term-border bg-term-chrome px-3 py-3 font-mono text-2xs text-term-muted">
        <span aria-hidden="true" className="flex flex-1 gap-2">
          {DOTS.map((bg) => (
            <span key={bg} className={`size-dot rounded-round ${bg}`} />
          ))}
        </span>
        <span className="truncate text-center">{title}</span>
        <span className="flex flex-1 justify-end">{actions}</span>
      </div>
      {children}
    </div>
  );
}
