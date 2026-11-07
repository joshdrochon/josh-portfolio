import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setMedia } from "@/test/browser-mocks";
import { getTheme, setTheme, useTheme } from "../theme";

const DARK = "(prefers-color-scheme: dark)";
afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  setMedia(DARK, false);
  vi.restoreAllMocks();
});

describe("theme", () => {
  it("uses the chosen theme, else the OS preference", () => {
    expect(getTheme()).toBe("light");
    setMedia(DARK, true);
    expect(getTheme()).toBe("dark");
    setTheme("light");
    expect(getTheme()).toBe("light");
  });

  it("setTheme sets data-theme and saves it, and survives storage throwing", () => {
    setTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("private mode");
    });
    expect(() => setTheme("light")).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("useTheme follows data-theme changes", async () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("light");
    await act(async () => setTheme("dark"));
    expect(result.current).toBe("dark");
  });
});
