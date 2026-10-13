"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
import { pages } from "@/data/pria";
import { Button } from "@/components/ui/button";
import { stepsForPath, type DemoStep } from "./demo-steps";

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const scored = voices
    .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
    .map((voice) => {
      const name = voice.name.toLowerCase();
      let score = voice.localService ? 8 : 0;
      if (name.includes("natural") || name.includes("premium") || name.includes("enhanced")) score += 4;
      if (voice.lang.toLowerCase().startsWith("en-gb")) score += 2;
      return { voice, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.voice;
}

function chunksOf(text: string) {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** Framer Motion leaves off-screen sections at opacity 0. A clone would otherwise be a blank card. */
function releaseMotion(root: HTMLElement) {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  for (const el of nodes) {
    const opacity = el.style.opacity;
    if (opacity === "" || Number(opacity) >= 0.99) continue;
    el.style.opacity = "1";
    const transform = (el.style.transform || "").trim();
    if (transform.startsWith("translate") || transform.startsWith("matrix") || transform.startsWith("scale")) {
      el.style.transform = "none";
    }
    if (el.style.translate) el.style.translate = "none";
    el.style.visibility = "visible";
  }
}

function copyCanvases(source: HTMLElement, clone: HTMLElement) {
  const from = source.querySelectorAll("canvas");
  const to = clone.querySelectorAll("canvas");
  from.forEach((src, index) => {
    const dest = to[index];
    if (!dest || src.width === 0 || src.height === 0) return;
    dest.width = src.width;
    dest.height = src.height;
    try {
      dest.getContext("2d")?.drawImage(src, 0, 0);
    } catch {
      /* A tainted canvas cannot be copied. The rest of the section still shows. */
    }
  });
}

type Scene = { root: number; intervals: number[]; pace: number; air: number };

/** Low, warm beds. Nothing above the speaking range, so the score stays in the room. */
function sceneFor(pathname: string): Scene {
  if (pathname.startsWith("/summary")) return { root: 65.4, intervals: [0, 7, 12, 16], pace: 3200, air: 520 };
  if (pathname.startsWith("/drim")) return { root: 98, intervals: [0, 5, 9, 12], pace: 2100, air: 700 };
  if (pathname.startsWith("/segments")) return { root: 110, intervals: [0, 4, 7, 11, 12], pace: 1900, air: 780 };
  if (pathname.startsWith("/research")) return { root: 82.4, intervals: [0, 7, 10, 14], pace: 3000, air: 600 };
  if (pathname.startsWith("/hazards") || pathname.startsWith("/challenges") || pathname.startsWith("/observations")) {
    return { root: 73.4, intervals: [0, 3, 7, 10], pace: 2800, air: 540 };
  }
  if (pathname.startsWith("/needs") || pathname.startsWith("/scope") || pathname.startsWith("/stakeholders")) {
    return { root: 92.5, intervals: [0, 5, 12, 17], pace: 2300, air: 720 };
  }
  if (pathname === "/") return { root: 98, intervals: [0, 7, 12, 16], pace: 2400, air: 760 };
  return { root: 87.3, intervals: [0, 5, 12, 17], pace: 2500, air: 660 };
}

type Score = { setScene: (pathname: string, step: number) => void; stop: () => void };

function createScore(): Score {
  const ctx = new window.AudioContext();
  void ctx.resume();
  const master = ctx.createGain();
  const warm = ctx.createBiquadFilter();
  warm.type = "lowpass";
  warm.frequency.value = 700;
  warm.Q.value = 0.5;
  master.connect(warm);
  warm.connect(ctx.destination);
  const opened = ctx.currentTime;
  master.gain.setValueAtTime(0.0001, opened);
  master.gain.exponentialRampToValueAtTime(0.16, opened + 1.6);

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 280;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.012;
  const noisePan = ctx.createStereoPanner();
  noisePan.pan.value = -0.2;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(noisePan);
  noisePan.connect(master);
  noise.start();

  const bed = (pan: number, detune: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    osc.type = "sine";
    osc.detune.value = detune;
    gain.gain.value = 0.028;
    panner.pan.value = pan;
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(master);
    osc.start();
    return osc;
  };
  const left = bed(-0.55, -7);
  const right = bed(0.55, 6);

  let scene = sceneFor("/");
  let cursor = 0;
  let stopped = false;
  let tuned = false;
  let timer = 0;

  const retune = () => {
    const time = ctx.currentTime;
    const fifth = scene.root * 1.5;
    if (!tuned) {
      left.frequency.setValueAtTime(scene.root, time);
      right.frequency.setValueAtTime(fifth, time);
      warm.frequency.setValueAtTime(scene.air, time);
      tuned = true;
      return;
    }
    left.frequency.cancelScheduledValues(time);
    right.frequency.cancelScheduledValues(time);
    warm.frequency.cancelScheduledValues(time);
    left.frequency.setValueAtTime(left.frequency.value, time);
    right.frequency.setValueAtTime(right.frequency.value, time);
    warm.frequency.setValueAtTime(warm.frequency.value, time);
    left.frequency.linearRampToValueAtTime(scene.root, time + 0.9);
    right.frequency.linearRampToValueAtTime(fifth, time + 1.2);
    warm.frequency.linearRampToValueAtTime(scene.air, time + 0.9);
  };

  const playNote = () => {
    if (stopped) return;
    const semi = scene.intervals[cursor % scene.intervals.length];
    cursor += 1;
    let tone = scene.root * 2 ** (semi / 12);
    while (tone > 247) tone /= 2;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    osc.type = "triangle";
    osc.frequency.value = tone;
    panner.pan.value = cursor % 2 === 0 ? -0.4 : 0.4;
    const time = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.035, time + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.6);
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(master);
    osc.start(time);
    osc.stop(time + 2.7);
  };

  const arm = () => {
    window.clearInterval(timer);
    timer = window.setInterval(playNote, scene.pace);
  };

  retune();
  arm();

  return {
    setScene(pathname, step) {
      if (stopped) return;
      scene = sceneFor(pathname);
      cursor = step;
      retune();
      arm();
      playNote();
    },
    stop() {
      if (stopped) return;
      stopped = true;
      window.clearInterval(timer);
      const time = ctx.currentTime;
      master.gain.cancelScheduledValues(time);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), time);
      master.gain.exponentialRampToValueAtTime(0.0001, time + 0.6);
      window.setTimeout(() => {
        [left, right, noise].forEach((node) => {
          try {
            node.stop();
          } catch {
            /* already stopped */
          }
        });
        void ctx.close();
      }, 700);
    },
  };
}

