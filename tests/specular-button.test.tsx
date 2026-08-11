import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SpecularButton } from "@/components/effects/SpecularButton";

describe("SpecularButton", () => {
  it("renders a styled navigation link with the supplied visual controls", () => {
    const markup = renderToStaticMarkup(
      <SpecularButton
        href="/learning"
        size="lg"
        radius={18}
        tint="#ffffff"
        tintOpacity={0}
        blur={0}
        textColor="#f5f5f5"
        lineColor="#ffffff"
        baseColor="#525252"
        intensity={1}
        shineSize={10}
        shineFade={40}
        thickness={1}
        speed={0.35}
        followMouse
        proximity={250}
        autoAnimate={false}
      >
        正在学习
      </SpecularButton>,
    );

    expect(markup).toContain('href="/learning"');
    expect(markup).toContain('data-specular-button="true"');
    expect(markup).toContain("--specular-radius:18px");
    expect(markup).toContain("--specular-base:#525252");
    expect(markup).toContain(">正在学习<");
  });
});
