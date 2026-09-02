import {
  default as React,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
} from "react";
import type { SiteHref } from "@/data/profile";

type SpecularStyle = CSSProperties &
  Record<`--specular-${string}`, string | number>;

interface Props {
  children: ReactNode;
  href?: SiteHref | `${SiteHref}#${string}`;
  size?: "sm" | "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function SpecularButton({
  children,
  href,
  size = "md",
  radius = 16,
  tint = "#ffffff",
  tintOpacity = 0,
  blur = 0,
  textColor = "#f5f5f5",
  lineColor = "#ffffff",
  baseColor = "#525252",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = false,
  proximity = 250,
  autoAnimate = false,
  className = "",
  onClick,
}: Props) {
  const elementRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !followMouse) return;

    const canTrack = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canTrack.matches || reducedMotion.matches) return;

    const updateHighlight = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const closestX = clamp(event.clientX, rect.left, rect.right);
      const closestY = clamp(event.clientY, rect.top, rect.bottom);
      const distance = Math.hypot(
        event.clientX - closestX,
        event.clientY - closestY,
      );
      const active = clamp(1 - distance / Math.max(proximity, 1), 0, 1);

      element.style.setProperty(
        "--specular-x",
        `${clamp(((event.clientX - rect.left) / rect.width) * 100, -35, 135)}%`,
      );
      element.style.setProperty(
        "--specular-y",
        `${clamp(((event.clientY - rect.top) / rect.height) * 100, -60, 160)}%`,
      );
      element.style.setProperty("--specular-active", active.toFixed(3));
    };

    window.addEventListener("pointermove", updateHighlight, { passive: true });
    return () => window.removeEventListener("pointermove", updateHighlight);
  }, [followMouse, proximity]);

  const classes = ["specular-button", `specular-button--${size}`, className]
    .filter(Boolean)
    .join(" ");
  const style: SpecularStyle = {
    "--specular-radius": `${Math.max(radius, 0)}px`,
    "--specular-tint": tint,
    "--specular-tint-mix": `${clamp(tintOpacity, 0, 1) * 100}%`,
    "--specular-blur": `${Math.max(blur, 0)}px`,
    "--specular-text": textColor,
    "--specular-line": lineColor,
    "--specular-base": baseColor,
    "--specular-intensity": clamp(intensity, 0, 2),
    "--specular-size": `${clamp(shineSize, 1, 100)}%`,
    "--specular-fade": `${clamp(shineFade, 1, 100)}%`,
    "--specular-thickness": `${Math.max(thickness, 0)}px`,
    "--specular-speed": `${Math.max(speed, 0.05)}s`,
  };
  const content = (
    <>
      <span className="specular-button__surface" aria-hidden="true" />
      <span className="specular-button__shine" aria-hidden="true" />
      <span className="specular-button__content">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={elementRef as Ref<HTMLAnchorElement>}
        className={classes}
        href={href}
        style={style}
        data-specular-button="true"
        data-auto-animate={autoAnimate ? "true" : "false"}
        data-follow-mouse={followMouse ? "true" : "false"}
        data-cursor-target
        onClick={(event) => onClick?.(event)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={elementRef as Ref<HTMLButtonElement>}
      className={classes}
      type="button"
      style={style}
      data-specular-button="true"
      data-auto-animate={autoAnimate ? "true" : "false"}
      data-follow-mouse={followMouse ? "true" : "false"}
      data-cursor-target
      onClick={(event) => onClick?.(event)}
    >
      {content}
    </button>
  );
}
