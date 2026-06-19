'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PixelModalProps {
  open: boolean
  onClose?: () => void
  title?: string
  accent?: string
  /** Hide the close button (e.g. forced choices) */
  hideClose?: boolean
  /** Prevent closing on backdrop click */
  disableBackdropClose?: boolean
  className?: string
  children: React.ReactNode
}

export function PixelModal({
  open,
  onClose,
  title,
  accent = 'var(--coin)',
  hideClose,
  disableBackdropClose,
  className,
  children,
}: PixelModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableBackdropClose) onClose?.()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, disableBackdropClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close dialog"
            className="absolute inset-0 cursor-default bg-background/80 backdrop-blur-sm"
            onClick={() => !disableBackdropClose && onClose?.()}
            tabIndex={-1}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={cn(
              'relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto border-4 bg-card shadow-[8px_8px_0_0_rgba(0,0,0,0.6)]',
              className,
            )}
            style={{ borderColor: accent }}
          >
            {(title || !hideClose) && (
              <div
                className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-4 bg-card px-4 py-3"
                style={{ borderColor: accent }}
              >
                {title ? (
                  <h2
                    className="font-pixel text-[11px] uppercase leading-tight crt-glow sm:text-sm"
                    style={{ color: accent }}
                  >
                    {title}
                  </h2>
                ) : (
                  <span />
                )}
                {!hideClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="grid h-7 w-7 shrink-0 place-items-center border-2 border-border bg-secondary text-secondary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            <div className="p-4 sm:p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
