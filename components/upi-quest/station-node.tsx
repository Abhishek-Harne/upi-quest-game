'use client'

import { cn } from '@/lib/utils'
import type { Station } from '@/lib/upi-data'
import { motion, AnimatePresence } from 'motion/react'
import { StationArt } from './station-art'

export type NodeState = 'idle' | 'active' | 'done' | 'failed'

const ringByColor: Record<Station['color'], string> = {
  coin: 'border-[var(--coin)]',
  cyan: 'border-[var(--arcade-cyan)]',
  magenta: 'border-[var(--arcade-magenta)]',
  primary: 'border-[var(--primary)]',
}

const glowByColor: Record<Station['color'], string> = {
  coin: 'shadow-[0_0_20px_4px_var(--coin-glow)]',
  cyan: 'shadow-[0_0_20px_4px_var(--arcade-cyan)]',
  magenta: 'shadow-[0_0_20px_4px_var(--arcade-magenta)]',
  primary: 'shadow-[0_0_20px_4px_var(--primary)]',
}

export function StationNode({
  station,
  state,
  big,
  onClick,
}: {
  station: Station
  state: NodeState
  big?: boolean
  onClick: () => void
}) {
  const active = state === 'active'
  const done = state === 'done'
  const failed = state === 'failed'

  return (
    <button
      type="button"
      onClick={onClick}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none"
      style={{ left: `${station.x}%`, top: `${station.y}%` }}
      aria-label={`${station.label} station. ${station.tag}. Click to learn more.`}
    >
      {/* sparks when active */}
      <AnimatePresence>
        {active && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 bg-[var(--coin)]"
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  x: [0, (i % 2 ? 1 : -1) * (18 + i * 6)],
                  y: [0, (i < 2 ? -1 : 1) * (18 + i * 4)],
                }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div
        animate={
          active
            ? { scale: [1, 1.12, 1] }
            : failed
              ? { x: [0, -3, 3, -3, 3, 0] }
              : { scale: 1 }
        }
        transition={
          active
            ? { duration: 0.7, repeat: Infinity }
            : { duration: 0.4 }
        }
        className={cn(
          'relative flex items-center justify-center border-4 bg-card transition-colors',
          big ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]',
          failed ? 'border-destructive' : ringByColor[station.color],
          active && glowByColor[station.color],
          done && 'opacity-100',
          !active && !done && !failed && 'opacity-70 group-hover:opacity-100',
        )}
        style={{ animation: !active && !failed ? 'pixel-bob 3s ease-in-out infinite' : undefined }}
      >
        <StationArt kind={station.kind} pixel={big ? 7 : 4} />

        {/* status corner light */}
        <span
          className={cn(
            'absolute -right-2 -top-2 h-3 w-3 border-2 border-background',
            failed
              ? 'bg-destructive'
              : done
                ? 'bg-[var(--primary)]'
                : active
                  ? 'bg-[var(--coin)]'
                  : 'bg-muted-foreground',
          )}
          style={{ animation: active ? 'blink 0.8s steps(2) infinite' : undefined }}
        />
      </motion.div>

      <div className="flex flex-col items-center gap-0.5">
        <span
          className={cn(
            'font-pixel text-[7px] uppercase leading-none sm:text-[8px]',
            active ? 'text-[var(--coin)] crt-glow' : 'text-foreground',
          )}
        >
          {station.label}
        </span>
        <span className="text-[11px] uppercase leading-none text-muted-foreground sm:text-xs">
          {station.tag}
        </span>
      </div>
    </button>
  )
}
