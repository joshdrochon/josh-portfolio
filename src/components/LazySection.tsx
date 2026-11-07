"use client";
import { type ReactNode, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { LAZY_ROOT_MARGIN } from "@/lib/motion";

type Props = { placeholder: ReactNode; className?: string; children: ReactNode };

// Shows a placeholder until the visitor scrolls near it, then mounts its children once (visual deferral, D36).
export function LazySection({ placeholder, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, rootMargin: LAZY_ROOT_MARGIN });
  if (inView) return <>{children}</>;
  return (
    <div ref={ref} className={className}>
      {placeholder}
    </div>
  );
}
