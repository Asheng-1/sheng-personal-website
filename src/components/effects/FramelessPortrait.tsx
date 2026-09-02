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
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const image = portraitRef.current?.querySelector("img");
    if (image) {
      image.style.transform = `translate(${x * 7}px, ${y * 5}px) scale(1.01)`;
    }
  };

  const reset = () => {
    const image = portraitRef.current?.querySelector("img");
    if (image) image.style.transform = "";
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
