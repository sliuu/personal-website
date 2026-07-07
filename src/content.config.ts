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
    team: z.string(),
    year: z.number(),
    role: z.string(),
    duration: z.string().optional(),
    summary: z.string(),
    tech: z.array(z.string()),
    date: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),   // draft/archived: hidden from the built site
    repo: z.string().url().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/work' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(),
    end: z.string().optional(),
    highlights: z.array(z.string()),
  }),
});

export const collections = { writing, projects, work };
