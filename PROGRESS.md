# Progress

Running log of the classical redesign. Newest first.

## 2026-08-04 — the numerals come inside, and what that cost

### Section numerals stopped hanging

They used to be printed into the gutter — outside the heading's own left edge,
by an `h2::before` counter with a `--numeral-drop: 3px` token to nudge them.
The whole 2-unit gutter existed to hold them: ~19px of tabular figures plus the
32px they hung by left about 13px of clearance, which is why the gutter could
never come down.

The numerals are still there and still count the same series as the rail's
contents list. They are inline now, part of the heading's line: sans, accent,
tabular, `--text-xs`. The token is gone.

The numeral's box is **one whole grid unit**, not its ink plus a gap. The first
version used a half-unit margin and put the heading's words at ~35px, on
nothing. At one unit they start at exactly 32, which is what lets the dek take
the same indent and land on a line too. `text-indent: calc(var(--grid) * -1)`
pulls the first line back out so the numeral still starts on the column edge,
and a heading long enough to wrap keeps its second line under its first rather
than under its own numeral.

Deks are indented to match (`h2 + .dek`), so a heading and its caption read as
one block. Adjacent-sibling only — an h3 has no numeral and a dek under one has
nothing to line up with but the column edge.

What it costs: the heading's WORDS no longer start on the column's left edge —
the numeral does. That is the correct edge to keep. The numeral is the first
thing on the line, so it is what the eye tracks down the page, and every other
left edge in the document lines up with it.

With nothing hanging in it, the gutter had no floor to defend, so `--rail-gap`
went from two units to one and the main column grew **768 → 800**.

### The widening broke the panel, and the fix is a rule

`repeat(3, 1fr)` across 800px is 266.67 per cell, which put the second and
third cells' text **11px off the line**. It had been fine at 768 purely by
luck: 768 is 24 units and divides by three. Nothing recorded that as a
constraint, so widening the column broke it silently.

The tracks are now rounded down to whole units with the last one absorbing the
remainder — `256 / 256 / 286` — written as arithmetic off `--panel-cols` so it
holds for any cell count:

```css
grid-template-columns:
  repeat(calc(var(--panel-cols, 3) - 1),
         round(down, calc(100% / var(--panel-cols, 3)), var(--grid)))
  1fr;
```

`down` rather than `nearest` so the tracks cannot sum past the box. Rendered
beside the equal split, the 30px-wider third cell is not a difference you can
see. Inner cells also took `padding-left: calc(var(--grid) - 2px)`: two strokes
stand between their text and the line — the panel's own border shifts every
track 1px right, then the cell adds its divider — where the first cell meets
only one.

**The general rule, now that it has cost something twice: a fluid split of the
column is only on the grid when the column divides by the number of parts.**
Fixed tracks or rounded tracks, never `1fr`, for anything whose edges show.

### Metadata moved out of the rail

It is a strip under the title and its lede now (`ProjectMeta.astro`, was
`RailMeta.astro`), on fixed five-unit tracks via `auto-fill` — not
`repeat(5, 1fr)` and not `minmax()`, both of which are the mistake above. The
rail is navigation only.

`Status` is no longer rendered. It stays in the schema and stays set on every
project, but a phrase like "handed off" in a row of facts beside the team and
the dates reads as a hedge attached to the work rather than a statement about
it. Each case study says where it landed in its own words — the Outcome cell
and the closing section.

### "All work" and "Contents" were already on the grid

Measured rather than assumed, and the answer was no change. A baseline probe
plus a pixel scan of the render put the contents entries at **exactly** 288 /
320 / 352 / 384 / 416, with the painted lines at the same coordinates and glyph
ink stopping in the pixel above each. Sticky contributes **0.00px** at scroll 0
(forcing `position: static` moved `.rail-inner` not at all — 160 either way).

Two things are true and neither is a misalignment:

- The horizontal lines are near-invisible in the rail. `--color-grid` is 3.1%
  contrast; the vertical lines read because they run the page's full height
  uninterrupted, while a horizontal line inside a 256px column is short and is
  broken by the text sitting on it. There is nothing there for the eye to
  register the text as resting on.
- `.rail-back` and `.rail-label` sit 0.5px high — the snapper's own metric
  error, not layout. Canvas `fontBoundingBox` returns integers (Fira Sans 16px
  → 15/4) and the real fractional metrics land half a pixel off. Fraunces's
  integers happen to be exact, which is why the contents entries measure 0.00
  and these two do not. Fixing it at source means fractional font metrics in
  the snapper, not a CSS change.

### Figures lost the mat

The `mat` prop and its hairline-plus-tint frame are gone from `Figure.astro`.
The argument for it was real — a UI screenshot's near-white background bleeds
into the paper with no edge — and it still lost. A rule around every picture
reads as chrome on a page that has very little, and the eye goes to the frame
instead of the screen inside it. The bleed is the cheaper problem.

### Video

`Video.astro`, same terms as a figure: column width on the `<figure>` so the
caption inherits the left edge, no border, `aspect-ratio` from the props so the
page below does not jump before metadata loads. No autoplay — a walkthrough is
a thing you choose to watch, and this one is 18MB.

The source was a `.mov`. Firefox will not play a QuickTime container at all, so
it was remuxed to `.mp4` (`avconvert --preset PresetPassthrough`, lossless —
the stream was already H.264).

### The grid came apart on scroll, and lazy images were why

