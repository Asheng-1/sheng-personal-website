# Sheng Personal Brand Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a responsive single-page Astro personal brand site that introduces Sheng as an aspiring AI trainer through anchored sections, a frameless IP hero, and controlled React Bits-inspired effects.

**Architecture:** Import the Gothsec Astro Portfolio as the scaffold, then replace its content and sections with focused Astro components. Keep static content in Astro and `src/data/profile.ts`; hydrate only interactive effects as small React islands. Use one Canvas 2D quantum-network renderer plus CSS and browser APIs, with no general animation or WebGL dependency.

**Tech Stack:** Astro, TypeScript, React, Tailwind CSS, Vitest, Canvas 2D, Astro image services, Markdown/MDX-ready content collections

## Global Constraints

- The first release is one page with anchored navigation.
- Navigation targets are exactly `#top`, `#learning`, and `#roadmap`; first-release section detail routes are forbidden.
- Use `Sheng` and `AI TRAINER IN PROGRESS` as the identity and positioning.
- Use the approved personal signature `保持好奇，奔赴未知。` verbatim.
- Use the approved Chinese introduction verbatim.
- Do not invent experience, projects, clients, certificates, contact information, percentages, counters, or career metrics.
- Use Chinese body copy with short English labels.
- Use a frameless IP image blended into the hero; do not render a card, border, or rounded image container.
- The first release is dark-only; do not render a theme toggle or persist a theme preference.
- Normal text contrast must be at least 4.5:1.
- Body text is at least 16px on mobile; interactive targets are at least 44 by 44px.
- Support mobile, keyboard navigation, `prefers-reduced-motion`, and JavaScript failure fallbacks.
- Do not add OGL, Three.js, GSAP, Motion, a CMS, a state-management library, authentication, a database, or a contact-form service.
- Keep at most one continuously animated rendering system per viewport and pause it while the document is hidden.
- Copy or adapt only the selected React Bits effects; retain applicable MIT + Commons Clause attribution.
- Retain the Gothsec template MIT license notice.
- The implementation is not complete until `npm test`, `npm run build`, and `npm run verify:site` all pass.

---

## File Map

### Project configuration

- `package.json`: Astro scripts, Vitest script, site verification script, dependencies
- `astro.config.mjs`: React and Tailwind integrations, static output
- `tailwind.config.mjs`: content paths and token aliases
- `tsconfig.json`: strict Astro TypeScript configuration and `@/*` alias
- `vitest.config.ts`: Node test environment and `@/*` alias
- `public/robots.txt`: crawler policy without an unverified domain
- `THIRD_PARTY_NOTICES.md`: Gothsec and React Bits notices
- `README.md`: setup, content editing, verification, and deployment guidance

### Data and assets

- `src/data/profile.ts`: single source of identity, navigation, learning topics, roadmap, principles, and verified links
- `src/assets/sheng-ip-hero.png`: approved hero asset copied from `assets/sheng-ip-hero.png`
- `src/styles/global.css`: dark design tokens, base typography, accessibility, responsive rules

### Layout and page

- `src/layouts/BaseLayout.astro`: document metadata, dark color-scheme declaration, global styles
- `src/pages/index.astro`: page composition and island hydration directives
- `src/pages/404.astro`: branded static not-found page

### Static Astro components

- `src/components/layout/SiteHeader.astro`: anchored pill navigation and active-section indicator
- `src/components/layout/SiteFooter.astro`: identity-only footer
- `src/components/sections/Hero.astro`: signature, anchored actions, image, and one status panel
- `src/components/sections/About.astro`: honest career-stage narrative
- `src/components/sections/LearningGrid.astro`: three learning cards
- `src/components/sections/Roadmap.astro`: four-stage entry route
- `src/components/sections/Principles.astro`: clarity, accuracy, usefulness

### Interactive React islands

- `src/components/effects/QuantumNetworkBackground.tsx`: one Canvas 2D particle-and-connection layer with static fallback
- `src/components/effects/DecryptedText.tsx`: one-time role-label entrance
- `src/components/effects/ClickSpark.tsx`: short pointer-activation feedback
- `src/components/effects/ActiveSectionNav.tsx`: active anchor indicator using IntersectionObserver
- `src/components/effects/GridScan.tsx`: localized Roadmap scan treatment
- `src/components/effects/SpotlightCard.tsx`: pointer-position spotlight card
- `src/components/effects/ScrollReveal.tsx`: IntersectionObserver entrance wrapper
- `src/components/effects/StarBorder.tsx`: animated CTA border on hover/focus
- `src/components/effects/TargetCursor.tsx`: optional desktop target ring without hiding the native cursor
- `src/components/effects/FramelessPortrait.tsx`: small IP image pointer parallax

