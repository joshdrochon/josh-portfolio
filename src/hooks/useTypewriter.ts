"use client";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useSound } from "@/providers/SoundProvider";
import { useInView } from "./useInView";
import { useReducedMotion } from "./useReducedMotion";
import * as M from "@/lib/motion";

type Options = { cmd: string; lineCount: number; onChar?: (ch: string) => void };
export type TypewriterView = { cmdShown: string; linesShown: number; typing: boolean };

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
  const running = useRef(false);
  const run = useCallback(
    (from: number, delay: number) => {
      running.current = true;
      const step = (n: number) => {
        if (n <= cmd.length) charCb.current?.(cmd[n - 1]);
        setTick(n);
        if (n < total) timer.current = setTimeout(() => step(n + 1), n < cmd.length ? jitter() : M.LINE_TICK_MS);
        else running.current = false;
      };
      timer.current = setTimeout(() => step(from), delay);
    },
    [cmd, total],
  );
  // Stable across renders, so effects can list them as dependencies without re-running per keystroke.
  // Restarts from empty, unless it is already running or ran in the last HOVER_COOLDOWN_MS.
  const start = useCallback(() => {
    if (reduce || running.current || Date.now() - lastRun.current < M.HOVER_COOLDOWN_MS) return;
    lastRun.current = Date.now();
    setTick(0);
    run(1, M.START_DELAY_MS);
  }, [reduce, run]);
  const pause = useCallback(() => {
    clearTimeout(timer.current);
    running.current = false;
  }, []);
  const resume = () => {
    if (!running.current && tick < total) run(tick + 1, 0);
  };

  return {
    cmdShown: cmd.slice(0, Math.min(tick, cmd.length)),
    linesShown: tick > cmd.length ? Math.min(lineCount, Math.ceil((tick - cmd.length) / M.TICKS_PER_LINE)) : 0,
    typing,
    start,
    pause,
    resume,
  };
}

// Types once when the element first scrolls into view, with a key click per character (the hire.sh footer).
export function useTypeOnView(ref: RefObject<Element | null>, { cmd, lineCount }: { cmd: string; lineCount: number }) {
  const { playKey } = useSound();
  const inView = useInView(ref, { once: true });
  const typewriter = useTypewriter({ cmd, lineCount, onChar: playKey });
  const { start } = typewriter;
  useEffect(() => {
    if (inView) start();
  }, [inView, start]);
  return typewriter;
}
