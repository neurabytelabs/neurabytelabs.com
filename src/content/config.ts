import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()),
    authorModel: z.string().optional(),
    heroGradient: z.string().optional(),
    heroShader: z.string().optional(),
  }),
});

export const collections = { blog };
