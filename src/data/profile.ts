export type AnchorHref = `#${string}`;

export interface NavItem {
  label: string;
  href: AnchorHref;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
}

export interface LearningItem extends ContentItem {
  status: string;
}

export interface ProfileLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  role: string;
  eyebrow: string;
  heroStatement: string;
  introduction: string;
  footer: string;
  nav: readonly NavItem[];
  learning: readonly LearningItem[];
  roadmap: readonly ContentItem[];
  principles: readonly ContentItem[];
  links: readonly ProfileLink[];
}

export const profile = {
  name: "Sheng",
  role: "AI TRAINER IN PROGRESS",
  eyebrow: "HELLO, I'M SHENG",
  heroStatement: "保持好奇，奔赴未知。",
  introduction:
    "正在探索 AI 世界的新手训练师。我喜欢拆解问题、打磨表达，也在一次次实践中学习如何让回答更准确、更好用。",
  footer: "SHENG · AI TRAINER IN PROGRESS · BUILT WITH CURIOSITY",
  nav: [
    { label: "首页", href: "#top" },
    { label: "正在学习", href: "#learning" },
    { label: "路线图", href: "#roadmap" },
  ],
  learning: [
    {
      id: "annotation",
      title: "数据标注",
      description: "理解任务规则，让判断有清楚、一致的依据。",
      status: "正在学习",
    },
    {
      id: "prompting",
      title: "提示词设计",
      description: "把模糊需求拆成具体、可执行的输入。",
      status: "正在学习",
    },
    {
      id: "evaluation",
      title: "回答评估",
      description: "从准确、清晰和实用三个角度检查回答。",
      status: "正在学习",
    },
  ],
  roadmap: [
    {
      id: "understand",
      title: "了解行业",
      description: "建立 AI 训练工作的基础认知。",
    },
    {
      id: "practice",
      title: "基础练习",
      description: "从标注、提示词和回答评估开始。",
    },
    {
      id: "portfolio",
      title: "建立作品",
      description: "把真实练习整理成可阅读的案例。",
    },
    {
      id: "opportunity",
      title: "寻找实践机会",
      description: "参与真实任务，继续积累反馈。",
    },
  ],
  principles: [
    { id: "clear", title: "清晰", description: "回答容易理解，重点明确。" },
    {
      id: "accurate",
      title: "准确",
      description: "遵循任务要求，不加入没有依据的判断。",
    },
    {
      id: "useful",
      title: "有帮助",
      description: "给用户一个能够继续行动的下一步。",
    },
  ],
  links: [],
} as const satisfies Profile;
