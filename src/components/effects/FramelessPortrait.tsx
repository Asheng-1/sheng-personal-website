import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function FramelessPortrait({ children }: Props) {
  const portraitRef = useRef<HTMLDivElement>(null);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      -0.5,
      Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
    );
    const y = Math.max(
      -0.5,
      Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
    );

    const image = portraitRef.current?.querySelector("img");
    const visual = event.currentTarget.closest<HTMLElement>(".hero__visual");
    if (image) {
      image.style.transform = `perspective(1400px) translate3d(${x * 8}px, ${y * 5}px, 10px) rotateX(${-y * 3.5}deg) rotateY(${x * 6}deg) scale(1.015)`;
    }
    visual?.style.setProperty("--portrait-depth-x", `${-x * 5}px`);
    visual?.style.setProperty("--portrait-depth-y", `${-y * 3}px`);
  };

  const reset = () => {
    const image = portraitRef.current?.querySelector("img");
    if (image) image.style.transform = "";
    const visual = portraitRef.current?.closest<HTMLElement>(".hero__visual");
    visual?.style.removeProperty("--portrait-depth-x");
    visual?.style.removeProperty("--portrait-depth-y");
  };

  return (
    <div
      ref={portraitRef}
      className="frameless-portrait"
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