function portalTour(from: string) {
  const main = pages.map((page) => page.href).filter((href) => stepsForPath(href).length > 0);
  const exact = main.indexOf(from);
  if (exact >= 0) return [...main.slice(exact), ...main.slice(0, exact)];
  const parent = [...main].reverse().find((href) => href !== "/" && from.startsWith(`${href}/`));
  const parentIndex = parent ? main.indexOf(parent) : -1;
  const after = parentIndex >= 0 ? parentIndex + 1 : 0;
  const before = parentIndex >= 0 ? parentIndex : 0;
  return [from, ...main.slice(after), ...main.slice(0, before)];
}

function pageLabel(pathname: string) {
  return pages.find((page) => page.href === pathname)?.navLabel ?? "This page";
}

function speakChunks(text: string, run: number, runRef: React.MutableRefObject<number>) {
  const synth = window.speechSynthesis;
  const parts = chunksOf(text);
  return new Promise<void>((resolve) => {
    let index = 0;
    const next = () => {
      if (run !== runRef.current || index >= parts.length) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(parts[index]);
      const voice = pickVoice(synth.getVoices());
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = "en-GB";
      }
      utterance.volume = 1;
      utterance.rate = 0.94;
      utterance.pitch = 1.02;
      const part = parts[index];
      index += 1;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.setTimeout(next, 40);
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      const expected = Math.max(2500, (part.split(/\s+/).length / 2.1) * 1000 + 900);
      window.setTimeout(() => {
        if (!settled && run === runRef.current && !synth.speaking) finish();
      }, expected);
      synth.speak(utterance);
    };
    synth.cancel();
    window.setTimeout(next, 50);
  });
}

