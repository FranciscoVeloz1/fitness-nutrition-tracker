import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
] as const

export function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-3 gap-3">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors',
            theme === option.value ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
          )}
        >
          <option.icon className="size-5" />
          {option.label}
        </button>
      ))}
    </div>
  )
}
