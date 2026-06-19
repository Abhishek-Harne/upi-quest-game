'use client'

import type { Provider } from '@/lib/upi-data'
import { cn } from '@/lib/utils'

export function ProviderBadge({
  provider,
  size = 'md',
  className,
}: {
  provider: Provider
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center border-2 border-background/40 font-pixel uppercase shadow-[2px_2px_0_0_rgba(0,0,0,0.4)]',
        size === 'sm' ? 'h-5 w-5 text-[7px]' : 'h-7 w-7 text-[8px]',
        className,
      )}
      style={{ backgroundColor: provider.color, color: '#fff' }}
      aria-hidden
    >
      {provider.initials}
    </span>
  )
}
