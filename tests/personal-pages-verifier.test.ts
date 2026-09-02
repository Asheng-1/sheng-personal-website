import { describe, expect, it } from "vitest";
import { inspectBuiltPage } from "../scripts/verify-built-site.mjs";

describe("personal page build contract", () => {
  it("accepts the personal OS about structure and truthful placeholders", () => {
    const html = `<main><section id="about">
      <h1>关于我</h1>
      <div class="about__console">
        <aside class="about__identity" aria-label="个人信息"><div><dt>所在地</dt><dd>来自广东广州</dd></div><div id="contact" class="about__contact-fact"><dt>联系方式</dt><dd><a href="mailto:asheng060@163.com">asheng060@163.com</a></dd></div></aside>
        <article class="about__biography" aria-label="个人介绍"><p>你好，我是 Sheng，来自广东广州。正在从事 AI 行业工作，沿着通往 AGI 之路持续学习和积累。</p><p>对我来说，这不只是一个新的职业选择，也是一次重新认识技术、内容和人的过程。我会从具体的学习与练习开始，逐步建立自己的理解和判断。</p><p>这个网站会记录我的学习、作品和思考，也会随着我的经历继续更新。</p></article>
      </div>
      <section class="about__focus-areas" aria-labelledby="focus-areas-title"><h2 id="focus-areas-title">关注领域</h2><ul><li>具身智能</li><li>AI Agent</li><li>多模态交互</li></ul></section>
      <section class="about__portfolio" aria-labelledby="portfolio-title"><h2 id="portfolio-title">个人作品</h2><div class="about__work-grid"><p>作品正在整理中，之后会从这里开始更新。</p></div></section>
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
