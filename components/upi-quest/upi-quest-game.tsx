'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'motion/react'
import {
  BookOpen,
  ChevronDown,
  Eye,
  EyeOff,
  Moon,
  PlayCircle,
  ShieldAlert,
  Sparkles,
  Sun,
  Type,
} from 'lucide-react'
import {
  MODES,
  TRANSACTION_TYPES,
  UPI_MAX_AMOUNT,
  XP,
  getLevel,
  formatINR,
  stationsForType,
  type ModeId,
  type ParticipantSlot,
  type Station,
  type TransactionType,
} from '@/lib/upi-data'
import { FUN_FACTS, type FunFact } from '@/lib/upi-facts'
import { SECURITY_SCENARIOS } from '@/lib/security-data'
import { GameStoreProvider, useGameStore, type TextSize } from '@/lib/game-store'
import { useArcadeSound } from '@/lib/use-arcade-sound'
import { ArcadeBackground } from './arcade-background'
import { Hud } from './hud'
import { SenderPhone } from './sender-phone'
import { ReceiverPhone } from './receiver-phone'
import { JourneyMap, type AttackPhase } from './journey-map'
import { ModeSelector } from './mode-selector'
import { DialogueBox } from './dialogue-box'
import { ResultModal, type ResultData } from './result-modal'
import { WelcomeModal } from './welcome-modal'
import { FactsCollection } from './facts-collection'
import { BurgerMenu } from './burger-menu'
import { PixelButton } from './pixel-button'
import { ToastProvider, useToast } from './toast-provider'

const STEP_BASE_MS = 850
const TEXT_SIZES: TextSize[] = ['sm', 'md', 'lg', 'xl']

export function UpiQuestGame() {
  return (
    <GameStoreProvider>
      <ToastProvider>
        <GameInner />
      </ToastProvider>
    </GameStoreProvider>
  )
}

