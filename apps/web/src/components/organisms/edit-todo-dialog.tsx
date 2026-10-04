import type { Todo } from '@todo/shared'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import type { TodoFormValues } from '@/lib/todo-form.schema'
import { TodoForm } from './todo-form'

interface EditTodoDialogProps {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (values: TodoFormValues) => void
}

export function EditTodoDialog({ todo, open, onOpenChange, onSave }: EditTodoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit todo</DialogTitle>
          <DialogDescription>Update the title or description.</DialogDescription>
        </DialogHeader>
        <TodoForm
          defaultValues={{ title: todo.title, description: todo.description ?? '' }}
          submitLabel="Save changes"
          onCancel={() => onOpenChange(false)}
          onSubmit={(values) => {
            onSave(values)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
