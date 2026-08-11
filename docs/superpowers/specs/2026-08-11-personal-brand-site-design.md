# Sheng Personal Brand Website Design

Date: 2026-08-11

## 1. Purpose

Build a personal brand website for Sheng, an aspiring AI trainer. The first visit should quickly answer three questions:

1. Who is Sheng?
2. What AI-training skills is Sheng currently learning?
3. How is Sheng progressing toward entering the field?

The site must be honest about the current career stage. It must not invent work experience, projects, clients, qualifications, or progress statistics.

## 2. Confirmed Direction

- Identity: Sheng
- Positioning: AI trainer in progress
- Primary visitor goal: understand Sheng's background and developing capabilities
- Language: Chinese content with short English section labels
- Page model: one scrolling page with anchored section navigation
- Visual direction: dark-only futuristic laboratory
- Effect direction: React Bits-inspired quantum network laboratory
- IP treatment: frameless character blended into the hero background
- Maintenance goal: support future learning notes, projects, and articles without redesigning the site

Approved personal signature:

> 保持好奇，奔赴未知。

Approved short introduction:

> 正在探索 AI 世界的新手训练师。我喜欢拆解问题、打磨表达，也在一次次实践中学习如何让回答更准确、更好用。

## 3. Scope

### Included in the first release

- One-page personal brand website with no first-release detail routes
- Responsive anchored navigation using `#top`, `#learning`, and `#roadmap`
- Hero with Sheng's name, positioning, introduction, calls to action, and IP image
- About section
- Learning-now section
- Entry roadmap section
- Principles section built around clarity, accuracy, and usefulness
- Minimal footer
- Dark-only brand presentation
- Responsive layouts for mobile, tablet, and desktop
- Accessible motion fallbacks
- Static deployment support
- Content structure that can later support Markdown-based updates and projects

### Not included in the first release

- Invented portfolio projects or testimonials
- Contact form or backend service
- Authentication, database, CMS, payments, or analytics
- Blog UI before real articles exist
- Separate About, Learning, Roadmap, or project pages before real content requires them
- Heavy three-dimensional scenes or multiple full-page WebGL shader layers
- Fake skill percentages, counters, or career metrics

Contact links are not rendered until Sheng provides verified contact information. The footer therefore presents only the site identity in the first release.

## 4. Template and Licensing

Use Gothsec's Astro Portfolio as the structural starting template because its Astro, TypeScript, React, and Tailwind foundation matches the selected visual direction.

Retain the template's MIT license notice. Remove template-specific content and features that do not serve the site:

- Spotify integration
- Likes
- Existing project entries
- Logo wall
- Formspree contact form
- Original owner metadata and social links

React Bits components are copied individually in TypeScript and Tailwind variants. Do not install or copy the full component collection. Retain the React Bits MIT + Commons Clause notice required by its license.

## 5. Information Architecture

The first release is a single page with anchored navigation.

### 5.1 Navigation

- Brand: `SHENG / LAB`
- Links: `首页`, `正在学习`, `路线图`
- Brand and `首页` target `#top`
- `正在学习` targets `#learning`
- `路线图` and the primary hero action target `#roadmap`
- Anchor navigation uses smooth scrolling when motion is allowed and remains functional without JavaScript
- Mobile navigation keeps the brand visible and uses a compact menu if the three links do not fit

### 5.2 Hero

Content order:

1. `HELLO, I'M SHENG`
2. `AI TRAINER IN PROGRESS`
3. Personal signature: `保持好奇，奔赴未知。`
4. Approved short introduction
5. Primary action: `查看入行路线`
6. Secondary action: `正在学习`
7. Frameless IP image
8. One status panel: `CURRENT FOCUS / 回答评估`
9. A restrained telemetry label used only as decoration and hidden from assistive technology

The IP image has no visible card, border, or rounded container. Its outer image area fades into the page with a soft mask. A restrained violet halo and one orbital line connect it to the background.

Do not render the earlier `清晰`, `准确`, and `有帮助` chips beneath the IP image. Those concepts remain in the Principles section only.

### 5.3 About

Explain why Sheng is exploring AI training and how Sheng approaches learning. The section emphasizes honest progress and careful expression, not seniority.

Core line:

`先真实地学习，再认真地表达。`

### 5.4 Learning Now

Three cards:

- 数据标注: understand task rules and make consistent judgments
- 提示词设计: turn ambiguous needs into specific, actionable input
- 回答评估: review answers for accuracy, clarity, and usefulness

Each card uses the phrase `正在学习` or equivalent language. It must not imply mastery.

### 5.5 Roadmap

