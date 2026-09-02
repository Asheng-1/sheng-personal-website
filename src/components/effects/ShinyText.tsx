import type { CSSProperties } from "react";

interface Props {
  text: string;
  speed?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: "left" | "right";
  yoyo?: boolean;
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
}

type ShinyTextStyle = CSSProperties &
  Record<`--shiny-${string}`, string | number>;

export function ShinyText({
  text,
  speed = 2,
  delay = 0,
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  direction = "left",
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
  className = "",
}: Props) {
  const style: ShinyTextStyle = {
    "--shiny-speed": `${Math.max(speed, 0.2)}s`,
    "--shiny-delay": `${Math.max(delay, 0)}s`,
    "--shiny-color": color,
    "--shiny-highlight": shineColor,
    "--shiny-spread": `${Math.max(spread, 40)}%`,
    "--shiny-start": direction === "left" ? "130%" : "-30%",
    "--shiny-end": direction === "left" ? "-30%" : "130%",
    "--shiny-direction": yoyo ? "alternate" : "normal",
    "--shiny-play-state": pauseOnHover ? "running" : "running",
  };

  return (
    <span
      className={[
        "shiny-text",
        pauseOnHover && "shiny-text--pause",
        disabled && "shiny-text--disabled",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-shiny-text="true"
      style={style}
    >
      {text}
      <style>{`
        .shiny-text {
          display: inline-block;
          background: linear-gradient(
            105deg,
            var(--shiny-color) 0%,
            var(--shiny-color) calc(50% - var(--shiny-spread) / 2),
            var(--shiny-highlight) 50%,
            var(--shiny-color) calc(50% + var(--shiny-spread) / 2),
            var(--shiny-color) 100%
          );
          background-position: var(--shiny-start) 50%;
          background-size: 230% 100%;
          background-clip: text;
          color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shiny-text-sweep var(--shiny-speed) ease-in-out var(--shiny-delay) infinite var(--shiny-direction);
        }

        .shiny-text--pause:hover { animation-play-state: paused; }
        .shiny-text--disabled { animation: none; background-position: 0 50%; }

        @keyframes shiny-text-sweep {
          to { background-position: var(--shiny-end) 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .shiny-text { animation: none; background-position: 0 50%; }
        }
      `}</style>
    </span>
  );
}
