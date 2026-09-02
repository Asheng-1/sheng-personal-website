import { describe, expect, it } from "vitest";
import { shouldRunPointerEffects } from "@/lib/effects";

describe("shouldRunPointerEffects", () => {
  it("runs only for a wide fine-pointer viewport without reduced motion", () => {
    expect(
      shouldRunPointerEffects({
        reducedMotion: false,
        coarsePointer: false,
        viewportWidth: 1440,
      }),
    ).toBe(true);
    expect(
      shouldRunPointerEffects({
        reducedMotion: true,
        coarsePointer: false,
        viewportWidth: 1440,
      }),
    ).toBe(false);
    expect(
      shouldRunPointerEffects({
        reducedMotion: false,
        coarsePointer: true,
        viewportWidth: 1440,
      }),
    ).toBe(false);
    expect(
      shouldRunPointerEffects({
        reducedMotion: false,
        coarsePointer: false,
        viewportWidth: 600,
      }),
    ).toBe(false);
  });
});
