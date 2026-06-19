'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { Clapperboard, Film } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import {
  FUN_FACTS,
  MODES,
  STATIONS,
  UPI_MAX_AMOUNT,
  getLevel,
  type ModeId,
  type Station,
} from '@/lib/upi-data'
import { useArcadeSound } from '@/lib/use-arcade-sound'
import { ArcadeBackground } from './arcade-background'
import { DialogueBox } from './dialogue-box'
import { FactCard } from './fact-card'
import { Hud } from './hud'
import { ModeSelector } from './mode-selector'
import { NetworkMap } from './network-map'
import { PixelButton } from './pixel-button'
import { ReceiverPhone } from './receiver-phone'
import { ResultModal, type ResultData } from './result-modal'
import { SenderPhone } from './sender-phone'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function UpiQuestGame() {
  // settings
  const [dark, setDark] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const play = useArcadeSound(soundOn)

  // transfer
  const [amount, setAmount] = useState(100)
  const [mode, setMode] = useState<ModeId>('normal')
  const overLimit = amount > UPI_MAX_AMOUNT

  // journey state
  const [running, setRunning] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [maxReached, setMaxReached] = useState(-1)
  const [failedIndex, setFailedIndex] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [received, setReceived] = useState(false)
  const [result, setResult] = useState<ResultData | null>(null)
  const cancelRef = useRef(false)

  // dialogue
  const [openStation, setOpenStation] = useState<Station | null>(null)
  const [visited, setVisited] = useState<Set<string>>(new Set())

  // gamification
  const [xp, setXp] = useState(0)
  const [collected, setCollected] = useState<string[]>([])
  const [newFactId, setNewFactId] = useState<string | null>(null)
  const awarded = useRef({
    firstTx: false,
    allStations: false,
    allFacts: false,
  })

  // demo mode
  const [demo, setDemo] = useState(false)
  const demoRef = useRef(false)

  // sync theme class
  useEffect(() => {
    const el = document.documentElement
    if (dark) {
      el.classList.add('dark')
      el.classList.remove('light')
    } else {
      el.classList.add('light')
      el.classList.remove('dark')
    }
  }, [dark])

  const addXp = useCallback(
    (amt: number) => {
      setXp((prev) => {
        const before = getLevel(prev).level
        const next = prev + amt
        if (getLevel(next).level > before) play('levelup')
        return next
      })
    },
    [play],
  )

  const revealFact = useCallback(() => {
    setCollected((prev) => {
      const remaining = FUN_FACTS.filter((f) => !prev.includes(f.id))
      if (remaining.length === 0) return prev
      const pick = remaining[Math.floor(Math.random() * remaining.length)]
      setNewFactId(pick.id)
      const next = [...prev, pick.id]
      if (next.length === FUN_FACTS.length && !awarded.current.allFacts) {
        awarded.current.allFacts = true
        addXp(50)
      }
      return next
    })
  }, [addXp])

  const fireConfetti = useCallback(() => {
    const colors = ['#f7c948', '#34d1d1', '#e85aa5', '#7bdc78']
    const opts = {
      spread: 70,
      ticks: 120,
      gravity: 1.1,
      scalar: 1.2,
      shapes: ['square'] as const,
      colors,
    }
    confetti({ ...opts, particleCount: 80, origin: { x: 0.3, y: 0.6 } })
    confetti({ ...opts, particleCount: 80, origin: { x: 0.7, y: 0.6 } })
    setTimeout(
      () => confetti({ ...opts, particleCount: 60, origin: { y: 0.5 } }),
      250,
    )
  }, [])

  const runJourney = useCallback(async () => {
    if (running || overLimit) return
    cancelRef.current = false
    setRunning(true)
    setReceived(false)
    setResult(null)
    setFailedIndex(null)
    setMaxReached(-1)
    setActiveIndex(-1)
    play('send')

    const m = MODES.find((x) => x.id === mode)!
    const step = 950 * m.speed
    const start = performance.now()

    for (let i = 0; i < STATIONS.length; i++) {
      if (cancelRef.current) return
      setActiveIndex(i)
      setStatusMessage(STATIONS[i].statusMessage)
      play('step')
      await delay(step)
      if (cancelRef.current) return

      if (m.failAt === i) {
        setFailedIndex(i)
        setStatusMessage(m.failMessage ?? 'Transaction failed')
        play('error')
        await delay(1100)
        if (cancelRef.current) return
        setRunning(false)
        setStatusMessage(null)
        setResult({
          success: false,
          amount,
          timeMs: performance.now() - start,
          nodes: i,
          xpEarned: 0,
          failMessage: m.failMessage,
        })
        return
      }
      setMaxReached(i)
    }

    // success
    if (cancelRef.current) return
    setReceived(true)
    play('coin')
    play('success')
    fireConfetti()

    let earned = 0
    if (!awarded.current.firstTx) {
      awarded.current.firstTx = true
      earned = 10
    } else {
      earned = 5
    }
    addXp(earned)
    revealFact()

    await delay(700)
    if (cancelRef.current) return
    setRunning(false)
    setStatusMessage(null)
    setResult({
      success: true,
      amount,
      timeMs: performance.now() - start,
      nodes: 8,
      xpEarned: earned,
    })
  }, [running, overLimit, mode, amount, play, fireConfetti, addXp, revealFact])

  // station dialogue + learn-all award
  function handleStationClick(s: Station) {
    setOpenStation(s)
    play('blip')
    setVisited((prev) => {
      if (prev.has(s.id)) return prev
      const next = new Set(prev)
      next.add(s.id)
      if (next.size === STATIONS.length && !awarded.current.allStations) {
        awarded.current.allStations = true
        addXp(20)
        revealFact()
      }
      return next
    })
  }

  // demo loop
  function toggleDemo() {
    const nextVal = !demo
    setDemo(nextVal)
    demoRef.current = nextVal
    if (nextVal && !running) {
      setMode('normal')
      void runJourney()
    }
  }

  useEffect(() => {
    if (!demo) return
    if (!running && !result) {
      // schedule a restart while demo is on
      const id = setTimeout(() => {
        if (demoRef.current) void runJourney()
      }, 1400)
      return () => clearTimeout(id)
    }
  }, [demo, running, result, runJourney])

  // when demo on and a result modal shows, auto-close to keep cinematic loop
  useEffect(() => {
    if (demo && result) {
      const id = setTimeout(() => setResult(null), 2600)
      return () => clearTimeout(id)
    }
  }, [demo, result])

  useEffect(() => {
    return () => {
      cancelRef.current = true
    }
  }, [])

  function resetAndClose() {
    setResult(null)
    setActiveIndex(-1)
    setMaxReached(-1)
    setReceived(false)
    setFailedIndex(null)
  }

  const activeDialogue =
    demo && running && activeIndex >= 0 ? STATIONS[activeIndex] : null

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <ArcadeBackground />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="font-pixel text-base leading-tight text-[var(--coin)] crt-glow sm:text-2xl">
            UPI QUEST
          </h1>
          <p className="mt-2 font-pixel text-[8px] uppercase tracking-wide text-[var(--arcade-cyan)] sm:text-[10px]">
            Follow Your Money
          </p>
        </div>

        <Hud
          xp={xp}
          soundOn={soundOn}
          toggleSound={() => setSoundOn((s) => !s)}
          dark={dark}
          toggleDark={() => setDark((d) => !d)}
        />

        {/* Main 3-column play area */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,280px)]">
          {/* Left: sender */}
          <div className="flex flex-col gap-4 lg:order-1">
            <SenderPhone
              amount={amount}
              setAmount={setAmount}
              onSend={runJourney}
              running={running}
              overLimit={overLimit}
            />
            <ModeSelector
              selected={mode}
              onSelect={setMode}
              disabled={running}
            />
          </div>

          {/* Center: network map */}
          <div className="flex flex-col gap-3 lg:order-2">
            <NetworkMap
              activeIndex={activeIndex}
              maxReached={maxReached}
              failedIndex={failedIndex}
              running={running}
              statusMessage={statusMessage}
              onStationClick={handleStationClick}
            />
            <div className="flex flex-wrap items-center justify-between gap-2 border-4 border-border bg-card p-2">
              <p className="text-sm text-muted-foreground">
                {running
                  ? 'Money is travelling the UPI network...'
                  : 'Tap any station to learn what it does.'}
              </p>
              <PixelButton
                variant={demo ? 'magenta' : 'ghost'}
                onClick={toggleDemo}
                active={demo}
              >
                {demo ? (
                  <Film className="h-3.5 w-3.5" />
                ) : (
                  <Clapperboard className="h-3.5 w-3.5" />
                )}
                {demo ? 'Demo On' : 'Demo Mode'}
              </PixelButton>
            </div>
          </div>

          {/* Right: receiver */}
          <div className="lg:order-3">
            <ReceiverPhone received={received} amount={amount} />
          </div>
        </div>

        {/* Fun facts collection */}
        <section className="border-4 border-border bg-card p-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-[9px] uppercase text-[var(--arcade-magenta)] sm:text-[10px]">
              Fact Cards
            </h2>
            <span className="font-pixel text-[8px] uppercase text-muted-foreground">
              {collected.length}/{FUN_FACTS.length}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FUN_FACTS.map((f) => (
              <FactCard
                key={f.id}
                fact={f}
                collected={collected.includes(f.id)}
                isNew={newFactId === f.id}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Complete transactions and learn every station to collect all cards.
            Collect them all for +50 XP.
          </p>
        </section>
      </div>

      {/* Demo narration bubble */}
      <AnimatePresence>
        {activeDialogue && (
          <motion.div
            key={activeDialogue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4 pb-4"
          >
            <div className="w-full max-w-2xl border-4 border-[var(--arcade-magenta)] bg-popover p-4 shadow-[6px_6px_0_0_rgba(0,0,0,0.6)]">
              <p className="font-pixel text-[8px] uppercase text-[var(--arcade-magenta)]">
                {activeDialogue.label}
              </p>
              <p className="mt-2 text-base leading-snug text-foreground">
                {activeDialogue.dialogue}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DialogueBox station={openStation} onClose={() => setOpenStation(null)} />
      <ResultModal result={result} onClose={resetAndClose} />
    </main>
  )
}
