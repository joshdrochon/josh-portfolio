"use client";
import { useRef } from "react";
import type { ShellConfig } from "@/data/types";
import { useTypeOnView } from "@/hooks/useTypewriter";
import { ShellSession } from "./ShellSession";

// The page ends on a call to action: `./hire.sh` types itself out when it scrolls into view.
export function HireFooter({ session, copyright }: { session: ShellConfig; copyright: string }) {
  const ref = useRef<HTMLElement>(null);
  const view = useTypeOnView(ref, { cmd: session.cmd, lineCount: session.lines.length });
  return (
    <footer id="contact" ref={ref} className="bg-term px-6 pt-10 pb-18 text-term-text">
      <div className="mx-auto max-w-reading">
        <ShellSession cmd={session.cmd} lines={session.lines} view={view} />
        <p className="mt-6 font-mono text-xs text-term-muted">{copyright}</p>
      </div>
    </footer>
  );
}
