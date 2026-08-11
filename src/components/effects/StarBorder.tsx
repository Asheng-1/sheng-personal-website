import type { PointerEvent, ReactNode } from "react";
import type { SiteHref } from "@/data/profile";

interface Props {
  href: SiteHref;
  children: ReactNode;
  className?: string;
}

function reset(anchor: HTMLAnchorElement) {
  anchor.style.setProperty("--star-shift-x", "0px");
  anchor.style.setProperty("--star-shift-y", "0px");
}

export function StarBorder({ href, children, className = "" }: Props) {
  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    if (
      event.pointerType === "touch" ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      reset(event.currentTarget);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    event.currentTarget.style.setProperty("--star-shift-x", `${x}px`);
    event.currentTarget.style.setProperty("--star-shift-y", `${y}px`);
  };
  const classes = ["star-border", className].filter(Boolean).join(" ");

  return (
    <a
      className={classes}
      href={href}
      onPointerMove={move}
      onPointerLeave={(event) => reset(event.currentTarget)}
      data-cursor-target
    >
      {children}
    </a>
  );
}
