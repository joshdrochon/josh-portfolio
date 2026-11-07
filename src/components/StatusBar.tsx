"use client";
import { useSyncExternalStore } from "react";
import type { NavTab } from "@/data/types";
import { useActiveSection } from "@/hooks/useActiveSection";
import { CLOCK_MS } from "@/lib/motion";
import { useSound } from "@/providers/SoundProvider";

const time = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" });
const tick = (onChange: () => void) => {
  const id = setInterval(onChange, CLOCK_MS);
  return () => clearInterval(id);
};

// tmux-style bar stuck to the bottom: section tabs (navigation), Seattle time and sound state.
export function StatusBar({ tabs }: { tabs: NavTab[] }) {
  const active = useActiveSection(tabs.map((t) => t.id));
  const clock = useSyncExternalStore(tick, time, () => "");
  const { clicks, music } = useSound();
  return (
    <nav aria-label="Site sections" className="sticky bottom-0 z-40 flex flex-wrap items-center gap-x-4 border-t border-term-border bg-term px-4 font-mono text-xs text-term-muted">
      <span className="bg-term-green px-2 text-term">[josh]</span>
      {tabs.map((t) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          aria-current={active === t.id ? "location" : undefined}
          className={`flex min-h-touch items-center ${active === t.id ? "text-term-green" : ""}`}
        >
          {t.label}
          {active === t.id && "*"}
        </a>
      ))}
      <span className="ml-auto">
        seattle {clock} · sound {clicks || music ? "on" : "off"}
      </span>
    </nav>
  );
}