### Pure utilities and tests

- `src/lib/effects.ts`: effect-capability decision function
- `tests/profile.test.ts`: content integrity and navigation contracts
- `tests/effects.test.ts`: reduced-motion, pointer, and viewport effect gating
- `scripts/verify-built-site.mjs`: checks generated HTML for required content and accessibility contracts

---

### Task 1: Import and Prune the Template Scaffold

**Files:**

- Create from template: `package.json`
- Create from template: `package-lock.json`
- Create from template: `astro.config.mjs`
- Create from template: `tailwind.config.mjs`
- Create from template: `tsconfig.json`
- Create from template: `src/env.d.ts`
- Create: `vitest.config.ts`
- Modify: `.gitignore`
- Delete after import: template-specific `src/Components/`, `src/React/`, and template media not used by Sheng

**Interfaces:**

- Produces scripts: `dev`, `build`, `preview`, `test`, `verify:site`, `check`
- Produces the Astro + React + Tailwind runtime used by every later task
- Produces the `@/* -> src/*` import alias

- [ ] **Step 1: Verify the empty project does not build yet**

Run:

```powershell
npm run build
```

Expected: FAIL because the repository has no `package.json`.

- [ ] **Step 2: Import the template into an ignored source cache**

Run from `D:\A.code program\Personal website2`:

```powershell
$project = (Resolve-Path '.').Path
$template = Join-Path $project '.superpowers\template-source'
git clone --depth 1 https://github.com/Gothsec/Astro-portfolio.git $template
Copy-Item -LiteralPath (Join-Path $template 'package.json') -Destination $project
Copy-Item -LiteralPath (Join-Path $template 'package-lock.json') -Destination $project
Copy-Item -LiteralPath (Join-Path $template 'astro.config.mjs') -Destination $project
Copy-Item -LiteralPath (Join-Path $template 'tailwind.config.mjs') -Destination $project
Copy-Item -LiteralPath (Join-Path $template 'tsconfig.json') -Destination $project
Copy-Item -LiteralPath (Join-Path $template 'src') -Destination $project -Recurse
```

Expected: the imported scaffold exists while `.git`, `docs`, `assets`, and `.gitignore` remain unchanged.

- [ ] **Step 3: Prune template-specific features with an explicit patch**

Delete the imported project components and integrations that implement Spotify, likes, Formspree, the logo wall, the original projects, and the original owner metadata. Keep only configuration files and the minimum Astro page/layout shell needed for the next task.

Expected remaining source tree:

```text
src/
  env.d.ts
  layouts/
    Layout.astro
  pages/
    index.astro
```

- [ ] **Step 4: Add verification scripts and Vitest**

Run:

```powershell
npm install
npm install --save-dev vitest
npm pkg set scripts.check="astro check"
npm pkg set scripts.test="vitest run"
npm pkg set scripts.verify:site="node scripts/verify-built-site.mjs"
```

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node" },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

Update `tsconfig.json` so the alias matches:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

- [ ] **Step 5: Add generated and local-tool exclusions**

Append to `.gitignore`:

```gitignore
.env.local
coverage/
playwright-report/
test-results/
```

- [ ] **Step 6: Run the imported scaffold checks**

Run:

```powershell
npm run check
npm run build
```

Expected: both commands exit 0 and `dist/index.html` exists.

- [ ] **Step 7: Commit the scaffold**

```powershell
git add package.json package-lock.json astro.config.mjs tailwind.config.mjs tsconfig.json vitest.config.ts src .gitignore
git commit -m "chore: import and prune Astro portfolio scaffold"
```

---

### Task 2: Define the Honest Content Model and Move the Approved Asset

**Files:**

- Create: `src/data/profile.ts`
- Create: `tests/profile.test.ts`
- Create: `src/assets/sheng-ip-hero.png`
- Modify: `src/pages/index.astro`

**Interfaces:**

