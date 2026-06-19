'use client'

import { Minus, Plus, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { UPI_MAX_AMOUNT, formatINR } from '@/lib/upi-data'
import { cn } from '@/lib/utils'
import { PixelButton } from './pixel-button'

export function SenderPhone({
  amount,
  setAmount,
  onSend,
  running,
  overLimit,
}: {
  amount: number
  setAmount: (n: number) => void
  onSend: () => void
  running: boolean
  overLimit: boolean
}) {
  function bump(delta: number) {
    setAmount(Math.max(1, amount + delta))
  }

  return (
    <div className="mx-auto w-full max-w-[280px]">
      {/* phone body */}
      <div className="relative border-4 border-[var(--arcade-cyan)] bg-card p-3 shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]">
        {/* speaker notch */}
        <div className="mx-auto mb-2 h-1.5 w-12 bg-border" />

        <div className="scanlines relative border-2 border-border bg-background p-3">
          <p className="font-pixel text-[8px] uppercase text-[var(--arcade-cyan)]">
            Send Money
          </p>
          <p className="mt-1 text-sm text-muted-foreground">To: rahul@okbank</p>

          {/* amount display */}
          <div className="my-3 flex flex-col items-center">
            <span className="text-xs uppercase text-muted-foreground">Amount</span>
            <motion.span
              key={amount}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={cn(
                'font-pixel text-2xl leading-none crt-glow',
                overLimit ? 'text-destructive' : 'text-primary',
              )}
            >
              {formatINR(amount)}
            </motion.span>
          </div>

          {/* +/- and field */}
          <div className="flex items-center justify-center gap-2">
            <PixelButton
              variant="ghost"
              className="px-2 py-2"
              onClick={() => bump(-100)}
              disabled={running}
              aria-label="Decrease amount by 100"
            >
              <Minus className="h-3 w-3" />
            </PixelButton>
            <input
              type="number"
              value={amount}
              min={1}
              disabled={running}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-24 border-2 border-border bg-card px-2 py-2 text-center text-lg text-foreground outline-none focus:border-[var(--arcade-cyan)] disabled:opacity-60"
              aria-label="Transfer amount in rupees"
            />
            <PixelButton
              variant="ghost"
              className="px-2 py-2"
              onClick={() => bump(100)}
              disabled={running}
              aria-label="Increase amount by 100"
            >
              <Plus className="h-3 w-3" />
            </PixelButton>
          </div>

          {/* slider */}
          <input
            type="range"
            min={1}
            max={UPI_MAX_AMOUNT}
            step={100}
            value={Math.min(amount, UPI_MAX_AMOUNT)}
            disabled={running}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--arcade-cyan)]"
            aria-label="Amount slider"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>{formatINR(1)}</span>
            <span>{formatINR(UPI_MAX_AMOUNT)}</span>
          </div>

          {/* quick chips */}
          <div className="mt-3 grid grid-cols-4 gap-1">
            {[100, 500, 2000, 10000].map((v) => (
              <button
                key={v}
                disabled={running}
                onClick={() => setAmount(v)}
                className="border-2 border-border bg-card py-1 text-[11px] text-foreground transition-colors hover:border-[var(--arcade-cyan)] disabled:opacity-50"
              >
                {v >= 1000 ? `${v / 1000}k` : v}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {overLimit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: [1, 1.05, 1] }}
                exit={{ opacity: 0 }}
                transition={{ scale: { repeat: Infinity, duration: 0.6 } }}
                className="mt-3 border-2 border-destructive bg-destructive/20 p-2 text-center"
              >
                <p className="font-pixel text-[8px] uppercase text-destructive crt-glow">
                  UPI limit exceeded
                </p>
                <p className="mt-1 text-xs text-destructive">
                  Max {formatINR(UPI_MAX_AMOUNT)} per transaction
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-3">
          <PixelButton
            variant="primary"
            className="w-full py-3 text-xs"
            onClick={onSend}
            disabled={running || overLimit}
          >
            <Zap className="h-3.5 w-3.5" />
            {running ? 'Sending...' : 'Send Money'}
          </PixelButton>
        </div>

        {/* home bar */}
        <div className="mx-auto mt-3 h-1.5 w-16 bg-border" />
      </div>
    </div>
  )
}
