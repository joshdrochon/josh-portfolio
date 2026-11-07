"use client";
import { useRef, useState } from "react";
import type { TerminalWindowConfig } from "@/data/types";
import { useTypeOnView } from "@/hooks/useTypewriter";
import { STAGGER_MS, WINDOW_THRESHOLD } from "@/lib/motion";
import { Button } from "./Button";
import { ShellSession } from "./ShellSession";
import { Window } from "./Window";

// One of the four top windows. Types when it scrolls into view and again on hover or focus.
export function TerminalWindow({ config, index }: { config: TerminalWindowConfig; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const { start, ...view } = useTypeOnView(ref, { cmd: config.cmd, lineCount: config.lines.length, delayMs: index * STAGGER_MS, threshold: WINDOW_THRESHOLD, once: true });

  const on = () => {
    setActive(true);
    start("hover");
  };
  const off = () => setActive(false);

  return (
    <div ref={ref} onMouseEnter={on} onMouseLeave={off} onFocus={on} onBlur={off}>
      <Window
        title={config.title}
        className={`flex h-window flex-col transition motion-reduce:transition-none ${active ? "translate-y-lift shadow-window-hover!" : ""}`}
      >
        <div className="min-h-0 flex-1 overflow-hidden px-4 py-3">
          <ShellSession cmd={config.cmd} lines={config.lines} view={view} trailingPrompt activeCursor={active} />
        </div>
        <Button variant="label" action={config.label} />
      </Window>
    </div>
  );
}