- Produces `profile: Profile`
- `Profile` contains `name`, `role`, `eyebrow`, `heroStatement`, `introduction`, `nav`, `learning`, `roadmap`, `principles`, and `links`
- `links` is an empty readonly array until verified links are supplied
- Later Astro sections consume the exact exported types and `profile` object

- [ ] **Step 1: Write the failing content tests**

Create `tests/profile.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";

describe("profile content contract", () => {
  it("uses the approved identity and introduction", () => {
    expect(profile.name).toBe("Sheng");
    expect(profile.role).toBe("AI TRAINER IN PROGRESS");
    expect(profile.heroStatement).toBe("保持好奇，奔赴未知。");
    expect(profile.introduction).toBe(
      "正在探索 AI 世界的新手训练师。我喜欢拆解问题、打磨表达，也在一次次实践中学习如何让回答更准确、更好用。",
    );
  });

  it("contains honest learning and roadmap content", () => {
    expect(profile.learning.map((item) => item.title)).toEqual([
      "数据标注",
      "提示词设计",
      "回答评估",
    ]);
    expect(profile.roadmap.map((item) => item.title)).toEqual([
      "了解行业",
      "基础练习",
      "建立作品",
      "寻找实践机会",
    ]);
    expect(profile.links).toEqual([]);
  });

  it("uses unique local anchor navigation", () => {
    const hrefs = profile.nav.map((item) => item.href);
    expect(hrefs).toEqual(["#top", "#learning", "#roadmap"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm test -- tests/profile.test.ts
```

Expected: FAIL because `src/data/profile.ts` does not exist.

- [ ] **Step 3: Implement the typed profile data**

Create `src/data/profile.ts`:

```ts
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
  nav: readonly NavItem[];
  learning: readonly ContentItem[];
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
    },
    {
      id: "prompting",
      title: "提示词设计",
      description: "把模糊需求拆成具体、可执行的输入。",
    },
    {
      id: "evaluation",
      title: "回答评估",
      description: "从准确、清晰和实用三个角度检查回答。",
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
```

- [ ] **Step 4: Copy the approved image into Astro assets**

Run:

```powershell
Copy-Item -LiteralPath 'assets\sheng-ip-hero.png' -Destination 'src\assets\sheng-ip-hero.png'
```

Expected: the source image remains in `assets/` and the implementation copy exists in `src/assets/`.

- [ ] **Step 5: Replace the imported page with a typed composition stub**

Create `src/pages/index.astro`:

```astro
---
import { profile } from "@/data/profile";
---

<main>
  <h1>{profile.heroStatement}</h1>
  <p>{profile.introduction}</p>
</main>
```

- [ ] **Step 6: Run tests and build**

```powershell
npm test -- tests/profile.test.ts
npm run check
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 7: Commit the content model**

```powershell
git add src/data/profile.ts tests/profile.test.ts src/assets/sheng-ip-hero.png src/pages/index.astro
git commit -m "feat: add Sheng profile content model"
```

---

### Task 3: Build the Dark Design Tokens and Anchored Site Shell

**Files:**

- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/effects/ActiveSectionNav.tsx`
- Create: `src/components/layout/SiteHeader.astro`
- Create: `src/components/layout/SiteFooter.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**

- `BaseLayout` accepts `{ title: string; description: string }`
- `SiteHeader` accepts `{ name: string; nav: readonly NavItem[] }`
- `ActiveSectionNav` accepts `{ items: readonly NavItem[] }` and never changes routes

- [ ] **Step 1: Import the missing shell to create a build failure**

Update `src/pages/index.astro` to import `BaseLayout`, `SiteHeader`, and `SiteFooter` before those files exist.

- [ ] **Step 2: Run the build to verify it fails**

```powershell
npm run build
```

Expected: FAIL with missing module errors for the shell files.

- [ ] **Step 3: Define the global token system**

Create `src/styles/global.css` with these base tokens and rules:

```css
:root {
  color-scheme: dark;
  --color-bg: #070811;
  --color-surface: rgba(15, 18, 31, 0.74);
  --color-text: #f7f7fb;
  --color-muted: #b2b9ca;
  --color-violet: #917fff;
  --color-cyan: #75ead8;
  --color-border: rgba(255, 255, 255, 0.11);
  --content-wide: 72.5rem;
  --content-reading: 66.25rem;
  --focus-ring: 0 0 0 3px #75ead8;
}

