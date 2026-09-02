import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";

const fromRoot = (path: string) =>
  fileURLToPath(new URL(`../${path}`, import.meta.url));
const readSource = (path: string) => readFileSync(fromRoot(path), "utf8");

const indexSource = readSource("src/pages/index.astro");
const aboutPageSource = readSource("src/pages/learning.astro");
const contactPageSource = readSource("src/pages/roadmap.astro");
const layoutSource = readSource("src/layouts/SiteLayout.astro");
const heroSource = readSource("src/components/sections/Hero.astro");
const aboutSource = readSource("src/components/sections/AboutShowcase.astro");
const contactSource = readSource("src/components/sections/ContactPanel.astro");

describe("two-page personal site shell", () => {
  it("maps every navigation item to an existing route", () => {
    expect(profile.nav).toEqual([
      { label: "首页", href: "/" },
      { label: "关于我", href: "/learning" },
    ]);

    expect(
      readdirSync(fromRoot("src/pages/"))
        .filter((name) => name.endsWith(".astro"))
        .sort(),
    ).toEqual(["404.astro", "index.astro", "learning.astro", "roadmap.astro"]);
  });

  it("keeps home locked while allowing the combined profile page to scroll", () => {
    expect(indexSource).toContain("fitScreen");
    expect(indexSource).toContain("showFooter={false}");
    expect(aboutPageSource).not.toContain("fitScreen");
    expect(aboutPageSource).toContain("showFooter={false}");
    expect(layoutSource).toContain("overflow: hidden");
    expect(layoutSource).toContain("height: 100svh");
  });

  it("routes homepage actions to about and contact", () => {
    expect(heroSource).toMatch(
      /href=\{withBasePath\("\/learning"\)\}[\s\S]*>了解我</,
    );
    expect(heroSource).toMatch(
      /href=\{withBasePath\("\/learning#contact"\)\}[\s\S]*>联系我</,
    );
    expect(heroSource).not.toContain('href="#learning"');
    expect(heroSource).not.toContain('href="#roadmap"');
  });

  it("keeps contact details in the profile rail without a duplicate panel", () => {
    expect(aboutPageSource).toContain("<AboutShowcase");
    expect(aboutPageSource).toContain("profile.about");
    expect(aboutPageSource).toContain("contact={profile.contact}");
    expect(aboutPageSource).not.toContain("<ContactPanel");
    expect(aboutPageSource).not.toContain(
      'import ContactPanel from "@/components/sections/ContactPanel.astro"',
    );
    expect(contactPageSource).toContain('withBasePath("/learning#contact")');
    expect(contactPageSource).not.toContain("<ContactPanel");
  });

  it("gives every page exactly one page-level heading", () => {
    expect(heroSource.match(/<h1\b/g)).toHaveLength(1);
    expect(aboutSource.match(/<h1\b/g)).toHaveLength(1);
    expect(aboutSource).toContain('id="contact"');
  });

  it("uses a personal OS console with truthful data and portfolio placeholders", () => {
    expect(aboutSource).toContain('class="about__console"');
    expect(aboutSource).toContain('class="about__identity system-panel"');
    expect(aboutSource).toContain('class="about__biography system-panel"');
    expect(aboutSource).toContain("about__focus-areas system-panel");
    expect(aboutSource).toContain("about__portfolio system-panel");
    expect(aboutSource).toContain('class="about__work-grid"');
    expect(aboutSource).toContain("content.origin");
    expect(aboutSource).toContain("content.focusAreas");
    expect(aboutSource).toContain('class="about__contact-fact"');
    expect(aboutSource).toContain("所在地");
    expect(aboutSource).toContain("联系方式");
    expect(aboutSource).not.toContain(" LOCATION");
    expect(aboutSource).not.toContain(" CONTACT");
    expect(aboutSource).toContain('href={primaryContact?.href ?? "#contact"}');
    expect(aboutSource).toContain("邮箱待补充");
    expect(aboutSource).not.toContain("content.keywords");
    expect(aboutSource).not.toContain("content.focus]");
    expect(aboutSource).toContain("content.introduction");
    expect(aboutSource).toContain("content.introductionDetails");
    expect(aboutSource).toContain("content.portfolioEmptyState");
    expect(aboutSource).toContain("prefers-reduced-motion: reduce");
    expect(aboutSource).not.toContain("description:");
    expect(aboutSource).not.toContain("我喜欢的两项球类运动");
    expect(aboutSource).not.toContain("正在了解并进入 AI 训练师方向");
    expect(aboutSource).not.toContain("overflow-x: auto");
  });

  it("shows an honest contact empty state and reduced-motion fallback", () => {
    expect(contactSource).toContain('class="contact__empty"');
    expect(contactSource).toContain("content.emptyState");
    expect(contactSource).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps the selected homepage effects and full-resolution portrait", () => {
    expect(heroSource.match(/<SplitFlapText\b/g)).toHaveLength(2);
    expect(heroSource.match(/<SpecularButton\b/g)).toHaveLength(2);
    expect(heroSource).toContain(
      'import heroImage from "@/assets/sheng-ip-hero-refined.png"',
    );
    expect(heroSource).toContain("quality={82}");
  });
});
