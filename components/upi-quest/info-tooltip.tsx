'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface InfoTooltipProps {
  term: string
  definition: string
  fullForm?: string
  analogy?: string
  accent?: string
  className?: string
  children: React.ReactNode
}

interface Coords {
  top: number
  left: number
  placement: 'top' | 'bottom'
}

const TOOLTIP_WIDTH = 288 // w-72, wide enough to avoid clipping full-form + analogy

/**
 * Accessible tooltip that opens on hover/focus (desktop) and on tap (mobile).
 * Renders into a portal with viewport-aware positioning so it is never clipped
 * by overflow containers, and flips above/below depending on available space.
 */
export function InfoTooltip({
  term,
  definition,
  fullForm,
  analogy,
  accent = 'var(--arcade-cyan)',
  className,
  children,
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState<Coords | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  const computePosition = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const spaceAbove = rect.top
    const placement: 'top' | 'bottom' = spaceAbove < 150 ? 'bottom' : 'top'
    const centerX = rect.left + rect.width / 2
    const half = TOOLTIP_WIDTH / 2
    const left = Math.min(
      Math.max(centerX, half + 8),
      window.innerWidth - half - 8,
    )
    const top =
      placement === 'top' ? rect.top - 10 : rect.bottom + 10
    setCoords({ top, left, placement })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    computePosition()
    const onScroll = () => computePosition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, computePosition])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: PointerEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onDocClick)
    return () => document.removeEventListener('pointerdown', onDocClick)
  }, [open])

  return (
    <div
      ref={triggerRef}
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
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && coords && (
              <motion.div
                role="tooltip"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className="pointer-events-none fixed z-[200] w-72 border-4 bg-popover p-3 text-left shadow-[5px_5px_0_0_rgba(0,0,0,0.55)]"
                style={{
                  top: coords.top,
                  left: coords.left,
                  transform: `translate(-50%, ${
                    coords.placement === 'top' ? '-100%' : '0'
                  })`,
                  borderColor: accent,
                }}
              >
                <p
                  className="font-pixel text-[8px] uppercase leading-tight"
                  style={{ color: accent }}
                >
                  {term}
                </p>
                {fullForm && (
                  <p className="mt-1 text-xs font-semibold leading-snug text-popover-foreground">
                    {fullForm}
                  </p>
                )}
                <p className="mt-1.5 text-xs leading-relaxed text-popover-foreground">
                  {definition}
                </p>
                {analogy && (
                  <p
                    className="mt-1.5 border-t border-border pt-1.5 text-[11px] italic leading-relaxed text-muted-foreground"
                  >
                    {analogy}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
