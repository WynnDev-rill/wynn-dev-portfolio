---
name: ui-ux-pro-max
description: UI/UX design intelligence for building and reviewing polished web and mobile interfaces. Apply for layout, visual hierarchy, typography, color, responsive behavior, accessibility, interaction, motion, and perceived performance work.
metadata:
  source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  integration: codex
  project: wynn-dev-portfolio
---

# UI/UX Pro Max — Portfolio Integration

Use this skill automatically for every task that changes how the portfolio looks, feels, moves, responds, or is navigated.

## Project context

- Product: premium futuristic developer portfolio
- Stack: React, Vite, TypeScript, React Three Fiber, Three.js, Framer Motion
- Primary targets: Android mobile browsers and desktop browsers
- Core visual: circular animation engine with rings, particles, wireframes, and a project-reactive center object
- Quality target: custom, cinematic, responsive, performant, and not an AI-template aesthetic

## Priority order

1. Accessibility and readable contrast
2. Touch targets and interaction feedback
3. Performance and frame stability
4. Responsive layout and viewport safety
5. Visual hierarchy and consistency
6. Typography and semantic color tokens
7. Motion quality and spatial continuity
8. Navigation and state clarity

## Required rules

### Responsive layout

- Design mobile-first and verify at 360, 375, 412, 768, 1024, and 1440 px widths.
- Never allow accidental horizontal scrolling.
- Use `dvh`, safe-area insets, fluid sizing, and bounded responsive typography.
- Avoid fixed pixel layouts that only work on one desktop viewport.
- Preserve meaningful content order when sections collapse on mobile.

### Android/mobile browser behavior

- Keep primary touch targets at least 44×44 CSS pixels with adequate spacing.
- Do not rely on hover for essential actions.
- Account for browser chrome, gesture navigation, notches, and dynamic viewport height.
- Avoid scroll locking, nested scrolling, and large fixed overlays that obstruct content.
- Test landscape orientation and reduced-height viewports.

### Motion

- Every animation must communicate hierarchy, state, navigation, focus, or continuity.
- Prefer transforms and opacity; avoid animating layout properties when possible.
- Use a consistent motion-token system for duration, easing, springs, and stagger.
- Keep micro-interactions around 150–300 ms and exits faster than entrances.
- Make animations interruptible and keep input responsive during transitions.
- Respect `prefers-reduced-motion` with an intentional reduced-motion experience.
- Prevent duplicate animation loops and pause expensive effects when off-screen or hidden.

### Three.js and circular engine

- Scale rendering quality using device pixel ratio caps and adaptive quality tiers.
- Reuse geometry and materials; avoid allocation inside render loops.
- Keep the center object legible and visually connected to the active project.
- Preserve stable frame pacing over raw particle count.
- Provide a graceful CSS/static fallback when WebGL is unavailable or constrained.
- Avoid excessive bloom, blur, noise, and overlapping transparent layers that reduce clarity.

### Visual system

- Maintain one coherent icon family, radius scale, spacing scale, elevation model, and color-token system.
- Use deliberate contrast and hierarchy instead of decorating every surface.
- Avoid generic glass cards, random gradients, excessive glowing borders, and repeated pill components.
- Keep project content, screenshots, descriptions, and actions more important than ambient effects.
- Use typography with controlled line length and responsive scale; body text must remain comfortable on mobile.

### Accessibility

- Normal text contrast should meet WCAG AA (4.5:1); large text at least 3:1.
- Preserve visible keyboard focus and logical tab order.
- Add accessible names to icon-only controls and meaningful alternatives for visual media.
- Do not encode state or meaning using color alone.
- Ensure navigation, dialogs, project cards, and carousels are usable without a pointer.

### Performance

- Reserve media dimensions to avoid layout shifts.
- Lazy-load below-the-fold media and split heavy visual modules when appropriate.
- Avoid continuous React state updates from animation frames.
- Profile mobile rendering, long tasks, memory use, and scroll jank before delivery.
- Prefer one coordinated animation timeline over many unrelated effects.

## Workflow

1. Inspect the existing implementation and identify the actual stack and constraints.
2. Audit mobile and desktop separately before changing code.
3. Define or update design tokens before making broad component edits.
4. Fix structural UX and responsive problems before adding polish.
5. Implement motion as a coordinated system, not isolated effects.
6. Validate TypeScript and production build locally or through GitHub Actions.
7. Verify Android mobile, desktop, reduced motion, keyboard navigation, overflow, and WebGL fallback.
8. Group related changes into as few safe commits as possible to minimize Vercel deployments.

## Pre-delivery checklist

- No horizontal overflow at supported widths
- No clipped controls under Android browser/navigation UI
- Touch targets and focus states are clear
- Primary navigation works with keyboard and touch
- Motion remains smooth and interruptible
- Reduced-motion mode is functional
- Circular engine degrades gracefully on weaker devices
- No console errors or hydration/runtime warnings
- Typecheck and production build pass
- Visual effects never obscure project information or calls to action
