"use client";
import { setTheme, useTheme } from "@/lib/theme";
import { useSound } from "@/providers/SoundProvider";
import { TogglePill } from "./TogglePill";

const onOff = (on: boolean) => (on ? "on" : "off");

// Top-right cluster: key clicks, music and the sun/moon theme toggle.
export function Controls() {
  const { clicks, music, toggleClicks, toggleMusic } = useSound();
  const theme = useTheme();
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-wrap justify-end gap-2">
      <TogglePill pressed={clicks} onToggle={toggleClicks} icon="speaker" label={`clicks: ${onOff(clicks)}`} />
      <TogglePill pressed={music} onToggle={toggleMusic} icon="note" label={`music: ${onOff(music)}`} />
      <TogglePill
        pressed={theme && theme === "dark"}
        onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
        icon="theme"
        ariaLabel="Dark mode"
      />
    </div>
  );
}
