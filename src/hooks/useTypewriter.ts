"use client";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useSound } from "@/providers/SoundProvider";
import { useInView } from "./useInView";
import { useReducedMotion } from "./useReducedMotion";
import * as M from "@/lib/motion";

type Options = { cmd: string; lineCount: number; onChar?: () => void };
export type TypewriterView = { cmdShown: string; linesShown: number; typing: boolean; done: boolean };

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
  const running = useRef(false);
  const at = useRef(total); // last tick shown, so resume() knows where to pick up
  const run = useCallback(
    (from: number, delay: number) => {
      running.current = true;
      const step = (n: number) => {
        if (n <= cmd.length) charCb.current?.();
        at.current = n;
        setTick(n);
        if (n < total) timer.current = setTimeout(() => step(n + 1), n < cmd.length ? jitter() : M.LINE_TICK_MS);
        else running.current = false;
      };
      timer.current = setTimeout(() => step(from), delay);
    },
    [cmd, total],
  );
  // Stable across renders, so effects can list them as dependencies without re-running per keystroke.
  const start = useCallback(
    (reason: keyof typeof COOLDOWN) => {
      if (reduce || running.current || Date.now() - lastRun.current < COOLDOWN[reason]) return;
      lastRun.current = Date.now();
      at.current = 0;
      setTick(0);
      run(1, M.START_DELAY_MS);
    },
    [reduce, run],
  );
  const pause = useCallback(() => {
    clearTimeout(timer.current);
    running.current = false;
  }, []);
  const resume = useCallback(() => {
    if (!running.current && at.current < total) run(at.current + 1, 0);
  }, [run, total]);

  return {
    cmdShown: cmd.slice(0, Math.min(tick, cmd.length)),
    linesShown: tick > cmd.length ? Math.min(lineCount, Math.ceil((tick - cmd.length) / M.TICKS_PER_LINE)) : 0,
    typing,
    done: !typing,
    start,
    pause,
    resume,
  };
}

type ViewOptions = { cmd: string; lineCount: number; delayMs?: number; threshold?: number; once?: boolean };

// Types when the element scrolls into view (after `delayMs`), with a key click per character.
export function useTypeOnView(ref: RefObject<Element | null>, { cmd, lineCount, delayMs = 0, ...inViewOptions }: ViewOptions) {
  const { playKey } = useSound();
  const inView = useInView(ref, inViewOptions);
  const typewriter = useTypewriter({ cmd, lineCount, onChar: playKey });
  const { start } = typewriter;
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => start("view"), delayMs);
    return () => clearTimeout(t);
  }, [inView, delayMs, start]);
  return typewriter;
}
