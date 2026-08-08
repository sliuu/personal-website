// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://stephliu.work',
  integrations: [mdx()],
  // Commit the Cloudflare adapter so `wrangler deploy` in Workers Builds
  // stops running `astro add cloudflare` on every deploy (deterministic builds).
  // prerenderEnvironment 'node': the default ('workerd') silently bakes error
  // pages into prerendered routes instead of failing the build. This site is
  // fully static with no CF runtime bindings, so Node is the correct one.
  adapter: cloudflare({ prerenderEnvironment: 'node' }),
});
