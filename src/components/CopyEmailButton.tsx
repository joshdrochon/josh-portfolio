"use client";
import { EMAIL } from "@/data/site";
import { useCopyEmail } from "@/hooks/useCopyEmail";

type Props = { label: string; copiedLabel: string; className?: string };

// Each button keeps its own copied state (D28) and announces the copy politely.
export function CopyEmailButton({ label, copiedLabel, className }: Props) {
  const { copied, copy } = useCopyEmail();
  return (
    <>
      <button type="button" onClick={copy} className={className}>
        {copied ? copiedLabel : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `Copied ${EMAIL}` : ""}
      </span>
    </>
  );
}
