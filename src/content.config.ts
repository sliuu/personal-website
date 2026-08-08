import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),                  // company shown next to the title on the homepage
    team: z.string(),
    year: z.number(),
    role: z.string(),
    summary: z.string(),                 // the dek on the case study, and its meta description
    // The homepage row's line, when it wants to be different from the dek —
    // a row in a list is read at a glance, a dek is read standing still.
    // Optional: a project without one shows its `summary` on the homepage,
    // which is what every project did before this field existed.
    blurb: z.string().optional(),
    tech: z.array(z.string()),
    date: z.string(),
    status: z.string().optional(),       // honest one-phrase outcome, shown in the meta block
    // What has been changed in the screens to keep a former employer's work
    // confidential. Rendered above the body, not below it: it qualifies every
    // image on the page, and a qualification that arrives after the thing it
    // qualifies is an admission instead of a disclaimer.
    confidentiality: z.string().optional(),
    order: z.number().default(99),       // homepage + next-project ordering (low = first)
    draft: z.boolean().default(false),   // draft/archived: hidden from the built site
    repo: z.string().url().optional(),
    // The rail's one call to action (components/RailAction.astro). Optional on
    // purpose: a project with no public artefact renders no button and the
    // rail is simply that much shorter. `demoNote` is the line under it that
    // says what you are about to open.
    demo: z.string().url().optional(),
    demoLabel: z.string().default('Open the prototype'),
    demoNote: z.string().optional(),
  }),
});

export const collections = { writing, projects };
