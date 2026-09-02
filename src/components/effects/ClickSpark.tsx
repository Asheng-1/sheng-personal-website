import { useEffect, useRef } from "react";

interface Props {
  targets: readonly string[];
}

const SPARK_COUNT = 7;

export function ClickSpark({ targets }: Props) {
  const layerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const activeSparks = new Set<HTMLSpanElement>();
    const timeouts = new Map<HTMLSpanElement, number>();

    const removeSpark = (spark: HTMLSpanElement) => {
      const timeout = timeouts.get(spark);
      if (timeout !== undefined) window.clearTimeout(timeout);
      timeouts.delete(spark);
      activeSparks.delete(spark);
      spark.remove();
    };

    const clearSparks = () => {
      activeSparks.forEach(removeSpark);
    };

    const matchesTarget = (node: Element) =>
      targets.some((selector) => node.closest(selector));

    const activate = (event: MouseEvent) => {
      const eventTarget = event.target;
      if (!(eventTarget instanceof Element) || !matchesTarget(eventTarget))
        return;

      clearSparks();
      if (motionQuery.matches) return;

      const target = targets
        .map((selector) => eventTarget.closest(selector))
        .find(Boolean);
      const bounds = target?.getBoundingClientRect();
      const originX =
        event.detail === 0 && bounds
          ? bounds.left + bounds.width / 2
          : event.clientX;
      const originY =
        event.detail === 0 && bounds
          ? bounds.top + bounds.height / 2
          : event.clientY;

      for (let index = 0; index < SPARK_COUNT; index += 1) {
        const spark = document.createElement("span");
        const angle = (Math.PI * 2 * index) / SPARK_COUNT;
        spark.className = "click-spark__particle";
        spark.style.left = `${originX}px`;
        spark.style.top = `${originY}px`;
        spark.style.setProperty("--spark-x", `${Math.cos(angle) * 24}px`);
        spark.style.setProperty("--spark-y", `${Math.sin(angle) * 24}px`);
        layer.append(spark);
        activeSparks.add(spark);
        timeouts.set(
          spark,
          window.setTimeout(() => removeSpark(spark), 520),
        );
      }
    };

    document.addEventListener("click", activate);
    return () => {
      document.removeEventListener("click", activate);
      clearSparks();
    };
  }, [targets]);

  return <span ref={layerRef} className="click-spark" aria-hidden="true" />;
}
