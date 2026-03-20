import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    ua_question: z.string(),
    en_question: z.string(),
    ua_answer: z.string(),
    en_answer: z.string(),
    section: z.string(),
    order: z.number(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { questions };
