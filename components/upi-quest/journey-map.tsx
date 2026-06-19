'use client'

import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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
import { ThiefSprite, PoliceSprite } from './cyber-mascots'
import { cn } from '@/lib/utils'

export type AttackPhase = 'none' | 'thief' | 'police'

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
  senderPhone: ReactNode
  receiverPhone: ReactNode
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

// First and last stations are the phones; the rest is the infrastructure rail.
const INFRA = STATIONS.slice(1, -1)
const LAST = STATIONS.length - 1
// Index of the Internet node, where heist attempts surface.
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
  senderPhone,
  receiverPhone,
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

  const setRef = (i: number) => (el: HTMLDivElement | null) => {
    nodeRefs.current[i] = el
  }

  const packetPos =
    activeIndex >= 0 && centers[activeIndex] ? centers[activeIndex] : centers[0]
  const attackPos = centers[INTERNET_INDEX]

  return (
    <div
      ref={containerRef}
      className={cn(
        'scanlines pixel-grid-bg relative overflow-hidden border-4 border-border bg-background/60 p-3 sm:p-4',
        xray && 'bg-background/90',
      )}
    >
      {/* Pipelines / fiber-optic connectors between every slot (phones + infra) */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden
      >
        {centers.length === STATIONS.length &&
          centers.slice(0, -1).map((c, i) => {
            const next = centers[i + 1]
            if (!c || !next || (c.x === 0 && c.y === 0)) return null
            const reached = i < maxReached
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
                    opacity: reached ? 1 : 0.45,
                  }}
                />
              </g>
            )
          })}
      </svg>

      {/* Stage: sender phone | infrastructure rail | receiver phone */}
      <div className="relative z-10 flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-center lg:gap-3">
        {/* Sender phone */}
        <div
          ref={setRef(0)}
          className="w-full max-w-[230px] shrink-0 lg:w-[220px]"
        >
          <p className="mb-1 text-center font-pixel text-[7px] uppercase text-arcade-cyan">
            You (Payer)
          </p>
          {senderPhone}
        </div>

        {/* Infrastructure rail */}
        <div className="relative flex w-full flex-col items-center gap-1 lg:w-auto">
          <span className="hidden font-pixel text-[7px] uppercase text-muted-foreground lg:block">
            {'\u2193 Payment Rails \u2193'}
          </span>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:flex-nowrap sm:justify-center sm:gap-1 lg:gap-2">
            {INFRA.map((s, idx) => {
              const globalIdx = idx + 1
              return (
                <div key={s.id} ref={setRef(globalIdx)}>
                  <StationNode
                    station={s}
                    state={stateFor(globalIdx)}
                    provider={providerFor(s, participants)}
                    providerOptions={optionsForSlot(s.slot)}
                    onSelectProvider={(id) => onSelectProvider(s.slot, id)}
                    canCustomize={canCustomize}
                    xray={xray}
                    onClick={() => onStationClick(s)}
                    className="w-[100px]"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Receiver phone */}
        <div
          ref={setRef(LAST)}
          className="w-full max-w-[230px] shrink-0 lg:w-[220px]"
        >
          <p className="mb-1 text-center font-pixel text-[7px] uppercase text-arcade-magenta">
            Friend (Payee)
          </p>
          {receiverPhone}
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

      {/* Cyber heist: thief grabs the packet, cyber-police chases it back */}
      <AnimatePresence>
        {attackPhase !== 'none' && attackPos && (
          <motion.div
            key={attackPhase}
            initial={{ opacity: 0, y: -16, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="pointer-events-none absolute z-30 flex -translate-x-1/2 flex-col items-center"
            style={{ left: attackPos.x, top: attackPos.y - 92 }}
          >
            {attackPhase === 'thief' ? (
              <>
                <span className="mb-1 border-2 border-destructive bg-destructive/20 px-1 font-pixel text-[7px] uppercase text-destructive crt-glow">
                  Mine now!
                </span>
                <motion.div
                  animate={{ x: [0, -3, 3, -2, 2, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <ThiefSprite pixel={4} />
                </motion.div>
              </>
            ) : (
              <>
                <span className="mb-1 border-2 border-arcade-cyan bg-arcade-cyan/15 px-1 font-pixel text-[7px] uppercase text-arcade-cyan crt-glow">
                  Busted!
                </span>
                <motion.div
                  initial={{ x: 30 }}
                  animate={{ x: 0 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 12 }}
                >
                  <PoliceSprite pixel={4} />
                </motion.div>
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
