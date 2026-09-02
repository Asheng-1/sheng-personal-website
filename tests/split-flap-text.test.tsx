import React, { type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeSplitFlapWords } from "@/lib/splitFlap";
import { SplitFlapText } from "@/components/effects/SplitFlapText";

interface MinimalSplitFlapProps {
  words: readonly string[];
  variant: "minimal";
  gap: number;
  tileRadius: number;
}

describe("normalizeSplitFlapWords", () => {
  it("uppercases and pads every status to the requested tile count", () => {
    expect(normalizeSplitFlapWords(["sync online", "signal live"], 12)).toEqual(
      ["SYNC ONLINE ", "SIGNAL LIVE "],
    );
  });
});

describe("SplitFlapText", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renders the restrained minimal tile variant", () => {
    vi.stubGlobal("React", React);
    const MinimalSplitFlap =
      SplitFlapText as ComponentType<MinimalSplitFlapProps>;
    const markup = renderToStaticMarkup(
      <MinimalSplitFlap
        words={["保持好奇，"]}
        variant="minimal"
        gap={4}
        tileRadius={5}
      />,
    );

    expect(markup).toContain("split-flap--minimal");
    expect(markup).toContain("--split-flap-gap:4px");
    expect(markup).toContain("--split-flap-radius:5px");
    expect(markup).toContain(
      ".split-flap--minimal > .split-flap__tile:last-of-type::after { display: none; }",
    );
  });
});