Four stages:

1. 了解行业
2. 基础练习
3. 建立作品
4. 寻找实践机会

The roadmap is descriptive, not percentage-based. Future real exercises can link from the relevant stage.

### 5.6 Principles

Present three criteria as Sheng's current evaluation framework:

- 清晰: the answer is easy to understand
- 准确: the answer follows the task and avoids unsupported claims
- 有帮助: the answer gives the user a practical next step

### 5.7 Footer

Display:

`SHENG · AI TRAINER IN PROGRESS · BUILT WITH CURIOSITY`

Do not render placeholder email addresses or dead social links.

## 6. Visual System

### 6.1 Color tokens

Dark-only palette:

- Background: `#070811`
- Elevated surface: `rgba(15, 18, 31, 0.74)`
- Primary text: `#F7F7FB`
- Secondary text: `#B2B9CA`
- Violet accent: `#917FFF`
- Cyan accent: `#75EAD8`
- Border: `rgba(255, 255, 255, 0.11)`

Normal-size text must meet WCAG AA contrast of at least 4.5:1.

### 6.2 Typography

- Latin labels and numerical details: Space Grotesk or a locally hosted equivalent
- Chinese headings and body: Noto Sans SC with system fallbacks
- Hero heading: `clamp(3rem, 6.8vw, 5.375rem)`
- Section heading: `clamp(2.125rem, 4.8vw, 3.375rem)`
- Body: 17px desktop and at least 16px mobile
- Monospace is reserved for short status labels, not paragraphs

Font files should be self-hosted or use reliable system fallbacks so the page remains readable when a remote font request fails.

### 6.3 Spacing and shape

- Page maximum width: 1160px
- Content section maximum width: 1060px
- Base spacing unit: 4px
- Primary section spacing: 92px desktop, 64px mobile
- Panel radius: 18-20px
- Button radius: 12px
- Interactive target height: at least 44px

### 6.4 Theme behavior

- The first release is dark-only because the dark interface is part of the technology-focused brand direction
- Do not render a theme toggle or store a theme preference
- Use the system `color-scheme: dark` declaration for native controls and browser UI

## 7. Motion and Interaction

Use a maximum of one or two continuously animated systems per viewport. Content comprehension takes priority over spectacle. Effects are distributed by section so the page feels rich without every component moving at once.

### 7.1 React Bits-inspired components

- Particles plus lightweight connection lines: the primary full-page quantum network background
- Threads or static light traces: slow violet/cyan depth behind the hero
- Grid Scan: a localized scan layer in the Roadmap section
- Decrypted Text: one-time entrance for the short role label, never for body copy
- Pill Nav: anchored navigation with an active-section indicator
- Magnet plus Star Border: primary call-to-action pointer and focus treatment
- Click Spark: brief feedback on direct pointer activation
- Electric Border: limited to the single `CURRENT FOCUS` panel
- Magic Bento or Spotlight Card: pointer-following light on Learning cards
- Scroll Reveal: one-time entrance for below-the-fold sections
- Shiny Text: low-frequency footer highlight
- Target Cursor: optional desktop pointer enhancement limited to interactive targets

The frameless IP parallax is a small custom transform, not a visible Tilted Card.

### 7.2 Motion rules

- Entrance and micro-interaction duration: 150-300ms unless the effect is a slow decorative background
- Decorative background cycle: at least 10 seconds
- Animate `transform` and `opacity`; avoid animating layout properties
- Shimmer effects run once on entry or on direct interaction, not continuously
- No continuous floating on the IP image or HUD panel
- Custom cursor never hides or blocks the native pointer and is disabled for touch devices
- Pause the quantum network animation when the page is hidden
- All effects are disabled or reduced under `prefers-reduced-motion: reduce`

### 7.3 Mobile behavior

- Use `min-height: 100dvh` for the hero
- Stack copy above the IP image
- Reduce particle and connection density and remove pointer parallax
- Show one HUD status panel
- Hide decorative telemetry if it competes with the IP image
- Do not make any essential action hover-only
- Maintain at least 8px between touch targets

## 8. Technical Architecture

### 8.1 Stack

- Astro
- TypeScript
- Tailwind CSS
- React only for interactive islands
- Markdown or MDX content collections for future updates and projects

Do not add Three.js, a general animation framework, a CMS, or a state-management library in the first release. A single lightweight OGL or Canvas layer is allowed only for the selected quantum network background.

### 8.2 Component boundaries

Static Astro components:

- `SiteHeader.astro`
- `Hero.astro`
- `About.astro`
- `LearningGrid.astro`
- `Roadmap.astro`
- `Principles.astro`
- `SiteFooter.astro`

