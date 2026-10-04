import { ListChecksIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/molecules/theme-toggle'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2 font-heading font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ListChecksIcon className="size-4" />
          </span>
          Todos
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
