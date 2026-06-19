'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  AGGREGATORS,
  BANKS,
  STATIONS,
  UPI_APPS,
  providerById,
  type Participants,
  type ParticipantSlot,
  type Provider,
  type Station,
} from '@/lib/upi-data'
import { ACCENT_VAR, StationNode, type NodeState } from './station-node'
import { EnergyPacket } from './energy-packet'
import { cn } from '@/lib/utils'

export type AttackPhase = 'none' | 'incoming' | 'blocked'

interface JourneyMapProps {
  activeIndex: number
  maxReached: number
  failedIndex: number | null
  running: boolean
  xray: boolean
  canCustomize: boolean
  participants: Participants
  attackPhase: AttackPhase
  onStationClick: (s: Station) => void
  onSelectProvider: (slot: ParticipantSlot, id: string) => void
}

interface Point {
  x: number
  y: number
}

function optionsForSlot(slot: ParticipantSlot): Provider[] | undefined {
  switch (slot) {
    case 'app':
      return UPI_APPS
    case 'aggregator':
      return AGGREGATORS
    case 'senderBank':
    case 'receiverBank':
      return BANKS
    default:
      return undefined
  }
}

function providerFor(station: Station, p: Participants) {
  switch (station.slot) {
    case 'app':
      return providerById(UPI_APPS, p.app)
    case 'aggregator':
      return providerById(AGGREGATORS, p.aggregator)
    case 'senderBank':
      return providerById(BANKS, p.senderBank)
    case 'receiverBank':
      return providerById(BANKS, p.receiverBank)
    default:
      return undefined
  }
}

// Index of the Internet node, where intrusion attempts surface.
const INTERNET_INDEX = STATIONS.findIndex((s) => s.id === 'internet')

