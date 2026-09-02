import { describe, expect, it } from "vitest";
import {
  hasContractFailure,
  inspectBuiltPage,
  inspectBuiltSite,
  renderedTextFromHtml,
} from "../scripts/verify-built-site.mjs";

const head = (title: string, bodyClass?: string) => `<html lang="zh-CN"><head>
  <meta name="theme-color" content="#070811">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="Sheng 的个人网站">
  <meta name="twitter:card" content="summary_large_image">
  <style>@media (max-height: 43.75rem) { body.screen-locked { overflow-y: auto; } }</style>
</head><body${bodyClass ? ` class="${bodyClass}"` : ""}>`;
const nav = (active: "/" | "/learning") => `<header>
  <nav aria-label="Primary navigation">
    <a href="/"${active === "/" ? ' aria-current="page"' : ""}>首页</a>
    <a href="/learning"${active === "/learning" ? ' aria-current="page"' : ""}>正在学习</a>
  </nav>
</header>`;
const close = `</body></html>`;
const validStyles =
  "@media (max-height: 43.75rem) { body.screen-locked { overflow-y: auto; } }";

const validPages = {
  home: `${head("Sheng | AI TRAINER IN PROGRESS", "screen-locked")}${nav("/")}
    <main><section id="top" class="hero" data-interface="personal-os">
      <canvas class="quantum-network"></canvas>
      <aside class="hero__identity-panel" aria-label="数字身份">
        <picture><source type="image/avif" srcset="/avatar-96.avif 96w, /avatar-192.avif 192w">
        <source type="image/webp" srcset="/avatar-96.webp 96w, /avatar-192.webp 192w">
        <img src="/avatar.jpg" width="192" height="189" alt="Sheng 常用头像"></picture>
        <p class="hero__hello">HELLO, I'M SHENG</p>
        <p class="hero__role">AI TRAINER IN PROGRESS</p>
      </aside>
      <h1>保持好奇，<span>探索未知。</span></h1>
      <p class="hero__intro">正在把好奇，训练成判断力。</p>
      <div class="hero__status-panel" aria-label="个人状态"><dl>
        <dt>ROLE</dt><dd>AI 训练师</dd>
        <dt>FOCUS</dt><dd>认知 × 创造力</dd>
        <dt>MODE</dt><dd>探索 / 学习 / 构建</dd>
      </dl></div>
      <a href="/learning">了解我</a><a href="/learning#contact">联系我</a>
      <div class="hero__scan-ring" aria-hidden="true"></div>
      <picture><source type="image/avif" srcset="/p-640.avif 640w, /p-960.avif 960w, /p-1440.avif 1440w, /p-1672.avif 1672w" sizes="(max-width: 850px) calc(100vw - 1.5rem), 1672px">
      <source type="image/webp" srcset="/p-640.webp 640w, /p-960.webp 960w, /p-1440.webp 1440w, /p-1672.webp 1672w" sizes="(max-width: 850px) calc(100vw - 1.5rem), 1672px">
      <img src="/portrait.png" width="1672" height="941" sizes="(max-width: 850px) calc(100vw - 1.5rem), 1672px" alt="Sheng 的 3D IP 形象"></picture>
    </section></main>${close}`,
  learning: `${head("关于我 | Sheng")}${nav("/learning")}
    <main><section id="about"><h1>关于我</h1>
      <div class="about__console">
        <aside class="about__identity" aria-label="个人信息"><div><dt>所在地</dt><dd>来自广东广州</dd></div><div id="contact" class="about__contact-fact"><dt>联系方式</dt><dd><a href="mailto:asheng060@163.com">asheng060@163.com</a></dd></div></aside>
        <article class="about__biography" aria-label="个人介绍"><p>你好，我是 Sheng，来自广东广州。正在从事 AI 行业工作，沿着通往 AGI 之路持续学习和积累。</p><p>对我来说，这不只是一个新的职业选择，也是一次重新认识技术、内容和人的过程。我会从具体的学习与练习开始，逐步建立自己的理解和判断。</p><p>这个网站会记录我的学习、作品和思考，也会随着我的经历继续更新。</p></article>
      </div>
      <section class="about__focus-areas" aria-labelledby="focus-areas-title"><h2 id="focus-areas-title">关注领域</h2><ul><li>具身智能</li><li>AI Agent</li><li>多模态交互</li></ul></section>
      <section class="about__portfolio" aria-labelledby="portfolio-title"><h2 id="portfolio-title">个人作品</h2><div class="about__work-grid"><p>作品正在整理中，之后会从这里开始更新。</p></div></section>
    </section></main>${close}`,
};

