export type CursorState = "idle" | "active" | "typing" | "solid";

type Props = { state: CursorState; tone?: "term" | "page" };

// Block cursor. Idle = hollow and still (unfocused terminal); active = solid and blinking.
export function Cursor({ state, tone = "term" }: Props) {
  const hollow = state === "idle";
  const fill = tone === "page" ? "bg-text" : "bg-term-text";
  return (
    <span
      aria-hidden="true"
      className={`ml-0.5 inline-block h-cursor-h w-cursor-w align-text-bottom ${hollow ? "shadow-cursor-hollow" : fill} ${state === "active" ? "motion-safe:animate-blink" : ""}`}
    />
  );
}
