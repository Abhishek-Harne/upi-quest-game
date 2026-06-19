'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { BookOpen, Eye, EyeOff, PlayCircle, Shield } from 'lucide-react'
import {
  MODES,
  STATIONS,
  UPI_MAX_AMOUNT,
  XP,
  getLevel,
  formatINR,
  type ModeId,
  type Station,
} from '@/lib/upi-data'
import { FUN_FACTS } from '@/lib/upi-facts'
import { GameStoreProvider, useGameStore } from '@/lib/game-store'
import { useArcadeSound } from '@/lib/use-arcade-sound'
import { ArcadeBackground } from './arcade-background'
import { Hud } from './hud'
import { SenderPhone } from './sender-phone'
import { ReceiverPhone } from './receiver-phone'
import { JourneyMap } from './journey-map'
import { ModeSelector } from './mode-selector'
import { ParticipantCustomizer } from './participant-customizer'
import { DialogueBox } from './dialogue-box'
import { ResultModal, type ResultData } from './result-modal'
import { SecurityChallenge } from './security-challenge'
import { FactsCollection } from './facts-collection'
import { WelcomeModal } from './welcome-modal'
import { BurgerMenu } from './burger-menu'
import { PixelButton } from './pixel-button'
import { ToastProvider, useToast } from './toast-provider'

const STEP_BASE_MS = 850

export function UpiQuestGame() {
  return (
    <GameStoreProvider>
      <ToastProvider>
        <GameInner />
      </ToastProvider>
    </GameStoreProvider>
  )
}

type Tab = 'play' | 'facts' | 'security'

