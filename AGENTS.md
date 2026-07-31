## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Conventions

Prefer variables and reusable components over repeated literals and markup.

- **Design values live in `src/styles/tokens.css`.** Reach for an existing
  custom property before writing a raw value. If a number appears in more than
  one place — a colour, a size, a duration — promote it to a token rather than
  repeating it. Everything vertical derives from the one `--grid` knob.
- **Shared markup lives in `src/components/`.** If a pattern shows up twice,
  make it a component instead of copying it. Content files import these
  (`Callout.astro`, `Challenge.astro`, `Figure.astro`) rather than hand-rolling
  the same structure.
- **Shared styles live in `src/styles/global.css`.** Page-specific rules stay
  in that page's own scoped `<style>` block. Don't restate a global rule in a
  page just to change one property.
- Constants used more than once in a page's frontmatter (URLs, paths) get a
  named `const` at the top instead of being inlined at each use.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
