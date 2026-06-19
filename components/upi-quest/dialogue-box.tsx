'use client'

import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Station } from '@/lib/upi-data'
import { StationArt } from './station-art'
import { PixelButton } from './pixel-button'

export function DialogueBox({
  station,
  onClose,
}: {
  station: Station | null
  onClose: () => void
}) {
  const [typed, setTyped] = useState('')

  // typewriter effect
  useEffect(() => {
    if (!station) return
    setTyped('')
    const full = station.dialogue
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(full.slice(0, i))
      if (i >= full.length) clearInterval(id)
    }, 18)
    return () => clearInterval(id)
  }, [station])

  return (
    <AnimatePresence>
      {station && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-label={`${station.label} dialogue`}
            initial={{ y: 30, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border-4 border-[var(--coin)] bg-popover p-4 shadow-[8px_8px_0_0_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-border bg-card">
                <StationArt kind={station.kind} pixel={5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-pixel text-[10px] uppercase text-[var(--coin)] crt-glow">
                    {station.label}
                  </p>
                  <button
                    onClick={onClose}
                    aria-label="Close dialogue"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs uppercase text-muted-foreground">
                  {station.tag}
                </p>
              </div>
            </div>

            <div className="mt-3 min-h-[72px] border-2 border-border bg-background p-3">
              <p className="text-base leading-snug text-foreground">
                {typed}
                <span
                  className="ml-0.5 inline-block h-3 w-2 translate-y-0.5 bg-[var(--coin)]"
                  style={{ animation: 'blink 0.8s steps(2) infinite' }}
                />
              </p>
            </div>

            <div className="mt-3 flex justify-end">
              <PixelButton variant="primary" onClick={onClose}>
                Got it
              </PixelButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
