import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";

function collectAstroFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;

    if (entry.isDirectory()) return collectAstroFiles(path);
    return entry.name.endsWith(".astro") ? [path] : [];
  });
}

const sectionDirectory = fileURLToPath(
  new URL("../src/components/sections/", import.meta.url),
);
const pageSource = readFileSync(
  fileURLToPath(new URL("../src/pages/index.astro", import.meta.url)),
  "utf8",
);
const heroSource = readFileSync(
  fileURLToPath(
    new URL("../src/components/sections/Hero.astro", import.meta.url),
  ),
  "utf8",
);
const pageDirectory = fileURLToPath(new URL("../src/pages/", import.meta.url));
const sectionSources = collectAstroFiles(sectionDirectory).map((path) =>
  readFileSync(path, "utf8"),
);
const literalIds = sectionSources.flatMap((source) =>
  [...source.matchAll(/\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/g)].map(
    (match) => match[1] ?? match[2],
  ),
);

describe("single-page site shell source", () => {
  it("provides a literal target for every navigation anchor", () => {
    for (const { href } of profile.nav) {
      expect(literalIds).toContain(href.slice(1));
    }
  });

  it("defines every scrolling section id exactly once", () => {
    for (const id of ["top", "about", "learning", "roadmap", "principles"]) {
      expect(
        literalIds.filter((value) => value === id),
        id,
      ).toHaveLength(1);
    }

    expect(new Set(literalIds).size).toBe(literalIds.length);
  });

  it("defines one page-level heading", () => {
    const h1Count = sectionSources.reduce(
      (count, source) => count + (source.match(/<h1\b/g) ?? []).length,
      0,
    );

    expect(h1Count).toBe(1);
  });

  it("keeps all primary sections inside one page", () => {
    expect(pageSource).toContain("<Hero");
    expect(pageSource).toContain("<About");
    expect(pageSource).toContain("<LearningGrid");
    expect(pageSource).toContain("<Roadmap");
    expect(pageSource).toContain("<Principles");

    const routeFiles = readdirSync(pageDirectory)
      .filter((name) => name.endsWith(".astro"))
      .sort();
    expect(routeFiles).toEqual(["404.astro", "index.astro"]);
  });

  it("uses in-page CTA targets", () => {
    expect(heroSource).toContain('href="#roadmap"');
    expect(heroSource).toContain('href="#learning"');
  });
});
