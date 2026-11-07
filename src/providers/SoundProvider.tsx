"use client";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

// ElevenLabs files in public/audio (D54). Both start "on" (D72) but nothing loads or plays until the
// visitor's first click, tap or key press, because browsers block audio before that. Nothing persists (D38).
const KEYS = ["/audio/key-1.mp3", "/audio/key-2.mp3", "/audio/key-3.mp3", "/audio/key-4.mp3"];
const THOCK = "/audio/thock.mp3";
const MUSIC = "/audio/music.mp3";
const KEY_GAIN = 0.15;
const MUSIC_GAIN = 0.05;
const FADE_S = 1.5;
const UNLOCK_EVENTS = ["click", "keydown", "touchend"] as const; // events browsers accept as permission to play

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
  const [clicks, setClicks] = useState(true);
  const [music, setMusic] = useState(true);
  const want = useRef({ clicks: true, music: true }); // read by async work that outlives a render
  const ctx = useRef<AudioContext | null>(null);
  const buffers = useRef(new Map<string, AudioBuffer>());
  const loop = useRef<{ src: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const loading = useRef(false);

  // Only ever called from inside a click or key press, so browsers allow it to play.
  const audio = useCallback(() => {
    ctx.current ??= new AudioContext();
    if (ctx.current.state === "suspended") void ctx.current.resume();
    return ctx.current;
  }, []);

  const load = useCallback(
    (urls: string[]) =>
      Promise.all(
        urls.filter((u) => !buffers.current.has(u)).map(async (u) => {
          const data = await (await fetch(u)).arrayBuffer();
          buffers.current.set(u, await audio().decodeAudioData(data));
        }),
      ),
    [audio],
  );

  const play = useCallback(
    (url: string, gainValue: number, repeat = false) => {
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
    },
    [audio],
  );

  const startMusic = useCallback(async () => {
    if (loop.current || loading.current) return;
    loading.current = true;
    await load([MUSIC]);
    loading.current = false;
    if (!want.current.music || loop.current) return; // turned off while the file loaded
    loop.current = play(MUSIC, 0, true);
    loop.current.gain.gain.linearRampToValueAtTime(MUSIC_GAIN, audio().currentTime + FADE_S);
  }, [audio, load, play]);

  const loadClicks = useCallback(() => load([...KEYS, THOCK]), [load]);

  useEffect(() => {
    const unlock = () => {
      UNLOCK_EVENTS.forEach((e) => document.removeEventListener(e, unlock, true));
      audio();
      if (want.current.clicks) void loadClicks();
      if (want.current.music) void startMusic();
    };
    UNLOCK_EVENTS.forEach((e) => document.addEventListener(e, unlock, true));
    return () => UNLOCK_EVENTS.forEach((e) => document.removeEventListener(e, unlock, true));
  }, [audio, loadClicks, startMusic]);

  const value: Sound = {
    clicks,
    music,
    toggleClicks: async () => {
      want.current.clicks = !clicks;
      setClicks(!clicks);
      if (!clicks) await loadClicks();
    },
    toggleMusic: async () => {
      want.current.music = !music;
      setMusic(!music);
      if (!music) return startMusic();
      if (!loop.current) return;
      const ac = audio();
      loop.current.gain.gain.linearRampToValueAtTime(0, ac.currentTime + FADE_S);
      loop.current.src.stop(ac.currentTime + FADE_S);
      loop.current = null;
    },
    playKey: (kind = "key") => {
      if (!clicks || !ctx.current) return;
      play(kind === "thock" ? THOCK : KEYS[Math.floor(Math.random() * KEYS.length)], KEY_GAIN);
    },
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
