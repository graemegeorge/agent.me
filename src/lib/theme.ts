export type ThemeMode = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'agent-me-theme'

export function getSystemTheme(): Exclude<ThemeMode, 'system'> {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
