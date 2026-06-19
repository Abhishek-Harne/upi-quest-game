'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'accent' | 'cyan' | 'magenta' | 'ghost' | 'danger'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground border-primary-foreground/30 hover:brightness-110',
  accent:
    'bg-accent text-accent-foreground border-accent-foreground/30 hover:brightness-110',
  cyan: 'bg-[var(--arcade-cyan)] text-background border-background/30 hover:brightness-110',
  magenta:
    'bg-[var(--arcade-magenta)] text-background border-background/30 hover:brightness-110',
  ghost:
    'bg-card text-foreground border-border hover:bg-secondary',
  danger:
    'bg-destructive text-destructive-foreground border-destructive-foreground/30 hover:brightness-110',
}

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  active?: boolean
}

export function PixelButton({
  className,
  variant = 'primary',
  active,
  children,
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={cn(
        'font-pixel relative inline-flex select-none items-center justify-center gap-2 border-2 px-3 py-2 text-[10px] leading-tight uppercase tracking-tight transition-all',
        'shadow-[4px_4px_0_0_rgba(0,0,0,0.45)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_rgba(0,0,0,0.45)]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0',
        variants[variant],
        active && 'ring-2 ring-offset-2 ring-offset-background ring-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
