"use client";

type Icon = "speaker" | "note" | "theme";
type Props = { pressed: boolean | null; onToggle: () => void; icon: Icon; label?: string; ariaLabel?: string };

const svg = (d: string, className = "") => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS: Record<Icon, React.ReactNode> = {
  speaker: svg("M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"),
  note: svg("M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"),
  // Both drawn; CSS shows the moon on a light page and the sun on a dark one, so the server never needs the theme.
  theme: (
    <>
      {svg("M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z", "dark:hidden")}
      {svg("M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4", "hidden dark:block")}
    </>
  ),
};

// Pill-shaped on/off button for sound, music and theme. aria-pressed is left off until the state is known (server render).
export function TogglePill({ pressed, onToggle, icon, label, ariaLabel }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={pressed ?? undefined}
      aria-label={ariaLabel}
      className="inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-pill border border-border-strong bg-bg px-4 font-mono text-xs text-text"
    >
      {ICONS[icon]}
      {label && <span>{label}</span>}
    </button>
  );
}
