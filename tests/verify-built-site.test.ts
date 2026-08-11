import { describe, expect, it } from "vitest";
import {
  hasContractFailure,
  inspectBuiltSite,
  renderedTextFromHtml,
} from "../scripts/verify-built-site.mjs";

const footer = "SHENG · AI TRAINER IN PROGRESS · BUILT WITH CURIOSITY";
const validHtml = `<!doctype html>
<html lang="zh-CN"><head>
  <meta name="theme-color" content="#070811">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Sheng | AI TRAINER IN PROGRESS">
  <meta property="og:description" content="Sheng 的个人网站">
  <meta name="twitter:card" content="summary_large_image">
</head><body>
  <header><nav aria-label="Primary navigation">
    <a href="#top" aria-current="location">首页</a>
    <a href="#learning">正在学习</a>
    <a href="#roadmap">路线图</a>
  </nav></header>
  <main>
    <section id="top" class="hero">
      <canvas class="quantum-network"></canvas>
      <p class="hero__hello">HELLO, I'M SHENG</p>
      <p class="hero__role">AI TRAINER IN PROGRESS</p>
      <h1>保持好奇，<span>奔赴未知。</span></h1>
      <a href="#roadmap">查看入行路线</a><a href="#learning">正在学习</a>
      <picture>
        <source type="image/avif" srcset="/p-480.avif 480w, /p-960.avif 960w">
        <source type="image/webp" srcset="/p-480.webp 480w, /p-960.webp 960w">
        <img src="/portrait.png" width="1672" height="941" sizes="100vw" alt="Sheng 的 3D IP 形象">
      </picture>
    </section>
    <section id="about"><h2>关于</h2></section>
    <section id="learning"><h2>正在建立的能力</h2><ul class="learning__grid">
      <li><p class="learning__status">正在学习</p><h3>数据标注</h3></li>
      <li><p class="learning__status">正在学习</p><h3>提示词设计</h3></li>
      <li><p class="learning__status">正在学习</p><h3>回答评估</h3></li>
    </ul></section>
    <section id="roadmap"><h2>一步一步，走进入行现场</h2></section>
    <section id="principles"><h2>判断回答的三个准则</h2></section>
  </main>
  <footer>${footer}</footer>
</body></html>`;

describe("built-site verifier", () => {
  it("accepts the complete single-page structural contract", () => {
    const result = inspectBuiltSite(validHtml);

    expect(result).toMatchObject({
      navRoutesValid: true,
      activeNavCount: 1,
      heroIdentityVisible: true,
      footerValid: true,
      learningStatusesValid: true,
      responsivePortraitValid: true,
      canvasCount: 1,
    });
    expect(hasContractFailure(result)).toBe(false);
  });

  it("rejects navigation that opens a separate learning page", () => {
    const mutated = validHtml.replace('href="#learning"', 'href="/learning"');

    expect(inspectBuiltSite(mutated).navRoutesValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("rejects a missing scrolling section", () => {
    const mutated = validHtml.replace('id="roadmap"', 'id="removed-roadmap"');

    expect(inspectBuiltSite(mutated).missing).toContain('id="roadmap"');
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("rejects a learning card without its honest status", () => {
    const mutated = validHtml.replace(
      '<p class="learning__status">正在学习</p><h3>数据标注</h3>',
      "<h3>数据标注</h3>",
    );

    expect(inspectBuiltSite(mutated).learningStatusesValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("rejects a homepage without responsive portrait sources", () => {
    const mutated = validHtml.replace(/<source type="image\/avif"[^>]*>/, "");

    expect(inspectBuiltSite(mutated).responsivePortraitValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it("detects claims only in rendered text", () => {
    expect(inspectBuiltSite("<p>AI 熟练度 90%</p>").hasFakePercentage).toBe(
      true,
    );
    const hidden = `<style>.meter { width: 90%; }</style>
      <script>const completion = '95%';</script><p>持续练习。</p>`;
    expect(renderedTextFromHtml(hidden)).toBe("持续练习。");
    expect(inspectBuiltSite(hidden).hasFakePercentage).toBe(false);
  });
});
