import type { Todo } from '@todo/shared'
import { useMemo, useState } from 'react'
import type { TodoFilter } from '@/components/molecules/todo-filter-tabs'
import { AppHeader } from '@/components/organisms/app-header'
import { CreateTodoCard } from '@/components/organisms/create-todo-card'
import { TodoList } from '@/components/organisms/todo-list'
import { TodoToolbar } from '@/components/organisms/todo-toolbar'
import { TodoTemplate } from '@/components/templates/todo-template'
import {
  createTempTodoId,
  isPendingTodo,
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useToggleTodo,
  useUpdateTodo,
} from '@/hooks/use-todos'
import { getErrorMessage } from '@/lib/api-client'
import type { TodoFormValues } from '@/lib/todo-form.schema'

const FILTER_PREDICATES: Record<TodoFilter, (todo: Todo) => boolean> = {
  all: () => true,
  active: (todo) => !todo.done,
  completed: (todo) => todo.done,
}

export function TodosPage() {
  const [filter, setFilter] = useState<TodoFilter>('all')
  const todosQuery = useTodos()
  const createTodo = useCreateTodo()
  const updateTodo = useUpdateTodo()
  const toggleTodo = useToggleTodo()
  const deleteTodo = useDeleteTodo()

  const todos = useMemo(() => todosQuery.data ?? [], [todosQuery.data])
  const counts = useMemo(() => {
    const completed = todos.filter(FILTER_PREDICATES.completed).length
    return { all: todos.length, active: todos.length - completed, completed }
  }, [todos])
  const visibleTodos = useMemo(() => todos.filter(FILTER_PREDICATES[filter]), [todos, filter])

  const handleCreate = ({ title, description }: TodoFormValues) => {
    createTodo.mutate({
      input: { title, description: description || undefined },
      tempId: createTempTodoId(),
    })
    // Show the new item even if the user is currently looking at "Completed".
    if (filter === 'completed') setFilter('all')
  }

  const handleUpdate = (todo: Todo, values: TodoFormValues) =>
    updateTodo.mutate({ id: todo.id, input: values })

  return (
    <TodoTemplate
      header={<AppHeader />}
      aside={<CreateTodoCard onCreate={handleCreate} />}
      toolbar={
        <TodoToolbar
          filter={filter}
          counts={counts}
          onFilterChange={setFilter}
          isSyncing={todosQuery.isFetching && !todosQuery.isLoading}
        />
      }
    >
      <TodoList
        todos={visibleTodos}
        filter={filter}
        isLoading={todosQuery.isLoading}
        error={todosQuery.isError ? getErrorMessage(todosQuery.error) : undefined}
        onRetry={() => void todosQuery.refetch()}
        isRetrying={todosQuery.isFetching}
        isPending={isPendingTodo}
        onToggle={(todo) => toggleTodo.mutate(todo.id)}
        onUpdate={handleUpdate}
        onDelete={(todo) => deleteTodo.mutate(todo.id)}
      />
    </TodoTemplate>
  )
}
