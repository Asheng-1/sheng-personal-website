import { describe, expect, it } from "vitest";
import { inspectBuiltPage } from "../scripts/verify-built-site.mjs";

describe("personal page build contract", () => {
  it("accepts the personal OS about structure and project experience", () => {
    const html = `<main><section id="about">
      <h1>关于我</h1>
      <div class="about__console">
        <aside class="about__identity" aria-label="个人信息"><div><dt>所在地</dt><dd>来自广东广州</dd></div><div id="contact" class="about__contact-fact"><dt>联系方式</dt><dd><a href="mailto:asheng060@163.com">asheng060@163.com</a></dd></div></aside>
        <article class="about__biography" aria-label="个人介绍"><p>我来自广东广州，从事过 AI Agent、模型数据策略与评测相关工作。曾参与 Agent 与多模态电商场景项目</p><p>我比较关注如何把模糊的任务需求转化为清晰、可执行的标准，也在尝试通过流程优化和自动化工具，提高数据生产与评测效率。</p><p>这个网站会持续记录我的项目实践、作品和思考，以及我对 AI Agent、具身智能和多模态交互的关注。</p></article>
      </div>
      <section class="about__focus-areas" aria-labelledby="focus-areas-title"><h2 id="focus-areas-title">关注领域</h2><ul><li>具身智能</li><li>AI Agent</li><li>多模态交互</li></ul></section>
      <section class="about__portfolio" aria-labelledby="portfolio-title"><h2 id="portfolio-title">项目实践</h2><div class="about__work-grid"><article>商汤 多模态数据生产与评测</article><article>美团 AI Agent 数据标注与评测</article></div></section>
    </section></main>`;

    expect(inspectBuiltPage(html, "learning")).toMatchObject({
      aboutSectionsValid: true,
      aboutRailAccessible: true,
      identityContactValid: true,
      identityLabelsLocalized: true,
      publishedEmailValid: true,
      aboutScrollValid: true,
      standaloneContactAbsent: true,
      footerValid: true,
    });
  });

  it("rejects a duplicate standalone contact section", () => {
    const html = `<main><section id="about"><aside class="about__identity"><div id="contact" class="about__contact-fact"><a href="mailto:asheng060@163.com">asheng060@163.com</a></div></aside></section><section id="contact"><h2>联系方式</h2></section></main>`;

    expect(inspectBuiltPage(html, "learning")).toMatchObject({
      standaloneContactAbsent: false,
    });
  });
});
