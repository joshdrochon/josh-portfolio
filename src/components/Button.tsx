import type { Action } from "@/data/types";
import { CopyEmailButton } from "./CopyEmailButton";

type Variant = "primary" | "secondary" | "term" | "link" | "label";
type Props = { action: Action; variant: Variant; className?: string };

const PILL = "inline-flex min-h-touch items-center gap-2 rounded-pill px-4 font-mono";
const VARIANTS: Record<Variant, string> = {
  primary: `${PILL} bg-primary-bg text-sm font-bold text-primary-fg`,
  secondary: `${PILL} border border-control bg-surface text-xs text-text-strong`,
  term: `${PILL} border border-term-faint text-xs text-term-text`,
  link: "inline-flex min-h-6 items-center text-term-blue underline underline-offset-4",
  label: "flex h-window-label w-full items-center justify-center font-mono text-xl font-bold tracking-label text-term-bright",
};

const ICONS = {
  play: <path d="M6 4l14 8-14 8z" fill="currentColor" />,
  arrow: <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />,
};

// Every link-like control on the page. A copy action becomes a CopyEmailButton.
export function Button({ action, variant, className = "" }: Props) {
  const cls = `${VARIANTS[variant]} ${className}`;
  if ("copy" in action) {
    return <CopyEmailButton label={action.label} copiedLabel={action.copiedLabel} className={cls} />;
  }
  const newTab = !action.href.startsWith("#"); // other sites and files (resume.pdf) open in a new tab (D74)
  const icon = action.icon && (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3">
      {ICONS[action.icon]}
    </svg>
  );
  return (
    <a href={action.href} className={cls} {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}>
      {action.icon === "play" && icon}
      {action.label}
      {action.icon === "arrow" && icon}
    </a>
  );
}
