const MUSIC_URL = "/assets/audio/music.mp3";

const STORAGE_KEY = "arcane-muted";

let ctx: AudioContext | null = null;
let music: HTMLAudioElement | null = null;
let muted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function readMuted() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function ensureContext() {
  if (typeof window === "undefined") {
    return null;
  }
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) {
    return null;
  }
  if (!ctx) {
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function snap(context: AudioContext, dest: AudioNode, start: number) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(3200, start);
  gain.gain.setValueAtTime(0.16, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.045);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(start);
  osc.stop(start + 0.05);
}

export function playClick() {
  const context = ensureContext();
  if (!context) {
    return;
  }

  const now = context.currentTime;
  const bus = context.createGain();
  bus.gain.value = 0.85;
  bus.connect(context.destination);

  snap(context, bus, now);

  const length = Math.max(32, Math.floor(context.sampleRate * 0.008));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 4200;
  filter.Q.value = 1.4;
  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0.22, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(bus);
  noise.start(now);
  noise.stop(now + 0.02);
}

export function initSound() {
  muted = readMuted();
  emit();
}

export function isMuted() {
  return muted;
}

export function subscribeSound(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setMuted(next: boolean) {
  muted = next;
  writeMuted(next);
  if (music) {
    music.muted = next;
    if (!next) {
      void music.play().catch(() => {});
    } else {
      music.pause();
    }
  }
  emit();
  if (!next) {
    unlockSound();
  }
}

export function unlockSound() {
  ensureContext();
  attachMusic();
  if (music && !muted && music.paused) {
    void music.play().catch(() => {});
  }
}

function attachMusic() {
  if (music) {
    return;
  }
  music = new Audio(MUSIC_URL);
  music.loop = true;
  music.preload = "auto";
  music.setAttribute("playsinline", "true");
  music.volume = 0.22;
  music.muted = muted;
  music.addEventListener("ended", () => {
    if (!music || muted) {
      return;
    }
    music.currentTime = 0;
    void music.play().catch(() => {});
  });
  music.load();
}

export function preloadMusic() {
  attachMusic();
}

export function isSoundTarget(node: EventTarget | null) {
  if (!(node instanceof Element)) {
    return false;
  }
  if (node.closest("[data-sound-toggle]")) {
    return false;
  }
  return Boolean(node.closest("a, button, summary, [role='button']"));
}
