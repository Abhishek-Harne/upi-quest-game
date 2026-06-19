'use client'

import { Lightbulb, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import type { FunFact } from '@/lib/upi-data'

export function FactCard({
  fact,
  collected,
  isNew,
}: {
  fact: FunFact
  collected: boolean
  isNew?: boolean
}) {
  return (
    <motion.div
      initial={isNew ? { rotateY: 90, opacity: 0 } : false}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative border-4 p-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] ${
        collected
          ? 'border-[var(--arcade-magenta)] bg-card'
          : 'border-dashed border-border bg-background/40'
      }`}
    >
      <div className="flex items-center gap-2">
        {collected ? (
          <Sparkles className="h-3.5 w-3.5 text-[var(--arcade-magenta)]" />
        ) : (
          <Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <p
          className={`font-pixel text-[8px] uppercase ${
            collected ? 'text-[var(--arcade-magenta)]' : 'text-muted-foreground'
          }`}
        >
          {collected ? fact.title : '???'}
        </p>
      </div>
      <p className="mt-2 text-sm leading-snug text-foreground">
        {collected ? fact.body : 'Hidden fact \u2014 keep playing to discover it.'}
      </p>
      {isNew && collected && (
        <span className="absolute -right-2 -top-3 border-2 border-background bg-[var(--coin)] px-1 py-0.5 font-pixel text-[7px] uppercase text-[oklch(0.2_0.08_280)]">
          New!
        </span>
      )}
    </motion.div>
  )
}
