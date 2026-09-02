import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const readSource = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");

const componentSource = readSource("src/components/effects/ShinyText.tsx");
const aboutSource = readSource("src/components/sections/AboutShowcase.astro");
const contactSource = readSource("src/components/sections/ContactPanel.astro");
const headerSource = readSource("src/components/layout/SiteHeader.astro");

describe("ShinyText", () => {
  it("exposes configurable shine styling and reduced-motion support", () => {
    expect(componentSource).toContain('data-shiny-text="true"');
    expect(componentSource).toContain('"--shiny-speed"');
    expect(componentSource).toContain('"--shiny-spread"');
    expect(componentSource).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps the editorial about title static and the contact title shiny", () => {
    expect(aboutSource).not.toContain("import { ShinyText }");
    expect(aboutSource).toContain(
      '<h1 id="about-title">关于我<span aria-hidden="true">_</span></h1>',
    );
    expect(contactSource).toContain("import { ShinyText }");
    expect(contactSource).toContain('text="联系方式"');
  });

  it("adds a restrained shine to the desktop system status", () => {
    expect(headerSource).toContain("import { ShinyText }");
    expect(headerSource).toMatch(
      /<ShinyText[^>]+text="SYS ONLINE"[^>]+speed=\{6\}/,
    );
  });
});
