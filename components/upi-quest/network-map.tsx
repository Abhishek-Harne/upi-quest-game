'use client'

import { STATIONS, type Station } from '@/lib/upi-data'
import { motion, AnimatePresence } from 'motion/react'
import { StationNode, type NodeState } from './station-node'
import { cn } from '@/lib/utils'

interface NetworkMapProps {
  activeIndex: number
  maxReached: number
  failedIndex: number | null
  running: boolean
  statusMessage: string | null
  onStationClick: (s: Station) => void
}

export function NetworkMap({
  activeIndex,
  maxReached,
  failedIndex,
  running,
  statusMessage,
  onStationClick,
}: NetworkMapProps) {
  const coinIndex = activeIndex >= 0 ? activeIndex : 0
  const coinStation = STATIONS[coinIndex]
  const showCoin = running && activeIndex >= 0 && failedIndex === null

  function stateFor(i: number): NodeState {
    if (failedIndex === i) return 'failed'
    if (running && i === activeIndex) return 'active'
    if (i <= maxReached) return 'done'
    return 'idle'
  }

  const activeStation = activeIndex >= 0 ? STATIONS[activeIndex] : null

  return (
    <div className="scanlines pixel-grid-bg relative aspect-[4/5] w-full overflow-hidden border-4 border-border bg-background/40 sm:aspect-[5/4]">
      {/* Pipelines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {STATIONS.slice(0, -1).map((s, i) => {
          const next = STATIONS[i + 1]
          const traversed = i < maxReached
          const isCurrent = i === activeIndex - 1 || (i === activeIndex && running)
          return (
            <g key={s.id}>
              <line
                x1={s.x}
                y1={s.y}
                x2={next.x}
                y2={next.y}
                stroke="var(--border)"
                strokeWidth={2.4}
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={s.x}
                y1={s.y}
                x2={next.x}
                y2={next.y}
                stroke={traversed ? 'var(--coin)' : 'transparent'}
                strokeWidth={1.4}
                strokeDasharray="3 2"
                vectorEffect="non-scaling-stroke"
                className={cn(isCurrent && 'animate-pulse')}
              />
            </g>
          )
        })}
      </svg>

      {/* NPCI label banner */}
      <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-full">
        <span className="font-pixel text-[7px] uppercase text-[var(--coin)] crt-glow sm:text-[9px]">
          Central Command
        </span>
      </div>

      {/* Stations */}
      {STATIONS.map((s, i) => (
        <StationNode
          key={s.id}
          station={s}
          state={stateFor(i)}
          big={s.kind === 'npci'}
          onClick={() => onStationClick(s)}
        />
      ))}

      {/* Energy Coin */}
      <AnimatePresence>
        {showCoin && (
          <motion.div
            className="pointer-events-none absolute z-30"
            initial={false}
            animate={{ left: `${coinStation.x}%`, top: `${coinStation.y}%` }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.55 }}
            style={{ translateX: '-50%', translateY: '-50%' }}
          >
            <div className="coin-shadow relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--coin-glow)] bg-[var(--coin)]">
              <span
                className="font-pixel text-[10px] text-[oklch(0.2_0.08_280)]"
                style={{ animation: 'coin-spin 0.7s linear infinite' }}
              >
                ₹
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status popup near active node */}
      <AnimatePresence mode="wait">
        {statusMessage && activeStation && (
          <motion.div
            key={statusMessage}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            className="absolute z-40 w-40 -translate-x-1/2"
            style={{
              left: `${Math.min(Math.max(activeStation.x, 22), 78)}%`,
              top: `${activeStation.y > 50 ? activeStation.y - 22 : activeStation.y + 14}%`,
            }}
          >
            <div
              className={cn(
                'border-2 bg-popover px-2 py-1.5 text-center shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]',
                failedIndex !== null
                  ? 'border-destructive'
                  : 'border-[var(--coin)]',
              )}
            >
              <p className="text-[13px] leading-tight text-popover-foreground">
                {statusMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
