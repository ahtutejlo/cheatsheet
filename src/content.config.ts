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
    type: z.enum(['basic', 'deep', 'trick', 'practical']).default('basic'),
  }),
});

const companies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/companies' }),
  schema: z.object({
    slug: z.string(),
    ua_name: z.string(),
    en_name: z.string(),
    type: z.enum(['outsource', 'product', 'startup', 'agency']),
    region: z.enum(['international', 'ukraine', 'usa', 'eu']),
    ua_description: z.string(),
    en_description: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    duration: z.string(),
    stages: z.array(z.object({
      ua_name: z.string(),
      en_name: z.string(),
      duration: z.string(),
    })),
    tags: z.array(z.string()).default([]),
    ua_tips: z.array(z.string()).default([]),
    en_tips: z.array(z.string()).default([]),
  }),
});

const companyQuestions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/company-questions' }),
  schema: z.object({
    company: z.string(),
    stage: z.string(),
    ua_question: z.string(),
    en_question: z.string(),
    ua_answer: z.string(),
    en_answer: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number(),
  }),
});

export const collections = { questions, companies, companyQuestions };
