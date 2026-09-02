import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";

describe("profile content contract", () => {
  it("uses the approved identity and introduction", () => {
    expect(profile.name).toBe("Sheng");
    expect(profile.role).toBe("AI TRAINER IN PROGRESS");
    expect(profile.heroStatement).toBe("保持好奇，探索未知。");
    expect(profile.introduction).toBe("正在把好奇，训练成判断力。");
  });

  it("keeps future personal content honest and centralized", () => {
    expect(profile.about).toEqual({
      origin: "来自广东广州",
      focusAreas: [
        { code: "01 / EMBODIED AI", title: "具身智能" },
        { code: "02 / AI AGENT", title: "AI Agent" },
        { code: "03 / MULTIMODAL", title: "多模态交互" },
      ],
      introduction:
        "你好，我是 Sheng，来自广东广州。正在从事 AI 行业工作，沿着通往 AGI 之路持续学习和积累。",
      introductionDetails: [
        "对我来说，这不只是一个新的职业选择，也是一次重新认识技术、内容和人的过程。我会从具体的学习与练习开始，逐步建立自己的理解和判断。",
        "这个网站会记录我的学习、作品和思考，也会随着我的经历继续更新。",
      ],
      portfolioEmptyState: "作品正在整理中，之后会从这里开始更新。",
    });
    expect(profile.contact.channels).toEqual([
      {
        label: "asheng060@163.com",
        href: "mailto:asheng060@163.com",
      },
    ]);
    expect(profile.contact.emptyState).toContain("正在整理中");
  });

  it("uses two unique page routes", () => {
    const hrefs = profile.nav.map(({ href }) => href);
    expect(hrefs).toEqual(["/", "/learning"]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