export function JourneyMap({
  activeIndex,
  maxReached,
  failedIndex,
  running,
  xray,
  canCustomize,
  participants,
  attackPhase,
  onStationClick,
  onSelectProvider,
}: JourneyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const [centers, setCenters] = useState<Point[]>([])

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const pts: Point[] = nodeRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 }
      const r = el.getBoundingClientRect()
      return {
        x: r.left - cRect.left + r.width / 2,
        y: r.top - cRect.top + r.height / 2,
      }
    })
    setCenters(pts)
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [measure, xray])

  useEffect(() => {
    const ro = new ResizeObserver(() => measure())
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', measure)
    const id = setTimeout(measure, 100)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      clearTimeout(id)
    }
  }, [measure])

  function stateFor(i: number): NodeState {
    if (failedIndex === i) return 'failed'
    if (running && i === activeIndex) return 'active'
    if (i <= maxReached) return 'done'
    return 'idle'
  }

  function renderNode(s: Station, i: number) {
    return (
      <div
        key={s.id}
        ref={(el) => {
          nodeRefs.current[i] = el
        }}
      >
        <StationNode
          station={s}
          state={stateFor(i)}
          provider={providerFor(s, participants)}
          providerOptions={optionsForSlot(s.slot)}
          onSelectProvider={(id) => onSelectProvider(s.slot, id)}
          canCustomize={canCustomize}
          xray={xray}
          onClick={() => onStationClick(s)}
        />
      </div>
    )
  }

  const packetPos =
    activeIndex >= 0 && centers[activeIndex] ? centers[activeIndex] : centers[0]
  const attackPos = centers[INTERNET_INDEX]

  return (
    <div
      ref={containerRef}
      className={cn(
        'scanlines relative overflow-hidden border-4 border-border bg-background/60 p-4 pixel-grid-bg',
        xray && 'bg-background/90',
      )}
    >
      {/* Pipelines / fiber-optic connectors */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        {centers.length === STATIONS.length &&
          centers.slice(0, -1).map((c, i) => {
            const next = centers[i + 1]
            if (!c || !next) return null
            const reached = i < maxReached || (i === maxReached && maxReached >= 0)
            const isFailedLink = failedIndex === i + 1
            const accent = isFailedLink
              ? 'var(--destructive)'
              : reached
                ? 'var(--coin)'
                : 'var(--grid)'
            return (
              <g key={i}>
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="var(--border)"
                  strokeWidth={6}
                />
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={accent}
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  style={{
                    animation:
                      reached || running
                        ? 'dash-flow 0.8s linear infinite'
                        : undefined,
                    opacity: reached ? 1 : 0.5,
                  }}
                />
                <rect
                  x={(c.x + next.x) / 2 - 3}
                  y={(c.y + next.y) / 2 - 3}
                  width={6}
                  height={6}
                  fill={reached ? accent : 'var(--muted-foreground)'}
                  className="animate-router-blink"
                />
              </g>
            )
          })}
      </svg>

      {/* Internet Highway label */}
      <div className="pointer-events-none absolute right-3 top-2 z-10 hidden items-center gap-1 sm:flex">
        <span className="font-pixel text-[7px] uppercase text-muted-foreground">
          Internet Highway
        </span>
      </div>

      {/* Nodes: serpentine on desktop, vertical on mobile */}
      <div className="relative z-10 flex flex-col items-stretch gap-8 sm:gap-10">
        {/* Row 1: sender -> upi-app -> aggregator -> sender-bank */}
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          {STATIONS.slice(0, 4).map((s, i) => renderNode(s, i))}
        </div>

        {/* Row 2: internet -> npci (reversed on desktop for serpentine flow) */}
        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row-reverse sm:justify-between sm:px-12">
          {renderNode(STATIONS[4], 4)}
          {renderNode(STATIONS[5], 5)}
        </div>

        {/* Row 3: receiver-bank -> receiver-phone */}
        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
          {STATIONS.slice(6).map((s, idx) => renderNode(s, idx + 6))}
        </div>
      </div>

      {/* Traveling energy packet */}
      {packetPos && running && activeIndex >= 0 && (
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-20"
          animate={{ x: packetPos.x - 14, y: packetPos.y - 14 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <EnergyPacket pixel={4} />
        </motion.div>
      )}

      {/* Inline intrusion / Guardian event near the Internet node */}
      <AnimatePresence>
        {attackPhase !== 'none' && attackPos && (
          <motion.div
            key="attack"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="pointer-events-none absolute z-30 flex -translate-x-1/2 flex-col items-center"
            style={{ left: attackPos.x, top: attackPos.y - 70 }}
          >
            {attackPhase === 'incoming' ? (
              <>
                <div className="animate-[hacker-shake_0.5s_steps(2)_infinite] font-mono text-xl leading-none text-destructive crt-glow">
                  {'[X_X]'}
                </div>
                <span className="mt-1 border-2 border-destructive bg-destructive/20 px-1 font-pixel text-[7px] uppercase text-destructive">
                  Intrusion!
                </span>
              </>
            ) : (
              <>
                <div className="animate-packet-glow font-mono text-xl leading-none text-arcade-cyan crt-glow">
                  {'[#]'}
                </div>
                <span className="mt-1 border-2 border-arcade-cyan bg-arcade-cyan/15 px-1 font-pixel text-[7px] uppercase text-arcade-cyan">
                  Blocked
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* X-ray detail strip */}
      {xray && activeIndex >= 0 && STATIONS[activeIndex] && (
        <div
          className="relative z-10 mt-4 border-2 p-2"
          style={{ borderColor: ACCENT_VAR[STATIONS[activeIndex].color] }}
        >
          <p
            className="font-pixel text-[8px] uppercase"
            style={{ color: ACCENT_VAR[STATIONS[activeIndex].color] }}
          >
            {STATIONS[activeIndex].xray.phase}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-card-foreground">
            {STATIONS[activeIndex].xray.detail}
          </p>
        </div>
      )}
    </div>
  )
}
