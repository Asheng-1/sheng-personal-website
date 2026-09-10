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
        "我来自广东广州，从事过 AI Agent、模型数据策略与评测相关工作。曾参与 Agent 与多模态电商场景项目",
      introductionDetails: [
        "我比较关注如何把模糊的任务需求转化为清晰、可执行的标准，也在尝试通过流程优化和自动化工具，提高数据生产与评测效率。",
        "这个网站会持续记录我的项目实践、作品和思考，以及我对 AI Agent、具身智能和多模态交互的关注。",
      ],
      portfolioIntroduction: "从真实工作中整理的方法、经验与阶段性成果。",
      projects: [
        {
          company: "商汤",
          title: "多模态数据生产与评测",
          description: "参与多模态数据生产、质量管理及模型评测。",
          tags: ["多模态", "数据策略", "模型评测"],
        },
        {
          company: "美团",
          title: "AI Agent 数据标注与评测",
          description: "参与 Agent 数据标注、结果评测与流程优化。",
          tags: ["AI Agent", "数据标注", "自动化"],
        },
      ],
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