function ZoomShot({ sourceId, tick }: { sourceId: string; tick: number }) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [shot, setShot] = React.useState<{ width: number; height: number; fit: number } | null>(null);

  React.useLayoutEffect(() => {
    setShot(null);
    const source = document.querySelector(`[data-demo="${sourceId}"]`) as HTMLElement | null;
    const frame = frameRef.current;
    if (!source || !frame) return;
    const maxWidth = Math.max(frame.clientWidth - 24, 1);
    const maxHeight = Math.max(Math.min(window.innerHeight - 230, 560), 200);
    const fit = Math.min(maxWidth / Math.max(source.offsetWidth, 1), maxHeight / Math.max(source.offsetHeight, 1));
    setShot({ width: source.offsetWidth, height: source.offsetHeight, fit });
  }, [sourceId, tick]);

  React.useLayoutEffect(() => {
    const source = document.querySelector(`[data-demo="${sourceId}"]`) as HTMLElement | null;
    const host = hostRef.current;
    if (!source || !host || !shot) return;
    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute("data-demo");
    clone.style.margin = "0";
    clone.style.width = `${shot.width}px`;
    clone.style.maxWidth = "none";
    releaseMotion(clone);
    copyCanvases(source, clone);
    host.replaceChildren(clone);
    const again = window.setTimeout(() => {
      releaseMotion(clone);
      copyCanvases(source, clone);
    }, 500);
    return () => window.clearTimeout(again);
  }, [sourceId, shot, tick]);

  const frameHeight = shot ? Math.ceil(shot.height * shot.fit) + 24 : 240;

  return (
    <div
      ref={frameRef}
      className="relative w-full overflow-hidden rounded-2xl bg-card shadow-[0_30px_80px_-24px_rgba(4,47,46,0.45)] ring-1 ring-black/10"
      style={{ height: frameHeight }}
    >
      {shot && (
        <motion.div
          ref={hostRef}
          initial={{ scale: shot.fit * 0.94, opacity: 0.85 }}
          animate={{ scale: shot.fit, opacity: 1 }}
          transition={{ duration: 6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: shot.width,
            height: shot.height,
            marginLeft: -shot.width / 2,
            marginTop: -shot.height / 2,
            transformOrigin: "center center",
          }}
        />
      )}
    </div>
  );
}

