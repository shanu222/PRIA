"use client";

import * as React from "react";
import { Pause, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "playing" | "paused";

function splitSentences(paragraph: string) {
  return paragraph
    .split(/(?<=[.!?])\s+(?=[A-Z“"])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function scoreVoice(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  if (!lang.startsWith("en")) return -1;
  let score = 0;
  if (name.includes("natural") || name.includes("neural")) score += 12;
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

  React.useEffect(() => {
    statusRef.current = status;
  }, [status]);

  React.useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      runId.current += 1;
      window.speechSynthesis?.cancel();
    };
  }, []);

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIndex]);

  const stop = React.useCallback(() => {
    runId.current += 1;
    window.speechSynthesis?.cancel();
    statusRef.current = "idle";
    setStatus("idle");
    setActiveIndex(null);
    setWord(null);
  }, []);

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
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onboundary = (event) => {
        if (run !== runId.current || event.name !== "word") return;
        setWord(wordAt(text, event.charIndex));
      };
      utterance.onend = () => {
        if (run !== runId.current || statusRef.current !== "playing") return;
        window.setTimeout(() => {
          if (run !== runId.current) return;
          void speakFrom(index + 1);
        }, 40);
      };
      utterance.onerror = (event) => {
        if (run !== runId.current) return;
        if (event.error === "interrupted" || event.error === "canceled") return;
        stop();
      };
      setActiveIndex(index);
      setWord(null);
      statusRef.current = "playing";
      setStatus("playing");
      utteranceRef.current = utterance;
      synth.speak(utterance);
    },
    [sentences, stop],
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
