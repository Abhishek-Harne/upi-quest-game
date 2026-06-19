'use client'

import { useMemo, useState } from 'react'
import {
  DIFFICULTY_COLOR,
  DIFFICULTY_ORDER,
  FUN_FACTS,
  type FactDifficulty,
} from '@/lib/upi-facts'
import { useGameStore } from '@/lib/game-store'

export function FactsCollection() {
  const { stats } = useGameStore()
  const [filter, setFilter] = useState<FactDifficulty | 'all'>('all')

  const unlocked = useMemo(
    () => new Set(stats.factsUnlocked),
    [stats.factsUnlocked],
  )

  // Most recently unlocked facts surface first so discovery feels rewarding;
  // still-locked facts (in natural difficulty order) trail behind them.
  const visible = useMemo(() => {
    const byId = new Map(FUN_FACTS.map((f) => [f.id, f]))
    const unlockedNewestFirst = [...stats.factsUnlocked]
      .reverse()
      .map((id) => byId.get(id))
      .filter((f): f is (typeof FUN_FACTS)[number] => !!f)
    const unlockedIds = new Set(stats.factsUnlocked)
    const locked = FUN_FACTS.filter((f) => !unlockedIds.has(f.id))
    return [...unlockedNewestFirst, ...locked].filter(
      (f) => filter === 'all' || f.difficulty === filter,
    )
  }, [filter, stats.factsUnlocked])

  const total = FUN_FACTS.length
  const got = stats.factsUnlocked.length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Knowledge Codex
        </p>
        <p className="font-mono text-xs text-coin">
          {got}/{total} unlocked
        </p>
      </div>

      {/* progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-sm border border-border bg-background">
        <div
          className="h-full bg-coin transition-all"
          style={{ width: `${(got / total) * 100}%` }}
        />
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-1.5">
        {(['all', ...DIFFICULTY_ORDER] as const).map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
              filter === d
                ? 'border-coin bg-coin/20 text-coin'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="grid max-h-[50vh] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {visible.map((f) => {
          const isUnlocked = unlocked.has(f.id)
          return (
            <div
              key={f.id}
              className={`rounded-sm border-2 p-2 transition-colors ${
                isUnlocked
                  ? 'border-border bg-card'
                  : 'border-dashed border-border/50 bg-background/40'
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[9px] uppercase tracking-wide"
                  style={{ color: DIFFICULTY_COLOR[f.difficulty] }}
                >
                  {f.difficulty}
                </span>
                {!isUnlocked && (
                  <span className="font-mono text-[9px] uppercase text-muted-foreground">
                    Locked
                  </span>
                )}
              </div>
              {isUnlocked ? (
                <>
                  <p className="font-mono text-xs font-bold text-foreground">
                    {f.title}
                  </p>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground">
                    {f.fact}
                  </p>
                </>
              ) : (
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  {'??? Complete more transactions to unlock this fact.'}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
