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
    duration: z.string().optional(),
    summary: z.string(),
    tech: z.array(z.string()),
    date: z.string(),
    status: z.string().optional(),       // honest one-phrase outcome, shown in the meta block
    order: z.number().default(99),       // homepage + next-project ordering (low = first)
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),   // draft/archived: hidden from the built site
    repo: z.string().url().optional(),
  }),
});

export const collections = { writing, projects };
