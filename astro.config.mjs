// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://stephliu.work',
  // React powers the interactive islands (e.g. the homepage role picker);
  // everything else stays static Astro.
  integrations: [mdx(), react()],
  // Commit the Cloudflare adapter so `wrangler deploy` in Workers Builds
  // stops running `astro add cloudflare` on every deploy (deterministic builds).
  // prerenderEnvironment 'node': the default ('workerd') can't SSR React
  // islands and silently bakes error pages into prerendered routes; this is
  // a fully static site with no CF runtime bindings, so Node is correct.
  adapter: cloudflare({ prerenderEnvironment: 'node' }),
});
