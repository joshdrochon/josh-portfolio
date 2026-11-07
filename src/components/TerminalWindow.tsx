"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { TerminalWindowConfig } from "@/data/types";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useSound } from "@/providers/SoundProvider";
import { Button } from "./Button";
import { ShellSession } from "./ShellSession";
import { Window } from "./Window";

const isMouse = (e: { pointerType: string }) => e.pointerType === "mouse";

// One of the four top windows. Shows its finished output, and types only while hovered (or tapped, on touch):
// leaving pauses it mid-line, coming back picks up where it stopped (D69).
export function TerminalWindow({ config }: { config: TerminalWindowConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const { playKey } = useSound();
  const { start, pause, resume, ...view } = useTypewriter({ cmd: config.cmd, lineCount: config.lines.length, onChar: playKey });

  const on = () => {
    setActive(true);
    if (view.typing) resume();
    else start("hover");
  };
  const off = useCallback(() => {
    setActive(false);
    pause();
  }, [pause]);

  // Touch has no "leave": a tap anywhere outside the window counts as leaving it.
  useEffect(() => {
    if (!active) return;
    const away = (e: globalThis.PointerEvent) => !isMouse(e) && !ref.current?.contains(e.target as Node) && off();
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [active, off]);

  const mouse = (fn: () => void) => (e: PointerEvent) => isMouse(e) && fn();
  return (
    <div
      ref={ref}
      onPointerEnter={mouse(on)}
      onPointerLeave={mouse(off)}
      onPointerDown={(e) => !isMouse(e) && on()}
      onFocus={on}
      onBlur={off}
    >
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
