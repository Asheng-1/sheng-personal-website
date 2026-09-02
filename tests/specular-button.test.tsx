import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SpecularButton } from "@/components/effects/SpecularButton";

describe("SpecularButton", () => {
  it("renders a styled navigation link with the supplied visual controls", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SpecularButton, {
        href: "/learning",
        size: "lg",
        radius: 18,
        baseColor: "#525252",
        followMouse: true,
        children: "正在学习",
      }),
    );

    expect(markup).toContain('href="/learning"');
    expect(markup).toContain('data-specular-button="true"');
    expect(markup).toContain('data-follow-mouse="true"');
    expect(markup).toContain("--specular-radius:18px");
    expect(markup).toContain("--specular-base:#525252");
    expect(markup).toContain(">正在学习<");
  });
});