Reported as "it sits on the lines after a reload, then stops once I scroll a
bit," and it was real. Every `<img>` is `loading="lazy"` and none declared a
size, so each one occupied **zero height** until it decoded and then sprang to
full height mid-scroll, shoving everything below it down by an arbitrary
number of pixels. The snapper's last settle pass is 500ms after `load` and it
never runs again, so those lines just stayed where the image put them.

Measured before the fix: the label-request document was **5049px at first
paint and 8162px** by the bottom of one scroll. 3113px of content arriving
under the reader.

`Figure.astro` now reads each file's intrinsic size with `sharp` at build time
and emits `width`/`height` plus an `aspect-ratio`, so the box is reserved
before a byte is fetched. In the component rather than as props on each
`<Figure>`, so the numbers cannot go stale when a screenshot is re-exported.
A missing file warns on the console and still builds —
`label-requesting-old.png` is still referenced and still absent.

After: **8089px at load, 8089px after a full scroll. 0px of growth**, 0
off-grid at both points. `sharp` was already present as one of Astro's own
dependencies; it is a direct devDependency now rather than a lucky hoist.

Worth generalising: the snapper assumes the document stops moving. Anything
that changes layout after 500ms — a lazy image, a web font that arrives late,
an expanding element — puts everything below it off the grid, and the fix is
always to stop the layout from moving rather than to re-snap after it does.

### Verified

Case study 54 measured / 0 off-grid at 1440, 48/0 at 900, 48/0 at 420, and
0 off-grid *after a full scroll to the bottom and back* on both project pages.
Left-edge sweep on both project pages at 1440: the only remaining hits are the
three that are meant to be off — the right-aligned footer link and two inline
mid-sentence links. Homepage left edges all 0. `npx astro build` clean,
8 pages.

## 2026-08-04 — the other axis

The baseline snapper has been putting text on the horizontal lines since it was
written. Nothing had ever put it on the vertical ones, and once you look for it
you cannot stop seeing it: at 1440 every left edge on the page sat **16px into
a cell**.

### Centring cannot land on a grid

The cause is arithmetic, not a bug. `.col` is 34 units wide and centred, so its
margin is `(100vw − 1088) / 2` — a multiple of 32 only when the viewport is a
multiple of 64. At 1440 that is 176, five and a **half** units. Worse, there
were two centrings stacked: `.wrap` capped the page at 1280 and centred that
too, so the column started at `80 + 96` and neither term was on a line.

Nothing downstream could correct it. The rail (8 units) and the gutter (2) are
exact, so they faithfully carried the half unit into the prose column: rail at
176, body at 496, both wrong by the same 16px.

Two changes:

- **`.wrap` loses its 1280 cap.** It was vestigial — the masthead moved out
  when it went full-bleed, and `.col` caps itself lower — but it was still
  contributing an unquantisable offset. It is a stacking context now.
- **`.col` rounds its own centring to `--grid`**, via CSS `round()`, with plain
  `margin-inline: auto` left in front as the fallback. The right margin takes
  the remainder, so the two differ by at most one unit — invisible at this
  width, where a text edge 16px off a line it is clearly reaching for is not.

`nearest` rather than `down`: down always shortens the left margin and drags
the column toward the edge it is furthest from. At 1440 nearest gives
176 → **192**, which is the small push right this started as.

### Three more half-units, found by sweeping

Fixing the column exposed the rest. Rather than guess, a probe walked every
element whose first child is a text node and measured its left edge against the
grid — 10 off on the case study, 12 on the homepage.

| what | was | now | why it was off |
| --- | --- | --- | --- |
| `--bullet-gutter` | 48px (1.5 units) | 32px | the half was the whole problem |
| `.work-row` tracks | `56px 1fr 200px` + 12px pad | `--grid 1fr 6×--grid` | title landed 88px in — 2¾ units |
| `.panel-cell` inline padding | `--grid` | `--grid − 1px` | border + 32 = 33, one px past the line |

The panel already took its border out of the *vertical* padding for exactly
this reason. It just had never been done on the other axis, and the error
repeated at all three cells.

The bullet gutter is the one that was a judgement call, because **32 and 64 are
both on the grid**. Two units measured fine and looked wrong: a 24px mark with
40px of air after it stops reading as punctuation for the line and starts
floating, so the eye has to reach for the text it belongs to. One unit keeps
the ~8px a list marker wants. Rendered both and looked, rather than picking the
one the arithmetic flattered. (It also made the narrow-width override
redundant — that breakpoint was already closing the gutter to one row.)

### What is still off, and is meant to be

The sweep does not reach zero, and shouldn't. What remains:

- **Right-aligned text** — `.career-date`, `.work-meta`, `.case-footer__next`.
  Their *right* edges are the aligned ones, and all three measure dev 0.
- **Inline links and spans mid-sentence** — "Get in touch ↗", the role button's
  label. These start where the sentence puts them; that is what inline means.
- **Fluid tracks below `--col-max`** — the rail's `auto-fit` metadata and the
  panel's thirds, at collapsed widths. Below the cap `.col` spans the viewport,
  so its content width is `100vw − 64` and is a grid multiple only when the
  viewport is. Quantising that would mean a right margin that jitters as you
  resize, to fix interior edges of a deliberately fluid grid. Not worth it —
  and the *left* edge, which is what was asked for, holds at every width.

### Verified

Vertical unchanged, which mattered — the bullet gutter changes how list items
wrap. Case study 70/0 at 1440, 64/0 at 900 and 420; homepage 24/0 at 1440 and
420. Horizontally at 1440: `.col`, rail, `h1`, body, contents, metadata and the
masthead mark all dev 0, and every right-aligned edge dev 0. Build exit 0.

