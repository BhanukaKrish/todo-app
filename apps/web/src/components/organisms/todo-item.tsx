import type { Todo } from '@todo/shared'
import { cn } from 'cn'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'
import { Spinner } from '@/components/atoms/spinner'
import { ConfirmDialog } from '@/components/molecules/confirm-dialog'
import type { TodoFormValues } from '@/lib/todo-form.schema'
import { EditTodoDialog } from './edit-todo-dialog'

interface TodoItemProps {
  todo: Todo
  /** True while the todo only exists optimistically and has no server id yet. */
  pending?: boolean
  onToggle: (todo: Todo) => void
  onUpdate: (todo: Todo, values: TodoFormValues) => void
  onDelete: (todo: Todo) => void
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export function TodoItem({ todo, pending, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const checkboxId = `todo-${todo.id}`

  return (
    <li
      className={cn(
        'group animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border bg-card p-4 duration-300',
        'transition-[opacity,background-color,box-shadow] hover:shadow-sm',
        todo.done && 'bg-muted/40',
        pending && 'opacity-70',
      )}
    >
      <Checkbox
        id={checkboxId}
        className="mt-0.5"
        checked={todo.done}
        disabled={pending}
        onCheckedChange={() => onToggle(todo)}
        aria-label={todo.done ? `Mark "${todo.title}" as not done` : `Mark "${todo.title}" as done`}
      />

      <div className="min-w-0 flex-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            'block cursor-pointer font-medium break-words transition-colors duration-300',
            todo.done && 'text-muted-foreground line-through decoration-muted-foreground/60',
          )}
        >
          {todo.title}
        </label>
        {todo.description && (
          <p
            className={cn(
              'mt-1 text-sm whitespace-pre-line break-words text-muted-foreground transition-opacity duration-300',
              todo.done && 'line-through opacity-60',
            )}
          >
            {todo.description}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground/80">
          {pending ? 'Saving…' : `Created ${dateFormatter.format(new Date(todo.createdAt))}`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        {pending ? (
          <Spinner className="m-2 text-muted-foreground" />
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit "${todo.title}"`}
              onClick={() => setEditing(true)}
            >
              <PencilIcon />
            </Button>
            <ConfirmDialog
              title="Delete this todo?"
              description={
                <>
                  <span className="font-medium text-foreground">"{todo.title}"</span> will be
                  permanently removed.
                </>
              }
              confirmLabel="Delete"
              onConfirm={() => onDelete(todo)}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Delete "${todo.title}"`}
                >
                  <Trash2Icon />
                </Button>
              }
            />
          </>
        )}
      </div>

      <EditTodoDialog
        todo={todo}
        open={editing}
        onOpenChange={setEditing}
        onSave={(values) => onUpdate(todo, values)}
      />
    </li>
  )
}
