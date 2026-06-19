'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  AGGREGATORS,
  BANKS,
  STATIONS,
  UPI_APPS,
  providerById,
  type Participants,
  type Station,
} from '@/lib/upi-data'
import { ACCENT_VAR, StationNode, type NodeState } from './station-node'
import { EnergyPacket } from './energy-packet'
import { cn } from '@/lib/utils'

interface JourneyMapProps {
  activeIndex: number
  maxReached: number
  failedIndex: number | null
  running: boolean
  xray: boolean
  participants: Participants
  onStationClick: (s: Station) => void
}

interface Point {
  x: number
  y: number
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

export function JourneyMap({
  activeIndex,
  maxReached,
  failedIndex,
  running,
  xray,
  participants,
  onStationClick,
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

  const packetPos =
    activeIndex >= 0 && centers[activeIndex] ? centers[activeIndex] : centers[0]

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
                {/* base pipe */}
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="var(--border)"
                  strokeWidth={6}
                />
                {/* energized current */}
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
                {/* router midpoint */}
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
      <div className="relative z-10 flex flex-col items-stretch gap-6 sm:gap-8">
        {/* Row 1: sender -> upi-app -> aggregator -> sender-bank */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          {STATIONS.slice(0, 4).map((s, i) => (
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
                xray={xray}
                onClick={() => onStationClick(s)}
              />
            </div>
          ))}
        </div>

        {/* Row 2 (desktop reversed for serpentine): npci centered */}
        <div className="flex justify-center">
          <div
            ref={(el) => {
              nodeRefs.current[4] = el
            }}
          >
            <StationNode
              station={STATIONS[4]}
              state={stateFor(4)}
              xray={xray}
              onClick={() => onStationClick(STATIONS[4])}
            />
          </div>
        </div>

        {/* Row 3: receiver-bank -> receiver-phone */}
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-16">
          {STATIONS.slice(5).map((s, idx) => {
            const i = idx + 5
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
                  xray={xray}
                  onClick={() => onStationClick(s)}
                />
              </div>
            )
          })}
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
