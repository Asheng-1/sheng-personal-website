import type { NavItem } from "@/data/profile";

interface AdjacentPages {
  previous: NavItem | null;
  next: NavItem | null;
}

export function getAdjacentPages(
  nav: readonly NavItem[],
  currentPath: string,
): AdjacentPages {
  const normalizedPath =
    currentPath === "/" ? "/" : currentPath.replace(/\/$/, "");
  const currentIndex = nav.findIndex(({ href }) => href === normalizedPath);

  if (currentIndex < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: nav[currentIndex - 1] ?? null,
    next: nav[currentIndex + 1] ?? null,
  };
}