html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  min-width: 320px;
  background: var(--color-bg);
  color: var(--color-text);
}
a,
button {
  min-height: 44px;
}
:focus-visible {
  outline: 3px solid var(--color-cyan);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Implement the dark-only layout**

`BaseLayout.astro` declares a dark document without a theme script:

```astro
---
import "@/styles/global.css";
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#070811" />
    <title>{title}</title>
  </head>
  <body><slot /></body>
</html>
```

- [ ] **Step 5: Implement active anchored navigation, header, and footer**

`ActiveSectionNav.tsx` renders only anchors from `items`. It observes `#top`, `#learning`, and `#roadmap`, applies `aria-current="location"` to the active link, and falls back to ordinary anchors when IntersectionObserver is unavailable. `SiteHeader.astro` renders `SHENG / LAB`, `<ActiveSectionNav client:idle items={nav} />`, and a non-interactive `SYS ONLINE` status. `SiteFooter.astro` renders only `SHENG · AI TRAINER IN PROGRESS · BUILT WITH CURIOSITY`; apply a slow React Bits-inspired shiny-text gradient to the final phrase and freeze it under reduced motion.

Core observer setup:

```tsx
useEffect(() => {
  if (!("IntersectionObserver" in window)) return;
  const nodes = items
    .map(({ href }) => document.querySelector(href))
    .filter(Boolean) as Element[];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActive(`#${visible.target.id}`);
    },
    { rootMargin: "-35% 0px -55%" },
  );
  nodes.forEach((node) => observer.observe(node));
  return () => observer.disconnect();
}, [items]);
```

- [ ] **Step 6: Compose and verify the shell**

Update `index.astro` to wrap the page in `BaseLayout`, place `SiteHeader` before `<main>`, and place `SiteFooter` after it.

Run:

```powershell
npm test -- tests/profile.test.ts
npm run check
npm run build
```

Expected: all commands exit 0; built HTML uses the dark palette, contains all three anchor hrefs, and contains no theme-toggle label.

- [ ] **Step 7: Commit the site shell**

```powershell
git add src/styles/global.css src/layouts/BaseLayout.astro src/components/effects/ActiveSectionNav.tsx src/components/layout src/pages/index.astro
git commit -m "feat: add dark anchored site shell"
```

---

### Task 4: Build the Frameless Hero and Responsive IP Treatment

**Files:**

- Create: `src/components/sections/Hero.astro`
- Create: `src/components/effects/FramelessPortrait.tsx`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**

- `Hero` consumes `profile: Profile`
- `FramelessPortrait` accepts `{ src: string; alt: string; width: number; height: number }`
- The hero exposes `#top`; the primary CTA targets `#roadmap` and the secondary CTA targets `#learning`

- [ ] **Step 1: Add the missing hero import to create a build failure**

Modify `src/pages/index.astro`:

```astro
---
import Hero from "@/components/sections/Hero.astro";
import { profile } from "@/data/profile";
---

<Hero profile={profile} />
```

- [ ] **Step 2: Run the build to verify it fails**

```powershell
npm run build
```

Expected: FAIL because `Hero.astro` does not exist.

- [ ] **Step 3: Implement the frameless portrait island**

Create `FramelessPortrait.tsx` with pointer parallax that never changes the image source:

```tsx
import { useRef } from "react";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function FramelessPortrait({ src, alt, width, height }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (imageRef.current)
      imageRef.current.style.transform = `translate(${x * 7}px, ${y * 5}px) scale(1.01)`;
  };
  const reset = () => {
    if (imageRef.current) imageRef.current.style.transform = "";
  };

  return (
    <div
      className="frameless-portrait"
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        fetchPriority="high"
      />
    </div>
  );
}
```

- [ ] **Step 4: Implement `Hero.astro` with the approved hierarchy**

The component must render, in order:

