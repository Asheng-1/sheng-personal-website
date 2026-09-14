import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const portraitSource = readFileSync(
  fileURLToPath(
    new URL("../src/components/effects/FramelessPortrait.tsx", import.meta.url),
  ),
  "utf8",
);
const heroSource = readFileSync(
  fileURLToPath(
    new URL("../src/components/sections/Hero.astro", import.meta.url),
  ),
  "utf8",
);

describe("frameless portrait", () => {
  it("adds restrained perspective motion to the portrait", () => {
    expect(portraitSource).toContain("perspective(1400px)");
    expect(portraitSource).toContain("translate3d(");
    expect(portraitSource).toContain("rotateX(");
    expect(portraitSource).toContain("rotateY(");
    expect(portraitSource).toContain("scale(1.015)");
  });

  it("moves a subdued scan ring behind the portrait", () => {
    expect(portraitSource).toContain("--portrait-depth-x");
    expect(portraitSource).toContain("--portrait-depth-y");
    expect(heroSource).toContain("rgba(117, 234, 216, 0.14)");
    expect(heroSource).toMatch(
      /translate3d\(\s*var\(--portrait-depth-x\),\s*var\(--portrait-depth-y\),\s*0\s*\)/,
    );
  });

  it("keeps reduced-motion and touch-pointer fallbacks", () => {
    expect(portraitSource).toContain("prefers-reduced-motion: reduce");
    expect(portraitSource).toContain("pointer: coarse");
    expect(portraitSource).toContain("onPointerLeave={reset}");
  });
});
