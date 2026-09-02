# Portfolio UI Refinement Design

## Goal

Refine the existing dark technology-themed portfolio so each screen has a clearer visual hierarchy, better mobile fit, and fewer competing effects without adding dependencies or changing the site architecture.

## Visual Direction

- Keep the black, cyan, violet, and off-white palette.
- Use one dominant effect per screen: split-flap headline on the homepage, spotlight cards on Learning, and the electric route line on Roadmap.
- Reduce secondary glow, borders, and telemetry so content and the IP character remain dominant.
- Preserve the full-body IP image and its current high-resolution source.

## Homepage

- Keep the split-flap signature as a one-time entrance treatment; do not cycle phrases.
- Reduce tile borders and shadows so the headline reads as typography rather than a control panel.
- Make “正在学习” the primary action with a restrained cyan treatment; keep “查看入行路线” secondary.
- Move the IP character slightly farther right on desktop while keeping the full body visible.
- Lower the prominence of the profile telemetry and background glow.

## Learning Page

- Keep three cards and replace generic descriptions with specific learning outcomes.
- Reduce decorative marker prominence while preserving keyboard-visible card interaction.
- On desktop, retain the three-column layout.
- On mobile, present the cards as a horizontal scroll-snap row with a visible swipe hint so the page remains within the fixed viewport.

## Roadmap Page

- Use role-specific step names and descriptions: understand the role, build core skills, complete a training project, and participate in real tasks.
- Tighten the gap between the heading and the stage panel.
- Add a short, one-time sequential node activation. Keep the existing electric border as the primary ambient effect.
- Disable non-essential animation when `prefers-reduced-motion: reduce` is active.

## Accessibility and Responsive Behavior

- Preserve one `h1` per page and semantic lists.
- Maintain visible focus states supplied by existing interactive components.
- Ensure horizontal card scrolling has an accessible label and does not hide content.
- Default to the existing dark theme and support viewport widths down to 320px.

## Acceptance Criteria

- Homepage actions remain clickable and “正在学习” is visually primary.
- The IP character remains full-body, sharp, and shifted right on desktop.
- Learning cards fit desktop in one row and mobile in a horizontal scroll-snap row.
- Roadmap copy is specific and its node animation runs once.
- Reduced-motion users receive static content.
- Targeted tests, Astro checks, and production build pass.