```astro
<section id="top" class="hero" aria-labelledby="hero-title">
  <div class="hero__copy">
    <p class="hero__hello">{profile.eyebrow}</p>
    <p class="hero__role">{profile.role}</p>
    <h1 id="hero-title">保持好奇，<span>奔赴未知。</span></h1>
    <p class="hero__intro">{profile.introduction}</p>
    <div class="hero__actions">
      <a href="#roadmap">查看入行路线</a>
      <a href="#learning">正在学习</a>
    </div>
  </div>
  <div class="hero__visual">
    <FramelessPortrait
      client:load
      src={heroImage.src}
      alt="Sheng 的 3D IP 形象"
      width={1672}
      height={941}
    />
    <div class="hero__hud">
      <span aria-hidden="true"></span>CURRENT FOCUS<strong>回答评估</strong>
    </div>
    <div class="hero__telemetry" aria-hidden="true">
      PROFILE / SHENG<br />SCAN COMPLETE
    </div>
  </div>
</section>
```

Import the approved asset through Astro and pass its generated URL into the island. If Astro's imported image metadata differs from 1672 by 941, pass the imported metadata dimensions rather than hard-coding different values.

- [ ] **Step 5: Add responsive frameless styling**

Add rules that:

- use `min-height: 100dvh`
- use two columns above 850px and one column below it
- apply a radial mask to the image edges
- keep one violet halo and one static orbit
- give the single `CURRENT FOCUS` HUD a restrained conic-gradient electric border; keep it static under reduced motion
- do not apply a card background, border, box shadow, or border radius to the image
- keep body text at 16px or larger on mobile
- hide decorative telemetry below 480px when it competes with the portrait
- never render the removed `清晰`, `准确`, or `有帮助` chips beneath the portrait

- [ ] **Step 6: Run the build and inspect both layout modes**

```powershell
npm run check
npm run build
```

Expected: both exit 0. At 1440px the copy and IP are side by side; at 360px copy appears before the IP and no horizontal scrolling occurs.

- [ ] **Step 7: Commit the hero**

```powershell
git add src/components/sections/Hero.astro src/components/effects/FramelessPortrait.tsx src/pages/index.astro src/styles/global.css
git commit -m "feat: add frameless IP hero"
```

---

### Task 5: Add Controlled React Bits-Inspired Effects

**Files:**

- Create: `src/lib/effects.ts`
- Create: `tests/effects.test.ts`
- Create: `src/components/effects/QuantumNetworkBackground.tsx`
- Create: `src/components/effects/DecryptedText.tsx`
- Create: `src/components/effects/ClickSpark.tsx`
- Create: `src/components/effects/ScrollReveal.tsx`
- Create: `src/components/effects/TargetCursor.tsx`
- Modify: `src/components/sections/Hero.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**

- Produces `EffectCapabilities` and `shouldRunPointerEffects(capabilities): boolean`
- `QuantumNetworkBackground` accepts `{ particleCount?: number; className?: string }`
- `DecryptedText` accepts `{ text: string; className?: string }`
- `ClickSpark` accepts `{ targets: readonly string[] }`
- `ScrollReveal` accepts `{ children: React.ReactNode; className?: string }`
- `TargetCursor` accepts `{ targets: readonly string[] }`

- [ ] **Step 1: Write failing effect-capability tests**

Create `tests/effects.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { shouldRunPointerEffects } from "@/lib/effects";

