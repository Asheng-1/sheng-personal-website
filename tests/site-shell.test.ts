import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";

const fromRoot = (path: string) =>
  fileURLToPath(new URL(`../${path}`, import.meta.url));

const readSource = (path: string) => readFileSync(fromRoot(path), "utf8");
const pageDirectory = fromRoot("src/pages/");
const indexSource = readSource("src/pages/index.astro");
const learningPageSource = readSource("src/pages/learning.astro");
const roadmapPageSource = readSource("src/pages/roadmap.astro");
const heroSource = readSource("src/components/sections/Hero.astro");
const learningSource = readSource("src/components/sections/LearningGrid.astro");
const roadmapSource = readSource("src/components/sections/Roadmap.astro");
const principlesSource = readSource("src/components/sections/Principles.astro");

describe("multi-page site shell source", () => {
  it("maps every primary navigation item to a real page", () => {
    expect(profile.nav.map(({ href }) => href)).toEqual([
      "/",
      "/learning",
      "/roadmap",
    ]);

    const routeFiles = readdirSync(pageDirectory)
      .filter((name) => name.endsWith(".astro"))
      .sort();

    expect(routeFiles).toEqual([
      "404.astro",
      "index.astro",
      "learning.astro",
      "roadmap.astro",
    ]);
  });

  it("keeps the homepage focused on identity and introduction", () => {
    expect(indexSource).toContain("<Hero");
    expect(indexSource).toContain("<About");
    expect(indexSource).not.toContain("<LearningGrid");
    expect(indexSource).not.toContain("<Roadmap");
    expect(indexSource).not.toContain("<Principles");
  });

  it("routes homepage calls to action to independent pages", () => {
    expect(heroSource).toContain('href="/roadmap"');
    expect(heroSource).toContain('href="/learning"');
    expect(heroSource).not.toContain('href="#roadmap"');
    expect(heroSource).not.toContain('href="#learning"');
  });

  it("composes each secondary page from its intended content", () => {
    expect(learningPageSource).toContain("<LearningGrid");
    expect(learningPageSource).not.toContain("<Roadmap");
    expect(roadmapPageSource).toContain("<Roadmap");
    expect(roadmapPageSource).toContain("<Principles");
  });

  it("provides exactly one page-level heading per route", () => {
    expect(heroSource.match(/<h1\b/g)).toHaveLength(1);
    expect(learningSource.match(/<h1\b/g)).toHaveLength(1);
    expect(roadmapSource.match(/<h1\b/g)).toHaveLength(1);
    expect(principlesSource.match(/<h1\b/g) ?? []).toHaveLength(0);
  });
});
