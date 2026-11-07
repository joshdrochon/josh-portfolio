import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { audio } from "@/test/browser-mocks";
import { SoundProvider, useSound } from "../SoundProvider";

const wrapper = ({ children }: { children: ReactNode }) => <SoundProvider>{children}</SoundProvider>;
const fetchMock = vi.fn(async () => ({ arrayBuffer: async () => new ArrayBuffer(8) }));

beforeEach(() => {
  Object.assign(audio, { created: 0, resumed: 0, started: 0, stopped: 0, gains: [] });
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
  localStorage.clear();
});

const firstClick = () =>
  act(async () => {
    document.body.click();
    await new Promise((r) => setTimeout(r, 0));
  });

describe("SoundProvider", () => {
  it("starts with clicks and music on, but fetches and plays nothing before the first click or key (D72)", () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    expect(result.current).toMatchObject({ clicks: true, music: true });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(audio.created).toBe(0);
    act(() => result.current.playKey());
    expect(audio.started).toBe(0);
  });

  it("the first click anywhere unlocks audio: resumes it, loads the clicks and starts the music", async () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    await firstClick();
    expect(audio.created).toBe(1);
    expect(audio.resumed).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith("/audio/music.mp3");
    expect(fetchMock).toHaveBeenCalledWith("/audio/thock.mp3");
    expect(audio.started).toBe(1);
    act(() => result.current.playKey());
    expect(audio.started).toBe(2);
    expect(localStorage.length).toBe(0);
  });

  it("only the first click unlocks; later clicks start nothing new", async () => {
    renderHook(() => useSound(), { wrapper });
    await firstClick();
    await firstClick();
    expect(audio.created).toBe(1);
    expect(audio.started).toBe(1);
  });

  it("turning music and clicks off before the first click keeps them silent", async () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    await act(async () => result.current.toggleMusic());
    await act(async () => result.current.toggleClicks());
    expect(result.current).toMatchObject({ clicks: false, music: false });
    await firstClick();
    act(() => result.current.playKey());
    expect(audio.started).toBe(0);
  });

  it("music toggles off and back on", async () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    await firstClick();
    await act(async () => result.current.toggleMusic());
    expect(result.current.music).toBe(false);
    expect(audio.stopped).toBe(1);
    await act(async () => result.current.toggleMusic());
    expect(result.current.music).toBe(true);
    expect(audio.started).toBe(2);
  });

  it("mutes the music while the tab is hidden and fades it back in on return (D83)", async () => {
    renderHook(() => useSound(), { wrapper });
    await firstClick();
    const music = audio.gains.at(-1)!;
    const setHidden = (hidden: boolean) => {
      Object.defineProperty(document, "hidden", { value: hidden, configurable: true });
      act(() => void document.dispatchEvent(new Event("visibilitychange")));
    };
    setHidden(true);
    expect(music.setValueAtTime).toHaveBeenLastCalledWith(0, expect.any(Number));
    music.linearRampToValueAtTime.mockClear();
    setHidden(false);
    expect(music.linearRampToValueAtTime).toHaveBeenCalledWith(0.05, expect.any(Number));
  });
});
