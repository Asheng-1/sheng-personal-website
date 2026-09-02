import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { normalizeSplitFlapWords } from "@/lib/splitFlap";

type Charset = "alphanumeric" | "numeric";
type Variant = "default" | "minimal";

interface Props {
  words: readonly string[];
  flipDuration?: number;
  stagger?: number;
  cycleDelay?: number;
  charset?: Charset;
  flipsPerChar?: number;
  tileColor?: string;
  textColor?: string;
  tileRadius?: number;
  gap?: number;
  fontSize?: number;
  loop?: boolean;
  padTo?: number;
  variant?: Variant;
  className?: string;
}

type SplitFlapStyle = CSSProperties &
  Record<`--split-flap-${string}`, string | number>;

const CHARSETS: Record<Charset, string> = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  numeric: "0123456789",
};

export function SplitFlapText({
  words,
  flipDuration = 0.12,
  stagger = 0.06,
  cycleDelay = 2400,
  charset = "alphanumeric",
  flipsPerChar = 8,
  tileColor = "#111827",
  textColor = "#f8fafc",
  tileRadius = 8,
  gap = 6,
  fontSize = 52,
  loop = false,
  padTo = 0,
  variant = "default",
  className = "",
}: Props) {
  const safeWords = useMemo(
    () => normalizeSplitFlapWords(words, padTo),
    [padTo, words],
  );
  const length = safeWords[0].length;
  const [wordIndex, setWordIndex] = useState(0);
  const [display, setDisplay] = useState(safeWords[0]);

  useEffect(() => {
    setWordIndex(0);
    setDisplay(safeWords[0]);
  }, [safeWords, length]);

  useEffect(() => {
    if (safeWords.length < 2) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timers = new Set<number>();
    const alphabet = CHARSETS[charset];

    const cycle = window.setInterval(
      () => {
        const nextIndex = wordIndex + 1;
        if (!loop && nextIndex >= safeWords.length) {
          window.clearInterval(cycle);
          return;
        }

        const resolvedIndex = nextIndex % safeWords.length;
        const target = safeWords[resolvedIndex];

        if (reducedMotion) {
          setDisplay(target);
          setWordIndex(resolvedIndex);
          return;
        }

        for (let step = 0; step < Math.max(flipsPerChar, 1); step += 1) {
          const timer = window.setTimeout(
            () => {
              setDisplay(
                Array.from(target)
                  .map((character, index) => {
                    if (character === " ") return " ";
                    if (step === Math.max(flipsPerChar, 1) - 1)
                      return character;
                    return alphabet[(step * 7 + index * 11) % alphabet.length];
                  })
                  .join(""),
              );
              if (step === Math.max(flipsPerChar, 1) - 1) {
                setWordIndex(resolvedIndex);
              }
            },
            step * Math.max(flipDuration, 0.04) * 1000,
          );
          timers.add(timer);
        }
      },
      Math.max(cycleDelay, 500),
    );

    return () => {
      window.clearInterval(cycle);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [
    charset,
    cycleDelay,
    flipDuration,
    flipsPerChar,
    length,
    loop,
    safeWords,
    wordIndex,
  ]);

  const style: SplitFlapStyle = {
    "--split-flap-duration": `${Math.max(flipDuration, 0.04)}s`,
    "--split-flap-stagger": `${Math.max(stagger, 0)}s`,
    "--split-flap-tile": tileColor,
    "--split-flap-text": textColor,
    "--split-flap-radius": `${Math.max(tileRadius, 0)}px`,
    "--split-flap-gap": `${Math.max(gap, 0)}px`,
    "--split-flap-font-size": `${Math.max(fontSize, 10)}px`,
  };

  return (
    <span
      className={[
        "split-flap",
        variant === "minimal" && "split-flap--minimal",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-split-flap="true"
      aria-label={safeWords[wordIndex].trimEnd()}
      style={style}
    >
      {Array.from(display).map((character, index) => (
        <span
          className="split-flap__tile"
          aria-hidden="true"
          style={{ "--tile-index": index } as CSSProperties}
          key={`${display}-${index}`}
        >
          <span>{character === " " ? "\u00a0" : character}</span>
        </span>
      ))}
      <style>{`
        .split-flap { display: inline-flex; gap: var(--split-flap-gap); white-space: nowrap; }
        .split-flap__tile { position: relative; display: grid; place-items: center; width: 0.72em; height: 1.08em; overflow: hidden; border: 1px solid var(--split-flap-tile-border, rgba(117, 234, 216, 0.16)); border-radius: var(--split-flap-radius); background: var(--split-flap-tile); color: var(--split-flap-text); box-shadow: var(--split-flap-tile-shadow, inset 0 -1px rgba(255,255,255,.08), 0 .35rem 1rem rgba(0,0,0,.18)); font: 700 var(--split-flap-font-size)/1 ui-monospace, SFMono-Regular, Consolas, monospace; }
        .split-flap--minimal > .split-flap__tile { border-color: var(--split-flap-tile-border, rgba(117,234,216,.08)); box-shadow: var(--split-flap-tile-shadow, inset 0 -1px rgba(255,255,255,.03), 0 .2rem .55rem rgba(0,0,0,.1)); }
        .split-flap--minimal > .split-flap__tile:last-of-type { width: .56em; border-color: transparent; background: transparent; box-shadow: none; }
        .split-flap--minimal > .split-flap__tile:last-of-type::after { display: none; }
        .split-flap__tile::after { position: absolute; right: 0; left: 0; top: 50%; height: 1px; background: rgba(0,0,0,.72); content: ""; }
        .split-flap__tile span { animation: split-flap-turn var(--split-flap-duration) ease-out both; animation-delay: calc(var(--tile-index) * var(--split-flap-stagger)); }
        @keyframes split-flap-turn { from { opacity: .35; transform: translateY(-38%) rotateX(-70deg); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .split-flap__tile span { animation: none; } }
      `}</style>
    </span>
  );
}