## 2026-08-03 — the case study gets a rail

The two-column treatment the last entry promised. `--col-max` splits into
**8 + 2 + 24 = 34 units** — a 256px rail, a 64px gutter, a 768px column of
prose. (It started 9 + 4 + 21; see "the gutter was a hole" below.) The wide
column bought the page presence and cost it its line length (~113 characters);
the rail spends the difference on navigation and hands the prose ~80 back.

### The components

Each of these is its own file, so a second case study gets the rail by
composing them, not by copying a page:

| file | what it is |
|---|---|
| `SideRail.astro` | the frame + the quantised sticky (below); three named slots |
| `RailMeta.astro` | the `<dl>` of Team / Role / Timeline / Tools / Status / Code |
| `Contents.astro` | the numbered nav **and** its scroll spy |
| `RailAction.astro` | the rail's one button, plus the line saying what it opens |
| `Panel.astro` + `PanelCell.astro` | the "At a glance" row |
| `Dek.astro`, `PullQuote.astro` | the two prose devices the mockup added |

`Contents` is driven by the `headings` that `render()` returns beside
`Content` — the real h2s of the real document. **Rule: never hand-keep a
contents list.** Add an `##` and it appears; rename it and it renames.

### Sticky has to be quantised

A `position: sticky` rail rides the viewport while the painted grid is anchored
to the page, so a rail pinned at a constant `top` is on the grid at exactly one
scroll position and off it everywhere else. `top` is recomputed per frame:

```
top = grid + ((-scrollY) mod grid)
```

which holds the rail's *page*-Y at ≡ 0 (mod grid) at every scroll offset. That
is also the only reason it is safe to baseline-snap the rail's contents at all.
To go back to smooth sticky, delete the script; the CSS `top` is already
`var(--grid)`.

### Two things the snapper taught us the hard way

- **Nested `data-snap` double-transforms.** `[data-snap-all]` tags every `li`,
  but in the contents list the `<li>` is a wrapper around a grid `<a>` that is
  the real row — tagging both moved it a full row and printed "Contents" on top
  of entry 01. The rail therefore does **not** carry `data-snap-all`; it tags
  its own text by hand.
- **A label above a *rule* needs its row of margin; a label above *text* does
  not.** Zeroing `.panel-label`'s bottom margin put its snapped baseline exactly
  on the panel's top border.

### The quantised sticky came back out

The rail rode a `top` recomputed each frame as `grid + ((-scrollY) mod grid)`,
which held its page position congruent to 0 (mod grid) and measured perfectly —
zero deviation at eight scroll positions. It was still wrong. That expression is
a **sawtooth**: the rail scrolls with the page for 32px, then jumps 32px to
catch up, so the whole left side of the page stutters once per row for as long
as you read.

**Rule: measure a fix at rest AND in motion.** Being on the grid is a static
property of a page at rest; a stutter is motion, and motion wins the eye. The
lines it was aligning to are a faint background wash — the jump was not faint.
Plain `position: sticky` now: exact at rest, floating against the wash once
pinned, which is the cheaper error. Verified steady across 41 consecutive
scroll pixels, largest frame-to-frame movement 0px.

### The gutter was a hole

A gap **inside** a layout must not out-measure the margin **around** it, or the
block stops reading as one page. It did, and it took two passes to fix:

| | was | pass 1 | now |
|---|---|---|---|
| rail | 288px (9u) | 288px | **256px (8u)** |
| gutter | 128px (4u) | 96px (3u) | **64px (2u)** |
| main column | 672px, ~70ch | 704px, ~73ch | **768px, ~80ch** |
| white between the rail's ink and the prose | **196px** | 159px | **~100px** |
| page's own outer margin | 176px | 176px | 176px |

The rail's longest line is only ~220px, so 68px of its 288px box was empty
before the gutter even started — the void was never the gutter alone. Widening
the rail doesn't help: **the ink does not grow with the box.** With the total
pinned at 34 units so a project page keeps the same outer edges as everywhere
else, the only lever that moves the prose left is the gutter.

**The gutter is now at its floor.** The section numerals need ~19px of tabular
figures plus the 32px they hang by, which leaves ~13px between the rail's right
edge and the numbers. Take another unit off and they collide.

**The cost, recorded so it isn't rediscovered:** the measure is now ~80
characters, over the comfortable 45–75, carried by the 32px leading on 20px
type. If it has to come back, the honest fix is a narrower `--col-max` for
project pages only — which costs edge alignment with the rest of the site.

### The masthead: full-bleed, sticky, two rows

It was capped at `--col-max` and centred, so the mark sat on the column's left
edge. It now runs the full width of the viewport with one grid unit of gutter,
and it is `position: sticky`. Three consequences that are easy to miss:

- **Sticky means opaque, and opaque over a page whose background IS the grid
  leaves a blank band.** So the masthead repaints the same grid at the same
  size. Its lines are anchored to its own box, so they hold still while the
  page scrolls underneath — the band reads as the page continuing.
- **Everything that scrolls to a position had to learn about it.** The rail
  parks at `--header-h + --grid` instead of `--grid`, its `max-height`
  subtracts the masthead, and every anchor target carries a matching
  `scroll-margin-top` — otherwise clicking a contents entry files the heading
  under an opaque bar.
