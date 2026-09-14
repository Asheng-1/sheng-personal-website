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
        { code: "03 / MULTIMODAL", title: "多模态模型" },
      ],
      introduction:
        "我来自广州，做过 AI Agent、模型数据策略与评测，也参与过多模态模型项目。",
      introductionDetails: [
        "面对模糊需求，我习惯先拆清目标、场景与判断标准，再把它们转化为可执行的规则。",
        "在数据构建与模型评测中，我会从 Bad Case 里定位问题、补充规则，也会用 Prompt 和自动化工具减少重复工作，让每轮数据都能继续迭代。",
      ],
      portfolioIntroduction: "从真实工作中沉淀的方法论、经验与阶段性成果。",
      projects: [
        {
          company: "商汤",
          title: "多模态数据生产与评测",
          description: "参与多模态数据生产、质量管理及模型评测。",
          tags: ["多模态", "数据策略", "模型评测"],
        },
        {
          company: "美团",
          title: "AI Agent 数据构建与评测",
          description: "数据标注与改写",
          tags: ["AI Agent", "数据构建", "自动化"],
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
