import { PlusIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import type { TodoFormValues } from '@/lib/todo-form.schema'
import { TodoForm } from './todo-form'

interface CreateTodoCardProps {
  onCreate: (values: TodoFormValues) => void
}

export function CreateTodoCard({ onCreate }: CreateTodoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New todo</CardTitle>
        <CardDescription>Capture a task before you forget it.</CardDescription>
      </CardHeader>
      <CardContent>
        <TodoForm
          submitLabel="Add todo"
          submitIcon={<PlusIcon />}
          onSubmit={onCreate}
          resetOnSubmit
          autoFocus
        />
      </CardContent>
    </Card>
  )
}
