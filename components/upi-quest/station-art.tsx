'use client'

import type { StationKind } from '@/lib/upi-data'
import { PixelSprite } from './pixel-sprite'

// color tokens resolved from CSS vars at runtime
const C = {
  body: 'var(--card)',
  dark: 'oklch(0.18 0.07 280)',
  light: 'var(--foreground)',
  coin: 'var(--coin)',
  cyan: 'var(--arcade-cyan)',
  magenta: 'var(--arcade-magenta)',
  gold: 'var(--primary)',
  screen: 'var(--arcade-cyan)',
  red: 'var(--destructive)',
} as const

const PHONE = [
  '.bbbbb.',
  '.bsssb.',
  '.bsssb.',
  '.bsssb.',
  '.bsssb.',
  '.bbobb.',
]
const PHONE_PAL = { b: C.dark, s: C.screen, o: C.light }

const APP = [
  '.ggggg.',
  'gwwwwwg',
  'gwgggwg',
  'gwgwgwg',
  'gwwwwwg',
  '.ggggg.',
]
const APP_PAL = { g: C.cyan, w: C.dark }

const AGG = [
  'mmmmmmm',
  'm.m.m.m',
  'mmmmmmm',
  'm.m.m.m',
  'mmmmmmm',
  '.l...l.',
]
const AGG_PAL = { m: C.magenta, l: C.dark }

const BANK = [
  '...g...',
  '..ggg..',
  '.ggggg.',
  'g.g.g.g',
  'g.g.g.g',
  'ggggggg',
]
const BANK_PAL = { g: C.gold }

const NPCI = [
  '...r...',
  '..ooo..',
  '..oco..',
  '.ooooo.',
  '.oc.co.',
  '.ooooo.',
  '.oc.co.',
  'ooooooo',
]
const NPCI_PAL = { o: C.coin, c: C.dark, r: C.red }

export function StationArt({
  kind,
  pixel = 5,
}: {
  kind: StationKind
  pixel?: number
}) {
  switch (kind) {
    case 'phone':
      return <PixelSprite grid={PHONE} palette={PHONE_PAL} pixel={pixel} />
    case 'app':
      return <PixelSprite grid={APP} palette={APP_PAL} pixel={pixel} />
    case 'aggregator':
      return <PixelSprite grid={AGG} palette={AGG_PAL} pixel={pixel} />
    case 'bank':
      return <PixelSprite grid={BANK} palette={BANK_PAL} pixel={pixel} />
    case 'npci':
      return <PixelSprite grid={NPCI} palette={NPCI_PAL} pixel={pixel} />
  }
}
