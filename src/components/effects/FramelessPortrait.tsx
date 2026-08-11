import { useRef } from 'react';

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function FramelessPortrait({ src, alt, width, height }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (imageRef.current) {
      imageRef.current.style.transform = `translate(${x * 7}px, ${y * 5}px) scale(1.01)`;
    }
  };

  const reset = () => {
    if (imageRef.current) imageRef.current.style.transform = '';
  };

  return (
    <div className="frameless-portrait" onPointerMove={move} onPointerLeave={reset}>
      <img ref={imageRef} src={src} alt={alt} width={width} height={height} fetchPriority="high" />
    </div>
  );
}
