'use client'

import { Moon, Sun, Volume2, VolumeX, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { getLevel, getNextLevel } from '@/lib/upi-data'

export function Hud({
  xp,
  soundOn,
  toggleSound,
  dark,
  toggleDark,
}: {
  xp: number
  soundOn: boolean
  toggleSound: () => void
  dark: boolean
  toggleDark: () => void
}) {
  const level = getLevel(xp)
  const next = getNextLevel(xp)
  const prevMin = level.minXp
  const span = next ? next.minXp - prevMin : 1
  const progress = next ? Math.min(100, ((xp - prevMin) / span) * 100) : 100

  return (
    <header className="flex flex-col gap-3 border-4 border-border bg-card p-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.5)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--coin)] bg-[var(--coin)]/15">
          <Trophy className="h-5 w-5 text-[var(--coin)]" />
        </div>
        <div>
          <p className="font-pixel text-[8px] uppercase text-muted-foreground">
            Level {level.level}
          </p>
          <p className="font-pixel text-[10px] uppercase text-[var(--coin)] crt-glow sm:text-xs">
            {level.title}
          </p>
        </div>
      </div>

      {/* XP bar */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-xs">
        <div className="flex items-center justify-between text-[11px] uppercase text-muted-foreground">
          <span>XP {xp}</span>
          <span>{next ? `Next: ${next.minXp}` : 'MAX'}</span>
        </div>
        <div className="h-4 border-2 border-border bg-background p-0.5">
          <motion.div
            className="h-full bg-[var(--primary)]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <IconToggle onClick={toggleSound} label="Toggle sound">
          {soundOn ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
        </IconToggle>
        <IconToggle onClick={toggleDark} label="Toggle dark mode">
          {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </IconToggle>
      </div>
    </header>
  )
}

function IconToggle({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center border-2 border-border bg-background text-foreground shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] transition-all hover:border-[var(--arcade-cyan)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]"
    >
      {children}
    </button>
  )
}
