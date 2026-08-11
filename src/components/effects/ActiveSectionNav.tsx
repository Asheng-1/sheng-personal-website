import { useEffect, useState } from "react";
import type { NavItem } from "@/data/profile";

interface Props {
  items: readonly NavItem[];
}

export default function ActiveSectionNav({ items }: Props) {
  const [active, setActive] = useState(items[0]?.href ?? "");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const nodes = items
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-35% 0px -55%" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Primary navigation" className="section-nav">
      {items.map(({ href, label }) => (
        <a
          aria-current={active === href ? "location" : undefined}
          className="section-nav__link"
          href={href}
          key={href}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
