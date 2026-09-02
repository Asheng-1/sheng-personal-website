function normalizeBase(base: string): string {
  const withLeadingSlash = base.startsWith("/") ? base : `/${base}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

export function withBasePath(
  path: string,
  base = import.meta.env.BASE_URL,
): string {
  const normalizedBase = normalizeBase(base);

  if (path === "/") {
    return normalizedBase;
  }

  return `${normalizedBase}${path.replace(/^\/+/, "")}`;
}

export function stripBasePath(
  pathname: string,
  base = import.meta.env.BASE_URL,
): string {
  const normalizedBase = normalizeBase(base);

  if (normalizedBase === "/") {
    return pathname;
  }

  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1);

  if (pathname === baseWithoutTrailingSlash || pathname === normalizedBase) {
    return "/";
  }

  return pathname.startsWith(normalizedBase)
    ? `/${pathname.slice(normalizedBase.length)}`
    : pathname;
}
