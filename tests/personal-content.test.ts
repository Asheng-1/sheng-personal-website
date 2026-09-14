import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";

interface PersonalContentContract {
  nav: readonly { label: string; href: string }[];
  about?: {
    origin: string;
    focusAreas: readonly { code: string; title: string }[];
    introduction: string;
    introductionDetails: readonly string[];
    portfolioIntroduction: string;
    projects: readonly {
      company: string;
      title: string;
      description: string;
      tags: readonly string[];
    }[];
  };
  contact?: {
    introduction: string;
    emptyState: string;
    channels: readonly { label: string; href: string }[];
  };
}

const personalProfile = profile as unknown as PersonalContentContract;

describe("personal site content contract", () => {
  it("labels the secondary pages as about and contact", () => {
    expect(personalProfile.nav.map(({ label }) => label)).toEqual([
      "首页",
      "关于我",
    ]);
  });

  it("keeps the about page truthful while its long-form copy is still pending", () => {
    expect(personalProfile.about).toEqual({
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
  });

  it("publishes the provided email as a mail link", () => {
    expect(personalProfile.contact).toEqual({
      introduction: "邮箱和社交主页确认后，会在这里公开。",
      emptyState: "联系方式正在整理中，之后可以从这里直接找到我。",
      channels: [
        {
          label: "asheng060@163.com",
          href: "mailto:asheng060@163.com",
        },
      ],
    });
  });
});
