'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Award, CheckCircle2, Shield, Sparkles, XCircle } from 'lucide-react'

export type ToastTone = 'success' | 'error' | 'xp' | 'fact' | 'cyber'

export interface ToastItem {
  id: number
  tone: ToastTone
  title: string
  detail?: string
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TONE: Record<
  ToastTone,
  { color: string; Icon: typeof CheckCircle2 }
> = {
  success: { color: 'var(--chart-4)', Icon: CheckCircle2 },
  error: { color: 'var(--destructive)', Icon: XCircle },
  xp: { color: 'var(--coin)', Icon: Sparkles },
  fact: { color: 'var(--arcade-magenta)', Icon: Award },
  cyber: { color: 'var(--arcade-cyan)', Icon: Shield },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const toast = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = ++idRef.current
    setItems((prev) => [...prev, { ...t, id }].slice(-4))
    setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id))
    }, 4200)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2 px-3 sm:right-3 sm:left-auto sm:items-end">
        <AnimatePresence>
          {items.map((item) => {
            const { color, Icon } = TONE[item.tone]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 40, y: -8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 border-4 bg-popover p-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.55)]"
                style={{ borderColor: color }}
              >
                <Icon
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p
                    className="font-pixel text-[9px] uppercase leading-tight"
                    style={{ color }}
                  >
                    {item.title}
                  </p>
                  {item.detail && (
                    <p className="mt-1 text-sm leading-snug text-popover-foreground">
                      {item.detail}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
