'use client'

import { cn } from '@/lib/utils'

// Renders a tiny pixel-art sprite from a string grid.
// Each char maps to a CSS color (or transparent for space/'.').
export function PixelSprite({
  grid,
  palette,
  pixel = 4,
  className,
}: {
  grid: string[]
  palette: Record<string, string>
  pixel?: number
  className?: string
}) {
  const cols = Math.max(...grid.map((r) => r.length))
  return (
    <div
      className={cn('relative', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${pixel}px)`,
        gridAutoRows: `${pixel}px`,
        width: cols * pixel,
      }}
      aria-hidden="true"
    >
      {grid.flatMap((row, y) =>
        Array.from({ length: cols }).map((_, x) => {
          const ch = row[x] ?? '.'
          const color = palette[ch]
          return (
            <div
              key={`${x}-${y}`}
              style={{
                width: pixel,
                height: pixel,
                backgroundColor: color || 'transparent',
              }}
            />
          )
        }),
      )}
    </div>
  )
}
