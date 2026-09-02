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
  portfolioEmptyState: string;
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
      "你好，我是 Sheng，来自广东广州。正在从事 AI 行业工作，沿着通往 AGI 之路持续学习和积累。",
    introductionDetails: [
      "对我来说，这不只是一个新的职业选择，也是一次重新认识技术、内容和人的过程。我会从具体的学习与练习开始，逐步建立自己的理解和判断。",
      "这个网站会记录我的学习、作品和思考，也会随着我的经历继续更新。",
    ],
    portfolioEmptyState: "作品正在整理中，之后会从这里开始更新。",
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