- **The border is a `border-bottom`, never a shadow**, so `box-sizing` eats it
  out of `--header-h`. A 1px border that added to the height would push the
  whole document a pixel off the grid.

**Three rows → two.** At three the nav had the middle row and the icons floated
at 48.5 — the midpoint *between* two painted lines. At two they centre on the
line at 32, so the grid runs through them. Measured: icon and mark centres both
land at exactly 32.5, which is that line's true middle (the grid paints each
line on the FIRST pixel of its tile, so it occupies 32–33). `--nav-drop` is
still 1px and still needed, but for the opposite reason — **same number,
different derivation; re-derive it, don't assume it.**

The bottom edge is a **double rule**: two 1px strokes in `--color-divider`,
`--grid / 8` apart. Both are the same weight and colour as every other rule on
the site — a double rule earns its emphasis from repetition, never from getting
heavier.

### The panel closes; the rail reorders; the faces split

- **"At a glance" lost its label and gained a frame.** It was open at the ends
  — top and bottom rules only, outer cells stripped of inline padding so the
  text started and ended on the column's own edges. That made it one more
  passage of the document. It is a closed rectangle now, which says the
  opposite and says it deliberately: this block is a summary standing outside
  the argument, and a frame is what marks it as such. `.panel-label + .panel`
  zeroes the top margin so a labelled panel doesn't take the row twice.
- **Contents sits above the metadata.** Navigation is the only part of the rail
  you come back to, so it should be nearest the top when the rail pins; the
  metadata is read once. Re-ordered in `SideRail.astro`, not in `[id].astro` —
  the sequence is the frame's business, so every project gets the same one.
- **Two faces, split down the pair.** `dd` is `--font-read`, `dt` stays
  `--font-ui`. It used to be sans on both, on the theory that a dt/dd pair is
  one unit; the site's actual rule is the reading face for what you READ and
  the UI face for what labels it, and a metadata value is content. The caps and
  tracking on the label are what hold the pair together. Cell titles
  ("Problem", "Approach") went the other way for the same reason — they are
  labels, so they wear `.section-label` like every other label on the site.

### Two bugs the reorder exposed

- **`+` is fragile next to a component that ships a `<script>`.** Contents.astro
  carries its scroll spy, and in dev Astro leaves that element in the markup
  where it was written. The moment contents moved above the metadata, the
  `.rail-section + .rail-section` rule stopped matching and the hairline between
  them silently vanished. Now `~`, which skips the first section just as well
  and doesn't care what sits in the gap. (`:last-of-type` would be no help
  either — the sections are a `<nav>`, a `<dl>` and a `<div>`, so each is the
  last of its own type.)
- **Every small label in the article was rendering at the wrong size, and had
  been for a while.** Astro scopes `.case-main :global(p)` to
  `.case-main[data-astro-cid] p` — (0,2,1) — while `.section-label` in
  global.css is (0,1,0). So the labels kept their caps and tracking and quietly
  came out at `--text-lg` instead of `--text-xs`. It looked plausible, which is
  exactly why it survived. **Lesson: a class that only half-applies looks like a
  design choice.** Fixed with `p.section-label`, the same `p.`-prefix trick
  `p.panel-cell__stat` already documented.

### The mockup's boxes are rules here

The mockup drew rounded rectangles in five places. Same decision as the
2026-07-31 entry: a 1px rectangle around a paragraph is a card, a thing from an
app, and this page is a document. Matted figures get a border because a
screenshot's own white would otherwise bleed into the paper with no edge.

**Except "At a glance", which was later closed on purpose** — see above. The
rule holds for a passage you read; that block is a summary standing outside the
argument, and the frame is what says so. The corners are still square, which is
the part of "not a card" that actually mattered.

### Verified, not eyeballed

At 1440 with images forced to load: **72 measured, 0 off-grid.** Across eight
scroll positions the rail's page-offset deviation is 0 and the worst baseline
deviation is 0. At 420: 65 measured, 0 off-grid. The one measurement with no
CSS derivation is `--numeral-drop: 3px` — Fira Sans 16 and Fraunces 24 sit at
21.4 and 24.9 from the top of the row, so the section numeral floats high next
to its own heading. **Re-measure it if either face or either rung changes.**

## 2026-08-03 — three widths collapse to one

The page had grown three horizontal edges, and every rule in
`pages/projects/[id].astro` had to declare which one it was on:

| | was | took it |
|---|---|---|
| measure | 672px | anything you read, plus the metadata grid |
| column | 864px | the frame: h1, back link, footer, the meta rule |
| bleed | 944px | figures with their captions, the `<Challenge>` rules |

All three are gone. `--col-max` went from 27 grid units to **34 (1088px)** and
is now the only width on the page. `--measure`, `--bleed` and `--callout-gutter`
are deleted from `tokens.css`.

### What that fixed as a side effect

Every margin shorthand in the case-study CSS had been carrying `auto` in its
inline slots, with a comment explaining that a `0` there would silently undo
the centring the `--measure` rule set. That trap is gone — the `auto`s are all
`0` now, and a future `margin: 0` can't knock a block off its axis.

### The breakpoint had to move with the column

`global.css` swapped `.col`'s centring for a 32px `padding-inline` at 60rem
(960px). With a 1088px column that leaves a band of viewport widths — 960 to
1088 — where the column is wider than the screen and the text runs flush into
the edge. The gutter rule is now at **72rem** (1152px = 1088 + two 32px
gutters). **Rule: that breakpoint is `--col-max` plus two gutters, not a taste
decision.** Raise one without the other and the band comes back.

