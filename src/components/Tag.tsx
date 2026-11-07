export function Tag({ children }: { children: string }) {
  return <span className="rounded-pill border border-border-strong px-3 py-1 font-mono text-2xs text-text-muted">{children}</span>;
}
