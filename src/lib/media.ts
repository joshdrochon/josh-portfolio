// Subscribe to a CSS media query (for useSyncExternalStore).
export const mediaQuery = (query: string) => ({
  matches: () => window.matchMedia(query).matches,
  subscribe: (onChange: () => void) => {
    const m = window.matchMedia(query);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  },
});