function GameInner() {
  const store = useGameStore()
  const { toast } = useToast()
  const play = useArcadeSound(store.settings.sound)

  const [amount, setAmount] = useState(500)
  const [mode, setMode] = useState<ModeId>('normal')
  const [tab, setTab] = useState<Tab>('play')

  const [activeIndex, setActiveIndex] = useState(-1)
  const [maxReached, setMaxReached] = useState(-1)
  const [failedIndex, setFailedIndex] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [received, setReceived] = useState(false)

  const [dialogueStation, setDialogueStation] = useState<Station | null>(null)
  const [result, setResult] = useState<ResultData | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(false)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const startedAt = useRef(0)
  const readNodes = useRef<Set<string>>(new Set())

  const overLimit = amount > UPI_MAX_AMOUNT

  // Show welcome on first visit (after hydration)
  useEffect(() => {
    if (store.hydrated && !store.settings.welcomeDismissed) {
      setWelcomeOpen(true)
    }
  }, [store.hydrated, store.settings.welcomeDismissed])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const celebrate = useCallback(() => {
    const colors = ['#ffcc33', '#33e1ff', '#ff4dd2', '#7CFC00']
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      shapes: ['square'],
      scalar: 1.1,
    })
    setTimeout(
      () =>
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.5 },
          colors,
          shapes: ['square'],
        }),
      200,
    )
  }, [])

  const finish = useCallback(
    (success: boolean, failIdx: number | null, failMessage?: string) => {
      const timeMs = Date.now() - startedAt.current
      const nodes = success ? STATIONS.length : (failIdx ?? 0)
      const selectedMode = MODES.find((m) => m.id === mode)!

      let xpEarned = 0
      const prevXp = store.stats.xp

      if (success) {
        xpEarned += XP.transaction
        store.recordTransaction(amount)
        setReceived(true)
        play('success')
        celebrate()
        const factId = store.unlockRandomFact()
        if (factId) {
          xpEarned += XP.unlockFact
          const f = FUN_FACTS.find((x) => x.id === factId)
          if (f)
            toast({
              tone: 'fact',
              title: `Fact Unlocked: ${f.title}`,
              detail: f.fact,
            })
        }
        toast({
          tone: 'success',
          title: 'Transaction Complete',
          detail: `${formatINR(amount)} delivered across all 7 stations`,
        })
      } else {
        play('error')
        toast({
          tone: 'error',
          title: 'Transaction Failed',
          detail: failMessage,
        })
      }

      // scenario XP (once per failure scenario)
      if (selectedMode.failAt && store.markScenarioTried(mode)) {
        xpEarned += selectedMode.xp
        toast({
          tone: 'xp',
          title: `Scenario Explored: +${selectedMode.xp} XP`,
          detail: selectedMode.label,
        })
      }

      if (xpEarned > 0) {
        const newXp = store.addXp(xpEarned)
        play('coin')
        const beforeLevel = getLevel(prevXp).level
        const afterLevel = getLevel(newXp).level
        if (afterLevel > beforeLevel) {
          play('levelup')
          toast({
            tone: 'xp',
            title: `Level Up! Lvl ${afterLevel}`,
            detail: getLevel(newXp).title,
          })
        }
      }

      setRunning(false)
      setResult({ success, amount, timeMs, nodes, xpEarned, failMessage })
    },
    [amount, celebrate, mode, play, store, toast],
  )

  const runJourney = useCallback(() => {
    if (running || overLimit) return
    clearTimers()
    const selectedMode = MODES.find((m) => m.id === mode)!
    const failIdx = selectedMode.failAt
      ? STATIONS.findIndex((s) => s.id === selectedMode.failAt)
      : -1

    setResult(null)
    setReceived(false)
    setFailedIndex(null)
    setActiveIndex(0)
    setMaxReached(0)
    setRunning(true)
    startedAt.current = Date.now()
    play('send')

    const stepMs = STEP_BASE_MS / selectedMode.speed
    const lastStep = failIdx >= 0 ? failIdx : STATIONS.length - 1

    for (let i = 1; i <= lastStep; i++) {
      const t = setTimeout(() => {
        setActiveIndex(i)
        setMaxReached((m) => Math.max(m, i))
        const st = STATIONS[i]
        if (failIdx >= 0 && i === failIdx) {
          setFailedIndex(i)
          play('error')
          toast({
            tone: 'error',
            title: st.label,
            detail: selectedMode.failMessage,
          })
        } else {
          play('step')
          toast({ tone: 'cyber', title: st.label, detail: st.statusMessage })
        }
      }, stepMs * i)
      timers.current.push(t)
    }

    const endT = setTimeout(
      () => {
        if (failIdx >= 0) {
          finish(false, failIdx, selectedMode.failMessage)
        } else {
          setActiveIndex(STATIONS.length - 1)
          finish(true, null)
        }
      },
      stepMs * (lastStep + 1),
    )
    timers.current.push(endT)
  }, [clearTimers, finish, mode, overLimit, play, running, toast])

  const reset = useCallback(() => {
    clearTimers()
    setRunning(false)
    setActiveIndex(-1)
    setMaxReached(-1)
    setFailedIndex(null)
    setReceived(false)
    setResult(null)
  }, [clearTimers])

  const onStationClick = useCallback(
    (s: Station) => {
      setDialogueStation(s)
      play('blip')
      if (!readNodes.current.has(s.id)) {
        readNodes.current.add(s.id)
        store.addXp(XP.readNode)
        toast({
          tone: 'xp',
          title: `+${XP.readNode} XP`,
          detail: `Studied ${s.label}`,
        })
      }
    },
    [play, store, toast],
  )

  const onCyberWin = useCallback(
    (scenarioId: string) => {
      store.recordCyberWin()
      store.addXp(XP.cyberChallenge)
      play('success')
      toast({
        tone: 'cyber',
        title: `Threat Blocked! +${XP.cyberChallenge} XP`,
        detail: 'The Cyber Guardian kept the payment safe.',
      })
      void scenarioId
    },
    [play, store, toast],
  )

  const startDemo = useCallback(() => {
    setTab('play')
    setMode('normal')
    setTimeout(() => runJourney(), 400)
  }, [runJourney])

  return (
    <div className="relative min-h-dvh overflow-hidden text-foreground">
      <ArcadeBackground />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="crt-glow font-pixel text-base uppercase leading-relaxed text-coin sm:text-2xl">
            UPI Quest
          </h1>
          <p className="mt-2 font-pixel text-[8px] uppercase tracking-wide text-arcade-cyan sm:text-[10px]">
            Follow Your Money Across India&apos;s Payment Rails
          </p>
        </div>

        <Hud onOpenMenu={() => setMenuOpen(true)} />

        {/* Tabs */}
        <nav className="flex flex-wrap items-center gap-2" aria-label="Game sections">
          <TabButton
            active={tab === 'play'}
            onClick={() => setTab('play')}
            icon={<PlayCircle className="h-3.5 w-3.5" />}
          >
            Play
          </TabButton>
          <TabButton
            active={tab === 'facts'}
            onClick={() => setTab('facts')}
            icon={<BookOpen className="h-3.5 w-3.5" />}
          >
            Facts
          </TabButton>
          <TabButton
            active={tab === 'security'}
            onClick={() => setTab('security')}
            icon={<Shield className="h-3.5 w-3.5" />}
          >
            Cyber
          </TabButton>

          {tab === 'play' && (
            <button
              onClick={() => store.setSettings({ xray: !store.settings.xray })}
              className="ml-auto flex items-center gap-1.5 border-2 border-arcade-cyan bg-background px-2.5 py-1.5 font-mono text-xs uppercase text-arcade-cyan transition-colors hover:bg-arcade-cyan/10"
              aria-pressed={store.settings.xray}
            >
              {store.settings.xray ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              X-Ray
            </button>
          )}
        </nav>

        {tab === 'play' && (
          <div className="flex flex-col gap-4">
            {/* Phones row */}
            <div className="grid gap-4 lg:grid-cols-2">
              <SenderPhone
                amount={amount}
                setAmount={setAmount}
                onSend={runJourney}
                running={running}
                overLimit={overLimit}
              />
              <ReceiverPhone received={received} amount={amount} />
            </div>

            {/* Controls */}
            <div className="grid gap-4 lg:grid-cols-2">
              <ModeSelector
                selected={mode}
                onSelect={setMode}
                disabled={running}
              />
              {store.settings.creatorMode ? (
                <ParticipantCustomizer
                  participants={store.participants}
                  onChange={store.setParticipants}
                  disabled={running}
                />
              ) : (
                <CreatorPrompt
                  onEnable={() => store.setSettings({ creatorMode: true })}
                />
              )}
            </div>

            {/* Journey map */}
            <JourneyMap
              activeIndex={activeIndex}
              maxReached={maxReached}
              failedIndex={failedIndex}
              running={running}
              xray={store.settings.xray}
              participants={store.participants}
              onStationClick={onStationClick}
            />

            <div className="flex flex-wrap justify-center gap-2">
              <PixelButton variant="ghost" onClick={reset} disabled={running}>
                Reset
              </PixelButton>
              <PixelButton
                variant="primary"
                onClick={runJourney}
                disabled={running || overLimit}
              >
                <PlayCircle className="h-4 w-4" />
                {running ? 'Routing...' : 'Send Payment'}
              </PixelButton>
            </div>

            <p className="text-center font-mono text-xs leading-relaxed text-muted-foreground">
              Tap any station to hear what it does and earn XP. Try the failure
              scenarios to see how UPI protects your money.
            </p>
          </div>
        )}

        {tab === 'facts' && (
          <div className="border-4 border-border bg-card p-4 shadow-[5px_5px_0_0_rgba(0,0,0,0.5)]">
            <FactsCollection />
          </div>
        )}

        {tab === 'security' && <SecurityChallenge onWin={onCyberWin} />}
      </main>

      {/* Overlays */}
      <DialogueBox
        station={dialogueStation}
        onClose={() => setDialogueStation(null)}
      />
      <ResultModal result={result} onClose={() => setResult(null)} />
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <WelcomeModal
        open={welcomeOpen}
        onStartDemo={startDemo}
        onClose={(dontShow) => {
          setWelcomeOpen(false)
          if (dontShow) store.setSettings({ welcomeDismissed: true })
        }}
      />
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 border-2 px-3 py-1.5 font-pixel text-[9px] uppercase transition-all ${
        active
          ? 'border-coin bg-coin/15 text-coin shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]'
          : 'border-border bg-background text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function CreatorPrompt({ onEnable }: { onEnable: () => void }) {
  return (
    <div className="flex flex-col items-start justify-center gap-2 border-4 border-dashed border-border bg-card/60 p-3">
      <p className="font-pixel text-[9px] uppercase text-arcade-magenta">
        Creator Mode
      </p>
      <p className="font-mono text-xs leading-relaxed text-muted-foreground">
        Swap the UPI app, aggregator and banks to see how your real payment
        setup is routed across the network.
      </p>
      <PixelButton variant="cyan" onClick={onEnable}>
        Enable Creator Mode
      </PixelButton>
    </div>
  )
}
