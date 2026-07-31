# Progress

Running log of the classical redesign. Newest first.

## 2026-07-30 — classical redesign

Rebuilt the site against the design artifact in
`handoff/portfolio-standalone.html`. Two deliberate departures from that file:
the role control is a real dropdown rather than a click-to-cycle button, and
there are narrow-screen rules (the handoff is desktop-only).

### The grid system

Everything hangs off one knob: `--grid: 2rem` (32px at a pinned 16px root).
The background is painted with two `linear-gradient`s tiled at that size, and
a script snaps content onto the painted lines in two passes:

- `[data-snap-box]` — nudges `margin-top` so an element's **top edge** lands on
  a grid line. This is what bordered rows use, since a border is a visible edge.
- `[data-snap]` — applies a `translateY` so the **text baseline** rests on a
  line. No reflow, so it can't disturb anything else.
- `[data-snap-all]` — for markdown bodies, which can't carry attributes by
  hand. The script tags their text blocks at runtime.

**Invariants.** Breaking any of these produces drift that is very hard to
attribute to its cause:

1. Line-heights must be **whole grid rows**. A 1.5-row line-height (48px) lands
   the page on a half row at odd wrap counts, and every border below it drifts.
2. Relative offsets between snapped siblings must be **whole grid rows**. A
   half-row margin puts the sibling on the far side of the rounding line, so
   the snapper pushes it back and the gap collapses.
3. A border inside a snapped box is **paid for out of that box's padding**
   (`calc(var(--grid) - 1px)`). Otherwise it adds 1px of drift to everything
   below.
4. An element with a visible border takes `data-snap-box` **only** — never
   also `data-snap`, which would translate the border off the line it was just
   snapped to.

Two bugs in the snapper itself, both fixed:

- The box pass measured `getBoundingClientRect()` without clearing the previous
  pass's `translateY`, so nudges compounded across settle passes and resizes.
- Adjacent siblings' vertical margins **collapse to the larger of the two**, so
  a nudge smaller than the preceding element's `margin-bottom` was silently
  discarded and the element never moved. The pass now verifies the element
  landed and adds whole rows until the margin wins the collapse.

### Done

- Ported layout, type and palette from the standalone. Cormorant Garamond for
  headings and UI, Lora for prose; editorial paper/ink/maroon palette with
  colour applied as stroke, not fill.
- Extracted global CSS into real stylesheets (`src/styles/tokens.css`,
  `global.css`). Astro bundles these identically to an inline
  `<style is:global>` block.
- Cursor spotlight: a thicker accent-coloured copy of the grid revealed through
  a radial mask. Tuned low (`--glow-strength`) so it passes behind text.
- Responsive rules at 60rem and 40rem, all obeying the invariants above.
- Career rows: solid maroon rules, sandwiched top and bottom, text centred
  between them, non-clickable hover tint at half the strength of a project row.
- Project pages brought onto the same system — solid borders, whole-row
  spacing, and the heading face they were missing (they had no `font-family`
  at all, so they inherited Lora throughout and read as a different site).
- Favicon rebuilt from the header mark: SVG, PNG and ICO, maroon on paper.
- Résumé wired to `public/resume_2026.pdf`.
- Buttons are 40px on a 32px grid, so they overhang by 8px. They're centred on
  a **half** row so that overhang splits 4px above one line and 4px below the
  next, rather than one line cutting through the middle.

### Open

- Case study bodies are commented out (`{/* … */}`) and render as "WIP".
- "Get in touch" points at LinkedIn; the design specifies
  `mailto:hello@stephliu.work`, which is unverified.
- Homepage work row 02 reads as shipped; the case study says the design was
  handed off before launch. Needs a decision on which is accurate.
- `public/me.jpg` is 6.7MB and may be unused.
