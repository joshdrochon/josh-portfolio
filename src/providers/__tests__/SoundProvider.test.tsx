import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { audio } from "@/test/browser-mocks";
import { SoundProvider, useSound } from "../SoundProvider";

const wrapper = ({ children }: { children: ReactNode }) => <SoundProvider>{children}</SoundProvider>;
const fetchMock = vi.fn(async () => ({ arrayBuffer: async () => new ArrayBuffer(8) }));

beforeEach(() => {
  Object.assign(audio, { created: 0, resumed: 0, started: 0, stopped: 0 });
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
  localStorage.clear();
});

describe("SoundProvider", () => {
  it("starts with everything off, fetches nothing and never autoplays", () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    expect(result.current).toMatchObject({ clicks: false, music: false });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(audio.created).toBe(0);
    act(() => result.current.playKey());
    expect(audio.started).toBe(0);
  });

  it("turning clicks on creates and resumes audio inside the click, loads samples, then plays keys", async () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    await act(async () => result.current.toggleClicks());
    expect(audio.created).toBe(1);
    expect(audio.resumed).toBe(1);
    expect(fetchMock).toHaveBeenCalled();
    act(() => result.current.playKey());
    act(() => result.current.playKey("thock"));
    expect(audio.started).toBe(2);
    expect(localStorage.length).toBe(0);
  });

  it("music starts and stops", async () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    await act(async () => result.current.toggleMusic());
    expect(result.current.music).toBe(true);
    expect(audio.started).toBe(1);
    await act(async () => result.current.toggleMusic());
    expect(result.current.music).toBe(false);
    expect(audio.stopped).toBe(1);
  });
});
