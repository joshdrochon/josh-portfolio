// Controllable stand-ins for browser APIs jsdom lacks (matchMedia, IntersectionObserver, AudioContext).
import { vi } from "vitest";

const media = new Map<string, { matches: boolean; listeners: Set<(e: { matches: boolean }) => void> }>();
export function setMedia(query: string, matches: boolean) {
  const m = media.get(query) ?? { matches, listeners: new Set() };
  m.matches = matches;
  media.set(query, m);
  m.listeners.forEach((l) => l({ matches }));
}
window.matchMedia = ((query: string) => {
  if (!media.has(query)) media.set(query, { matches: false, listeners: new Set() });
  const m = media.get(query)!;
  return {
    get matches() { return m.matches; },
    addEventListener: (_: string, l: (e: { matches: boolean }) => void) => m.listeners.add(l),
    removeEventListener: (_: string, l: (e: { matches: boolean }) => void) => m.listeners.delete(l),
  };
}) as unknown as typeof window.matchMedia;

export const observers: MockIO[] = [];
export class MockIO {
  disconnected = false;
  constructor(public cb: IntersectionObserverCallback) {
    observers.push(this);
  }
  observe() {}
  disconnect() { this.disconnected = true; }
  fire(target: Element, isIntersecting: boolean) {
    this.cb([{ target, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}
window.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;

export const audio = { created: 0, resumed: 0, started: 0, stopped: 0 };
class MockAudioContext {
  currentTime = 0;
  state = "suspended";
  destination = {};
  constructor() { audio.created++; }
  resume() { audio.resumed++; this.state = "running"; return Promise.resolve(); }
  decodeAudioData() { return Promise.resolve({}); }
  createGain() { return { gain: { value: 0, linearRampToValueAtTime: vi.fn() }, connect: vi.fn() }; }
  createBufferSource() {
    return { buffer: null, loop: false, connect: vi.fn(), start: () => audio.started++, stop: () => audio.stopped++ };
  }
}
window.AudioContext = MockAudioContext as unknown as typeof AudioContext;

