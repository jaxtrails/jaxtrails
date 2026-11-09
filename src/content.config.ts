import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A park is the parent. It has a write-up but no rating.
const parks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/parks' }),
  schema: z.object({
    title: z.string(),
    visited: z.coerce.date(),
    summary: z.string(),
    // Optional: hours, fees, parking. Shows in the park page sidebar.
    plan: z.string().optional(),
    draft: z.boolean().default(false),
    sample: z.boolean().default(false),
  }),
});

// A trail belongs to exactly one park and carries the rating.
const trails = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trails' }),
  schema: z.object({
    title: z.string(),
    park: reference('parks'),
    visited: z.coerce.date(),
    summary: z.string(),
    distance: z.string(), // e.g. "3.2 mi loop"
    difficulty: z.enum(['Easy', 'Moderate', 'Hard']),
    rating: z.number().int().min(1).max(5),
    // Optional links to your writing. Set it here or on the post; both ways show up.
    relatedThoughts: z.array(reference('thoughts')).default([]),
    draft: z.boolean().default(false),
    sample: z.boolean().default(false),
  }),
});

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thoughts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Reflections', 'Books', 'Everything Else']),
    summary: z.string(),
    relatedTrails: z.array(reference('trails')).default([]),
    draft: z.boolean().default(false),
    sample: z.boolean().default(false),
  }),
});

export const collections = { parks, trails, thoughts };