### The hero rung came down, 48 → 40

"Stephanie is a *design technologist* based in San Francisco." should set on
one line. Measured against real Fraunces 200 metrics, with the role button's
border, padding, gap and caret counted in:

| hero size | longest line |
|---|---|
| 48px | 1230px |
| 40px | 1035px |

At 48 it needs a column so wide the page has no margin left — the opposite of
what widening the column was for. `--text-3xl` is **40px**, which is 1¼ grid
rows, so the rung stays on the same arithmetic as the rest of the scale. The
sentence renders on one line with 51px to spare, and `h1.hero` no longer
carries a `max-width` at all. The case-study h1 shares the rung and came down
with it.

### The known cost

20px prose across 1088px is ~90 characters, above the comfortable 45–75. Taken
deliberately: the case-study body gets a two-column treatment later, and the
wide column is the frame those two columns will sit in.

## 2026-07-31 — callouts become rules; bullets become the mark

The callouts read as UI cards pasted onto a document. Four separate reasons,
fixed together.

### Why

1. **A box is the wrong device.** A 1px rectangle around a paragraph is a
   card — a thing from an app. This page is a document, and a document sets a
   passage apart with a rule above and below it. The page already does that
   twice (`.career-list`, `.case-footer`); the callout was the odd one out.
2. **The text was the smallest on the page.** `.callout p` was pinned to
   `--text-base` (16px) while body copy is `--text-lg` (20px). The one passage
   you most want read was set smaller and lighter than the prose around it.
3. **The icons were the only aliased thing on the site.** pixelarticons are
   24×24 pixel art. Everything else — the mark, the nav rings, every rule — is
   drawn at a hairline. Blown up to a 32px box, the stair-steps were the one
   place the drawing broke.
4. **Half-row padding was fighting the snapper** — see the bug below.

### The half-row padding bug

Worth writing down, because it will happen again. `.callout` had
`padding: calc(var(--grid) / 2 - 1px)`. BaseLayout tags `.callout` with
`[data-snap-box]`, which puts its **top edge** on a grid line. 16px of padding
then starts the inner `<p>` half a row down — and the baseline pass rounds to
the **nearest** line, so it yanked that paragraph a full 16px to one side or
the other. That is most of why the boxes "looked off".

**Rule: a snapped box's padding must be a whole row too, not just its height.**
Half a row anywhere inside a `[data-snap-box]` puts its `[data-snap]` children
on the wrong side of the rounding. Padding is now a full row minus the border,
so one line of callout text is 1+31+32+31+1 = 96px, exactly three rows.

### Changed

- **`.callout`** — `border-block` only (top + bottom rules), no inline
  padding, so the text starts on the same left edge as the prose around it.
  Full-row padding. Hover shades it `--tint-row`, the same wash the career
  rows take. The `--text-base` override is **deleted**, so callout text now
  inherits body size and full ink from `article p`.