export function PageDemo() {
  const pathname = usePathname();
  const router = useRouter();
  const steps = stepsForPath(pathname);
  const [step, setStep] = React.useState<number | null>(null);
  const [running, setRunning] = React.useState(false);
  const [tourMark, setTourMark] = React.useState<{ mode: "page" | "all"; index: number; total: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const runRef = React.useRef(0);
  const carryRef = React.useRef(false);
  const musicRef = React.useRef<Score | null>(null);

  const stopMusic = React.useCallback(() => {
    musicRef.current?.stop();
    musicRef.current = null;
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (carryRef.current) {
      carryRef.current = false;
      setStep(null);
    } else {
      setStep(null);
      setRunning(false);
      setTourMark(null);
      runRef.current += 1;
      stopMusic();
      window.speechSynthesis?.cancel();
    }
    return () => {
      if (carryRef.current) return;
      runRef.current += 1;
      stopMusic();
      window.speechSynthesis?.cancel();
    };
  }, [pathname, stopMusic]);

  const finish = React.useCallback(() => {
    runRef.current += 1;
    stopMusic();
    setRunning(false);
    setTourMark(null);
    setStep(null);
    window.speechSynthesis?.cancel();
    window.dispatchEvent(new CustomEvent("pria-demo-segment", { detail: null }));
  }, [stopMusic]);

  const explainPage = async (path: string, run: number) => {
    const readyAt = Date.now() + 8000;
    let tour: DemoStep[] = [];
    while (run === runRef.current && Date.now() < readyAt) {
      if (window.location.pathname === path) {
        tour = stepsForPath(path);
        if (tour.length > 0 && document.querySelector("[data-demo]")) break;
      }
      await wait(80);
    }
    if (run !== runRef.current) return;
    for (let index = 0; index < tour.length; index++) {
      if (run !== runRef.current) return;
      const current = tour[index];
      musicRef.current?.setScene(path, index);
      current.prepare?.();
      let source = document.querySelector(`[data-demo="${current.id}"]`);
      if (current.prepare) {
        const foundBy = Date.now() + 2000;
        while (run === runRef.current && Date.now() < foundBy && !source) {
          await wait(100);
          source = document.querySelector(`[data-demo="${current.id}"]`);
        }
        await wait(450);
        source = document.querySelector(`[data-demo="${current.id}"]`);
      }
      if (run !== runRef.current) return;
      if (!source) continue;
      source.scrollIntoView({ behavior: "auto", block: "center" });
      await wait(700);
      if (run !== runRef.current) return;
      setStep(index);
      await wait(400);
      if (run !== runRef.current) return;
      await speakChunks(current.script, run, runRef);
    }
  };

  const start = async (mode: "page" | "all") => {
    const run = ++runRef.current;
    const paths = mode === "page" ? [window.location.pathname] : portalTour(window.location.pathname);
    setRunning(true);
    setTourMark({ mode, index: 0, total: paths.length });
    window.speechSynthesis?.cancel();
    stopMusic();
    try {
      musicRef.current = createScore();
      musicRef.current.setScene(window.location.pathname, 0);
    } catch {
      musicRef.current = null;
    }
    for (let index = 0; index < paths.length; index++) {
      if (run !== runRef.current) return;
      const path = paths[index];
      setTourMark({ mode, index, total: paths.length });
      if (window.location.pathname !== path) {
        carryRef.current = true;
        setStep(null);
        router.push(path);
        const readyAt = Date.now() + 8000;
        while (run === runRef.current && window.location.pathname !== path && Date.now() < readyAt) {
          await wait(50);
        }
        await wait(600);
      }
      if (run !== runRef.current) return;
      await explainPage(path, run);
    }
    if (run === runRef.current) finish();
  };

  const active = step == null ? null : steps[step];
  if (!running && steps.length === 0) return null;

  return (
    <>
      {!running && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border bg-card/95 p-1.5 shadow-lift backdrop-blur">
          <span className="hidden pl-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:inline">
            Demo
          </span>
          <Button type="button" size="sm" className="rounded-full" onClick={() => void start("page")}>
            <Play /> This page
          </Button>
          <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => void start("all")}>
            All pages
          </Button>
        </div>
      )}
      {mounted &&
        running &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#042f2e]/72 p-3 backdrop-blur-[2px] sm:items-center sm:p-6">
            <div className="flex w-full max-w-5xl flex-col gap-3">
              <div className="flex items-center justify-between gap-3 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">
                  {tourMark?.mode === "all"
                    ? `Full portal · ${pageLabel(pathname)} · ${(tourMark.index ?? 0) + 1} of ${tourMark.total}`
                    : "This page"}
                  {active ? ` · ${(step ?? 0) + 1} of ${steps.length}` : ""}
                </p>
                <Button type="button" variant="outline" onClick={finish} className="border-white/30 bg-white text-[#042f2e]">
                  <Square /> Stop
                </Button>
              </div>
              {active ? (
                <>
                  <ZoomShot sourceId={active.id} tick={step ?? 0} />
                  <div className="rounded-2xl bg-white px-5 py-4 text-[#042f2e] shadow-lift">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">Curator’s note</p>
                    <p className="mt-1 font-heading text-lg font-semibold leading-snug">{active.title}</p>
                    <p className="mt-1 text-base leading-relaxed text-[#134e4a]">{active.gist}</p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-white px-5 py-8 text-center text-[#042f2e] shadow-lift">
                  <p className="font-heading text-lg font-semibold">Opening the next page</p>
                  <p className="mt-1 text-sm text-[#134e4a]">The explanation continues there.</p>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
