import type { ReactNode } from "react";

type Props = { id: string; title: string; subtitle?: string; children: ReactNode };

// A page section with its anchor and centred heading.
export function Section({ id, title, subtitle, children }: Props) {
  return (
    <section id={id} className="mx-auto w-full max-w-content scroll-mt-6 px-6 pb-18">
      <h2 tabIndex={-1} className="text-center font-mono text-h2 font-bold tracking-tight text-text">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-center font-mono text-sm text-text-muted">{subtitle}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}
