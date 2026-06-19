'use client'

import { Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { useGameStore, type TextSize } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const TEXT_SIZES: { id: TextSize; label: string }[] = [
  { id: 'sm', label: 'Small' },
  { id: 'md', label: 'Medium' },
  { id: 'lg', label: 'Large' },
  { id: 'xl', label: 'XL' },
]

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-pixel text-[8px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

export function SettingsPanel() {
  const { settings, setSettings } = useGameStore()

  return (
    <div className="flex flex-col gap-4">
      <Row label="Text Size">
        <div className="grid grid-cols-4 gap-1.5">
          {TEXT_SIZES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSettings({ textSize: t.id })}
              className={cn(
                'border-2 px-1 py-1.5 text-xs transition-colors',
                settings.textSize === t.id
                  ? 'border-[var(--coin)] bg-[var(--coin)] text-[var(--primary-foreground)]'
                  : 'border-border bg-secondary text-secondary-foreground hover:border-[var(--coin)]',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Row>

      <Row label="Theme">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setSettings({ theme: 'dark' })}
            className={cn(
              'flex items-center justify-center gap-1.5 border-2 px-2 py-1.5 text-xs transition-colors',
              settings.theme === 'dark'
                ? 'border-[var(--arcade-cyan)] bg-[var(--arcade-cyan)] text-[var(--accent-foreground)]'
                : 'border-border bg-secondary text-secondary-foreground hover:border-[var(--arcade-cyan)]',
            )}
          >
            <Moon className="h-3.5 w-3.5" /> Night
          </button>
          <button
            onClick={() => setSettings({ theme: 'light' })}
            className={cn(
              'flex items-center justify-center gap-1.5 border-2 px-2 py-1.5 text-xs transition-colors',
              settings.theme === 'light'
                ? 'border-[var(--coin)] bg-[var(--coin)] text-[var(--primary-foreground)]'
                : 'border-border bg-secondary text-secondary-foreground hover:border-[var(--coin)]',
            )}
          >
            <Sun className="h-3.5 w-3.5" /> Day
          </button>
        </div>
      </Row>

      <Row label="Sound">
        <button
          onClick={() => setSettings({ sound: !settings.sound })}
          className={cn(
            'flex items-center justify-center gap-2 border-2 px-2 py-1.5 text-xs transition-colors',
            settings.sound
              ? 'border-[var(--chart-4)] bg-secondary text-secondary-foreground'
              : 'border-border bg-secondary text-muted-foreground',
          )}
        >
          {settings.sound ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
          {settings.sound ? 'Sound On' : 'Sound Off'}
        </button>
      </Row>
    </div>
  )
}
