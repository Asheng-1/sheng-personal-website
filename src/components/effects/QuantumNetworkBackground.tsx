import { useEffect, useRef } from "react";

interface Props {
  particleCount?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  cyan: boolean;
}

interface Pointer {
  x: number;
  y: number;
}

const CONNECTION_DISTANCE = 142;
const MOBILE_PARTICLE_COUNT = 28;

function createParticles(
  width: number,
  height: number,
  count: number,
): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    radius: 0.7 + Math.random() * 1.15,
    cyan: index % 4 === 0,
  }));
}

function renderQuantumFrame(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particles: Particle[],
  pointer: Pointer,
  reduced: boolean,
) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);
  context.lineWidth = 0.7;

  particles.forEach((particle, index) => {
    if (!reduced) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x <= 0 || particle.x >= width) {
        particle.x = Math.min(width, Math.max(0, particle.x));
        particle.vx *= -1;
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.y = Math.min(height, Math.max(0, particle.y));
        particle.vy *= -1;
      }
    }

    for (
      let otherIndex = index + 1;
      otherIndex < particles.length;
      otherIndex += 1
    ) {
      const other = particles[otherIndex];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance >= CONNECTION_DISTANCE) continue;

      context.beginPath();
      context.moveTo(particle.x, particle.y);
      context.lineTo(other.x, other.y);
      context.strokeStyle = `rgba(145, 127, 255, ${(1 - distance / CONNECTION_DISTANCE) * 0.18})`;
      context.stroke();
    }

    const pointerDistance = Math.hypot(
      pointer.x - particle.x,
      pointer.y - particle.y,
    );
    if (!reduced && pointerDistance < 170) {
      particle.x += (particle.x - pointer.x) * 0.0026;
      particle.y += (particle.y - pointer.y) * 0.0026;
    }

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = particle.cyan ? "#75ead8" : "#917fff";
    context.fill();
  });
}

export function QuantumNetworkBackground({
  particleCount = 58,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<Pointer>({
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    let frame: number | null = null;

    const stop = () => {
      if (frame === null) return;
      window.cancelAnimationFrame(frame);
      frame = null;
    };

    const draw = () => {
      frame = null;
      renderQuantumFrame(
        context,
        canvas,
        particlesRef.current,
        pointerRef.current,
        reduced,
      );
      schedule();
    };

    const schedule = () => {
      if (frame !== null || reduced || document.hidden) return;
      frame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = width <= 700 ? MOBILE_PARTICLE_COUNT : particleCount;
      particlesRef.current = createParticles(width, height, count);

      if (reduced || document.hidden) {
        renderQuantumFrame(
          context,
          canvas,
          particlesRef.current,
          pointerRef.current,
          true,
        );
      }
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
    };

    const resetPointer = () => {
      pointerRef.current = {
        x: Number.POSITIVE_INFINITY,
        y: Number.POSITIVE_INFINITY,
      };
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        schedule();
      }
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      stop();

      if (reduced) {
        renderQuantumFrame(
          context,
          canvas,
          particlesRef.current,
          pointerRef.current,
          true,
        );
      } else {
        schedule();
      }
    };

    resize();
    schedule();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", resetPointer);
    motionQuery.addEventListener("change", handleMotionPreference);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", resetPointer);
      motionQuery.removeEventListener("change", handleMotionPreference);
    };
  }, [particleCount]);

  const classes = ["quantum-network", className].filter(Boolean).join(" ");
  return <canvas ref={canvasRef} className={classes} aria-hidden="true" />;
}