describe("shouldRunPointerEffects", () => {
  it("runs only for a wide fine-pointer viewport without reduced motion", () => {
    expect(
      shouldRunPointerEffects({
        reducedMotion: false,
        coarsePointer: false,
        viewportWidth: 1440,
      }),
    ).toBe(true);
    expect(
      shouldRunPointerEffects({
        reducedMotion: true,
        coarsePointer: false,
        viewportWidth: 1440,
      }),
    ).toBe(false);
    expect(
      shouldRunPointerEffects({
        reducedMotion: false,
        coarsePointer: true,
        viewportWidth: 1440,
      }),
    ).toBe(false);
    expect(
      shouldRunPointerEffects({
        reducedMotion: false,
        coarsePointer: false,
        viewportWidth: 600,
      }),
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```powershell
npm test -- tests/effects.test.ts
```

Expected: FAIL because `src/lib/effects.ts` does not exist.

- [ ] **Step 3: Implement capability gating**

Create `src/lib/effects.ts`:

```ts
export interface EffectCapabilities {
  reducedMotion: boolean;
  coarsePointer: boolean;
  viewportWidth: number;
}

export function shouldRunPointerEffects(value: EffectCapabilities): boolean {
  return (
    !value.reducedMotion && !value.coarsePointer && value.viewportWidth >= 850
  );
}
```

- [ ] **Step 4: Verify the effect layer needs no runtime dependency**

Run:

```powershell
Select-String -Path 'package.json' -Pattern 'ogl|three|motion|gsap'
```

Expected: no matches. Use Canvas 2D, CSS, and browser APIs only.

- [ ] **Step 5: Implement the effect components**

Implementation requirements:

- `QuantumNetworkBackground.tsx`: adapt the free React Bits Particles direction with Canvas 2D; render violet/cyan particles and short-distance connections; cap device pixel ratio at 1.5; use 58 particles above 700px and 28 below it; stop scheduling frames when the document is hidden; render one static frame under reduced motion.
- `DecryptedText.tsx`: split the short role label into character spans; use CSS staggered delays; preserve the full label through `aria-label`; render the final readable state immediately under reduced motion.
- `ClickSpark.tsx`: listen for activation on the supplied target selectors; create at most seven short-lived decorative sparks; never intercept clicks, remove listeners on unmount, and create none under reduced motion.
- `ScrollReveal.tsx`: use a single IntersectionObserver; add `data-visible="true"` once; disconnect after reveal.
- `TargetCursor.tsx`: preserve the native cursor; render a pointer-events-none ring only when `shouldRunPointerEffects` returns true; highlight only selectors in `targets`; clean up every event listener on unmount.

Use this core cleanup pattern in `ScrollReveal.tsx`:

```tsx
useEffect(() => {
  const node = ref.current;
  if (!node) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    node.dataset.visible = "true";
    return;
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        node.dataset.visible = "true";
        observer.disconnect();
      }
    },
    { threshold: 0.15 },
  );
  observer.observe(node);
  return () => observer.disconnect();
}, []);
```

Use this render-loop contract in `QuantumNetworkBackground.tsx`:

```tsx
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  cyan: boolean;
}
interface Pointer {
  x: number;
  y: number;
}

function renderQuantumFrame(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particles: Particle[],
  pointer: Pointer,
  reduced: boolean,
) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);
  particles.forEach((particle, index) => {
    if (!reduced) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
    }
    particles.slice(index + 1).forEach((other) => {
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance >= 142) return;
      context.beginPath();
      context.moveTo(particle.x, particle.y);
      context.lineTo(other.x, other.y);
      context.strokeStyle = `rgba(145,127,255,${(1 - distance / 142) * 0.18})`;
      context.stroke();
    });
    const pointerDistance = Math.hypot(
      pointer.x - particle.x,
      pointer.y - particle.y,
    );
    if (!reduced && pointerDistance < 170) {
      particle.x += (particle.x - pointer.x) * 0.0026;
      particle.y += (particle.y - pointer.y) * 0.0026;
    }
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = particle.cyan ? "#75ead8" : "#917fff";
    context.fill();
  });
}

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  resize();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;
  let running = !document.hidden;
  const draw = () => {
    renderQuantumFrame(
      context,
      canvas,
      particlesRef.current,
      pointerRef.current,
      reduced,
    );
    if (!reduced && running) frame = requestAnimationFrame(draw);
  };
  const visibility = () => {
    running = !document.hidden;
    cancelAnimationFrame(frame);
    if (running && !reduced) frame = requestAnimationFrame(draw);
  };
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("resize", resize);
  draw();
  return () => {
    running = false;
    cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("resize", resize);
  };
}, []);
```

- [ ] **Step 6: Wire hydration deliberately**

In `Hero.astro`, render:

```astro
<QuantumNetworkBackground client:load particleCount={58} />
<DecryptedText client:load text={profile.role} />
<ClickSpark client:idle targets={[".hero__actions a"]} />
```

In `index.astro`, render:

```astro
<TargetCursor client:idle targets={["a", "button", "[data-cursor-target]"]} />
```

Below-fold reveal islands are added in Task 6 with `client:visible`.

- [ ] **Step 7: Run unit, type, and build checks**

```powershell
npm test -- tests/effects.test.ts
npm run check
npm run build
```

Expected: all commands exit 0; the build output includes no imports from `ogl`, `three`, `motion`, `framer-motion`, or `gsap`.

Verify the dependency restriction:

```powershell
Select-String -Path 'package.json','package-lock.json' -Pattern 'ogl|framer-motion|"motion"|"gsap"|three'
```

Expected: no matches.

- [ ] **Step 8: Commit the effect foundation**

```powershell
git add package.json package-lock.json src/lib/effects.ts tests/effects.test.ts src/components/effects src/components/sections/Hero.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: add accessible interactive effects"
```

---

### Task 6: Build the Content Sections and Interactive Cards

**Files:**

- Create: `src/components/effects/SpotlightCard.tsx`
- Create: `src/components/effects/StarBorder.tsx`
- Create: `src/components/effects/GridScan.tsx`
- Create: `src/components/sections/About.astro`
- Create: `src/components/sections/LearningGrid.astro`
- Create: `src/components/sections/Roadmap.astro`
- Create: `src/components/sections/Principles.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**

- `SpotlightCard` accepts `{ children: React.ReactNode; className?: string }`
- `StarBorder` accepts `{ href: AnchorHref; children: React.ReactNode; className?: string }`
- Every section consumes only the relevant readonly `ContentItem[]` or text props
- Sections expose `#about`, `#learning`, `#roadmap`, and `#principles`

- [ ] **Step 1: Import the missing sections to create a build failure**

Update `src/pages/index.astro` to import and render all four sections with data from `profile`.

Expected composition:

```astro
<Hero profile={profile} />
<About />
<LearningGrid items={profile.learning} />
<Roadmap items={profile.roadmap} />
<Principles items={profile.principles} />
```

- [ ] **Step 2: Run the build to verify it fails**

```powershell
npm run build
```

Expected: FAIL because the four section files do not exist.

- [ ] **Step 3: Implement `SpotlightCard` and `StarBorder`**

`SpotlightCard.tsx` uses pointer position only for decoration:

```tsx
export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const move = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spotlight-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--spotlight-y",
      `${event.clientY - rect.top}px`,
    );
  };
  return (
    <article
      className={`spotlight-card ${className}`}
      onPointerMove={move}
      data-cursor-target
    >
      {children}
    </article>
  );
}
```

`StarBorder.tsx` renders a semantic anchor and a decorative pseudo-element. On a fine pointer it may translate at most 4px toward the pointer and must reset on leave; the border animation runs only on hover or `:focus-visible`, never continuously.

`GridScan.tsx` renders an `aria-hidden` CSS grid and one slow scan band inside its own container; it has no global canvas or pointer listener.

- [ ] **Step 4: Implement the four semantic sections**

Requirements:

- `About.astro` uses `id="about"`, heading `先真实地学习，再认真地表达。`, and text that clearly states no experience is being invented.
- `LearningGrid.astro` uses `id="learning"`, maps each item into `<SpotlightCard client:visible>`, and labels the group `正在建立的能力`.
- `Roadmap.astro` uses `id="roadmap"`, an ordered list, one connected line rendered with CSS, and `<GridScan client:visible />` behind the list.
- `Principles.astro` uses `id="principles"` and presents clarity, accuracy, and usefulness without numerical scores.
- Wrap each below-fold section body in `<ScrollReveal client:visible>`.
- Use `StarBorder` for the primary hero CTA only; secondary links remain visually quieter.

- [ ] **Step 5: Add responsive and fallback styles**

Add CSS so:

- three-card grids become one column below 850px
- the roadmap becomes a vertical ordered path below 850px
- spotlight gradients are absent for coarse pointers
- all section text remains visible before React hydration
- reveal final states are visible under reduced motion
- no decorative layer receives pointer events

- [ ] **Step 6: Run the full automated checks**

```powershell
npm test
npm run check
npm run build
```

Expected: all commands exit 0 and `dist/index.html` contains the four section IDs.

- [ ] **Step 7: Commit the sections**

```powershell
git add src/components/effects/SpotlightCard.tsx src/components/effects/StarBorder.tsx src/components/effects/GridScan.tsx src/components/sections src/pages/index.astro src/styles/global.css
git commit -m "feat: add learning and roadmap sections"
```

---

### Task 7: Add Built-Site Verification, Metadata, Licensing, and Final QA

**Files:**

- Create: `scripts/verify-built-site.mjs`
- Create: `src/pages/404.astro`
- Create: `public/robots.txt`
- Create: `THIRD_PARTY_NOTICES.md`
- Create: `README.md`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**

- Produces `npm run verify:site`, which exits nonzero on a broken generated page contract
- Produces deployment-ready `dist/`
- Documents exact content-editing and verification commands

- [ ] **Step 1: Write the built-site verifier before final metadata fixes**

Create `scripts/verify-built-site.mjs`:

```js
import { readFileSync } from "node:fs";

const html = readFileSync(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const required = [
  '<html lang="zh-CN"',
  "Sheng",
  "AI TRAINER IN PROGRESS",
  "保持好奇",
  "奔赴未知",
  'href="#top"',
  'href="#learning"',
  'href="#roadmap"',
  'id="about"',
  'id="learning"',
  'id="roadmap"',
  'id="principles"',
  'alt="Sheng 的 3D IP 形象"',
];

const missing = required.filter((value) => !html.includes(value));
const h1Count = (html.match(/<h1\b/g) ?? []).length;
const forbidden = [
  "Formspree",
  "Spotify",
  "90%",
  "95%",
  "example@email",
  "切换明暗主题",
  "<span>清晰</span><span>准确</span><span>有帮助</span>",
];
const foundForbidden = forbidden.filter((value) => html.includes(value));

if (missing.length || h1Count !== 1 || foundForbidden.length) {
  console.error({ missing, h1Count, foundForbidden });
  process.exit(1);
}

console.log("Built-site contract verified.");
```

- [ ] **Step 2: Run the verifier and capture any contract failure**

```powershell
npm run build
npm run verify:site
```

Expected before fixes: FAIL if metadata, required IDs, anchor targets, signature, alt text, or heading count is wrong. Correct the exact reported contract before continuing.

- [ ] **Step 3: Complete metadata and static fallback pages**

Update `BaseLayout.astro` to include:

```astro
<meta name="theme-color" content="#070811" />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta name="twitter:card" content="summary_large_image" />
```

Do not add a canonical URL or sitemap URL until a real domain exists.

Create `public/robots.txt`:

```text
User-agent: *
Allow: /
```

Create `404.astro` with the same `BaseLayout`, the heading `这里暂时没有内容`, and a 44px-tall link back to `/`.

- [ ] **Step 4: Add third-party notices**

Create `THIRD_PARTY_NOTICES.md` containing:

- Gothsec Astro Portfolio repository URL and retained MIT license text from the imported template
- React Bits repository URL, the names of the adapted effects, and the retained MIT + Commons Clause license text
- A statement that the site uses those sources as part of an application and does not redistribute the component collection

Copy the license text from the checked-out source repositories rather than paraphrasing it.

- [ ] **Step 5: Document maintenance and verification**

Create `README.md` with these commands:

```powershell
npm install
npm run dev
npm test
npm run check
npm run build
npm run verify:site
npm run preview
```

Document that identity and section copy live in `src/data/profile.ts`, the approved image lives in `src/assets/sheng-ip-hero.png`, and verified links are added through `profile.links`.

- [ ] **Step 6: Run final automated verification**

```powershell
npm test
npm run check
npm run build
npm run verify:site
```

Expected: every command exits 0.

- [ ] **Step 7: Perform the exact browser QA matrix**

Run the preview server:

```powershell
npm run preview -- --host 127.0.0.1
```

Verify at 360px, 768px, 1024px, and 1440px:

- no horizontal scrolling
- one visible page-level heading
- name and role visible before scrolling
- frameless IP edges blend without a card outline
- every anchor reaches its section
- the header contains no theme toggle and remains consistently dark
- keyboard Tab reaches every link and button with a visible focus ring
- touch widths show no target cursor or pointer parallax
- reduced-motion emulation shows content immediately and renders a static quantum network
- JavaScript disabled still shows all copy, navigation, image, roadmap, and principles
- browser console contains no errors

- [ ] **Step 8: Commit the release-quality documentation and verification**

```powershell
git add scripts/verify-built-site.mjs src/pages/404.astro public/robots.txt THIRD_PARTY_NOTICES.md README.md src/layouts/BaseLayout.astro package.json .gitignore
git commit -m "chore: finalize site verification and documentation"
```

- [ ] **Step 9: Confirm the worktree is clean**

```powershell
git status --short --branch
git log --oneline --decorate -8
```

Expected: no uncommitted files and the seven implementation commits appear after the design commit.
