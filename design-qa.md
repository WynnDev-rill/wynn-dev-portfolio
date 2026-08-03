# Design QA — Immersive Motion Rebuild

## Source truth

- Primary motion reference: `/workspace/scratch/4d649bcbfa94/upload/1000080034.mp4`
- Extracted reference frames: `/workspace/scratch/4d649bcbfa94/portfolio-video-audit/reference/`
- Reference contact sheet used in the final comparison: `/workspace/scratch/4d649bcbfa94/portfolio-video-audit/reference-contact-sheet.jpg`
- Product content and application icons: `src/data/projects.ts` and `public/images/icons/`
- Homepage design rules: `design-system/wynn-dev-portfolio/pages/home.md`

## Implementation captures and comparison setup

- Desktop capture: cloud Chrome, 1363 × 936 CSS px, DPR 1, `/`, MemoCard active (`02 / 06`), light surface, scroll position 1030.
- Desktop dark capture: cloud Chrome, 1363 × 936 CSS px, DPR 1, `/`, My Library active (`01 / 06`).
- Android large-phone capture: responsive frame at 412 × 860, My Library, MemoCard, and HabitVerse states.
- Android small-phone capture: responsive frame at 375 × 812, My Library state.
- Android landscape capture: responsive frame at 812 × 375, My Library state.
- Detail capture: cloud Chrome, 1363 × 936 CSS px, DPR 1, `/projects/memocard`, motion-blueprint section.
- The final full-frame comparison placed the reference contact sheet and the 1363 × 936 MemoCard implementation capture in the same comparison input. Focused checks then inspected the copy zone, circular engine, rail, app badge, and lower technical readouts.

## Fidelity review

- Layout: one persistent full-viewport stage now owns the first six chapters. Copy stays left, the circular engine dominates the right/upper mobile field, and the rail/count/scroll cue remain spatially stable.
- Typography: Manrope Variable supplies the neutral geometric display rhythm; IBM Plex Mono is reserved for technical labels, measurements, and motion explanations.
- Color: graphite black and warm paper alternate by chapter. Persistent cyan, green, yellow, and red arcs reproduce the reference signal language while each project accent colors the morphing core.
- Motion: GSAP ScrollTrigger provides normalized chapter progress; one mounted React Three Fiber field morphs shared vertices across all six project shapes. Framer Motion only handles copy/icon state transitions.
- Assets: no APK or product screenshot is rendered on the homepage, project index, or case-study motion panel. All visible raster project assets are real application icons; the primary visuals are procedural Canvas/WebGL systems.
- Responsive hierarchy: the engine shifts behind the title on portrait mobile and into a right-hand instrument field in landscape. CTA, explanation, icon identity, and all six rail controls remain reachable.
- Accessibility: canvas labels describe the active visual, all projects exist as semantic text, touch targets are at least 44 × 44 px, keyboard focus styles remain visible, and Motion/Lite plus `prefers-reduced-motion` provide non-blocking alternatives.

## Iteration history

1. Initial implementation used a strong WebGL scene but produced an oversized app icon in browsers where WebGL was unavailable. Replaced it with an animated Canvas 2D procedural engine that preserves the same project-specific forms without screenshots.
2. The first mobile QA pass exposed an implicit second grid column in the profile section. Reset paragraph grid placement below 820 px and confirmed a single 345.8 px content track.
3. The first 812 × 375 landscape pass clipped the explanation/CTA and pushed the first/last rail controls outside the visible stage. Reduced landscape density, preserved the icon, hid secondary body copy, set the stage to `100dvh`, removed rail gaps, and rechecked all six 44 px controls.
4. The first desktop comparison found the system readout too close to the final headline line. Shifted the readout to the right/lower calibration field and repeated the combined source comparison.

## Functional and resilience verification

- All six rail controls update the correct headline, surface, app icon, procedural form, and explanation.
- Proyek and Tentang navigation anchors reach their intended sections.
- The primary project CTA opens the correct detail route.
- The Motion/Lite toggle changes `aria-pressed` and the document motion mode, then restores full motion correctly.
- The screenshot-free project index renders six real application icons and six working case-study links.
- The MemoCard detail panel renders a procedural motion blueprint; its only image is the small MemoCard icon.
- Desktop and mobile document widths equal their scroll widths; no horizontal overflow was found.
- Measured rail controls: desktop 46 × 46 px; mobile 48 × 44 px. Primary stage CTA: desktop 46 px high; mobile 44 px high.
- App-specific browser console check returned no errors or warnings. Observed extension metadata errors came from a Chrome extension URL and were not produced by the application.
- Production build and TypeScript validation pass through `npm run build`. The isolated Three.js chunk retains Vite's non-blocking size advisory and stays lazy-loaded.

## Final result

passed
