"use client";
import { useEffect, useState } from "react";
import { ACTIVE_SECTION_MARGIN } from "@/lib/motion";

// Id of the section crossing the middle of the viewport (drives the status bar).
export function useActiveSection(ids: string[], rootMargin = ACTIVE_SECTION_MARGIN) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join();
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin });
    key.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key, rootMargin]);
  return active;
}
