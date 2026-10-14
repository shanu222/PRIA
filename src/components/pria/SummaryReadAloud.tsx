"use client";

import * as React from "react";
import { Pause, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "playing" | "paused";

const MAX_CHUNK = 140;

function splitSentences(paragraph: string) {
  const sentences = paragraph
    .split(/(?<=[.!?])\s+(?=[A-Z“"])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= MAX_CHUNK) {
      chunks.push(sentence);
      continue;
    }
    const clauses = sentence.split(/(?<=[,;:—])\s+/);
    let buffer = "";
    for (const clause of clauses) {
      const next = buffer ? `${buffer} ${clause}` : clause;
      if (buffer && next.length > MAX_CHUNK) {
        chunks.push(buffer);
        buffer = clause;
      } else {
        buffer = next;
      }
    }
    if (buffer) chunks.push(buffer);
  }
  return chunks;
}

function scoreVoice(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  if (!lang.startsWith("en")) return -1;
  let score = 0;
  if (voice.localService) score += 10;
  if (!voice.localService) score -= 6;
  if (name.includes("natural") || name.includes("neural")) score += 4;
  if (name.includes("premium") || name.includes("enhanced")) score += 6;
  if (lang.startsWith("en-gb")) score += 4;
  if (lang.startsWith("en-us")) score += 3;
  if (/aria|jenny|sonia|libby|ryan|guy|samantha|daniel/.test(name)) score += 4;
  if (name.includes("google") && name.includes("english")) score += 3;
  if (/espeak|compact|zarvox|whisper|bad/.test(name)) score -= 8;
  return score;
}

function pickVoice(voices: SpeechSynthesisVoice[]) {
  return [...voices].filter((voice) => scoreVoice(voice) >= 0).sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

function wordAt(text: string, index: number) {
  if (index < 0 || index >= text.length) return null;
  let start = index;
  while (start > 0 && /\S/.test(text[start]) && /\S/.test(text[start - 1])) start -= 1;
  while (start < text.length && /\s/.test(text[start])) start += 1;
  let end = start;
  while (end < text.length && /\S/.test(text[end])) end += 1;
  return end > start ? { start, end } : null;
}

function SpokenSentence({
  text,
  active,
  word,
}: {
  text: string;
  active: boolean;
  word: { start: number; end: number } | null;
}) {
  if (!active) return <>{text}</>;
  const span = word ?? { start: 0, end: 0 };
  return (
    <>
      {text.slice(0, span.start)}
      {span.end > span.start ? (
        <mark className="rounded-[0.2rem] bg-primary px-0.5 text-primary-foreground">{text.slice(span.start, span.end)}</mark>
      ) : null}
      {text.slice(span.end)}
    </>
  );
}

export function SummaryReadAloud({ paragraphs }: { paragraphs: string[] }) {
  const blocks = React.useMemo(() => paragraphs.map(splitSentences), [paragraphs]);
  const sentences = React.useMemo(() => blocks.flat(), [blocks]);
  const [status, setStatus] = React.useState<Status>("idle");
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [word, setWord] = React.useState<{ start: number; end: number } | null>(null);
  const [supported, setSupported] = React.useState(true);
  const runId = React.useRef(0);
  const statusRef = React.useRef<Status>("idle");
  const activeRef = React.useRef<HTMLSpanElement>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const indexRef = React.useRef(0);
  const watchRef = React.useRef<number | null>(null);
  const chunkStarted = React.useRef(0);
  const retried = React.useRef(false);
  const lastResume = React.useRef(0);
  const utterGen = React.useRef(0);

  React.useEffect(() => {
    statusRef.current = status;
  }, [status]);

  React.useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      runId.current += 1;
      if (watchRef.current) window.clearInterval(watchRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIndex]);

  const clearWatch = React.useCallback(() => {
    if (watchRef.current) window.clearInterval(watchRef.current);
    watchRef.current = null;
  }, []);

  const stop = React.useCallback(() => {
    runId.current += 1;
    clearWatch();
    window.speechSynthesis?.cancel();
    statusRef.current = "idle";
    setStatus("idle");
    setActiveIndex(null);
    setWord(null);
  }, [clearWatch]);

  const speakFrom = React.useCallback(
    async (index: number) => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const run = runId.current;
      if (index >= sentences.length) {
        stop();
        return;
      }
      const ready = synth.getVoices();
      const voices =
        ready.length > 0
          ? ready
          : await new Promise<SpeechSynthesisVoice[]>((resolve) => {
              const timer = window.setTimeout(() => resolve(synth.getVoices()), 500);
              synth.addEventListener(
                "voiceschanged",
                () => {
                  window.clearTimeout(timer);
                  resolve(synth.getVoices());
                },
                { once: true },
              );
            });
      if (run !== runId.current) return;
      const text = sentences[index];
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(voices);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = "en-GB";
      }
      utterance.volume = 1;
      utterance.rate = 1.15;
      utterance.pitch = 1;
      const mine = ++utterGen.current;
      const advance = () => {
        if (mine !== utterGen.current) return;
        if (run !== runId.current || statusRef.current !== "playing") return;
        if (indexRef.current !== index) return;
        retried.current = false;
        indexRef.current = index + 1;
        clearWatch();
        window.setTimeout(() => {
          if (run !== runId.current) return;
          void speakFrom(index + 1);
        }, 50);
      };
      utterance.onboundary = (event) => {
        if (mine !== utterGen.current || run !== runId.current || event.name !== "word") return;
        setWord(wordAt(text, event.charIndex));
      };
      utterance.onend = () => advance();
      utterance.onerror = (event) => {
        if (mine !== utterGen.current || run !== runId.current) return;
        if (event.error === "interrupted" || event.error === "canceled") return;
        advance();
      };
      if (indexRef.current !== index) retried.current = false;
      indexRef.current = index;
      chunkStarted.current = Date.now();
      lastResume.current = Date.now();
      setActiveIndex(index);
      setWord(null);
      statusRef.current = "playing";
      setStatus("playing");
      utteranceRef.current = utterance;
      const words = text.split(/\s+/).length;
      const expected = Math.max(2200, (words / 2.1) * 1000 + 700);
      clearWatch();
      watchRef.current = window.setInterval(() => {
        if (run !== runId.current || statusRef.current !== "playing" || indexRef.current !== index) return;
        if (synth.paused) return;
        if (synth.speaking) {
          if (Date.now() - lastResume.current > 8000) {
            synth.resume();
            lastResume.current = Date.now();
          }
          return;
        }
        const elapsed = Date.now() - chunkStarted.current;
        if (elapsed < 600) return;
        if (elapsed < expected * 0.55 && !retried.current) {
          retried.current = true;
          utterGen.current += 1;
          clearWatch();
          synth.cancel();
          window.setTimeout(() => {
            if (run !== runId.current || indexRef.current !== index) return;
            void speakFrom(index);
          }, 60);
          return;
        }
        advance();
      }, 500);
      synth.speak(utterance);
    },
    [sentences, stop, clearWatch],
  );

  const onRead = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (status === "playing") {
      synth.pause();
      statusRef.current = "paused";
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      synth.resume();
      statusRef.current = "playing";
      setStatus("playing");
      const index = indexRef.current;
      window.setTimeout(() => {
        if (statusRef.current !== "playing" || indexRef.current !== index) return;
        if (!synth.speaking) void speakFrom(index);
      }, 250);
      return;
    }
    const run = runId.current + 1;
    runId.current = run;
    synth.cancel();
    window.setTimeout(() => {
      if (run !== runId.current) return;
      void speakFrom(0);
    }, 60);
  };

  if (!supported || sentences.length === 0) {
    return (
      <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  let cursor = 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-5">
        <p className="text-sm font-medium text-muted-foreground" aria-live="polite">
          {status === "playing" ? "Reading" : status === "paused" ? "Paused" : "Listen to this summary"}
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={onRead} aria-pressed={status === "playing"}>
            {status === "playing" ? (
              <>
                <span className="flex h-4 items-end gap-0.5" aria-hidden>
                  <span className="w-0.5 origin-bottom animate-[read-bar_0.8s_ease-in-out_infinite] bg-current" style={{ height: "100%" }} />
                  <span className="w-0.5 origin-bottom animate-[read-bar_0.8s_ease-in-out_infinite] bg-current [animation-delay:0.15s]" style={{ height: "100%" }} />
                  <span className="w-0.5 origin-bottom animate-[read-bar_0.8s_ease-in-out_infinite] bg-current [animation-delay:0.3s]" style={{ height: "100%" }} />
                </span>
                <Pause /> Pause
              </>
            ) : (
              <>
                <Volume2 /> {status === "paused" ? "Resume" : "Read aloud"}
              </>
            )}
          </Button>
          {status !== "idle" && (
            <Button type="button" variant="outline" onClick={stop}>
              <Square /> Stop
            </Button>
          )}
        </div>
      </div>
      <style>{`@keyframes read-bar { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }`}</style>
      <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
        {blocks.map((group) => {
          const paragraph = group.join(" ");
          return (
            <p key={paragraph}>
              {group.map((sentence, indexInGroup) => {
                const index = cursor;
                cursor += 1;
                const active = index === activeIndex;
                return (
                  <React.Fragment key={`${index}-${sentence.slice(0, 24)}`}>
                    {indexInGroup > 0 ? " " : null}
                    <span
                      ref={active ? activeRef : undefined}
                      className={
                        active
                          ? "rounded-md bg-[color-mix(in_srgb,hsl(var(--primary))_16%,transparent)] px-1 py-0.5 shadow-[inset_0_0_0_1px_color-mix(in_srgb,hsl(var(--primary))_35%,transparent)] box-decoration-clone"
                          : undefined
                      }
                    >
                      <SpokenSentence text={sentence} active={active} word={active ? word : null} />
                    </span>
                  </React.Fragment>
                );
              })}
            </p>
          );
        })}
      </div>
    </div>
  );
}
