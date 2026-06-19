'use client'

import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SECURITY_SCENARIOS, type SecurityScenario } from '@/lib/security-data'
import { PixelButton } from './pixel-button'

type Phase = 'idle' | 'attacking' | 'defending' | 'resolved'

export function SecurityChallenge({
  onWin,
}: {
  onWin: (scenarioId: string) => void
}) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const scenario: SecurityScenario = useMemo(
    () => SECURITY_SCENARIOS[index],
    [index],
  )

  const runDefense = useCallback(() => {
    setPhase('attacking')
    window.setTimeout(() => setPhase('defending'), 1100)
    window.setTimeout(() => {
      setPhase('resolved')
      onWin(scenario.id)
    }, 2200)
  }, [onWin, scenario.id])

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SECURITY_SCENARIOS.length)
    setPhase('idle')
  }, [])

  return (
    <div className="rounded-sm border-2 border-destructive/60 bg-card/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-destructive">
          <span className="inline-block h-2 w-2 animate-router-blink bg-destructive" />
          Cyber Security Challenge
        </h3>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          {index + 1}/{SECURITY_SCENARIOS.length}
        </span>
      </div>

      {/* Arena */}
      <div className="relative mb-3 flex items-center justify-between gap-2 overflow-hidden rounded-sm border border-border/60 bg-background/60 p-4">
        {/* Hacker */}
        <motion.div
          animate={
            phase === 'attacking'
              ? { x: [0, 12, 0], transition: { repeat: 2, duration: 0.4 } }
              : phase === 'defending' || phase === 'resolved'
                ? { x: -8, opacity: 0.4, filter: 'grayscale(1)' }
                : { x: 0 }
          }
          className="flex flex-col items-center gap-1"
          aria-hidden
        >
          <HackerSprite />
          <span className="font-mono text-[10px] uppercase text-destructive">
            Attacker
          </span>
        </motion.div>

        {/* Center: attack bolt / shield */}
        <div className="relative flex flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'attacking' && (
              <motion.div
                key="bolt"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 30, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs uppercase text-destructive"
              >
                {'>>> exploit >>>'}
              </motion.div>
            )}
            {(phase === 'defending' || phase === 'resolved') && (
              <motion.div
                key="shield"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="animate-packet-glow font-mono text-2xl text-arcade-cyan">
                  {'[#]'}
                </div>
                <span className="font-mono text-[10px] uppercase text-arcade-cyan">
                  BLOCKED
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guardian */}
        <motion.div
          animate={
            phase === 'defending' || phase === 'resolved'
              ? { scale: [1, 1.15, 1], transition: { duration: 0.5 } }
              : {}
          }
          className="flex flex-col items-center gap-1"
          aria-hidden
        >
          <GuardianSprite active={phase === 'defending' || phase === 'resolved'} />
          <span className="font-mono text-[10px] uppercase text-arcade-cyan">
            Guardian
          </span>
        </motion.div>
      </div>

      {/* Scenario text */}
      <div className="mb-3 space-y-2">
        <div className="rounded-sm border border-destructive/40 bg-destructive/10 p-2">
          <p className="font-mono text-xs font-bold uppercase tracking-wide text-destructive">
            {scenario.attack}
          </p>
          <p className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground">
            {scenario.attackDesc}
          </p>
        </div>

        <AnimatePresence>
          {(phase === 'defending' || phase === 'resolved') && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-sm border border-arcade-cyan/40 bg-arcade-cyan/10 p-2"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-wide text-arcade-cyan">
                {scenario.defense}
              </p>
              <p className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground">
                {scenario.defenseDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'resolved' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-sm border border-coin/50 bg-coin/10 p-2"
            >
              <p className="font-mono text-xs leading-relaxed text-coin-foreground">
                <span className="font-bold text-coin">Lesson: </span>
                {scenario.lesson}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2">
        {phase === 'idle' && (
          <PixelButton onClick={runDefense} variant="danger">
            Launch Attack
          </PixelButton>
        )}
        {phase === 'resolved' && (
          <PixelButton onClick={next} variant="cyan">
            Next Threat
          </PixelButton>
        )}
        {(phase === 'attacking' || phase === 'defending') && (
          <span className="font-mono text-xs uppercase text-muted-foreground">
            {phase === 'attacking' ? 'Under attack...' : 'Guardian responding...'}
          </span>
        )}
      </div>
    </div>
  )
}

function HackerSprite() {
  return (
    <div className="animate-[hacker-shake_0.6s_steps(2)_infinite] text-2xl leading-none text-destructive">
      <div className="font-mono">{'[X_X]'}</div>
    </div>
  )
}

function GuardianSprite({ active }: { active: boolean }) {
  return (
    <div
      className={`text-2xl leading-none ${active ? 'text-arcade-cyan' : 'text-muted-foreground'}`}
    >
      <div className="font-mono">{'[^_^]'}</div>
    </div>
  )
}
