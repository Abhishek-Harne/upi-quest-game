'use client'

import { motion } from 'motion/react'
import { STATIONS } from '@/lib/upi-data'

export function XrayPanel({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="rounded-sm border-2 border-arcade-cyan/60 bg-card/80 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block h-2 w-2 animate-router-blink bg-arcade-cyan" />
        <h3 className="font-mono text-sm uppercase tracking-widest text-arcade-cyan">
          X-Ray: Technical Pipeline
        </h3>
      </div>
      <ol className="flex flex-col gap-1">
        {STATIONS.map((s, i) => {
          const reached = i <= activeIndex
          const active = i === activeIndex
          return (
            <li
              key={s.id}
              className={`flex items-start gap-2 rounded-sm border px-2 py-1.5 transition-colors ${
                active
                  ? 'border-coin/70 bg-coin/10'
                  : reached
                    ? 'border-arcade-cyan/30 bg-arcade-cyan/5'
                    : 'border-border/40 opacity-50'
              }`}
            >
              <span
                className={`mt-0.5 font-mono text-xs ${
                  reached ? 'text-coin' : 'text-muted-foreground'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wide text-foreground">
                    {s.xray.phase}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    @ {s.label}
                  </span>
                </div>
                {active && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground"
                  >
                    {s.xray.detail}
                  </motion.p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
