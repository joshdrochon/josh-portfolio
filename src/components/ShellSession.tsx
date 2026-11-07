import type { OutputLine, Tone } from "@/data/types";
import type { TypewriterView } from "@/hooks/useTypewriter";
import { Button } from "./Button";
import { Prompt } from "./Prompt";

type Props = { cmd: string; lines: OutputLine[]; view: TypewriterView; trailingPrompt?: boolean; activeCursor?: boolean };

const TONE: Record<Tone, string> = {
  fg: "text-term-text",
  muted: "text-term-muted",
  green: "text-term-green",
  blue: "text-term-blue",
  amber: "text-term-amber",
  red: "text-term-red",
  purple: "text-term-purple",
};

// A command being typed, then its output. Screen readers get the command once, not letter by letter (D51).
export function ShellSession({ cmd, lines, view, trailingPrompt, activeCursor }: Props) {
  const idle = activeCursor ? "active" : "idle";
  return (
    <div className="font-mono text-sm leading-term">
      <div>
        <span className="sr-only">{cmd}</span>
        <span aria-hidden="true">
          <Prompt cursor={view.typing ? "typing" : undefined}>{view.cmdShown}</Prompt>
        </span>
      </div>
      {lines.slice(0, view.linesShown).map((l, i) =>
        l.action ? (
          <div key={i}>
            <Button variant="link" action={l.action} />
          </div>
        ) : (
          <div key={i} className={`whitespace-pre ${TONE[l.tone ?? "fg"]}`}>
            {l.text}
          </div>
        ),
      )}
      {!view.typing && trailingPrompt && <Prompt cursor={idle} />}
    </div>
  );
}
