'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  DEFAULT_PARTICIPANTS,
  getLevel,
  type ModeId,
  type Participants,
  type TransactionType,
} from './upi-data'
import { DIFFICULTY_ORDER, FUN_FACTS } from './upi-facts'

export type TextSize = 'sm' | 'md' | 'lg' | 'xl'
export type ThemeMode = 'dark' | 'light'

export interface GameStats {
  transactions: number
  totalSent: number
  xp: number
  factsUnlocked: string[]
  scenariosTried: ModeId[]
  cyberWins: number
  timeSpentMs: number
  switchedTransactionTypes: TransactionType[]
  completedTransactionTypes: TransactionType[]
}

export interface GameSettings {
  theme: ThemeMode
  textSize: TextSize
  sound: boolean
  creatorMode: boolean
  xray: boolean
  welcomeDismissed: boolean
}

interface PersistShape {
  stats: GameStats
  settings: GameSettings
  participants: Participants
}

const STORAGE_KEY = 'upi-quest-v2'

const DEFAULT_STATS: GameStats = {
  transactions: 0,
  totalSent: 0,
  xp: 0,
  factsUnlocked: [],
  scenariosTried: [],
  cyberWins: 0,
  timeSpentMs: 0,
  switchedTransactionTypes: [],
  completedTransactionTypes: [],
}

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'dark',
  textSize: 'md',
  sound: true,
  creatorMode: false,
  xray: false,
  welcomeDismissed: false,
}

interface GameStoreValue {
  stats: GameStats
  settings: GameSettings
  participants: Participants
  hydrated: boolean
  level: ReturnType<typeof getLevel>
  addXp: (amount: number) => number
  recordTransaction: (amount: number) => void
  markScenarioTried: (id: ModeId) => boolean
  recordCyberWin: () => void
  unlockRandomFact: () => string | null
  markTransactionTypeSwitched: (type: TransactionType) => boolean
  markTransactionTypeCompleted: (type: TransactionType) => boolean
  setSettings: (patch: Partial<GameSettings>) => void
  setParticipants: (patch: Partial<Participants>) => void
  resetProgress: () => void
}

const GameStoreContext = createContext<GameStoreValue | null>(null)

export function GameStoreProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS)
  const [settings, setSettingsState] = useState<GameSettings>(DEFAULT_SETTINGS)
  const [participants, setParticipantsState] =
    useState<Participants>(DEFAULT_PARTICIPANTS)
  const [hydrated, setHydrated] = useState(false)

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistShape>
        if (parsed.stats) setStats({ ...DEFAULT_STATS, ...parsed.stats })
        if (parsed.settings)
          setSettingsState({ ...DEFAULT_SETTINGS, ...parsed.settings })
        if (parsed.participants)
          setParticipantsState({
            ...DEFAULT_PARTICIPANTS,
            ...parsed.participants,
          })
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true)
  }, [])

  // persist whenever data changes (after hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      const payload: PersistShape = { stats, settings, participants }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* ignore quota errors */
    }
  }, [stats, settings, participants, hydrated])

  // apply theme + text size to <html>
  useEffect(() => {
    if (!hydrated) return
    const el = document.documentElement
    el.classList.toggle('dark', settings.theme === 'dark')
    el.classList.toggle('light', settings.theme === 'light')
    el.dataset.textSize = settings.textSize
  }, [settings.theme, settings.textSize, hydrated])

  // accumulate time spent learning
  const lastTick = useRef(Date.now())
  useEffect(() => {
    if (!hydrated) return
    lastTick.current = Date.now()
    const id = setInterval(() => {
      const now = Date.now()
      const delta = now - lastTick.current
      lastTick.current = now
      // ignore long gaps (tab hidden) over 10s
      if (delta < 10000 && !document.hidden) {
        setStats((s) => ({ ...s, timeSpentMs: s.timeSpentMs + delta }))
      }
    }, 5000)
    return () => clearInterval(id)
  }, [hydrated])

  const addXp = useCallback((amount: number) => {
    let newXp = 0
    setStats((s) => {
      newXp = s.xp + amount
      return { ...s, xp: newXp }
    })
    return newXp
  }, [])

  const recordTransaction = useCallback((amount: number) => {
    setStats((s) => ({
      ...s,
      transactions: s.transactions + 1,
      totalSent: s.totalSent + amount,
    }))
  }, [])

  const markScenarioTried = useCallback((id: ModeId) => {
    let isNew = false
    setStats((s) => {
      if (s.scenariosTried.includes(id)) return s
      isNew = true
      return { ...s, scenariosTried: [...s.scenariosTried, id] }
    })
    return isNew
  }, [])

  const recordCyberWin = useCallback(() => {
    setStats((s) => ({ ...s, cyberWins: s.cyberWins + 1 }))
  }, [])

  // Facts unlock progressively: every Beginner fact before any Intermediate
  // fact unlocks, every Intermediate before any Advanced, and so on.
  const unlockRandomFact = useCallback((): string | null => {
    let unlockedId: string | null = null
    setStats((s) => {
      const unlockedSet = new Set(s.factsUnlocked)
      for (const tier of DIFFICULTY_ORDER) {
        const remainingInTier = FUN_FACTS.filter(
          (f) => f.difficulty === tier && !unlockedSet.has(f.id),
        )
        if (remainingInTier.length === 0) continue
        const pick =
          remainingInTier[Math.floor(Math.random() * remainingInTier.length)]
        unlockedId = pick.id
        return { ...s, factsUnlocked: [...s.factsUnlocked, pick.id] }
      }
      return s
    })
    return unlockedId
  }, [])

  const markTransactionTypeSwitched = useCallback((type: TransactionType) => {
    let isNew = false
    setStats((s) => {
      if (s.switchedTransactionTypes.includes(type)) return s
      isNew = true
      return {
        ...s,
        switchedTransactionTypes: [...s.switchedTransactionTypes, type],
      }
    })
    return isNew
  }, [])

  const markTransactionTypeCompleted = useCallback((type: TransactionType) => {
    let isNew = false
    setStats((s) => {
      if (s.completedTransactionTypes.includes(type)) return s
      isNew = true
      return {
        ...s,
        completedTransactionTypes: [...s.completedTransactionTypes, type],
      }
    })
    return isNew
  }, [])

  const setSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettingsState((s) => ({ ...s, ...patch }))
  }, [])

  const setParticipants = useCallback((patch: Partial<Participants>) => {
    setParticipantsState((p) => ({ ...p, ...patch }))
  }, [])

  const resetProgress = useCallback(() => {
    setStats(DEFAULT_STATS)
  }, [])

  const level = useMemo(() => getLevel(stats.xp), [stats.xp])

  const value: GameStoreValue = {
    stats,
    settings,
    participants,
    hydrated,
    level,
    addXp,
    recordTransaction,
    markScenarioTried,
    recordCyberWin,
    unlockRandomFact,
    markTransactionTypeSwitched,
    markTransactionTypeCompleted,
    setSettings,
    setParticipants,
    resetProgress,
  }

  return (
    <GameStoreContext.Provider value={value}>
      {children}
    </GameStoreContext.Provider>
  )
}

export function useGameStore(): GameStoreValue {
  const ctx = useContext(GameStoreContext)
  if (!ctx)
    throw new Error('useGameStore must be used within a GameStoreProvider')
  return ctx
}
