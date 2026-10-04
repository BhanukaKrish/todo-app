import { TODO_DESCRIPTION_MAX_LENGTH, TODO_TITLE_MAX_LENGTH } from '@todo/shared'
import { z } from 'zod'

export const todoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(TODO_TITLE_MAX_LENGTH, `Title must be at most ${TODO_TITLE_MAX_LENGTH} characters`),
  description: z
    .string()
    .trim()
    .max(
      TODO_DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${TODO_DESCRIPTION_MAX_LENGTH} characters`,
    ),
})

export type TodoFormValues = z.infer<typeof todoFormSchema>
