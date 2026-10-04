import type { Todo } from '@todo/shared'
import { CircleCheckBigIcon, ListTodoIcon, SparklesIcon } from 'lucide-react'
import { Skeleton } from '@/components/atoms/skeleton'
import { EmptyState } from '@/components/molecules/empty-state'
import { ErrorState } from '@/components/molecules/error-state'
import type { TodoFilter } from '@/components/molecules/todo-filter-tabs'
import type { TodoFormValues } from '@/lib/todo-form.schema'
import { TodoItem } from './todo-item'

interface TodoListProps {
  todos: Todo[]
  filter: TodoFilter
  isLoading: boolean
  error?: string
  onRetry: () => void
  isRetrying: boolean
  isPending: (todo: Todo) => boolean
  onToggle: (todo: Todo) => void
  onUpdate: (todo: Todo, values: TodoFormValues) => void
  onDelete: (todo: Todo) => void
}

const EMPTY_COPY: Record<TodoFilter, { icon: typeof ListTodoIcon; title: string; description: string }> = {
  all: {
    icon: ListTodoIcon,
    title: 'No todos yet',
    description: 'Add your first task using the form to get started.',
  },
  active: {
    icon: SparklesIcon,
    title: 'All caught up',
    description: 'Every task is done. Enjoy the moment!',
  },
  completed: {
    icon: CircleCheckBigIcon,
    title: 'Nothing completed yet',
    description: 'Tick a todo off and it will show up here.',
  },
}

function TodoListSkeleton() {
  return (
    <ul aria-busy="true" aria-label="Loading todos" className="grid gap-3">
      {Array.from({ length: 3 }, (_, i) => (
        <li key={i} className="flex items-start gap-3 rounded-xl border p-4">
          <Skeleton className="size-4 rounded-[4px]" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function TodoList({
  todos,
  filter,
  isLoading,
  error,
  onRetry,
  isRetrying,
  isPending,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (isLoading) return <TodoListSkeleton />

  if (error) {
    return (
      <ErrorState
        title="We couldn't load your todos"
        message={error}
        onRetry={onRetry}
        retrying={isRetrying}
      />
    )
  }

  if (todos.length === 0) return <EmptyState {...EMPTY_COPY[filter]} />

  return (
    <ul className="grid gap-3" aria-label="Todos">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          pending={isPending(todo)}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
