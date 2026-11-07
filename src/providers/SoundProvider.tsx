"use client";
import { createContext, type ReactNode, useContext, useRef, useState } from "react";

// ElevenLabs files in public/audio (D54). Loaded only after a toggle turns on; nothing persists (D38).
const KEYS = ["/audio/key-1.mp3", "/audio/key-2.mp3", "/audio/key-3.mp3", "/audio/key-4.mp3"];
const THOCK = "/audio/thock.mp3";
const MUSIC = "/audio/music.mp3";
const KEY_GAIN = 0.15;
const MUSIC_GAIN = 0.05;
const FADE_S = 1.5;

type Sound = {
  clicks: boolean;
  music: boolean;
  toggleClicks: () => Promise<void>;
  toggleMusic: () => Promise<void>;
  playKey: (kind?: "key" | "thock") => void;
};

const SoundContext = createContext<Sound | null>(null);

export function useSound() {
  const s = useContext(SoundContext);
  if (!s) throw new Error("useSound must be used inside <SoundProvider>");
  return s;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [clicks, setClicks] = useState(false);
  const [music, setMusic] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const buffers = useRef(new Map<string, AudioBuffer>());
  const loop = useRef<{ src: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const loading = useRef(false);

  // Created inside the click that turns sound on, so browsers allow it to play.
  const audio = () => {
    ctx.current ??= new AudioContext();
    if (ctx.current.state === "suspended") void ctx.current.resume();
    return ctx.current;
  };

  const load = (urls: string[]) =>
    Promise.all(
      urls.filter((u) => !buffers.current.has(u)).map(async (u) => {
        const data = await (await fetch(u)).arrayBuffer();
        buffers.current.set(u, await audio().decodeAudioData(data));
      }),
    );

  const play = (url: string, gainValue: number, repeat = false) => {
    const ac = audio();
    const src = ac.createBufferSource();
    const gain = ac.createGain();
    src.buffer = buffers.current.get(url) ?? null;
    src.loop = repeat;
    gain.gain.value = gainValue;
    src.connect(gain);
    gain.connect(ac.destination);
    src.start();
    return { src, gain };
  };

  const value: Sound = {
    clicks,
    music,
    toggleClicks: async () => {
      if (!clicks) {
        audio();
        await load([...KEYS, THOCK]);
      }
      setClicks(!clicks);
    },
    toggleMusic: async () => {
      const ac = audio();
      if (loop.current) {
        loop.current.gain.gain.linearRampToValueAtTime(0, ac.currentTime + FADE_S);
        loop.current.src.stop(ac.currentTime + FADE_S);
        loop.current = null;
        return setMusic(false);
      }
      if (loading.current) return; // ignore double-clicks while the file loads
      loading.current = true;
      await load([MUSIC]);
      loading.current = false;
      loop.current = play(MUSIC, 0, true);
      loop.current.gain.gain.linearRampToValueAtTime(MUSIC_GAIN, ac.currentTime + FADE_S);
      setMusic(true);
    },
    playKey: (kind = "key") => {
      if (!clicks || !ctx.current) return;
      play(kind === "thock" ? THOCK : KEYS[Math.floor(Math.random() * KEYS.length)], KEY_GAIN);
    },
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
