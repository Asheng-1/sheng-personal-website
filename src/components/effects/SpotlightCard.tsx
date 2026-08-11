import type { PointerEvent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = '' }: Props) {
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;

    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--spotlight-x',
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      '--spotlight-y',
      `${event.clientY - rect.top}px`,
    );
  };
  const classes = ['spotlight-card', className].filter(Boolean).join(' ');

  return (
    <article className={classes} onPointerMove={move} data-cursor-target>
      {children}
    </article>
  );
}