- **`<Challenge>`** — the pixel speech-bubble is gone. "Challenge:" is now a
  tracked uppercase `--font-ui` label in the accent, reusing the existing
  `.section-label` class and overriding only colour and margin. Same device as
  the metadata `<dt>`s, so it reads as part of the system. The label stacks
  above the text (it was going to hang in a 128px `--callout-gutter`; see the
  centring section below for why it can't), and the text sets at `--text-xl`.
  It's the thesis of the case study; it shouldn't be the same size as the
  paragraph after it. It drops to `--text-lg` under 640px.
- **The callout breaks the measure.** `.callout` came off the `--measure`
  list, so its *rules* now run the full column the way a figure does. The text
  inside is still held to the measure, because `article p` catches it.
  Full-width rules over a measure-width paragraph is the entire effect — it's
  why the block can afford to break out at all.
- **`components/Mark.astro`** (new) — the seven-node logo, extracted from
  BaseLayout so the header and the bullets share one drawing. Takes
  `currentColor`, so the header's `a` rule paints it the accent and hands it
  the hover brightening for free.
- **`components/BulletList.astro`** (new) — `<BulletList items={[...]} />`.
  The mark hangs in a 1.5-row gutter as the bullet; a real hanging indent, so
  wrapped lines align under the text rather than under the bullet. Grid, not
  `::marker` — a marker can't take an SVG without baking the drawing into a
  data URI, where it would drift from the real mark.
  - **`ordered`** swaps the mark for a padded numeral (`01`, `02`) and needs
    no other change — same gutter, same indent. Deliberately the same
    treatment as `.work-num` on the homepage. `<ol>` when the order carries
    meaning, `<ul>` when it doesn't.
  - **Items can be `{ term, text }`** as well as plain strings, rendering as
    **term** — sentence. Items arrive as props rather than markdown, so
    `**bold**` in a string would ship as literal asterisks; this covers the
    one shape the case studies were already writing by hand. The em dash is
    rendered by the component, so every item punctuates identically.
  - The `1. Auto-labeling / 2. Self-labeling` list in `easy-labeling-design`
    is the first user. Wording unchanged.
- **Three-up rows retired.** Every `<div class="cols-3">` of `<Callout>`s in
  the case studies is a `<BulletList>` now. `.cols-3`, `Callout.astro`,
  `icons.ts` and the `.minisvg` rules are all **kept and unrendered**, so
  turning one back on is an edit in the content, not a CSS rebuild.
- **`--tint-link` / `--tint-row`** — the two hover washes were literals
  repeated in `index.astro`; promoted to tokens. Which one a row takes now
  says what it is: `--tint-link` (0.06) if it navigates, `--tint-row` (0.03)
  if it doesn't.
- **`--bullet-size` / `--bullet-stroke` / `--bullet-gutter`** — new tokens.
  24px is the floor for the mark: below that the seven circles merge into a
  blob and it stops reading as the logo. Stroke is heavier than the header's
  1.1 for the same reason `--icon-stroke` is — a hairline doesn't survive
  being scaled down.

### The text block moves to the centre of the column

`--measure` held prose to 672px inside an 864px column, but flush to the left
edge — so all 192px of slack piled up on one side and the page looked like it
had come loose. Everything that is read is now **centred as a block**
(`margin-inline: auto`), h1 included.

Block-level centring only. **No `text-align: center` anywhere** — the lines
still set ragged-right off a common left edge; it's the box that moved, not
the text inside it.

- The measure list is one rule (`.summary`, `.meta-block`, `p`, `ul`, `ol`,
  `h2`, `h3`, `h4`) plus the h1, so the whole reading column has one left edge
  and one right edge whatever element it is. The Team/Role/Date/Tools grid is
  on it because it's a row of fields you *read*; its underline still runs the
  full column.
- **Three widths, and which one a thing takes says what it is:** measure
  (672) for anything read, column (864) for the frame (the h1, the back link,
  the footer, the meta grid's underline), bleed (944) for figures and the
  `<Challenge>` block.
- **The h1 stays on the column, not the measure.** 48px type held to 672
  wrapped most titles to two or three lines and made the title exactly as
  wide as the paragraph under it. Display type should be the widest text on
  the page. The 96px step down to the lede is what says the title *opens* the
  piece rather than belonging to it. `.back` sits on the same edge — it's
  navigation, and navigation lives on the frame, level with the header mark
  above and "All work" below.
- **The bleed moved from `<img>` to `<figure>`.** On the image, it left the
  caption at column width — 40px inside the picture's own left edge, the one
  place two things that obviously belong together didn't line up. On the
  figure, both children inherit the edges and there's no second copy of the
  calc to keep in sync.
- **`--bleed` (40px)** — new token. Images already hung 40px past the column
  on each side; `<Challenge>` now takes the same number so the two widest
  things on the page share an edge instead of each picking their own. It goes
  to `0` under 60rem, where `.col` swaps centring for a 32px gutter and a
  40px bleed would push content 8px off-screen.
- **The bleed and the centring depend on each other.** A bled callout grows
  its content box by 80px and shifts it left by 40, so a centred 672px
  paragraph inside it lands on exactly the same axis as the prose above.
  Wider rules, identical left edge — which would not work if the text were
  flush left.
- **Every later `margin` shorthand had to change** to `auto` in the inline
  slots. A shorthand that writes `0` there silently undoes the centring, and
  the failure looks like "some paragraphs are centred and some aren't."
  `.callout-label`, the challenge paragraph and `.case-cta` were all this.
- **Figures, images, the Team/Role/Date/Tools grid and every rule keep the
  full column.** That contrast is the point: the text sits inside a wider
  frame rather than hanging off one side of it. `figcaption` stays with its
  figure at the column edge for the same reason.
- **`.back` gets `margin-left: max(0px, calc((100% - var(--measure)) / 2))`**
  rather than `margin-inline: auto`, because a block-level `<a>` would make
  the whole 672px strip clickable. `max()` collapses it to 0 once the column
  is narrower than the measure.
- **The hanging "CHALLENGE" label is reverted to a stack.** It needed a 128px
  margin to hang in; centring leaves 96px. It would have overflowed the
  column or pushed the challenge text right of every other line on the page.
  `--callout-gutter` and the note in `Challenge.astro` are kept — a wider
  column makes it possible again.

### Gotcha

A custom property is **not** reliable inside an SVG presentation attribute, so
`<Mark size="var(--bullet-size)" />` doesn't work. `.bullet-mark` sets `width`,
`height` and `stroke-width` in CSS instead, which beats the attributes `Mark`
writes for its default (header) size.

### Open

- The callout hover is feedback on something you can't click. `.career-box`
  already does this, so it's consistent — but if it reads as a broken link,
  drop `.callout:hover` and the block still works.
- Bullets get no rules and no hover, deliberately: they're prose in a list,
  and the ruled callout is what they contrast with. If the two should share a
  look, the move is rules + hover on each `li`, not a border on `.bullets`.
- `<BulletList>` items still can't carry a **link** — `{ term, text }` covers
  bold lead-ins and nothing else. If a bullet needs arbitrary markup, switch
  the component to a slot and have the CSS target `.bullets > li` written as
  real markdown.
- `.bullet-num` and `.work-num` are the same rule written twice, in two scoped
  blocks. Both are built from tokens, so only the *combination* repeats — not
  worth a global class for two call sites yet, but a third one means promote.
- The generic (unlabelled) `.callout` has no consumer now that `<Callout>` is
  retired; only `<Challenge>` renders one. Its base rules still work, but they
  are untested against real content.
- Centring splits the 192px of slack into 96px a side, which is too little to
  put anything in and enough to notice. The remaining lever is narrowing
  `--col-max` from 27 units to 25 (800px), which closes the margins to 64px a
  side. **The wide asymmetric alternative was built and rejected** — see
  below, so nobody rebuilds it.

### Tried and rejected: the Tufte layout (2026-08-03)

Built the full version and rolled it back the same day. Worth recording,
because "put marginal notes in the whitespace" is an idea that will come back.

**What it was.** `--col-max` to 992 on case studies only, `article` reserving
the right 320px as padding — which leaves a 672px content box, *exactly*
`--measure`, so every text rule kept its existing `max-width` + `auto` and
simply filled it. Text block flush left, 256px margin column, 64px gutter.
Sidenotes were floats (not grid cells: a float pins to the vertical position
where it's written, which is the one thing a marginal note has to do). Images
dropped to text width, since a page can only make one claim about how wide it
is and the margin column was already making it.

**Why it went.** Didn't look right. The specific costs, for the record:

- The right edge goes ragged by design — text at 672, notes at 992, h1 and
  rules at 992. After the centred version that reads as unfinished.
- It needs a real breakpoint. Below 64rem the margin gets squeezed while
  `--measure` doesn't, so notes collapse into the flow as indented blocks.
  The centred layout needs no breakpoint at all.
- The header has to widen with it or the mark lands 64px inside the title's
  left edge — which then makes the header change width between the homepage
  and a case study.
- `clear: right` means two notes close together stack, so a dense run drifts
  down away from its references. Marginalia has to stay sparse to work, which
  is in tension with wanting to use the space.

**What survived it.** Captions written *for* the margin turned out to be good
captions, and folded straight back into `<Figure caption>`.
- A full-width hairline **above each h2** would anchor the right edge
  repeatedly down the page and lean on the rules already there. It is blocked
  on the snapper, not on taste: the tagger gives h2 both `data-snap-box` and
  `data-snap`, and the baseline transform would drag a border off the grid
  line with it. Doing it means dropping h2 from the `data-snap` list, which
  shifts every h2 on the site ~7px.

## 2026-07-31 — typography: one serif, one sans

Readability pass on the case-study pages, then a rework of the font system.
**EB Garamond is no longer used anywhere.** If any of this is wrong, the
revert notes at the end of the section say what to put back.

### Why

The pages were hard to read for two reasons that had nothing to do with the
font choice, and one that did.

1. **Measure.** `.col` is 928px with 64px of right padding, so prose sat on an
   ~864px line — roughly 110 characters at 16px. Comfortable is 45–75.
2. **Leading.** Prose was `--text-base` (16px) on a `--grid` (32px) row: a
   line-height of **2.0**, where 16px body copy wants 1.5–1.65. Long measure
   plus very loose leading is specifically the combination that breaks the
   return sweep — the eye finishes a long line and the line it needs next is
   not visually adjacent, so you lose your place and re-read.
3. **Two faces on the same axis.** EB Garamond and Lora are both old-style
   serifs. Too similar to register as deliberate contrast, too different to
   read as one family — the ambiguous middle, which reads as inconsistency
   rather than intent. Separately, `--font-heading` was doing two unrelated
   jobs: display type *and* all the chrome (nav, buttons, 14px tracked
   uppercase labels, captions, footer). Garamond's small x-height and fine
   hairlines were never going to hold that second job.

### Changed

- **Prose up one rung** to `--text-lg`. 20px on the 32px row is a line-height
  of 1.6, and the grid is untouched.
- **`--text-base` now means UI text, not body copy** (16px). It was trying to
  be both, and the two want different numbers — the same mistake
  `--font-heading` was making by covering headings *and* chrome. It now drives
  only buttons, metadata values, footers and hints.

  The reason 20px is not negotiable on this grid: line-height is always a
  whole `--grid` row, so 32px is the *smallest leading any text can take*, and
  the size therefore decides the ratio — 16px is 2.00, 18px is 1.78, 20px is
  1.60, 24px is 1.33. Body copy wants 1.45–1.65, so 20px is the only rung in
  the band. **The grid and the body size are locked together**; a 24px grid
  would want 16px body. 18px was tried (1.78) and 17px considered — 17 was
  rejected because it is the only rung that is not a simple fraction of
  `--grid`, and it left a compressed 17→20 step of 1.18.
- **`.work-desc` promoted to content.** It is the pitch for each project, but
  at `--text-base` and `rgba(ink, 0.66)` — about **4.6:1** on the paper — it
  read as skippable next to a full-ink 24px title. Now `--text-lg` at 0.8
  alpha. Its 520px max-width holds it to ~54 characters.
- **`article h1` leading** → `calc(var(--grid) * 2)`. At `--text-3xl` (48px) a
  single row was a line-height of **0.67**, so any title long enough to wrap
  would have overlapped itself. Latent, since every current title is one line.
- **Prose measure** held to `--measure` (a new token: 21 grid units = 672px),
  applied to `p`, `ul`, `ol`, `h2`–`h4`, `.callout` and `.summary` in
  `[id].astro`. ~89 characters → ~69. Figures, images and the meta grid are
  deliberately excluded and keep the full column width.
- **Work-row grid snapping**, two separate bugs on the homepage:
  - `.work-num` had no `data-snap` at all. `.work-row` pads by
    `calc(var(--grid) * 1.5)` — a *half* row — so with the row's top edge
    snapped, its content starts on a half-row offset. Every sibling carried
    its own `data-snap` and was corrected; the number was not, so it sat 16px
    off everything beside it.
  - `.work-title`'s `data-snap` was on the unstyled wrapper `<span>`, which
    sets no `line-height`. It computes to `normal`, `parseFloat` returns
    `NaN`, and the baseline pass falls back to `lh = fs` — measuring a 24px
    line box against a real one of 32px, so the title snapped 4px off. Moved
    the attribute onto `.work-title`, which declares both.
  - **Rule this implies:** `data-snap` only measures true on an element that
    declares its own `font-size` *and* `line-height`. Never put it on a bare
    wrapper.
- **Header and column centred on one shared width.** Two problems, same cause.
  `.header` padded by 2 grid units while `.col` inset by 3 and padded right by
  2, so on a 1280px `.wrap` the header spanned 64→1216 against the column's
  96→960 — 32px wider on the left, 256px on the right. And because the column
  was *inset from the left* rather than centred, the whole page sat off-axis.

  Both now take `--col-max` (27 grid units = 864px) with `margin-inline: auto`
  and no horizontal padding. **864px is exactly what the column already
  resolved to** — a 928px box minus its 64px right padding — so no content got
  narrower; the left inset and the one-sided padding are what went away.
  The narrow-screen rule sets both together via `padding-inline`, so the
  centring survives and they cannot drift apart again.
- **Nav icons darkened.** `--color-icon` 0.45 → 0.65, taking the glyphs from
  ~2.6:1 on the paper to ~4.5:1 — the old value was under the 3:1 WCAG asks of
  a graphical object and read as disabled. The ring
  (`--color-stroke-neutral`) went 0.18 → 0.3. Both tokens are used only by
  `IconLink.astro`.
- **Font tokens renamed to roles**, replacing `--font-heading` / `--font-body`:
  - `--font-read` → **Lora**. Hero, project titles, h1–h4, prose, company
    names, the closing statement, "also loves", the role control.
  - `--font-ui` → **Fira Sans**. Nav, buttons, eyebrows, section and aside
    labels, work numbers and meta, captions, the metadata block, footers.
  - The rule is *what you read* vs *what you use*. Every `font-family` in the
    codebase now picks one of these two; there are no other font declarations.
- **Lora 600 loaded** (`0,600;1,600`) and `strong, b { font-weight: 600 }`
  pinned in `global.css`. Only 400 was loaded before, so every `**bold**` in
  the MDX was a browser-synthesized faux bold, which smears a serif.
- Fira Sans is loaded at 400/600 plus a 400 italic. No 700 anywhere.

### Revert notes

- **Back to EB Garamond entirely:** in `tokens.css` set `--font-read: 'Lora'`
  and `--font-ui: 'EB Garamond', serif`, and restore the Google Fonts link in
  `BaseLayout.astro`. That is close to the old state, but not exact — `dd`,
  `figcaption` and `.meta` in `[id].astro` had no `font-family` before and now
  declare `--font-ui`; delete those three lines to fully restore.
- **A different sans:** one line — `--font-ui` in `tokens.css`.
  `'Source Sans 3'` is the quieter alternative that was considered.
- **Back to 16px prose:** `article p, li` in `[id].astro`.
- **Wider prose again:** `--measure` in `tokens.css`, one line. Keep it a whole
  multiple of `--grid` so the text block's right edge stays on a painted line.

### Open

- **Shrinking `--grid` to 24px was considered and deferred.** It is the only
  way to get 16px body copy at a comfortable 1.50 leading. Costs, if it is
  ever revisited: `--icon-btn` is 28px and no longer fits inside a 24px row;
  `--btn-h` is 40px and the `.btn-row` trick depends on an 8px overhang
  splitting 4px either side of a line, which becomes 16px on a 24px grid and
  breaks that symmetry; the header drops from 96px to 72px while still
  centring a 28px ring; every `--space-*` and `calc(var(--grid) * N)` changes
  meaning; and the painted background gets a third more lines, working against
  the calm the design wants. Judged a large refactor for a more conventional
  result.
- **Half-row (16px) leading is not an escape hatch.** Paragraph heights become
  16×N, so odd wrap counts land on half rows and `data-snap-box` corrects each
  block by a different amount — inter-paragraph gaps would visibly jump by
  16px depending on how text happens to wrap. The 32px leading quantum is
  load-bearing while the grid is 32.
- **The lede is the same size as body copy.** `.summary` and prose are both
  `--text-lg`, so the lede is distinguished only by face-colour and position.
  `--text-xl` was tried and backed out; noting it as a live question, not a bug.
- **`.work-row` padding is a half row** (`calc(var(--grid) * 1.5)`). Now that
  everything inside is snapped it is corrected at runtime, but it means the
  rendered padding is 16px off what the CSS says, and any *new* unsnapped
  child will land off-grid the way `.work-num` did.
- **`h3`/`h4` now tie body copy at 20px.** They still read as headings on face,
  weight and margin, but they have lost their size distinction. The real fix
  shifts the heading rungs up (h3→24, h2→32), which cascades toward the h1.
- **`.callout p` is pinned to `--text-base`,** so callouts are now 16px against
  20px body. Kept deliberately — smaller set-aside text is standard — but it
  used to match body exactly.
- **The role control is `--font-read`** even though it is a button, because it
  sits inside the hero sentence and switching faces mid-sentence looked worse
  than the inconsistency. `.role-option` follows it for the same reason.
- **`-webkit-font-smoothing: antialiased`** (`global.css`) thins strokes on
  macOS. Still set; worth testing without it.
- **Muted text at `rgba(var(--ink-rgb), 0.5)`** is ~3.0:1 on the paper, below
  WCAG AA. 0.62 would clear 4.5:1. Affects the footer and captions.

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
- Homepage work row 02 reads as shipped; the case study says the design was
  handed off before launch. Needs a decision on which is accurate.
- `public/me.jpg` is 6.7MB and may be unused.
