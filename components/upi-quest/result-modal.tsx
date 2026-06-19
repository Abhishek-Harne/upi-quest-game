'use client'

import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { STATIONS, formatINR } from '@/lib/upi-data'
import { PixelButton } from './pixel-button'

export interface ResultData {
  success: boolean
  amount: number
  timeMs: number
  nodes: number
  xpEarned: number
  failMessage?: string
}

export function ResultModal({
  result,
  onClose,
}: {
  result: ResultData | null
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-label="Transaction result"
            initial={{ scale: 0.85, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm border-4 bg-popover p-5 text-center shadow-[8px_8px_0_0_rgba(0,0,0,0.6)] ${
              result.success ? 'border-[var(--primary)]' : 'border-destructive'
            }`}
          >
            <motion.div
              animate={{ scale: [0.6, 1.15, 1] }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center"
            >
              {result.success ? (
                <CheckCircle2 className="h-14 w-14 text-[var(--primary)]" />
              ) : (
                <XCircle className="h-14 w-14 text-destructive" />
              )}
            </motion.div>

            <p
              className={`font-pixel text-sm uppercase crt-glow ${
                result.success ? 'text-[var(--primary)]' : 'text-destructive'
              }`}
            >
              {result.success ? 'Transaction Complete' : 'Transaction Failed'}
            </p>

            {result.success ? (
              <p className="mt-2 text-base text-foreground">
                {formatINR(result.amount)} received successfully
              </p>
            ) : (
              <p className="mt-2 text-base text-destructive">
                {result.failMessage}
              </p>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Stat label="Time" value={`${(result.timeMs / 1000).toFixed(1)}s`} />
              <Stat label="Nodes" value={`${result.nodes}/${STATIONS.length}`} />
              <Stat
                label="XP"
                value={result.xpEarned > 0 ? `+${result.xpEarned}` : '0'}
              />
            </div>

            <div className="mt-5">
              <PixelButton
                variant={result.success ? 'primary' : 'ghost'}
                className="w-full py-3"
                onClick={onClose}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Play Again
              </PixelButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-border bg-background p-2">
      <p className="text-[11px] uppercase text-muted-foreground">{label}</p>
      <p className="font-pixel text-[10px] text-foreground">{value}</p>
    </div>
  )
}
