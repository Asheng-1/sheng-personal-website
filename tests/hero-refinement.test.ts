import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const heroSource = readFileSync(
  fileURLToPath(
    new URL("../src/components/sections/Hero.astro", import.meta.url),
  ),
  "utf8",
);

describe("homepage hero refinement", () => {
  it("subdues the animated network behind the headline and portrait", () => {
    expect(heroSource).toMatch(
      /\.hero\s+:global\(\.quantum-network\)\s*\{[^}]*opacity:\s*0\.3;/s,
    );
  });
});
