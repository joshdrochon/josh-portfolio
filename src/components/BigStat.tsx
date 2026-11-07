import type { Stat } from "@/data/types";

const BARS = [[90, 140], [170, 50], [120]]; /* one-off: redaction-widths */

// The one big number in a card header: plain, before → after, ours vs theirs, an error, or redacted.
export function BigStat({ stat }: { stat: Stat }) {
  if ("redacted" in stat) {
    return (
      <div role="img" aria-label="Redacted text" className="flex flex-col gap-2">
        {BARS.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((w) => (
              <span key={w} style={{ width: w }} className="h-3 rounded-hair bg-term-redact" />
            ))}
          </div>
        ))}
      </div>
    );
  }
  const base = "font-mono text-metric font-bold whitespace-nowrap";
  if ("from" in stat) {
    const to = `${stat.to}${stat.unit ? ` ${stat.unit}` : ""}`;
    return (
      <div className={base}>
        <span aria-hidden="true">
          <s className="text-term-red">{stat.from}</s> <span className="text-term-muted">→</span> <span className="text-term-green">{to}</span>
        </span>
        <span className="sr-only">{`from ${stat.from} to ${to}`}</span>
      </div>
    );
  }
  if ("ours" in stat) {
    return (
      <div className={base}>
        <span className="text-term-green">{stat.ours}</span> <span className="text-term-muted">vs</span> <span className="text-term-red">{stat.theirs}</span>
      </div>
    );
  }
  if ("error" in stat) return <div className={`${base} text-term-red`}>{stat.error}</div>;
  return <div className={`${base} text-term-green`}>{stat.text}</div>;
}
