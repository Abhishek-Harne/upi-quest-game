'use client'

import { MODES, type ModeId } from '@/lib/upi-data'
import { cn } from '@/lib/utils'

export function ModeSelector({
  selected,
  onSelect,
  disabled,
}: {
  selected: ModeId
  onSelect: (id: ModeId) => void
  disabled: boolean
}) {
  const current = MODES.find((m) => m.id === selected)!
  return (
    <div className="border-4 border-border bg-card p-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.5)]">
      <p className="font-pixel text-[8px] uppercase text-[var(--arcade-cyan)]">
        Scenario
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            disabled={disabled}
            onClick={() => onSelect(m.id)}
            className={cn(
              'border-2 px-2 py-1.5 text-[11px] uppercase transition-all disabled:opacity-50',
              selected === m.id
                ? m.failAt === null
                  ? 'border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]'
                  : 'border-destructive bg-destructive/15 text-destructive'
                : 'border-border bg-background text-muted-foreground hover:text-foreground',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm leading-snug text-muted-foreground">
        {current.description}
      </p>
    </div>
  )
}
