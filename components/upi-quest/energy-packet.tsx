'use client'

import { PixelSprite } from './pixel-sprite'

const COIN = [
  '..ooo..',
  '.oocoo.',
  'ooc.coo',
  'ooc.coo',
  'ooc.coo',
  '.oocoo.',
  '..ooo..',
]
const COIN_PAL = {
  o: 'var(--coin)',
  c: 'oklch(0.45 0.12 60)',
}

/** A glowing UPI energy coin/packet. */
export function EnergyPacket({ pixel = 4 }: { pixel?: number }) {
  return (
    <div className="animate-packet-glow" aria-hidden>
      <div style={{ animation: 'coin-spin 1.1s ease-in-out infinite' }}>
        <PixelSprite grid={COIN} palette={COIN_PAL} pixel={pixel} />
      </div>
    </div>
  )
}
