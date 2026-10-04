import type { CreateTodoInput, Todo, UpdateTodoInput } from '@todo/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/api-client'
import { todosService } from '@/services/todos.service'

export const todosQueryKey = ['todos'] as const

const TEMP_ID_PREFIX = 'temp-'

/** Optimistically-created todos carry a temporary id until the server responds. */
export const isPendingTodo = (todo: Todo) => todo.id.startsWith(TEMP_ID_PREFIX)

export function useTodos() {
  return useQuery({ queryKey: todosQueryKey, queryFn: todosService.list })
}

/**
 * Builds an optimistic mutation: `apply` patches the cached list immediately,
 * and the snapshot is restored (with an error toast) if the request fails.
 */
function useOptimisticTodoMutation<TVariables, TResult>({
  mutationFn,
  apply,
  errorTitle,
  onSuccess,
}: {
  mutationFn: (variables: TVariables) => Promise<TResult>
  apply: (todos: Todo[], variables: TVariables) => Todo[]
  errorTitle: string
  onSuccess?: (result: TResult, variables: TVariables) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey: todosQueryKey })
      const previous = queryClient.getQueryData<Todo[]>(todosQueryKey)
      queryClient.setQueryData<Todo[]>(todosQueryKey, (todos = []) => apply(todos, variables))
      return { previous }
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(todosQueryKey, context?.previous)
      toast.error(errorTitle, { description: getErrorMessage(error) })
    },
    onSuccess,
    // Only resync once the last in-flight mutation settles, otherwise a refetch
    // could overwrite another mutation's optimistic state.
    onSettled: () => {
      if (queryClient.isMutating() === 1) {
        return queryClient.invalidateQueries({ queryKey: todosQueryKey })
      }
    },
  })
}

const replaceTodo = (todos: Todo[], id: string, patch: (todo: Todo) => Todo) =>
  todos.map((todo) => (todo.id === id ? patch(todo) : todo))

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useOptimisticTodoMutation({
    mutationFn: ({ input }: { input: CreateTodoInput; tempId: string }) =>
      todosService.create(input),
    apply: (todos, { input, tempId }) => {
      const now = new Date().toISOString()
      return [{ ...input, id: tempId, done: false, createdAt: now, updatedAt: now }, ...todos]
    },
    errorTitle: "Couldn't add the todo",
    // Swap the placeholder for the real record so its actions become available right away.
    onSuccess: (created, { tempId }) => {
      queryClient.setQueryData<Todo[]>(todosQueryKey, (todos = []) =>
        replaceTodo(todos, tempId, () => created),
      )
    },
  })
}

export const createTempTodoId = () => `${TEMP_ID_PREFIX}${crypto.randomUUID()}`

export function useUpdateTodo() {
  return useOptimisticTodoMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todosService.update(id, input),
    apply: (todos, { id, input }) => replaceTodo(todos, id, (todo) => ({ ...todo, ...input })),
    errorTitle: "Couldn't save your changes",
  })
}

export function useToggleTodo() {
  return useOptimisticTodoMutation({
    mutationFn: (id: string) => todosService.toggleDone(id),
    apply: (todos, id) => replaceTodo(todos, id, (todo) => ({ ...todo, done: !todo.done })),
    errorTitle: "Couldn't update the todo",
  })
}

export function useDeleteTodo() {
  return useOptimisticTodoMutation({
    mutationFn: (id: string) => todosService.remove(id),
    apply: (todos, id) => todos.filter((todo) => todo.id !== id),
    errorTitle: "Couldn't delete the todo",
    onSuccess: () => toast.success('Todo deleted'),
  })
}
