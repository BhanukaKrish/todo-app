import { Spinner } from '@/components/atoms/spinner'
import { TodoFilterTabs, type TodoFilter } from '@/components/molecules/todo-filter-tabs'

interface TodoToolbarProps {
  filter: TodoFilter
  counts: Record<TodoFilter, number>
  onFilterChange: (filter: TodoFilter) => void
  isSyncing: boolean
}

export function TodoToolbar({ filter, counts, onFilterChange, isSyncing }: TodoToolbarProps) {
  const progress = counts.all === 0 ? 0 : Math.round((counts.completed / counts.all) * 100)

  return (
    <div className="grid gap-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 id="todos-heading" className="flex items-center gap-2 font-heading text-xl font-semibold">
            Your todos
            {isSyncing && <Spinner className="size-3.5 text-muted-foreground" />}
          </h1>
          <p className="text-sm text-muted-foreground">
            {counts.completed} of {counts.all} completed
          </p>
        </div>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">{progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <TodoFilterTabs value={filter} counts={counts} onChange={onFilterChange} />
    </div>
  )
}
