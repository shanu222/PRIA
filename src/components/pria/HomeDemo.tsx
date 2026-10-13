"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    id: "hero",
    title: "The atlas",
    script:
      "This is the Pakistan Resilient Infrastructure Atlas, prepared for the National Disaster Management Authority. It sets where and how Pakistan should build, through Vision 2047.",
  },
  {
    id: "figures",
    title: "The scale",
    script:
      "These figures frame the work. About 255 million people in 2026. About 31 million houses still needed. The horizon is 2047, when Pakistan turns one hundred. The country is read as four regional segments and six kinds of infrastructure.",
  },
  {
    id: "glance",
    title: "The path through the portal",
    script:
      "At a glance, the portal moves from the national picture, to the challenges and needs, to the scope and the stakeholders, and on to the summary of NDMA’s role.",
  },
  {
    id: "segments",
    title: "Four grounds",
    script:
      "Pakistan is divided into four grounds. The mountain segment is selected here. Then riverine and plains, desert and arid, and the coast. A house that is safe on one ground can fail on another.",
  },
  {
    id: "models",
    title: "How to build",
    script:
      "NDMA’s disaster resilient house models show how to build for earthquakes, floods, landslides, and extreme heat and cold. Each model is matched to the provinces it suits.",
  },
  {
    id: "disasters",
    title: "Why resilience",
    script:
      "The atlas is shaped by recorded disasters. The 2005 earthquake, the Indus floods, the 2015 heatwave, the 2022 floods, and Cyclone Biparjoy. The aim is to avoid building back into the same hazard.",
  },
  {
    id: "roadmap",
    title: "How the portal is organised",
    script:
      "Follow the portal in this order. National context, needs, scope, stakeholders, the regional segments, and the summary. That is the path through PRIA.",
  },
] as const;

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

function ZoomShot({ sourceId }: { sourceId: string }) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [shot, setShot] = React.useState<{ width: number; fit: number } | null>(null);

  React.useLayoutEffect(() => {
    setShot(null);
    const source = document.querySelector(`[data-demo="${sourceId}"]`) as HTMLElement | null;
    const frame = frameRef.current;
    if (!source || !frame) return;
    const fit = Math.min(1, frame.clientWidth / Math.max(source.offsetWidth, 1));
    setShot({ width: source.offsetWidth, fit });
  }, [sourceId]);

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
  }, [sourceId, shot]);

  return (
    <div
      ref={frameRef}
      className="relative h-[min(58vh,540px)] overflow-hidden rounded-2xl bg-[#042f2e] shadow-[0_30px_80px_-24px_rgba(4,47,46,0.85)] ring-1 ring-white/20"
    >
      {shot && (
        <motion.div
          ref={hostRef}
          initial={{ scale: shot.fit * 0.86, opacity: 0.7 }}
          animate={{ scale: shot.fit * 1.08, opacity: 1 }}
          transition={{ duration: 7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "center top", width: shot.width }}
        />
      )}
    </div>
  );
}

export function HomeDemo() {
  const [step, setStep] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const runRef = React.useRef(0);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      runRef.current += 1;
      window.speechSynthesis?.cancel();
    };
  }, []);

  const finish = React.useCallback(() => {
    runRef.current += 1;
    window.speechSynthesis?.cancel();
    setStep(null);
    window.dispatchEvent(new CustomEvent("pria-demo-segment", { detail: null }));
  }, []);

  const start = async () => {
    const run = ++runRef.current;
    window.speechSynthesis?.cancel();
    for (let index = 0; index < STEPS.length; index++) {
      if (run !== runRef.current) return;
      const current = STEPS[index];
      setStep(index);
      if (current.id === "segments") {
        window.dispatchEvent(new CustomEvent("pria-demo-segment", { detail: "mountain" }));
      }
      document.querySelector(`[data-demo="${current.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      await wait(700);
      if (run !== runRef.current) return;
      await speakChunks(current.script, run, runRef);
    }
    if (run === runRef.current) finish();
  };

  const active = step == null ? null : STEPS[step];

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
                  Portal demo · {(step ?? 0) + 1} of {STEPS.length}
                </p>
                <Button type="button" variant="outline" onClick={finish} className="border-white/30 bg-white text-[#042f2e]">
                  <Square /> Stop
                </Button>
              </div>
              <ZoomShot sourceId={active.id} />
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
