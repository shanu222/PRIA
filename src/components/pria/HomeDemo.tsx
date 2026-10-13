"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
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
      utterance.rate = 0.96;
      utterance.pitch = 1;
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
    const maxHeight = Math.max(Math.min(window.innerHeight * 0.62, 680) - 24, 1);
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
    host.replaceChildren(clone);
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
  const steps = stepsForPath(pathname);
  const [step, setStep] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const runRef = React.useRef(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setStep(null);
    runRef.current += 1;
    window.speechSynthesis?.cancel();
    return () => {
      runRef.current += 1;
      window.speechSynthesis?.cancel();
    };
  }, [pathname]);

  const finish = React.useCallback(() => {
    runRef.current += 1;
    window.speechSynthesis?.cancel();
    setStep(null);
    window.dispatchEvent(new CustomEvent("pria-demo-segment", { detail: null }));
  }, []);

  const start = async () => {
    const run = ++runRef.current;
    const tour: DemoStep[] = stepsForPath(window.location.pathname);
    window.speechSynthesis?.cancel();
    for (let index = 0; index < tour.length; index++) {
      if (run !== runRef.current) return;
      const current = tour[index];
      current.prepare?.();
      let source = document.querySelector(`[data-demo="${current.id}"]`);
      if (current.prepare) {
        const readyAt = Date.now() + 2000;
        while (run === runRef.current && Date.now() < readyAt && !source) {
          await wait(100);
          source = document.querySelector(`[data-demo="${current.id}"]`);
        }
        await wait(450);
        source = document.querySelector(`[data-demo="${current.id}"]`);
      }
      if (run !== runRef.current) return;
      if (!source) continue;
      setStep(index);
      source.scrollIntoView({ behavior: "smooth", block: "center" });
      await wait(700);
      if (run !== runRef.current) return;
      await speakChunks(current.script, run, runRef);
    }
    if (run === runRef.current) finish();
  };

  const active = step == null ? null : steps[step];
  if (steps.length === 0) return null;

  return (
    <>
      {step == null && (
        <div className="fixed bottom-5 right-5 z-40">
          <Button type="button" size="lg" onClick={() => void start()} className="rounded-full px-5 shadow-lift">
            <Play /> Demo
          </Button>
        </div>
      )}
      {mounted &&
        active &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#042f2e]/72 p-3 backdrop-blur-[2px] sm:items-center sm:p-6">
            <div className="flex w-full max-w-5xl flex-col gap-3">
              <div className="flex items-center justify-between gap-3 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">
                  {pathname === "/" ? "Portal demo" : "Page demo"} · {(step ?? 0) + 1} of {steps.length}
                </p>
                <Button type="button" variant="outline" onClick={finish} className="border-white/30 bg-white text-[#042f2e]">
                  <Square /> Stop
                </Button>
              </div>
              <ZoomShot sourceId={active.id} tick={step ?? 0} />
              <div className="rounded-2xl bg-white px-5 py-4 text-[#042f2e] shadow-lift">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">{active.title}</p>
                <p className="mt-1 text-base leading-relaxed sm:text-lg">{active.script}</p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