function GameInner() {
  const store = useGameStore()
  const { toast } = useToast()
  const play = useArcadeSound(store.settings.sound)

  const [amount, setAmount] = useState(500)
  const [mode, setMode] = useState<ModeId>('normal')
  const [transactionType, setTransactionType] = useState<TransactionType>('personal')

  const stations = stationsForType(transactionType)
  const INTERNET_INDEX = stations.findIndex((s) => s.id === 'internet')

  const [activeIndex, setActiveIndex] = useState(-1)
  const [maxReached, setMaxReached] = useState(-1)
  const [failedIndex, setFailedIndex] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [received, setReceived] = useState(false)

  const [attackPhase, setAttackPhase] = useState<AttackPhase>('none')
  const [attackPhaseMs, setAttackPhaseMs] = useState(1500)
  const [attackScenario, setAttackScenario] = useState<
    (typeof SECURITY_SCENARIOS)[number] | null
  >(null)
  const [statusLine, setStatusLine] = useState<string | null>(null)

  const [dialogueStation, setDialogueStation] = useState<Station | null>(null)
  const [result, setResult] = useState<ResultData | null>(null)
  const [lastFact, setLastFact] = useState<FunFact | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(false)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const startedAt = useRef(0)
  const readNodes = useRef<Set<string>>(new Set())
  const scenarioIdx = useRef(0)

  const overLimit = amount > UPI_MAX_AMOUNT

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
      const nodes = success ? stations.length : (failIdx ?? 0)
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
          if (f) {
            setLastFact(f)
            toast({
              tone: 'fact',
              title: `Fact Unlocked: ${f.title}`,
              detail: f.fact,
            })
          }
        }
        toast({
          tone: 'success',
          title: 'Transaction Complete',
          detail: `${formatINR(amount)} delivered across all ${stations.length} stations`,
        })

        const isFirstOfType = store.markTransactionTypeCompleted(transactionType)
        if (isFirstOfType) {
          const bonusXp =
            transactionType === 'personal'
              ? XP.firstPersonalPayment
              : XP.firstBusinessPayment
          xpEarned += bonusXp
          toast({
            tone: 'xp',
            title: `First ${transactionType === 'personal' ? 'Personal' : 'Business'} Payment: +${bonusXp} XP`,
            detail:
              transactionType === 'personal'
                ? 'You completed your first person-to-person UPI payment.'
                : 'You completed your first merchant UPI payment.',
          })
        }
      } else {
        play('error')
        toast({
          tone: 'error',
          title: 'Transaction Failed',
          detail: failMessage,
        })
      }

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
    [amount, celebrate, mode, play, stations.length, store, toast, transactionType],
  )

  // Arcade-style cyber heist: an ~20s beat-by-beat sequence that fully halts
  // the transaction (no station-advance timers run during this window) so
  // the interruption feels meaningful rather than cosmetic. `onResume` is
  // called once the network is restored, letting the journey continue from
  // exactly where it paused.
  const triggerAttack = useCallback(
    (onResume: () => void) => {
      const scenario =
        SECURITY_SCENARIOS[scenarioIdx.current % SECURITY_SCENARIOS.length]
      scenarioIdx.current += 1
      setAttackScenario(scenario)

      const beats: Array<{ phase: AttackPhase; ms: number; onStart?: () => void }> = [
        { phase: 'warning', ms: 2200, onStart: () => play('alarm') },
        { phase: 'thief', ms: 4000, onStart: () => play('error') },
        { phase: 'narration', ms: 7000 },
        { phase: 'siren', ms: 2200, onStart: () => play('siren') },
        { phase: 'guardian', ms: 4400, onStart: () => play('success') },
        { phase: 'recovery', ms: 5000, onStart: () => play('coin') },
      ]

      let elapsed = 0
      beats.forEach((beat) => {
        timers.current.push(
          setTimeout(() => {
            setAttackPhase(beat.phase)
            setAttackPhaseMs(beat.ms)
            beat.onStart?.()
          }, elapsed),
        )
        elapsed += beat.ms
      })

      timers.current.push(
        setTimeout(() => {
          setAttackPhase('none')
          setAttackScenario(null)
          store.recordCyberWin()
          store.addXp(XP.cyberChallenge)
          toast({
            tone: 'cyber',
            title: `Threat Neutralized: ${scenario.defense}`,
            detail: scenario.lesson,
          })
          onResume()
        }, elapsed),
      )
    },
    [play, store, toast],
  )

  const runJourney = useCallback(
    (heist = false) => {
      if (running || overLimit) return
      clearTimers()
      const selectedMode = MODES.find((m) => m.id === mode)!
      const failIdx = selectedMode.failAt
        ? stations.findIndex((s) => s.id === selectedMode.failAt)
        : -1

      setResult(null)
      setReceived(false)
      setFailedIndex(null)
      setAttackPhase('none')
      setStatusLine(stations[0].statusMessage)
      setActiveIndex(0)
      setMaxReached(0)
      setRunning(true)
      startedAt.current = Date.now()
      play('send')

      const stepMs = STEP_BASE_MS / selectedMode.speed
      const lastStep = failIdx >= 0 ? failIdx : stations.length - 1
      const reachesInternet = failIdx < 0 || failIdx > INTERNET_INDEX
      const heistAtInternet = heist && reachesInternet

      // Step the packet one station at a time. Each step schedules the next
      // one itself, so a cyber heist can fully pause the chain (instead of
      // racing against pre-scheduled timers) and resume it exactly where it
      // left off.
      const step = (i: number) => {
        if (i > lastStep) {
          if (failIdx >= 0) {
            finish(false, failIdx, selectedMode.failMessage)
          } else {
            setActiveIndex(stations.length - 1)
            setStatusLine(stations[stations.length - 1].statusMessage)
            finish(true, null)
          }
          return
        }

        const t = setTimeout(() => {
          setActiveIndex(i)
          setMaxReached((m) => Math.max(m, i))
          const st = stations[i]
          if (failIdx >= 0 && i === failIdx) {
            setFailedIndex(i)
            play('error')
            setStatusLine(selectedMode.failMessage ?? st.statusMessage)
          } else {
            play('step')
            setStatusLine(st.statusMessage)
          }

          if (heistAtInternet && i === INTERNET_INDEX) {
            triggerAttack(() => step(i + 1))
          } else {
            step(i + 1)
          }
        }, i === 0 ? 0 : stepMs)
        timers.current.push(t)
      }

      step(1)
    },
    [
      INTERNET_INDEX,
      clearTimers,
      finish,
      mode,
      overLimit,
      play,
      running,
      stations,
      triggerAttack,
    ],
  )

  const reset = useCallback(() => {
    clearTimers()
    setRunning(false)
    setActiveIndex(-1)
    setMaxReached(-1)
    setFailedIndex(null)
    setReceived(false)
    setResult(null)
    setAttackPhase('none')
    setStatusLine(null)
  }, [clearTimers])

  const onStationClick = useCallback(
    (s: Station) => {
      setDialogueStation(s)
      play('blip')
      if (!readNodes.current.has(s.id)) {
        readNodes.current.add(s.id)
        const bonus = s.id === 'aggregator' ? XP.viewAggregator : XP.readNode
        store.addXp(bonus)
        toast({
          tone: 'xp',
          title: `+${bonus} XP`,
          detail: `Studied ${s.label}`,
        })
      }
    },
    [play, store, toast],
  )

  const onSelectProvider = useCallback(
    (slot: ParticipantSlot, id: string) => {
      if (!slot) return
      store.setParticipants({ [slot]: id })
      play('blip')
    },
    [play, store],
  )

  const startDemo = useCallback(() => {
    setMode('normal')
    setTimeout(() => runJourney(), 400)
  }, [runJourney])

  const hasSwitchedModeBefore = useRef(false)

  const onSelectTransactionType = useCallback(
    (type: TransactionType) => {
      if (running || type === transactionType) return
      reset()
      setTransactionType(type)
      play('blip')

      const info = TRANSACTION_TYPES.find((t) => t.id === type)!
      const isNewType = store.markTransactionTypeSwitched(type)

      let xpEarned = 0
      if (isNewType) {
        toast({
          tone: 'fact',
          title: `${info.icon} ${info.label}`,
          detail:
            type === 'personal'
              ? 'Used when sending money directly to another person. Examples: Friends, Family, Roommates. No payment aggregator is involved.'
              : 'Used when paying a business or merchant. Examples: QR payments, Ecommerce, Food delivery, Subscriptions. Payment aggregators may help merchants collect and manage payments.',
        })
      }
      if (!hasSwitchedModeBefore.current) {
        hasSwitchedModeBefore.current = true
        xpEarned += XP.firstModeSwitch
        toast({
          tone: 'xp',
          title: `+${XP.firstModeSwitch} XP`,
          detail: 'Switched transaction modes for the first time',
        })
      }
      if (xpEarned > 0) {
        store.addXp(xpEarned)
        play('coin')
      }
    },
    [play, reset, running, store, toast, transactionType],
  )

  return (
    <div className="relative min-h-dvh overflow-hidden text-foreground">
      <ArcadeBackground />

      {/* Always-visible quick theme + text-size toggles, independent of the burger menu */}
      <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2">
        <button
          onClick={() => {
            const idx = TEXT_SIZES.indexOf(store.settings.textSize)
            const next = TEXT_SIZES[(idx + 1) % TEXT_SIZES.length]
            store.setSettings({ textSize: next })
          }}
          aria-label="Cycle text size"
          title={`Text size: ${store.settings.textSize.toUpperCase()}`}
          className="flex h-11 w-11 items-center justify-center border-2 border-arcade-cyan bg-card text-arcade-cyan shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] transition-all hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]"
        >
          <Type className="h-5 w-5" />
        </button>
        <button
          onClick={() =>
            store.setSettings({
              theme: store.settings.theme === 'dark' ? 'light' : 'dark',
            })
          }
          aria-label="Toggle theme"
          className="flex h-11 w-11 items-center justify-center border-2 border-coin bg-card text-coin shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] transition-all hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]"
        >
          {store.settings.theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-3 px-3 py-3 sm:px-5 sm:py-4">
        {/* Compact title */}
        <div className="text-center">
          <h1 className="crt-glow font-pixel text-sm uppercase leading-relaxed text-coin sm:text-xl">
            UPI Quest
          </h1>
          <p className="mt-1 font-pixel text-[7px] uppercase tracking-wide text-arcade-cyan sm:text-[9px]">
            Follow Your Money Across India&apos;s Payment Rails
          </p>
        </div>

        <Hud onOpenMenu={() => setMenuOpen(true)} />

        {/* Transaction Type Selector: switches the whole infra map between
            Personal (P2P, no aggregator) and Business (P2M, via aggregator). */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-pixel text-[7px] uppercase text-muted-foreground">
            Transaction Type
          </span>
          <div className="flex gap-2">
            {TRANSACTION_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTransactionType(t.id)}
                disabled={running}
                aria-pressed={transactionType === t.id}
                className={`flex items-center gap-1.5 border-2 px-3 py-1.5 font-mono text-xs uppercase transition-colors disabled:opacity-50 ${
                  transactionType === t.id
                    ? 'border-coin bg-coin/10 text-coin'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
          <p className="max-w-md text-center font-mono text-[11px] leading-relaxed text-muted-foreground">
            {TRANSACTION_TYPES.find((t) => t.id === transactionType)?.educationalMessage}
          </p>
        </div>

        {/* Transaction stage: payer phone -> infrastructure -> payee phone.
            This is the dominant, above-the-fold centerpiece. */}
        <JourneyMap
          stations={stations}
          transactionType={transactionType}
          activeIndex={activeIndex}
          maxReached={maxReached}
          failedIndex={failedIndex}
          running={running}
          xray={store.settings.xray}
          canCustomize={!running}
          participants={store.participants}
          attackPhase={attackPhase}
          attackPhaseMs={attackPhaseMs}
          attackScenario={attackScenario}
          statusLine={statusLine}
          onStationClick={onStationClick}
          onSelectProvider={onSelectProvider}
          senderPhone={
            <SenderPhone
              amount={amount}
              setAmount={setAmount}
              onSend={() => runJourney(false)}
              running={running}
              overLimit={overLimit}
              compact
            />
          }
          receiverPhone={
            <ReceiverPhone received={received} amount={amount} compact />
          }
        />

        {/* Primary actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <PixelButton variant="ghost" onClick={reset} disabled={running}>
            Reset
          </PixelButton>
          <PixelButton
            variant="primary"
            onClick={() => runJourney(false)}
            disabled={running || overLimit}
          >
            <PlayCircle className="h-4 w-4" />
            {running ? 'Routing...' : 'Send Payment'}
          </PixelButton>
          <PixelButton
            variant="danger"
            onClick={() => runJourney(true)}
            disabled={running || overLimit}
          >
            <ShieldAlert className="h-4 w-4" />
            Let&apos;s Steal Some Money
          </PixelButton>
          <ToggleChip
            active={store.settings.xray}
            onClick={() => store.setSettings({ xray: !store.settings.xray })}
            activeClass="border-arcade-cyan bg-arcade-cyan/10 text-arcade-cyan"
            icon={
              store.settings.xray ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )
            }
          >
            X-Ray Mode
          </ToggleChip>
        </div>

        {/* Scenario selector (secondary) */}
        <ModeSelector selected={mode} onSelect={setMode} disabled={running} />

        {/* Inline discovery reveal */}
        {lastFact && (
          <div className="flex items-start gap-2 border-2 border-coin/60 bg-coin/10 p-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-coin" />
            <div>
              <p className="font-pixel text-[8px] uppercase text-coin">
                Latest Discovery &mdash; {lastFact.title}
              </p>
              <p className="mt-1 font-mono text-xs leading-relaxed text-card-foreground">
                {lastFact.fact}
              </p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {lastFact.why}
              </p>
            </div>
          </div>
        )}

        {/* Knowledge Codex, surfaced on the main screen */}
        <MainCodex />

        <p className="text-center font-mono text-xs leading-relaxed text-muted-foreground">
          Tap any station to learn what it does and earn XP. Tap a provider chip
          to swap your UPI app, aggregator or banks. Hit &quot;Let&apos;s Steal
          Some Money&quot; to watch the Cyber Police defend your cash in transit.
        </p>
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

function MainCodex() {
  const { stats } = useGameStore()
  const [open, setOpen] = useState(false)
  const got = stats.factsUnlocked.length
  const total = FUN_FACTS.length

  return (
    <section className="border-4 border-coin/60 bg-card shadow-[5px_5px_0_0_rgba(0,0,0,0.5)]">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3 py-3 text-left"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-coin bg-coin/15 text-coin">
          <BookOpen className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-pixel text-[9px] uppercase text-coin">
            Knowledge Codex
          </span>
          <span className="mt-1 block h-2 w-full max-w-xs overflow-hidden border border-border bg-background">
            <span
              className="block h-full bg-coin transition-all"
              style={{ width: `${(got / total) * 100}%` }}
            />
          </span>
        </span>
        <span className="shrink-0 font-mono text-xs text-coin">
          {got}/{total}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t-2 border-border p-3">
              <FactsCollection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ToggleChip({
  active,
  onClick,
  icon,
  activeClass,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  activeClass: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 border-2 px-3 py-1.5 font-mono text-xs uppercase transition-colors ${
        active
          ? activeClass
          : 'border-border bg-background text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}
