import type { ExperienceEntry } from "@/data/types";

const DOT: Record<ExperienceEntry["lane"], string> = {
  now: "bg-term-green",
  aim: "bg-term-blue",
  client: "bg-term-blue",
  early: "bg-term-purple",
};

function Commit({ e }: { e: ExperienceEntry }) {
  return (
    <div className="relative py-2 pl-6">
      <span aria-hidden="true" className={`absolute top-4 -left-2 size-3 rounded-round ring-3 ring-term ${DOT[e.lane]}`} />
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5">
        <span className="text-term-amber">{e.dates}</span>
        <span className="font-bold text-term-bright">{e.org}</span>
        <span className="text-term-blue">{e.role}</span>
        <span className="basis-full text-term-muted">{e.note}</span>
      </div>
    </div>
  );
}

// Work history drawn as `git log --graph`: one trunk, with Aim's clients on their own branch.
export function GitGraph({ entries }: { entries: ExperienceEntry[] }) {
  const clients = entries.filter((e) => e.lane === "client");
  return (
    <ul className="ml-2 border-l-2 border-term-redact">
      {entries
        .filter((e) => e.lane !== "client")
        .map((e) => (
          <li key={e.org}>
            <Commit e={e} />
            {e.lane === "aim" && (
              <ul className="mb-2 ml-6 rounded-bl-window border-l-2 border-term-blue">
                {clients.map((c) => (
                  <li key={c.org}>
                    <Commit e={c} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
    </ul>
  );
}
