"use client";
import { useSyncExternalStore } from "react";
import { mediaQuery } from "./media";
import { THEME_KEY as KEY } from "./theme-script";

export type Theme = "light" | "dark";
const osDark = mediaQuery("(prefers-color-scheme: dark)");
const root = () => document.documentElement;

// data-theme already holds the saved choice (themeScript copies it there before paint).
export const getTheme = (): Theme => (root().dataset.theme as Theme | undefined) ?? (osDark.matches() ? "dark" : "light");

export function setTheme(t: Theme) {
  root().dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    // private mode: the choice lasts for this page only
  }
}

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  const offMedia = osDark.subscribe(onChange);
  return () => {
    mo.disconnect();
    offMedia();
  };
}

// null on the server, so aria-pressed is filled in after hydration without a mismatch.
export const useTheme = (): Theme | null => useSyncExternalStore(subscribe, getTheme, () => null);
