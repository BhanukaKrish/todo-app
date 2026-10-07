import { TODO_TITLE_MAX_LENGTH } from '@todo/shared'
import { describe, expect, it } from 'vitest'
import { todoFormSchema } from './todo-form.schema'

describe('todoFormSchema', () => {
  it('trims values', () => {
    expect(todoFormSchema.parse({ title: '  Buy milk ', description: ' 2L ' })).toEqual({
      title: 'Buy milk',
      description: '2L',
    })
  })

  it('rejects a whitespace-only title', () => {
    const result = todoFormSchema.safeParse({ title: '   ', description: '' })
    expect(result.error?.issues[0]?.message).toBe('Title is required')
  })

  it('enforces the shared title length limit', () => {
    const result = todoFormSchema.safeParse({
      title: 'a'.repeat(TODO_TITLE_MAX_LENGTH + 1),
      description: '',
    })
    expect(result.success).toBe(false)
  })
})
