# Portfolio UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Improve hierarchy, copy, responsive fit, and restrained motion across the three existing portfolio screens.

**Architecture:** Keep the existing Astro section components and profile data model. Apply content changes in `profile.ts`, component-local layout changes in each section, and source-contract tests for behavior that is important but difficult to exercise in jsdom.

**Tech Stack:** Astro, React islands, TypeScript, CSS, Vitest

## Global Constraints

- Do not add dependencies.
- Preserve the existing dark technology visual language.
- Support mobile widths and `prefers-reduced-motion`.
- Keep copy specific, concise, and natural.
- Preserve existing user changes and the high-resolution IP asset.

---

### Task 1: Lock the refined content contract

**Files:**

- Modify: `tests/profile.test.ts`
- Modify: `src/data/profile.ts`

**Interfaces:**

- Consumes: the existing `Profile`, `LearningItem`, and `ContentItem` interfaces.
- Produces: updated `profile.learning` and `profile.roadmap` content used by the section components.

- [x] **Step 1: Write failing expectations for the three learning descriptions and four roadmap entries.**
- [x] **Step 2: Run `npm test -- tests/profile.test.ts` and verify the content expectations fail.**
- [x] **Step 3: Update `profile.ts` with the approved specific copy and align the existing introduction expectation.**
- [x] **Step 4: Run `npm test -- tests/profile.test.ts` and verify it passes.**

### Task 2: Refine homepage hierarchy

**Files:**

- Modify: `tests/site-shell.test.ts`
- Modify: `src/components/sections/Hero.astro`

**Interfaces:**

- Consumes: `profile.heroStatement`, `profile.introduction`, `SpecularButton`, `SplitFlapText`, and the refined portrait asset.
- Produces: a restrained one-time headline, clear primary action, and balanced portrait placement.

- [x] **Step 1: Add source expectations for a primary Learning action, subdued split-flap tiles, and right-shifted portrait.**
- [x] **Step 2: Run the site-shell test and verify the new expectations fail.**
- [x] **Step 3: Update the button props/classes and component-local CSS; keep both existing routes and click layers intact.**
- [x] **Step 4: Run the site-shell test and verify it passes.**

### Task 3: Make Learning fit mobile viewports

**Files:**

- Modify: `tests/site-shell.test.ts`
- Modify: `src/components/sections/LearningGrid.astro`

**Interfaces:**

- Consumes: `readonly LearningItem[]`.
- Produces: a three-column desktop grid and labeled horizontal scroll-snap mobile list.

- [x] **Step 1: Add source expectations for `scroll-snap-type`, horizontal overflow, and the mobile swipe hint.**
- [x] **Step 2: Run the site-shell test and verify the new expectations fail.**
- [x] **Step 3: Implement the mobile horizontal row, snap alignment, hidden scrollbar, compact cards, and swipe hint.**
- [x] **Step 4: Run the site-shell test and verify it passes.**

### Task 4: Tighten Roadmap and sequence nodes

**Files:**

- Modify: `tests/site-shell.test.ts`
- Modify: `src/components/sections/Roadmap.astro`

**Interfaces:**

- Consumes: `readonly ContentItem[]`.
- Produces: four indexed nodes with CSS delay variables and reduced-motion fallback.

- [x] **Step 1: Add source expectations for `--roadmap-step`, the node keyframes, and reduced-motion handling.**
- [x] **Step 2: Run the site-shell test and verify the new expectations fail.**
- [x] **Step 3: Add the per-node delay, one-time activation animation, and tighter stage spacing.**
- [x] **Step 4: Run the site-shell test and verify it passes.**

### Task 5: Verify the complete refinement

**Files:**

- Verify only; no production files should change.

**Interfaces:**

- Consumes: completed Tasks 1-4.
- Produces: evidence that the site compiles and key screens render correctly.

- [x] **Step 1: Run targeted Vitest files for profile, site shell, and split-flap behavior.**
- [x] **Step 2: Run `npm run check`.**
- [x] **Step 3: Run `npm run build`.**
- [x] **Step 4: Capture desktop screenshots for `/`, `/learning`, and `/roadmap`, plus a mobile Learning screenshot, and inspect hierarchy, clipping, and overflow.**
