import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <SunIcon className="scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