describe("built-site verifier", () => {
  it("accepts the complete two-page structural contract", () => {
    const result = inspectBuiltSite(validPages, validStyles);

    expect(result.home).toMatchObject({
      navRoutesValid: true,
      activeNavCount: 1,
      heroIdentityVisible: true,
      futureOsInterfaceValid: true,
      identityAvatarValid: true,
      responsivePortraitValid: true,
      portraitDensityValid: true,
      canvasCount: 1,
      singleScreenValid: true,
    });
    expect(result.learning).toMatchObject({
      aboutSectionsValid: true,
      aboutRailAccessible: true,
      identityContactValid: true,
      identityLabelsLocalized: true,
      publishedEmailValid: true,
      aboutScrollValid: true,
      standaloneContactAbsent: true,
      viewportFallbackValid: true,
      canvasCount: 0,
      footerValid: true,
      singleScreenValid: false,
    });
    expect(hasContractFailure(result)).toBe(false);
  });

  it("rejects same-page hash navigation", () => {
    const mutated = {
      ...validPages,
      home: validPages.home.replace('href="/learning"', 'href="#learning"'),
    };

    expect(inspectBuiltSite(mutated, validStyles).home.navRoutesValid).toBe(
      false,
    );
    expect(hasContractFailure(inspectBuiltSite(mutated, validStyles))).toBe(
      true,
    );
  });

  it("rejects a page without exactly one active navigation item", () => {
    const mutated = {
      ...validPages,
      learning: validPages.learning.replace(' aria-current="page"', ""),
    };

    expect(inspectBuiltSite(mutated, validStyles).learning.activeNavCount).toBe(
      0,
    );
    expect(hasContractFailure(inspectBuiltSite(mutated, validStyles))).toBe(
      true,
    );
  });

  it("rejects an about page without its truthful origin", () => {
    const mutated = {
      ...validPages,
      learning: validPages.learning.replace(
        "<dd>来自广东广州</dd>",
        "<dd>来自某个地方</dd>",
      ),
    };

    expect(
      inspectBuiltSite(mutated, validStyles).learning.aboutSectionsValid,
    ).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated, validStyles))).toBe(
      true,
    );
  });

  it("rejects an about page without a labelled story region", () => {
    const mutated = {
      ...validPages,
      learning: validPages.learning.replace(' aria-label="个人介绍"', ""),
    };

    expect(
      inspectBuiltSite(mutated, validStyles).learning.aboutRailAccessible,
    ).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated, validStyles))).toBe(
      true,
    );
  });

  it("rejects a homepage without responsive portrait sources", () => {
    const mutated = {
      ...validPages,
      home: validPages.home.replace(
        /<source type="image\/avif"[^>]*srcset="\/p-640\.avif[^>]*>/,
        "",
      ),
    };

    expect(
      inspectBuiltSite(mutated, validStyles).home.responsivePortraitValid,
    ).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated, validStyles))).toBe(
      true,
    );
  });

  it("rejects a desktop portrait that does not use the full-resolution source", () => {
    const mutated = {
      ...validPages,
      home: validPages.home.replaceAll("1672px", "min(142vh, 1309px)"),
    };

    expect(
      inspectBuiltSite(mutated, validStyles).home.portraitDensityValid,
    ).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated, validStyles))).toBe(
      true,
    );
  });

  it("rejects unexpected canvases on secondary pages", () => {
    const mutated = {
      ...validPages,
      learning: validPages.learning.replace(
        "<main>",
        "<main><canvas></canvas>",
      ),
    };

    expect(inspectBuiltSite(mutated, validStyles).learning.canvasCount).toBe(1);
    expect(hasContractFailure(inspectBuiltSite(mutated, validStyles))).toBe(
      true,
    );
  });

  it("rejects an about page that is viewport locked", () => {
    const mutated = {
      ...validPages,
      learning: validPages.learning.replace(
        "<body>",
        '<body class="screen-locked">',
      ),
    };

    expect(
      inspectBuiltSite(mutated, validStyles).learning.aboutScrollValid,
    ).toBe(false);
    expect(hasContractFailure(inspectBuiltSite(mutated, validStyles))).toBe(
      true,
    );
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
