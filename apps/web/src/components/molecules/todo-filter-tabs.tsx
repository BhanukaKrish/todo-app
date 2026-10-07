import { Badge } from '@/components/atoms/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/atoms/tabs'

export type TodoFilter = 'all' | 'active' | 'completed'

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

interface TodoFilterTabsProps {
  value: TodoFilter
  counts: Record<TodoFilter, number>
  onChange: (value: TodoFilter) => void
}

export function TodoFilterTabs({ value, counts, onChange }: TodoFilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TodoFilter)}>
      <TabsList>
        {FILTERS.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
            <Badge variant="secondary" className="tabular-nums">
              {counts[filter.value]}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
