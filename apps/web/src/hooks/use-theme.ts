import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

// Must match the key read by the inline script in index.html.
const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

const getTheme = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light'

function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(STORAGE_KEY, theme)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme)
  return { theme, setTheme }
}
