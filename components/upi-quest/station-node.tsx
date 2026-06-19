'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, ChevronDown, HelpCircle, X } from 'lucide-react'
import type { AccentColor, Provider, Station } from '@/lib/upi-data'
import { StationArt } from './station-art'
import { ProviderBadge } from './provider-badge'
import { InfoTooltip } from './info-tooltip'
import { cn } from '@/lib/utils'

export type NodeState = 'idle' | 'active' | 'done' | 'failed'

export const ACCENT_VAR: Record<AccentColor, string> = {
  coin: 'var(--coin)',
  cyan: 'var(--arcade-cyan)',
  magenta: 'var(--arcade-magenta)',
  primary: 'var(--primary)',
  green: 'var(--chart-4)',
}

interface StationNodeProps {
  station: Station
  state: NodeState
  provider?: Provider
  /** When provided (and not running), the provider line becomes a swap picker. */
  providerOptions?: Provider[]
  onSelectProvider?: (id: string) => void
  canCustomize?: boolean
  xray?: boolean
  onClick: () => void
  className?: string
}

export function StationNode({
  station,
  state,
  provider,
  providerOptions,
  onSelectProvider,
  canCustomize,
  xray,
  onClick,
  className,
}: StationNodeProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const accent = ACCENT_VAR[station.color]
  const active = state === 'active'
  const done = state === 'done'
  const failed = state === 'failed'
  const swappable =
    canCustomize && !!provider && !!providerOptions && !!onSelectProvider

  return (
    <motion.div
      animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={
        active
          ? { duration: 1, repeat: Number.POSITIVE_INFINITY }
          : { duration: 0.2 }
      }
      className={cn('relative flex w-[116px] flex-col items-center', className)}
    >
      {(done || failed) && (
        <span
          className={cn(
            'absolute -right-1 -top-1 z-20 grid h-5 w-5 place-items-center border-2',
            done
              ? 'border-[var(--chart-4)] bg-[var(--chart-4)] text-background'
              : 'border-destructive bg-destructive text-destructive-foreground',
          )}
        >
          {done ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
        </span>
      )}

      <button
        onClick={onClick}
        aria-label={`${station.label} \u2014 learn more`}
        className={cn(
          'group relative flex w-full flex-col items-center gap-1 border-4 bg-card px-2 py-2 transition-all',
          'shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] hover:-translate-y-0.5',
        )}
        style={{
          borderColor: failed ? 'var(--destructive)' : accent,
          boxShadow: active
            ? `0 0 0 2px ${accent}, 0 0 16px 2px ${accent}`
            : undefined,
        }}
      >
        <div
          className={cn(
            'grid h-12 place-items-center',
            xray && 'opacity-30 grayscale',
          )}
          style={{
            animation: !active ? 'pixel-bob 3s ease-in-out infinite' : undefined,
          }}
        >
          <StationArt kind={station.kind} pixel={4} />
        </div>

        {xray ? (
          <span
            className="font-pixel text-[6px] uppercase leading-tight crt-glow"
            style={{ color: accent }}
          >
            {station.xray.phase}
          </span>
        ) : (
          <span className="font-pixel text-[6px] uppercase leading-tight text-card-foreground">
            {station.label}
          </span>
        )}

        {!swappable &&
          (provider ? (
            <span className="flex items-center gap-1">
              <ProviderBadge provider={provider} size="sm" />
              <span className="text-[10px] leading-none text-muted-foreground">
                {provider.name}
              </span>
            </span>
          ) : (
            <span
              className="text-[9px] uppercase leading-none"
              style={{ color: accent }}
            >
              {station.tag}
            </span>
          ))}
      </button>

      {/* Inline provider swap control */}
      {swappable && provider && (
        <div className="relative mt-1 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setPickerOpen((o) => !o)
            }}
            aria-label={`Change ${station.label} provider`}
            aria-expanded={pickerOpen}
            className="flex w-full items-center justify-center gap-1 border-2 bg-popover px-1 py-1 text-[10px] leading-none transition-colors hover:brightness-110"
            style={{ borderColor: accent }}
          >
            <ProviderBadge provider={provider} size="sm" />
            <span className="truncate text-muted-foreground">
              {provider.name}
            </span>
            <ChevronDown
              className={cn(
                'h-3 w-3 shrink-0 transition-transform',
                pickerOpen && 'rotate-180',
              )}
              style={{ color: accent }}
            />
          </button>

          {pickerOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setPickerOpen(false)}
                aria-hidden
              />
              <div
                className="absolute left-1/2 top-full z-40 mt-1 w-[148px] -translate-x-1/2 border-4 bg-popover p-1 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]"
                style={{ borderColor: accent }}
                role="listbox"
              >
                {providerOptions!.map((opt) => {
                  const selected = opt.id === provider.id
                  return (
                    <button
                      key={opt.id}
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onSelectProvider!(opt.id)
                        setPickerOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 px-1 py-1 text-left text-[11px] transition-colors hover:bg-muted',
                        selected && 'bg-muted',
                      )}
                    >
                      <ProviderBadge provider={opt} size="sm" />
                      <span className="truncate text-popover-foreground">
                        {opt.name}
                      </span>
                      {selected && (
                        <Check
                          className="ml-auto h-3 w-3 shrink-0"
                          style={{ color: accent }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      <div className="absolute -left-1 -top-1 z-20">
        <InfoTooltip
          term={station.tooltip.term}
          definition={station.tooltip.definition}
          fullForm={station.tooltip.fullForm}
          analogy={station.tooltip.analogy}
          accent={accent}
        >
          <span
            className="grid h-5 w-5 place-items-center border-2 bg-popover"
            style={{ borderColor: accent, color: accent }}
          >
            <HelpCircle className="h-3 w-3" />
          </span>
        </InfoTooltip>
      </div>
    </motion.div>
  )
}
