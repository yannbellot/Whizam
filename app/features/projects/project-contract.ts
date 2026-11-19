import { z } from 'zod'

export const projectInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Saisissez un nom.')
      .max(100, 'Le nom est limité à 100 caractères.'),
    description: z.string().trim().max(2000, 'La description est limitée à 2000 caractères.'),
  })
  .strict()
export const projectIdSchema = z.uuid()
export type ProjectInput = z.infer<typeof projectInputSchema>
export type ProjectView = ProjectInput & { id: string; createdAt: string; updatedAt: string }
