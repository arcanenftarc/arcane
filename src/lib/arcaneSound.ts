const MUSIC_CANDIDATES = [
  "/assets/audio/music.mp3",
  "/assets/audio/music.ogg",
  "/assets/audio/music.wav",
  "/assets/audio/music.m4a",
];

const STORAGE_KEY = "arcane-muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let music: HTMLAudioElement | null = null;
let musicTried = false;
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
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function tone(context: AudioContext, dest: AudioNode, frequency: number, start: number, duration: number, volume: number) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, start);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.72, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(start);
  osc.stop(start + duration + 0.02);
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
  if (master) {
    master.gain.setTargetAtTime(next ? 0 : 1, ctx?.currentTime ?? 0, 0.04);
  }
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
    playClick();
  }
}

export function unlockSound() {
  ensureContext();
  if (!musicTried) {
    musicTried = true;
    void attachMusic();
  } else if (music && !muted && music.paused) {
    void music.play().catch(() => {});
  }
}

async function attachMusic() {
  for (const url of MUSIC_CANDIDATES) {
    const found = await probe(url);
    if (!found) {
      continue;
    }
    music = new Audio(url);
    music.loop = true;
    music.preload = "auto";
    music.volume = 0.22;
    music.muted = muted;
    if (!muted) {
      void music.play().catch(() => {});
    }
    return;
  }
}

function probe(url: string) {
  return new Promise<boolean>((resolve) => {
    const node = new Audio();
    const done = (ok: boolean) => {
      node.removeAttribute("src");
      node.load();
      resolve(ok);
    };
    node.addEventListener("canplay", () => done(true), { once: true });
    node.addEventListener("error", () => done(false), { once: true });
    node.preload = "metadata";
    node.src = url;
  });
}

export function playClick() {
  if (muted) {
    return;
  }
  const context = ensureContext();
  if (!context || !master) {
    return;
  }

  const now = context.currentTime;
  const bus = context.createGain();
  bus.gain.value = 0.55;
  bus.connect(master);

  tone(context, bus, 1244, now, 0.16, 0.11);
  tone(context, bus, 1866, now + 0.008, 0.12, 0.05);
  tone(context, bus, 3136, now + 0.016, 0.09, 0.028);

  const noise = context.createBufferSource();
  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.04), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2400;
  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0.04, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  noise.buffer = buffer;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(bus);
  noise.start(now);
  noise.stop(now + 0.05);
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
