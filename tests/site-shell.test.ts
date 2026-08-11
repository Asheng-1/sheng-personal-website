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
const layoutSource = readSource("src/layouts/SiteLayout.astro");
const heroSource = readSource("src/components/sections/Hero.astro");
const learningSource = readSource("src/components/sections/LearningGrid.astro");
const roadmapSource = readSource("src/components/sections/Roadmap.astro");

describe("single-screen homepage source", () => {
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

  it("keeps the homepage to one hero screen without lower sections", () => {
    expect(indexSource).toContain("fitScreen");
    expect(indexSource).toContain("showFooter={false}");
    expect(indexSource).toContain("<Hero");
    expect(indexSource).not.toContain("<About");
    expect(indexSource).not.toContain("<LearningGrid");
    expect(indexSource).not.toContain("<Roadmap");
    expect(layoutSource).toContain("overflow: hidden");
    expect(layoutSource).toContain("height: 100svh");
  });

  it("routes homepage calls to action to independent pages", () => {
    expect(heroSource).toContain('href="/roadmap"');
    expect(heroSource).toContain('href="/learning"');
    expect(heroSource).not.toContain('href="#roadmap"');
    expect(heroSource).not.toContain('href="#learning"');
  });

  it("puts learning first and removes the focus badge", () => {
    expect(heroSource.indexOf('href="/learning"')).toBeLessThan(
      heroSource.indexOf('href="/roadmap"'),
    );
    expect(heroSource).not.toContain("hero__hud");
    expect(heroSource).not.toContain("CURRENT FOCUS");
  });

  it("gives every page exactly one page-level heading", () => {
    expect(heroSource.match(/<h1\b/g)).toHaveLength(1);
    expect(learningSource.match(/<h1\b/g)).toHaveLength(1);
    expect(roadmapSource.match(/<h1\b/g)).toHaveLength(1);
    expect(learningPageSource).toContain("<LearningGrid");
    expect(roadmapPageSource).toContain("<Roadmap");
  });

  it("locks every content page to one viewport without a footer", () => {
    for (const source of [indexSource, learningPageSource, roadmapPageSource]) {
      expect(source).toContain("fitScreen");
      expect(source).toContain("showFooter={false}");
    }
  });
});
