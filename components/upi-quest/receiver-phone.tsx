'use client'

import { ArrowDownLeft, BellRing } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { formatINR } from '@/lib/upi-data'

export function ReceiverPhone({
  received,
  amount,
}: {
  received: boolean
  amount: number
}) {
  return (
    <div className="mx-auto w-full max-w-[280px]">
      <motion.div
        animate={received ? { x: [0, -3, 3, -3, 3, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="relative border-4 border-[var(--arcade-magenta)] bg-card p-3 shadow-[6px_6px_0_0_rgba(0,0,0,0.5)]"
      >
        <div className="mx-auto mb-2 h-1.5 w-12 bg-border" />

        <div className="scanlines relative flex min-h-[280px] flex-col border-2 border-border bg-background p-3">
          <p className="font-pixel text-[8px] uppercase text-[var(--arcade-magenta)]">
            Receiver
          </p>
          <p className="mt-1 text-sm text-muted-foreground">rahul@okbank</p>

          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <AnimatePresence mode="wait">
              {received ? (
                <motion.div
                  key="got"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex w-full flex-col items-center gap-2"
                >
                  {/* notification toast */}
                  <div className="flex w-full items-center gap-2 border-2 border-[var(--primary)] bg-card p-2 shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]">
                    <div className="flex h-8 w-8 items-center justify-center border-2 border-[var(--primary)] bg-[var(--primary)]/20">
                      <ArrowDownLeft className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] uppercase text-muted-foreground">
                        Credited
                      </p>
                      <p className="font-pixel text-[10px] text-[var(--primary)]">
                        {formatINR(amount)}
                      </p>
                    </div>
                  </div>
                  <motion.p
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-center text-sm text-[var(--primary)]"
                  >
                    {formatINR(amount)} received successfully
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="wait"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <BellRing className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Waiting for incoming payment...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto mt-3 h-1.5 w-16 bg-border" />
      </motion.div>
    </div>
  )
}
