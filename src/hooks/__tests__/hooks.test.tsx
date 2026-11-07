import { act, render, renderHook } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { observers, setMedia } from "@/test/browser-mocks";
import { useReducedMotion } from "../useReducedMotion";
import { useInView } from "../useInView";
import { useActiveSection } from "../useActiveSection";
import { useTypewriter } from "../useTypewriter";
import { HOVER_COOLDOWN_MS, LINE_TICK_MS, START_DELAY_MS, TICKS_PER_LINE, TYPE_MAX_MS, TYPE_MIN_MS, VIEW_COOLDOWN_MS } from "@/lib/motion";

const REDUCE = "(prefers-reduced-motion: reduce)";
beforeEach(() => setMedia(REDUCE, false));
afterEach(() => vi.useRealTimers());

describe("useReducedMotion", () => {
  it("reflects the media query and updates on change", () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => setMedia(REDUCE, true));
    expect(result.current).toBe(true);
  });
});

function InView({ once, onChange }: { once?: boolean; onChange: (v: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  onChange(useInView(ref, { once }));
  return <div ref={ref} />;
}

describe("useInView", () => {
  it("follows intersection, latches with once, and disconnects on unmount", () => {
    let seen = false;
    const { container, unmount } = render(<InView onChange={(v) => (seen = v)} />);
    const io = observers.at(-1)!;
    act(() => io.fire(container.firstElementChild!, true));
    expect(seen).toBe(true);
    act(() => io.fire(container.firstElementChild!, false));
    expect(seen).toBe(false);
    unmount();
    expect(io.disconnected).toBe(true);

    const latched = render(<InView once onChange={(v) => (seen = v)} />);
    const io2 = observers.at(-1)!;
    act(() => io2.fire(latched.container.firstElementChild!, true));
    act(() => io2.fire(latched.container.firstElementChild!, false));
    expect(seen).toBe(true);
  });

  it("is true when IntersectionObserver is missing", () => {
    const IO = window.IntersectionObserver;
    // @ts-expect-error simulating an old browser
    delete window.IntersectionObserver;
    let seen = false;
    render(<InView onChange={(v) => (seen = v)} />);
    expect(seen).toBe(true);
    window.IntersectionObserver = IO;
  });
});

describe("useActiveSection", () => {
  it("returns the section crossing the middle band", () => {
    document.body.innerHTML = '<section id="home"></section><section id="projects"></section>';
    const { result } = renderHook(() => useActiveSection(["home", "projects"]));
    expect(result.current).toBe("home");
    act(() => observers.at(-1)!.fire(document.getElementById("projects")!, true));
    expect(result.current).toBe("projects");
  });
});

describe("useTypewriter", () => {
  const cmd = "ls";
  const run = (lineCount = 2, onChar = vi.fn()) => renderHook(() => useTypewriter({ cmd, lineCount, onChar }));
  const ticksAfter = (ms: number) => act(() => vi.advanceTimersByTime(ms));

  it("starts complete, then types the command, prints lines, and finishes", () => {
    vi.useFakeTimers();
    const onChar = vi.fn();
    const { result } = run(2, onChar);
    expect(result.current).toMatchObject({ cmdShown: "ls", linesShown: 2, done: true, typing: false });
    act(() => result.current.start("view"));
    expect(result.current).toMatchObject({ cmdShown: "", linesShown: 0, typing: true });
    ticksAfter(START_DELAY_MS);
    expect(result.current.cmdShown).toBe("l");
    ticksAfter(TYPE_MAX_MS);
    expect(result.current.cmdShown).toBe("ls");
    ticksAfter(LINE_TICK_MS);
    expect(result.current.linesShown).toBe(1);
    ticksAfter(LINE_TICK_MS * TICKS_PER_LINE * 2);
    expect(result.current).toMatchObject({ linesShown: 2, done: true, typing: false });
    expect(onChar).toHaveBeenCalledTimes(cmd.length);
  });

  it("pause freezes mid-run and resume continues from the same point (D69)", () => {
    vi.useFakeTimers();
    const { result } = run(2);
    act(() => result.current.start("hover"));
    ticksAfter(START_DELAY_MS);
    expect(result.current.cmdShown).toBe("l");
    act(() => result.current.pause());
    ticksAfter(10_000);
    expect(result.current).toMatchObject({ cmdShown: "l", linesShown: 0, typing: true });
    act(() => result.current.resume());
    ticksAfter(TYPE_MAX_MS);
    expect(result.current.cmdShown).toBe("ls");
    ticksAfter(10_000);
    expect(result.current).toMatchObject({ linesShown: 2, done: true });
  });

  it("keeps every keystroke delay inside the jitter range", () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(globalThis, "setTimeout");
    const { result } = renderHook(() => useTypewriter({ cmd: "abcdefgh", lineCount: 0 }));
    act(() => result.current.start("view"));
    act(() => vi.advanceTimersByTime(START_DELAY_MS + TYPE_MAX_MS * 8));
    const keyDelays = spy.mock.calls.map(([, ms]) => ms as number).slice(1, 8);
    expect(keyDelays).toHaveLength(7);
    keyDelays.forEach((ms) => {
      expect(ms).toBeGreaterThanOrEqual(TYPE_MIN_MS);
      expect(ms).toBeLessThanOrEqual(TYPE_MAX_MS);
    });
  });

  it("ignores start while typing and honours the cooldowns", () => {
    vi.useFakeTimers();
    const { result } = run(0);
    act(() => result.current.start("view"));
    ticksAfter(START_DELAY_MS);
    act(() => result.current.start("hover"));
    expect(result.current.cmdShown).toBe("l");
    ticksAfter(HOVER_COOLDOWN_MS - START_DELAY_MS - 1);
    act(() => result.current.start("hover"));
    expect(result.current.done).toBe(true);
    ticksAfter(1);
    act(() => result.current.start("view"));
    expect(result.current.done).toBe(true);
    ticksAfter(VIEW_COOLDOWN_MS - HOVER_COOLDOWN_MS);
    act(() => result.current.start("view"));
    expect(result.current.typing).toBe(true);
  });

  it("stays complete under reduced motion and leaves no timers on unmount", () => {
    vi.useFakeTimers();
    setMedia(REDUCE, true);
    const { result, unmount } = run();
    act(() => result.current.start("hover"));
    expect(result.current.done).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    setMedia(REDUCE, false);
    act(() => result.current.start("hover"));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
