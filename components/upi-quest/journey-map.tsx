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
  UPI_APPS,
  providerById,
  type Participants,
  type ParticipantSlot,
  type Provider,
  type Station,
  type TransactionType,
} from '@/lib/upi-data'
import { ACCENT_VAR, StationNode, type NodeState } from './station-node'
import { EnergyPacket } from './energy-packet'
import { ThiefSprite, PoliceSprite } from './cyber-mascots'
import { SECURITY_SCENARIOS } from '@/lib/security-data'
import { cn } from '@/lib/utils'

export type AttackPhase =
  | 'none'
  | 'warning'
  | 'thief'
  | 'narration'
  | 'siren'
  | 'guardian'
  | 'recovery'

interface JourneyMapProps {
  stations: Station[]
  transactionType: TransactionType
  activeIndex: number
  maxReached: number
  failedIndex: number | null
  running: boolean
  xray: boolean
  canCustomize: boolean
  participants: Participants
  attackPhase: AttackPhase
  attackPhaseMs: number
  attackScenario: (typeof SECURITY_SCENARIOS)[number] | null
  statusLine: string | null
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

const PHONE_LABELS: Record<TransactionType, { sender: string; receiver: string }> = {
  personal: { sender: 'You (Payer)', receiver: 'Friend (Payee)' },
  business: { sender: 'You (Customer)', receiver: 'Merchant' },
}

export function JourneyMap({
  stations,
  transactionType,
  activeIndex,
  maxReached,
  failedIndex,
  running,
  xray,
  canCustomize,
  participants,
  attackPhase,
  attackPhaseMs,
  attackScenario,
  statusLine,
  onStationClick,
  onSelectProvider,
  senderPhone,
  receiverPhone,
}: JourneyMapProps) {
  // First and last stations are the phones; the rest is the infrastructure
  // rail. This is derived from the active transaction type, so the
  // infrastructure swaps in/out (e.g. the Aggregator) automatically.
  const INFRA = stations.slice(1, -1)
  const LAST = stations.length - 1
  const INTERNET_INDEX = stations.findIndex((s) => s.id === 'internet')
  const phoneLabels = PHONE_LABELS[transactionType]
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

  // Mobile auto-follow: smoothly keep the active node centered in the
  // viewport as the packet travels, so users don't have to scroll manually.
  useEffect(() => {
    if (!running || activeIndex < 0) return
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 1024px)').matches) return
    const el = nodeRefs.current[activeIndex]
    el?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }, [activeIndex, running])

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
  const attackActive = attackPhase !== 'none'
  const brokenLink = (i: number) =>
    attackActive &&
    (attackPhase === 'warning' || attackPhase === 'thief') &&
    (i === INTERNET_INDEX - 1 || i === INTERNET_INDEX)