Interactive React islands:

- `SpotlightCard.tsx`
- `ScrollReveal.tsx`
- `StarBorder.tsx`
- `TargetCursor.tsx`
- `ParticleNetworkBackground.tsx`
- `GridScan.tsx`
- `DecryptedText.tsx`
- `ClickSpark.tsx`

Each component has one clear responsibility. Static layout and copy remain in Astro; React is used only where runtime interaction is required.

### 8.3 Hydration strategy

- Hero background and initial text effect: `client:load`
- Target cursor: `client:idle` with desktop capability checks
- Below-the-fold spotlight and reveal components: `client:visible`
- Static sections: no client directive and no shipped JavaScript

### 8.4 Content flow

`src/data/profile.ts` is the single source for identity, introduction, navigation, learning topics, roadmap entries, principles, and future verified links.

Astro page flow:

`profile.ts -> index.astro -> static section components -> interactive islands receive only the props they need`

Future articles and projects live in Astro content collections rather than `profile.ts`.

## 9. Asset Handling

- Selected source asset: `assets/sheng-ip-hero.png`
- Implementation destination: `src/assets/sheng-ip-hero.png`
- Render through Astro's image pipeline with explicit width and height
- Generate responsive WebP or AVIF output with a PNG fallback
- Hero image uses eager loading and high fetch priority
- Below-the-fold images use lazy loading
- Alt text: `Sheng 的 3D IP 形象`

The approved image may be resized or encoded for delivery, but its character design is not regenerated or altered.

## 10. Failure and Fallback Behavior

- If JavaScript fails, all identity, learning, roadmap, principles, and navigation content remains readable
- If the particle network, Threads, or another effect fails, show the static grid, violet halo, and perspective-line background
- If the IP image fails, reserve its layout space and display the alt text without breaking the hero
- If reduced motion is requested, display final states with no animated delay
- Navigation anchor targets remain functional without smooth scrolling

There are no form, network, authentication, or API error states in the first release because the site has no runtime data submission.

## 11. Accessibility

- Use semantic landmarks: header, nav, main, section, and footer
- Keep one page-level `h1` and ordered heading levels
- Provide visible `:focus-visible` rings using the cyan accent
- Give icon-only buttons accessible names
- Preserve a normal cursor and keyboard operation
- Do not communicate status through color alone
- Verify normal text contrast at 4.5:1 or higher
- Ensure mobile body text is at least 16px
- Ensure all interactive targets are at least 44 by 44px
- Support `prefers-reduced-motion`

## 12. Performance Strategy

- Copy only the selected React Bits components
- Audit each copied component's dependencies before installation
- Prefer CSS and Canvas 2D; if the selected React Bits background requires OGL, keep it to one full-page rendering layer
- Hydrate below-the-fold effects only when visible
- Pause continuous animation when the document is hidden
- Reduce effect density for narrow viewports and low-power conditions
- Optimize and preload the hero image
- Keep the page usable before hydration

## 13. Verification and Acceptance Criteria

The implementation is accepted when all of the following are true:

1. `npm run build` completes successfully.
2. The page has no browser console errors during normal navigation.
3. The hero identifies Sheng and the AI-trainer positioning without scrolling.
4. No invented experience, project, client, certificate, contact information, or metric is present.
5. The selected IP is frameless and visually blends into the background.
6. Desktop shows the planned quantum network, Grid Scan, one-time text entrance, pointer parallax, cursor target, and card spotlight interactions.
7. Mobile removes pointer-only effects and keeps all actions usable by touch.
8. Reduced-motion mode removes continuous and entrance motion without hiding content.
9. The site is consistently dark-only and does not expose a theme toggle.
10. Keyboard users can reach every interactive element and see focus indication.
11. Normal text meets WCAG AA contrast.
12. Layout is checked at 360px, 768px, 1024px, and 1440px widths.
13. The site remains readable with JavaScript disabled.
14. The hero image has responsive output, dimensions, alt text, and a non-breaking fallback.
15. The first release has one page only; `首页`, `正在学习`, `路线图`, and both hero actions resolve to valid anchors on that page.
16. The hero displays `保持好奇，奔赴未知。` and does not display the removed value chips.

## 14. Future Extension Path

When real material becomes available:

1. Add `src/content/updates/` for learning notes.
2. Add `src/content/projects/` for real exercises and case studies.
3. Add list and detail routes generated from content collections only after real material exists.
4. Add verified social or email links through `profile.ts`.

These additions reuse the existing layout, tokens, and component boundaries. They do not require replacing the first-release architecture.
