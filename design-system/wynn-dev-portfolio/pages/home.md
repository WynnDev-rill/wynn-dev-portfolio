# Home Page Overrides

> **PROJECT:** Wynn Dev Portfolio
>
> **PAGE:** Immersive project journey
> **SOURCE OF TRUTH:** `/workspace/scratch/4d649bcbfa94/upload/1000080034.mp4`

These rules override the generic portfolio pattern in `../MASTER.md` whenever the homepage is implemented or reviewed.

## Composition

- One persistent, full-viewport stage pinned by native sticky positioning.
- Six equal vertical scroll chapters drive one circular generative engine; no horizontal gesture is required.
- The engine owns roughly 55–65% of the desktop frame and 45–55% of the mobile frame.
- Project copy remains on the left of the engine on desktop. On mobile it overlays the lower edge of the engine with a dedicated readability zone.
- Navigation, project rail, active chapter count, and scroll cue remain visible throughout the journey.
- After the motion sequence, projects resolve into a flat system index—never a screenshot grid.

## Visual Language

- Scientific instrument / kinetic technical blueprint, alternating graphite-black and warm paper surfaces.
- Persistent cyan, green, yellow, and red perimeter signals; each project accent controls the morphing core.
- Zero-radius technical labels and flat divider structures. Avoid generic rounded cards, blobs, purple gradients, and glass panels.
- Manrope Variable remains the display/body family to preserve the existing bundled font and the reference’s neutral grotesk character. IBM Plex Mono is used only for measurements, labels, and readouts.
- Real application icons are the only raster project assets in the motion presentation.

## Motion System

- GSAP ScrollTrigger reads normalized scroll progress; CSS sticky provides the pin without scroll-jacking.
- One React Three Fiber canvas stays mounted and morphs a shared vertex field between six procedural shapes.
- Framer Motion handles copy, icon, and UI state transitions only; each UI transition is 280–360ms and interruptible.
- Coarse pointer / Android receives the live engine at reduced DPR and vertex count. It is not forced into a static fallback.
- Static identity fallback is reserved for reduced-motion, Lite mode, or unavailable WebGL.

## Responsive And Accessibility

- Validate at 375×812, 412×915, 768×1024, 1024×768, and 1440×900.
- No horizontal overflow; vertical browser chrome changes are handled with `dvh`.
- Interactive targets are at least 44×44px and have keyboard focus states.
- The canvas has a descriptive accessible label, while all six projects remain available as semantic text.
- Body copy is at least 16px on mobile. Technical readouts may be smaller because they are supplementary, not the only explanation.
- `prefers-reduced-motion` and the explicit Motion/Lite toggle must preserve navigation and content.

## Forbidden Homepage Patterns

- APK or product screenshots.
- Per-project canvas remounts that cause popping instead of morphing.
- Disabling WebGL solely because the pointer is coarse or the viewport is narrow.
- Long conventional card stacks before the core motion experience.
- Decorative motion that is unrelated to the active project or scroll state.
