'use client'

// Decorative pixel clouds + grid backdrop. Purely cosmetic.
function PixelCloud({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="relative h-6 w-24 opacity-80">
        <div className="absolute bottom-0 left-0 h-3 w-24 bg-foreground/10" />
        <div className="absolute bottom-2 left-4 h-3 w-16 bg-foreground/10" />
        <div className="absolute bottom-4 left-8 h-3 w-8 bg-foreground/10" />
      </div>
    </div>
  )
}

export function ArcadeBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="pixel-grid-bg absolute inset-0 opacity-60" />
      {/* drifting clouds */}
      <div
        className="absolute top-[8%] left-0"
        style={{ animation: 'float-cloud 38s linear infinite' }}
      >
        <PixelCloud />
      </div>
      <div
        className="absolute top-[22%] left-0"
        style={{ animation: 'float-cloud 55s linear infinite', animationDelay: '-10s' }}
      >
        <PixelCloud />
      </div>
      <div
        className="absolute top-[60%] left-0"
        style={{ animation: 'float-cloud 46s linear infinite', animationDelay: '-22s' }}
      >
        <PixelCloud />
      </div>
      {/* twinkling pixel stars */}
      {STAR_POSITIONS.map((s, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 bg-foreground/40"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animation: `blink ${s.d}s steps(2) infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

const STAR_POSITIONS = [
  { x: 12, y: 14, d: 3, delay: 0 },
  { x: 28, y: 8, d: 4, delay: 1 },
  { x: 47, y: 12, d: 2.5, delay: 0.5 },
  { x: 68, y: 6, d: 3.5, delay: 1.5 },
  { x: 82, y: 16, d: 3, delay: 0.8 },
  { x: 92, y: 40, d: 4, delay: 0.2 },
  { x: 6, y: 50, d: 2.8, delay: 1.2 },
  { x: 73, y: 70, d: 3.2, delay: 0.6 },
  { x: 38, y: 90, d: 3.6, delay: 1.1 },
  { x: 58, y: 94, d: 2.6, delay: 0.3 },
]
