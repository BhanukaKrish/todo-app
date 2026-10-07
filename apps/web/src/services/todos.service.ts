import type { CreateTodoInput, Todo, UpdateTodoInput } from '@todo/shared'
import { apiRequest } from '@/lib/api-client'

export const todosService = {
  list: () => apiRequest<Todo[]>('/todos'),

  create: (input: CreateTodoInput) =>
    apiRequest<Todo>('/todos', { method: 'POST', body: JSON.stringify(input) }),

  update: (id: string, input: UpdateTodoInput) =>
    apiRequest<Todo>(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(input) }),

  toggleDone: (id: string) => apiRequest<Todo>(`/todos/${id}/done`, { method: 'PATCH' }),

  remove: (id: string) => apiRequest<void>(`/todos/${id}`, { method: 'DELETE' }),
}
