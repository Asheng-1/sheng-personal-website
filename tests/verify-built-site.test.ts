import { describe, expect, it } from "vitest";
import {
  hasContractFailure,
  inspectBuiltPage,
  inspectBuiltSite,
  renderedTextFromHtml,
} from "../scripts/verify-built-site.mjs";

const footer = "SHENG · AI TRAINER IN PROGRESS · BUILT WITH CURIOSITY";
const head = (title: string) => `<html lang="zh-CN"><head>
  <meta name="theme-color" content="#070811">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="Sheng 的个人网站">
  <meta name="twitter:card" content="summary_large_image">
</head><body>`;
const nav = (active: "/" | "/learning" | "/roadmap") => `<header>
  <nav aria-label="Primary navigation">
    <a href="/"${active === "/" ? ' aria-current="page"' : ""}>首页</a>
    <a href="/learning"${active === "/learning" ? ' aria-current="page"' : ""}>正在学习</a>
    <a href="/roadmap"${active === "/roadmap" ? ' aria-current="page"' : ""}>路线图</a>
  </nav>
</header>`;
const end = `<footer>${footer}</footer></body></html>`;

const validPages = {
  home: `${head("Sheng | AI TRAINER IN PROGRESS")}${nav("/")}
    <main><section id="top" class="hero">
      <canvas class="quantum-network"></canvas>
      <p class="hero__hello">HELLO, I'M SHENG</p>
      <p class="hero__role">AI TRAINER IN PROGRESS</p>
      <h1>保持好奇，<span>奔赴未知。</span></h1>
      <a href="/roadmap">查看入行路线</a><a href="/learning">正在学习</a>
      <picture><source type="image/avif" srcset="/p-480.avif 480w, /p-960.avif 960w">
      <source type="image/webp" srcset="/p-480.webp 480w, /p-960.webp 960w">
      <img src="/portrait.png" width="1672" height="941" sizes="100vw" alt="Sheng 的 3D IP 形象"></picture>
    </section><section id="about"><h2>关于</h2></section></main>${end}`,
  learning: `${head("正在学习 | Sheng")}${nav("/learning")}
    <main><section id="learning"><h1>正在建立的能力</h1><ul class="learning__grid">
      <li><p class="learning__status">正在学习</p><h3>数据标注</h3></li>
      <li><p class="learning__status">正在学习</p><h3>提示词设计</h3></li>
      <li><p class="learning__status">正在学习</p><h3>回答评估</h3></li>
    </ul></section></main>${end}`,
  roadmap: `${head("入行路线 | Sheng")}${nav("/roadmap")}
    <main><section id="roadmap"><h1>一步一步，走进入行现场</h1></section>
    <section id="principles"><h2>判断回答的三个准则</h2></section></main>${end}`,
};

describe("built-site verifier", () => {
  it("accepts the complete three-page structural contract", () => {
    const result = inspectBuiltSite(validPages);

    expect(result.home).toMatchObject({
      navRoutesValid: true,
      activeNavCount: 1,
      heroIdentityVisible: true,
      responsivePortraitValid: true,
      canvasCount: 1,
    });
    expect(result.learning).toMatchObject({
      learningStatusesValid: true,
      canvasCount: 0,
    });
    expect(result.roadmap.canvasCount).toBe(0);
    expect(hasContractFailure(result)).toBe(false);
  });

  it("rejects same-page hash navigation", () => {
    const mutated = {
      ...validPages,
      home: validPages.home.replace('href="/learning"', 'href="#learning"'),
    };

    expect(inspectBuiltSite(mutated).home.navRoutesValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("rejects a page without exactly one active navigation item", () => {
    const mutated = {
      ...validPages,
      roadmap: validPages.roadmap.replace(' aria-current="page"', ""),
    };

    expect(inspectBuiltSite(mutated).roadmap.activeNavCount).toBe(0);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("rejects a learning card without its honest status", () => {
    const mutated = {
      ...validPages,
      learning: validPages.learning.replace(
        '<p class="learning__status">正在学习</p><h3>数据标注</h3>',
        "<h3>数据标注</h3>",
      ),
    };

    expect(inspectBuiltSite(mutated).learning.learningStatusesValid).toBe(
      false,
    );
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("rejects a homepage without responsive portrait sources", () => {
    const mutated = {
      ...validPages,
      home: validPages.home.replace(/<source type="image\/avif"[^>]*>/, ""),
    };

    expect(inspectBuiltSite(mutated).home.responsivePortraitValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("rejects unexpected canvases on secondary pages", () => {
    const mutated = {
      ...validPages,
      learning: validPages.learning.replace(
        "<main>",
        "<main><canvas></canvas>",
      ),
    };

    expect(inspectBuiltSite(mutated).learning.canvasCount).toBe(1);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("detects claims only in rendered text", () => {
    expect(
      inspectBuiltPage("<p>AI 熟练度 90%</p>", "home").hasFakePercentage,
    ).toBe(true);
    const hidden = `<style>.meter { width: 90%; }</style>
      <script>const completion = '95%';</script><p>持续练习。</p>`;
    expect(renderedTextFromHtml(hidden)).toBe("持续练习。");
    expect(inspectBuiltPage(hidden, "home").hasFakePercentage).toBe(false);
  });
});
