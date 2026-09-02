import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SpotlightCard } from "@/components/effects/SpotlightCard";

describe("SpotlightCard", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("does not advertise a non-interactive card as a cursor target", () => {
    vi.stubGlobal("React", React);
    const markup = renderToStaticMarkup(
      <SpotlightCard>Learning item</SpotlightCard>,
    );

    expect(markup).not.toContain("data-cursor-target");
  });
});
