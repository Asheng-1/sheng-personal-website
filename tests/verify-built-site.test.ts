import { describe, expect, it } from 'vitest';
import {
  hasContractFailure,
  inspectBuiltSite,
  renderedTextFromHtml,
} from '../scripts/verify-built-site.mjs';

const footer = 'SHENG · AI TRAINER IN PROGRESS · BUILT WITH CURIOSITY';
const validHtml = `<!doctype html>
<html lang="zh-CN"><head>
  <meta name="theme-color" content="#070811">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Sheng">
  <meta property="og:description" content="保持好奇，奔赴未知">
  <meta name="twitter:card" content="summary_large_image">
</head><body>
  <header><nav aria-label="Primary navigation">
    <a href="#top">首页</a><a href="#learning">正在学习</a><a href="#roadmap">路线图</a>
  </nav></header>
  <main>
    <section id="top" class="hero">
      <canvas class="quantum-network"></canvas>
      <p class="hero__hello">HELLO, I'M SHENG</p>
      <p class="hero__role">AI TRAINER IN PROGRESS</p>
      <h1>保持好奇，<span>奔赴未知。</span></h1>
      <a href="#roadmap">查看入行路线</a>
      <picture class="hero__portrait">
        <source type="image/avif" srcset="/portrait-480.avif 480w, /portrait-960.avif 960w">
        <source type="image/webp" srcset="/portrait-480.webp 480w, /portrait-960.webp 960w">
        <img src="/portrait.png" width="1672" height="941" sizes="100vw" alt="Sheng 的 3D IP 形象">
      </picture>
    </section>
    <section id="about"><h2>关于</h2></section>
    <section id="learning"><ul class="learning__grid">
      <li><article><p class="learning__status">正在学习</p><h3>数据标注</h3></article></li>
      <li><article><p class="learning__status">正在学习</p><h3>提示词设计</h3></article></li>
      <li><article><p class="learning__status">正在学习</p><h3>回答评估</h3></article></li>
    </ul></section>
    <section id="roadmap"><h2>路线图</h2></section>
    <section id="principles"><h2>原则</h2></section>
  </main>
  <footer>${footer}</footer>
</body></html>`;

describe('built-site verifier', () => {
  it('rejects a percentage claim embedded in visible copy', () => {
    const result = inspectBuiltSite('<p>AI 熟练度 90%</p>');

    expect(result.hasFakePercentage).toBe(true);
  });

  it('ignores non-rendered percentages in scripts and styles', () => {
    const html = `
      <style>.meter { width: 90%; }</style>
      <script>const completion = '95%';</script>
      <p>持续练习，不使用能力百分比。</p>
    `;

    expect(renderedTextFromHtml(html)).toBe('持续练习，不使用能力百分比。');
    expect(inspectBuiltSite(html).hasFakePercentage).toBe(false);
  });

  it('accepts a complete structural contract', () => {
    expect(inspectBuiltSite(validHtml)).toMatchObject({
      navAnchorsValid: true,
      heroIdentityVisible: true,
      footerValid: true,
      learningStatusesValid: true,
      responsivePortraitValid: true,
      canvasCount: 1,
    });
    expect(hasContractFailure(inspectBuiltSite(validHtml))).toBe(false);
  });

  it('rejects a navigation anchor removed from the primary nav', () => {
    const mutated = validHtml.replace('<a href="#roadmap">路线图</a>', '');

    expect(inspectBuiltSite(mutated).navAnchorsValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it.each([
    ['hidden eyebrow', 'class="hero__hello"', 'class="hero__hello" hidden'],
    [
      'removed role',
      '<p class="hero__role">AI TRAINER IN PROGRESS</p>',
      '',
    ],
  ])('rejects %s', (_name, target, replacement) => {
    const mutated = validHtml.replace(target, replacement);

    expect(inspectBuiltSite(mutated).heroIdentityVisible).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it('rejects an incorrect footer identity', () => {
    const mutated = validHtml.replace(footer, footer.replaceAll('·', '路'));

    expect(inspectBuiltSite(mutated).footerValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it('rejects a learning card without its honest status', () => {
    const mutated = validHtml.replace(
      '<p class="learning__status">正在学习</p><h3>数据标注</h3>',
      '<h3>数据标注</h3>',
    );

    expect(inspectBuiltSite(mutated).learningStatusesValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it.each([
    ['AVIF', /\s*<source type="image\/avif"[^>]*>/],
    ['WebP', /\s*<source type="image\/webp"[^>]*>/],
  ])('rejects a portrait missing its %s responsive source', (_name, source) => {
    const mutated = validHtml.replace(source, '');

    expect(inspectBuiltSite(mutated).responsivePortraitValid).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });

  it.each([
    ['zero canvases', '<canvas class="quantum-network"></canvas>', ''],
    [
      'two canvases',
      '<canvas class="quantum-network"></canvas>',
      '<canvas class="quantum-network"></canvas><canvas></canvas>',
    ],
  ])('rejects %s', (_name, target, replacement) => {
    const mutated = validHtml.replace(target, replacement);

    expect(inspectBuiltSite(mutated).canvasCount).not.toBe(1);
    expect(hasContractFailure(inspectBuiltSite(mutated))).toBe(true);
  });
});
