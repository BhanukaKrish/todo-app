import { zodResolver } from '@hookform/resolvers/zod'
import { TODO_DESCRIPTION_MAX_LENGTH, TODO_TITLE_MAX_LENGTH } from '@todo/shared'
import { useId } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { FormField } from '@/components/molecules/form-field'
import { todoFormSchema, type TodoFormValues } from '@/lib/todo-form.schema'

interface TodoFormProps {
  defaultValues?: Partial<TodoFormValues>
  submitLabel: string
  submitIcon?: React.ReactNode
  onSubmit: (values: TodoFormValues) => void
  onCancel?: () => void
  resetOnSubmit?: boolean
  autoFocus?: boolean
}

export function TodoForm({
  defaultValues,
  submitLabel,
  submitIcon,
  onSubmit,
  onCancel,
  resetOnSubmit,
  autoFocus,
}: TodoFormProps) {
  const id = useId()
  const {
    register,
    handleSubmit,
    reset,
    control,
    setFocus,
    formState: { errors, isDirty },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: { title: '', description: '', ...defaultValues },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const [title, description] = useWatch({ control, name: ['title', 'description'] })

  const submit = handleSubmit((values) => {
    onSubmit(values)
    if (resetOnSubmit) {
      reset()
      setFocus('title')
    }
  })

  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  return (
    <form
      noValidate
      onSubmit={submit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void submit()
      }}
      className="grid gap-4"
    >
      <FormField
        id={titleId}
        label="Title"
        error={errors.title?.message}
        length={title.length}
        maxLength={TODO_TITLE_MAX_LENGTH}
      >
        <Input
          id={titleId}
          placeholder="What needs to be done?"
          autoComplete="off"
          autoFocus={autoFocus}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          {...register('title')}
        />
      </FormField>

      <FormField
        id={descriptionId}
        label="Description"
        optional
        error={errors.description?.message}
        length={description.length}
        maxLength={TODO_DESCRIPTION_MAX_LENGTH}
      >
        <Textarea
          id={descriptionId}
          placeholder="Add some details…"
          rows={3}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? `${descriptionId}-error` : undefined}
          {...register('description')}
        />
      </FormField>

      <div className="flex items-center justify-between gap-2">
        <p className="hidden text-xs text-muted-foreground sm:block">
          <kbd className="rounded border bg-muted px-1 font-sans">⌘/Ctrl</kbd> +{' '}
          <kbd className="rounded border bg-muted px-1 font-sans">Enter</kbd> to submit
        </p>
        <div className="ml-auto flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={!!defaultValues && !isDirty}>
            {submitIcon}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
