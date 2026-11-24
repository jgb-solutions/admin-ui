import { icons } from '../icons'
import { useAdminTheme } from '../theme'
import { IconButton } from '../ui/Button'

/** Switches between light and dark (the choice is remembered; the system's is the default). */
export function ThemeToggle({ tone = 'tile' }: { tone?: 'tile' | 'night' }) {
  const { theme, setChoice } = useAdminTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <IconButton
      tone={tone}
      icon={theme === 'dark' ? <icons.sun /> : <icons.moon />}
      label={next === 'dark' ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={() => setChoice(next)}
    />
  )
}
