import type { ReactNode } from "react";
import { Cursor, type CursorState } from "./Cursor";

type Props = { children?: ReactNode; cursor?: CursorState };

// The shell prompt: `josh ~ $ <command>`.
export function Prompt({ children, cursor }: Props) {
  return (
    <span>
      <span className="text-term-green">josh</span> <span className="text-term-blue">~</span> $ {children}
      {cursor && <Cursor state={cursor} />}
    </span>
  );
}
