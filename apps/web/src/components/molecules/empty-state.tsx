import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center duration-300">
      <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <p className="font-medium">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
