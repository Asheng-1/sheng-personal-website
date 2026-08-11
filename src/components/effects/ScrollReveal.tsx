import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ScrollReveal({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const classes = ['scroll-reveal', className].filter(Boolean).join(' ');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.dataset.enhanced = 'true';

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      node.dataset.visible = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.visible = 'true';
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={classes}
      data-visible="false"
      data-enhanced="false"
    >
      {children}
    </div>
  );
}
