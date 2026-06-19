'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface InfoTooltipProps {
  term: string
  definition: string
  accent?: string
  className?: string
  children: React.ReactNode
}

/**
 * Accessible tooltip that opens on hover/focus (desktop) and on tap (mobile).
 */
export function InfoTooltip({
  term,
  definition,
  accent = 'var(--arcade-cyan)',
  className,
  children,
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [open])

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`What is ${term}?`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex cursor-help items-center"
      >
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className="absolute bottom-[calc(100%+10px)] left-1/2 z-[60] w-56 -translate-x-1/2 border-4 bg-popover p-3 text-left shadow-[5px_5px_0_0_rgba(0,0,0,0.55)]"
            style={{ borderColor: accent }}
          >
            <p
              className="font-pixel text-[8px] uppercase leading-tight"
              style={{ color: accent }}
            >
              {term}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-popover-foreground">
              {definition}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