  return (
    <div ref={containerRef} className="relative">
      {/* Pipelines / fiber-optic connectors between every slot (phones + infra) */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden
      >
        {centers.length === stations.length &&
          centers.slice(0, -1).map((c, i) => {
            const next = centers[i + 1]
            if (!c || !next || (c.x === 0 && c.y === 0)) return null
            const reached = i < maxReached
            const isFailedLink = failedIndex === i + 1
            const isBroken = brokenLink(i)
            const isRepairing = attackPhase === 'recovery' && i === INTERNET_INDEX - 1
            const accent = isBroken
              ? 'var(--destructive)'
              : isFailedLink
                ? 'var(--destructive)'
                : reached
                  ? 'var(--coin)'
                  : 'var(--grid)'
            const midX = (c.x + next.x) / 2
            const midY = (c.y + next.y) / 2
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
                  strokeDasharray={isBroken ? '3 10' : '6 6'}
                  style={{
                    animation:
                      reached || running
                        ? 'dash-flow 0.8s linear infinite'
                        : undefined,
                    opacity: isBroken ? 0.9 : reached ? 1 : 0.45,
                  }}
                />
                {(isBroken || isRepairing) && (
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    fontSize="14"
                    className="select-none"
                    style={{
                      animation: 'pixel-bob 0.4s ease-in-out infinite',
                    }}
                  >
                    {isRepairing ? '✨' : '⚡'}
                  </text>
                )}
              </g>
            )
          })}
      </svg>

      {/* Stage: sender phone | infrastructure rail | receiver phone.
          The phones live outside the pipeline window so they always have
          room to render fully, even at small/medium text sizes. */}
      <div className="relative z-10 flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-center lg:gap-3">
        {/* Sender phone */}
        <div
          ref={setRef(0)}
          className="w-full max-w-[230px] shrink-0 lg:w-[220px]"
        >
          <p className="mb-1 text-center font-pixel text-[7px] uppercase text-arcade-cyan">
            {phoneLabels.sender}
          </p>
          {senderPhone}
        </div>

        {/* Infrastructure rail \u2014 this is the "pipeline window" */}
        <div
          className={cn(
            'scanlines pixel-grid-bg relative flex w-full flex-col items-center gap-1 overflow-hidden border-4 border-border bg-background/60 p-3 sm:p-4 lg:w-auto',
            xray && 'bg-background/90',
          )}
        >
          <span className="hidden font-pixel text-[7px] uppercase text-muted-foreground lg:block">
            {'\u2193 Payment Rails \u2193'}
          </span>
          {/* Compact live status indicator \u2014 replaces stacked toast spam */}
          <div className="mb-3 flex min-h-[20px] w-full items-center justify-center px-2 text-center">
            {statusLine && (
              <motion.p
                key={statusLine}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block max-w-full break-words border-2 border-arcade-cyan/60 bg-arcade-cyan/10 px-2 py-0.5 font-pixel text-[7px] uppercase text-arcade-cyan"
              >
                {statusLine}
              </motion.p>
            )}
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={transactionType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-8 sm:flex-row sm:flex-nowrap sm:justify-center sm:gap-3 lg:gap-5"
            >
              {INFRA.map((s, idx) => {
                const globalIdx = idx + 1
                // Gentle S-curve on sm+: alternate a vertical offset per node
                // so the rail breathes instead of feeling like a compressed
                // straight line. Mobile keeps a plain vertical stack.
                const wave =
                  idx % 2 === 0 ? 'sm:-translate-y-3.5' : 'sm:translate-y-3.5'
                return (
                  <motion.div key={s.id} ref={setRef(globalIdx)} className={cn(wave)}>
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
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Receiver phone */}
        <div
          ref={setRef(LAST)}
          className="w-full max-w-[230px] shrink-0 lg:w-[220px]"
        >
          <p className="mb-1 text-center font-pixel text-[7px] uppercase text-arcade-magenta">
            {phoneLabels.receiver}
          </p>
          {receiverPhone}
        </div>
      </div>

      {/* Traveling energy packet — frozen in place while the heist plays out */}
      {packetPos && running && activeIndex >= 0 && (
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-20"
          animate={{ x: packetPos.x - 14, y: packetPos.y - 14 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <EnergyPacket pixel={4} />
        </motion.div>
      )}

      {/* Cyber heist arcade event: Packet Pirate vs Cyber Guardian */}
      <AnimatePresence>
        {attackActive && attackPos && (
          <motion.div
            key="heist-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-background/55"
          >
            <div className="relative flex w-full max-w-xs flex-col items-center gap-2 border-4 border-destructive bg-card p-3 text-center shadow-[6px_6px_0_0_rgba(0,0,0,0.55)] crt-glow">
              <div className="absolute left-0 top-0 h-1 w-full bg-border/60">
                <motion.div
                  key={attackPhase}
                  className="h-full bg-destructive"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: attackPhaseMs / 1000, ease: 'linear' }}
                />
              </div>

              {attackPhase === 'warning' && (
                <>
                  <span className="font-pixel text-[9px] uppercase text-destructive">
                    {'⚠ Suspicious Activity Detected'}
                  </span>
                  <p className="text-xs leading-relaxed text-card-foreground">
                    All network movement is pausing while we take a closer look...
                  </p>
                </>
              )}

              {attackPhase === 'thief' && (
                <>
                  <span className="font-pixel text-[9px] uppercase text-destructive">
                    {attackScenario
                      ? `Packet Pirate: ${attackScenario.attack}!`
                      : 'A Packet Pirate Strikes!'}
                  </span>
                  <motion.div
                    initial={{ x: -120 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <motion.div
                      animate={{ rotate: [0, -8, 8, -6, 6, 0] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <ThiefSprite pixel={5} />
                    </motion.div>
                  </motion.div>
                  <p className="text-xs leading-relaxed text-card-foreground">
                    {'🔨 '}
                    {attackScenario?.attackDesc ??
                      'The pirate smashes the pipeline and grabs your packet!'}
                  </p>
                </>
              )}

              {attackPhase === 'narration' && (
                <>
                  <span className="font-pixel text-[9px] uppercase text-arcade-cyan">
                    How Real UPI Stays Safe
                  </span>
                  <p className="text-xs leading-relaxed text-card-foreground">
                    Real payment systems constantly monitor for suspicious activity.
                  </p>
                  <p className="text-xs leading-relaxed text-card-foreground">
                    {attackScenario?.defenseDesc ??
                      'When unusual behaviour is detected, transactions may be temporarily halted until it’s verified safe.'}
                  </p>
                </>
              )}

              {attackPhase === 'siren' && (
                <>
                  <span className="font-pixel text-[9px] uppercase text-arcade-cyan">
                    {'🚨 WEE-OO WEE-OO 🚨'}
                  </span>
                  <motion.div
                    initial={{ x: 120 }}
                    animate={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 140, damping: 12 }}
                  >
                    <PoliceSprite pixel={5} />
                  </motion.div>
                  <p className="text-xs leading-relaxed text-card-foreground">
                    The Cyber Guardian arrives on the scene!
                  </p>
                </>
              )}

              {attackPhase === 'guardian' && (
                <>
                  <span className="font-pixel text-[9px] uppercase text-arcade-cyan">
                    Busted!
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 25, -10, 0], x: [0, 6, -2, 0] }}
                      transition={{ duration: 0.8 }}
                    >
                      <ThiefSprite pixel={4} />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <PoliceSprite pixel={4} />
                    </motion.div>
                  </div>
                  <p className="text-xs leading-relaxed text-card-foreground">
                    The Pirate slips on a banana peel and drops the packet!
                  </p>
                </>
              )}

              {attackPhase === 'recovery' && (
                <>
                  <span className="font-pixel text-[9px] uppercase text-chart-4">
                    {'✅ Threat Neutralized'}
                  </span>
                  <span className="font-pixel text-[9px] uppercase text-chart-4">
                    {'✅ Network Restored'}
                  </span>
                  <span className="font-pixel text-[9px] uppercase text-chart-4">
                    {'✅ Transaction Resuming'}
                  </span>
                  <p className="text-xs leading-relaxed text-card-foreground">
                    The Cyber Guardian repairs the pipeline. Your packet continues
                    on its way.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* X-ray detail strip */}
      {xray && activeIndex >= 0 && stations[activeIndex] && (
        <div
          className="relative z-10 mt-4 border-2 p-2"
          style={{ borderColor: ACCENT_VAR[stations[activeIndex].color] }}
        >
          <p
            className="font-pixel text-[8px] uppercase"
            style={{ color: ACCENT_VAR[stations[activeIndex].color] }}
          >
            {stations[activeIndex].xray.phase}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-card-foreground">
            {stations[activeIndex].xray.detail}
          </p>
        </div>
      )}
    </div>
  )
}
