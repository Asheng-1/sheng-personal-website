import { useEffect, useRef, useState } from 'react';
import { shouldRunPointerEffects } from '@/lib/effects';

interface Props {
  targets: readonly string[];
}

export function TargetCursor({ targets }: Props) {
  const ringRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const update = () => {
      setEnabled(
        shouldRunPointerEffects({
          reducedMotion: motionQuery.matches,
          coarsePointer: pointerQuery.matches,
          viewportWidth: window.innerWidth,
        }),
      );
    };

    update();
    window.addEventListener('resize', update);
    motionQuery.addEventListener('change', update);
    pointerQuery.addEventListener('change', update);

    return () => {
      window.removeEventListener('resize', update);
      motionQuery.removeEventListener('change', update);
      pointerQuery.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!enabled || !ring) return;

    const move = (event: PointerEvent) => {
      ring.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      ring.dataset.visible = 'true';

      const target = event.target;
      ring.dataset.active = String(
        target instanceof Element &&
          targets.some((selector) => target.closest(selector)),
      );
    };

    const hide = () => {
      ring.dataset.visible = 'false';
      ring.dataset.active = 'false';
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', hide);
    document.documentElement.addEventListener('pointerleave', hide);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', hide);
      document.documentElement.removeEventListener('pointerleave', hide);
    };
  }, [enabled, targets]);

  if (!enabled) return null;

  return (
    <span
      ref={ringRef}
      className="target-cursor"
      data-visible="false"
      data-active="false"
      aria-hidden="true"
    />
  );
}
