'use client'

import { Menu, Trophy, Zap, Send, Shield, BookOpen } from 'lucide-react'
import { motion } from 'motion/react'
import { getNextLevel, formatINR, formatDuration } from '@/lib/upi-data'
import { useGameStore } from '@/lib/game-store'
import { FUN_FACTS } from '@/lib/upi-facts'

export function Hud({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { stats, level } = useGameStore()
  const next = getNextLevel(stats.xp)
  const prevMin = level.minXp
  const span = next ? next.minXp - prevMin : 1
  const progress = next ? Math.min(100, ((stats.xp - prevMin) / span) * 100) : 100

  return (
    <header className="flex flex-col gap-3 border-4 border-border bg-card p-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-coin bg-coin/15">
          <Trophy className="h-5 w-5 text-coin" />
        </div>
        <div className="min-w-0">
          <p className="font-pixel text-[8px] uppercase text-muted-foreground">
            Level {level.level}
          </p>
          <p className="crt-glow truncate font-pixel text-[10px] uppercase text-coin sm:text-xs">
            {level.title}
          </p>
        </div>

        {/* XP bar */}
        <div className="ml-auto flex min-w-0 max-w-[38%] flex-1 flex-col gap-1 sm:max-w-xs">
          <div className="flex items-center justify-between text-[11px] uppercase text-muted-foreground">
            <span>XP {stats.xp}</span>
            <span>{next ? `Next: ${next.minXp}` : 'MAX'}</span>
          </div>
          <div className="h-4 border-2 border-border bg-background p-0.5">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </div>
        </div>

        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-border bg-background text-foreground shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] transition-all hover:border-arcade-cyan active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Session stats strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatChip icon={<Send className="h-3.5 w-3.5" />} label="Txns" value={String(stats.transactions)} />
        <StatChip icon={<Zap className="h-3.5 w-3.5" />} label="Sent" value={formatINR(stats.totalSent)} />
        <StatChip
          icon={<BookOpen className="h-3.5 w-3.5" />}
          label="Facts"
          value={`${stats.factsUnlocked.length}/${FUN_FACTS.length}`}
        />
        <StatChip
          icon={<Shield className="h-3.5 w-3.5" />}
          label="Time"
          value={formatDuration(stats.timeSpentMs)}
        />
      </div>
    </header>
  )
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 border-2 border-border bg-background px-2 py-1.5">
      <span className="text-arcade-cyan">{icon}</span>
      <div className="min-w-0">
        <p className="font-pixel text-[7px] uppercase text-muted-foreground">
          {label}
        </p>
        <p className="truncate font-mono text-xs font-bold text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
