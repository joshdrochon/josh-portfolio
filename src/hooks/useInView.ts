"use client";
import { type RefObject, useEffect, useState } from "react";

type Options = { threshold?: number; rootMargin?: string; once?: boolean };

// True while the element is on screen (or forever after the first time, with `once`).
export function useInView(ref: RefObject<Element | null>, { threshold, rootMargin, once }: Options = {}) {
  // Browsers without IntersectionObserver just show everything.
  const [inView, setInView] = useState(() => typeof window !== "undefined" && typeof IntersectionObserver === "undefined");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && once) io.disconnect();
        if (entry.isIntersecting || !once) setInView(entry.isIntersecting);
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);
  return inView;
}
