"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";
import * as M from "@/lib/motion";

type Options = { cmd: string; lineCount: number; onChar?: () => void };

const COOLDOWN = { view: M.VIEW_COOLDOWN_MS, hover: M.HOVER_COOLDOWN_MS };
const jitter = () => M.TYPE_MIN_MS + Math.random() * (M.TYPE_MAX_MS - M.TYPE_MIN_MS);

// Types `cmd` key by key, then prints `lineCount` lines. Starts complete so nothing is ever empty.
export function useTypewriter({ cmd, lineCount, onChar }: Options) {
  const total = cmd.length + lineCount * M.TICKS_PER_LINE;
  const [tick, setTick] = useState(total);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastRun = useRef(-Infinity);
  const charCb = useRef(onChar);
  useEffect(() => {
    charCb.current = onChar;
  });
  useEffect(() => () => clearTimeout(timer.current), []);

  const typing = tick < total;
  const busy = useRef(false);
  // Stable across renders, so effects can list it as a dependency without re-running per keystroke.
  const start = useCallback(
    (reason: keyof typeof COOLDOWN) => {
      if (reduce || busy.current || Date.now() - lastRun.current < COOLDOWN[reason]) return;
      lastRun.current = Date.now();
      busy.current = true;
      setTick(0);
      const step = (n: number) => {
        if (n <= cmd.length) charCb.current?.();
        setTick(n);
        if (n < total) timer.current = setTimeout(() => step(n + 1), n < cmd.length ? jitter() : M.LINE_TICK_MS);
        else busy.current = false;
      };
      timer.current = setTimeout(() => step(1), M.START_DELAY_MS);
    },
    [reduce, cmd, total],
  );

  return {
    cmdShown: cmd.slice(0, Math.min(tick, cmd.length)),
    linesShown: tick > cmd.length ? Math.min(lineCount, Math.ceil((tick - cmd.length) / M.TICKS_PER_LINE)) : 0,
    typing,
    done: !typing,
    start,
  };
}
