import { cn } from 'cn'
import { Label } from '@/components/atoms/label'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  /** Current length of the value; renders a counter when paired with `maxLength`. */
  length?: number
  maxLength?: number
  optional?: boolean
  className?: string
  children: React.ReactNode
}

export function FormField({
  id,
  label,
  error,
  length,
  maxLength,
  optional,
  className,
  children,
}: FormFieldProps) {
  const showCounter = length !== undefined && maxLength !== undefined
  const nearLimit = showCounter && length > maxLength * 0.9

  return (
    <div className={cn('grid gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
        </Label>
        {showCounter && (
          <span
            className={cn(
              'text-xs tabular-nums text-muted-foreground transition-colors',
              nearLimit && 'text-amber-600 dark:text-amber-400',
              length > maxLength && 'text-destructive',
            )}
          >
            {length}/{maxLength}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="animate-in fade-in slide-in-from-top-1 text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  )
}
