export type SiteHref = "/" | "/learning";

export interface NavItem {
  label: string;
  href: SiteHref;
}

export interface AboutContent {
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
}

export interface ProfileLink {
  label: string;
  href: string;
}

export interface ContactContent {
  introduction: string;
  emptyState: string;
  channels: readonly ProfileLink[];
}

export interface Profile {
  name: string;
  role: string;
  eyebrow: string;
  heroStatement: string;
  introduction: string;
  footer: string;
  nav: readonly NavItem[];
  about: AboutContent;
  contact: ContactContent;
}

export const profile = {
  name: "Sheng",
  role: "AI TRAINER IN PROGRESS",
  eyebrow: "HELLO, I'M SHENG",
  heroStatement: "保持好奇，探索未知。",
  introduction: "正在把好奇，训练成判断力。",
  footer: "SHENG · AI TRAINER IN PROGRESS · BUILT WITH CURIOSITY",
  nav: [
    { label: "首页", href: "/" },
    { label: "关于我", href: "/learning" },
  ],
  about: {
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
  },
  contact: {
    introduction: "邮箱和社交主页确认后，会在这里公开。",
    emptyState: "联系方式正在整理中，之后可以从这里直接找到我。",
    channels: [
      {
        label: "asheng060@163.com",
        href: "mailto:asheng060@163.com",
      },
    ],
  },
} as const satisfies Profile;
