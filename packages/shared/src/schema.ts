import { z } from "zod";

export const deployTargetSchema = z.enum([
  "railway",
  "vercel",
  "fly",
  "custom",
]);

export const environmentSchema = z.object({
  name: z.string().min(1),
  branch: z.string().min(1),
  deploy: z
    .object({
      target: deployTargetSchema,
      config: z.record(z.string()).optional(),
    })
    .optional(),
  auto: z.boolean().default(false),
  reviewers: z.number().int().min(0).optional(),
});

export const promotionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  requireTests: z.boolean().optional(),
  requireApproval: z.boolean().optional(),
});

export const convoyeYmlSchema = z.object({
  version: z.string().default("1"),
  pipeline: z.object({
    name: z.string().min(1),
    environments: z.array(environmentSchema).min(1),
    promotions: z.array(promotionSchema),
  }),
});

export type ConvoyeYmlInput = z.infer<typeof convoyeYmlSchema>;
