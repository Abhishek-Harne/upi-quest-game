'use client'

import {
  AGGREGATORS,
  BANKS,
  UPI_APPS,
  providerById,
  type Participants,
  type Provider,
} from '@/lib/upi-data'
import { ProviderBadge } from './provider-badge'
import { cn } from '@/lib/utils'

interface CustomizerProps {
  participants: Participants
  onChange: (patch: Partial<Participants>) => void
  disabled?: boolean
}

function Picker({
  label,
  accent,
  options,
  value,
  onSelect,
  disabled,
}: {
  label: string
  accent: string
  options: Provider[]
  value: string
  onSelect: (id: string) => void
  disabled?: boolean
}) {
  const selected = providerById(options, value)
  return (
    <div>
      <p
        className="font-pixel text-[7px] uppercase tracking-wide"
        style={{ color: accent }}
      >
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            disabled={disabled}
            onClick={() => onSelect(o.id)}
            aria-pressed={value === o.id}
            className={cn(
              'flex items-center gap-1.5 border-2 px-1.5 py-1 text-[11px] transition-all disabled:opacity-50',
              value === o.id
                ? 'bg-secondary text-secondary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-card-foreground',
            )}
            style={value === o.id ? { borderColor: accent } : undefined}
          >
            <ProviderBadge provider={o} size="sm" />
            {o.name}
          </button>
        ))}
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {selected.description}
      </p>
    </div>
  )
}

export function ParticipantCustomizer({
  participants,
  onChange,
  disabled,
}: CustomizerProps) {
  return (
    <div className="flex flex-col gap-3 border-4 border-border bg-card p-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.5)]">
      <h2 className="font-pixel text-[10px] uppercase text-[var(--arcade-cyan)]">
        Customize Players
      </h2>
      <Picker
        label="UPI App"
        accent="var(--arcade-cyan)"
        options={UPI_APPS}
        value={participants.app}
        onSelect={(id) => onChange({ app: id })}
        disabled={disabled}
      />
      <Picker
        label="Aggregator"
        accent="var(--arcade-magenta)"
        options={AGGREGATORS}
        value={participants.aggregator}
        onSelect={(id) => onChange({ aggregator: id })}
        disabled={disabled}
      />
      <Picker
        label="Sender Bank"
        accent="var(--primary)"
        options={BANKS}
        value={participants.senderBank}
        onSelect={(id) => onChange({ senderBank: id })}
        disabled={disabled}
      />
      <Picker
        label="Receiver Bank"
        accent="var(--primary)"
        options={BANKS}
        value={participants.receiverBank}
        onSelect={(id) => onChange({ receiverBank: id })}
        disabled={disabled}
      />
    </div>
  )
}
