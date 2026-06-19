'use client'

import { PixelSprite } from './pixel-sprite'

const C = {
  dark: 'oklch(0.18 0.07 280)',
  skin: 'oklch(0.78 0.09 60)',
  mask: 'oklch(0.32 0.02 280)',
  bagY: 'var(--coin)',
  red: 'var(--destructive)',
  blue: 'var(--arcade-cyan)',
  white: 'oklch(0.96 0.01 250)',
} as const

// Sneaky cartoon thief in a black mask, clutching a money bag
const THIEF = [
  '..kkkkk..',
  '.kkkkkkk.',
  '.kmmmmmk.',
  '.wkwkwkw.',
  '.sssssss.',
  '..sssss..',
  '.kkssskk.',
  'k.ksssk.k',
  '...kbk...',
  '..bbbbb..',
  '.bbBBBbb.',
  '..bbbbb..',
]
const THIEF_PAL = {
  k: C.dark,
  m: C.mask,
  w: C.white,
  s: C.skin,
  b: C.bagY,
  B: C.dark,
}

// Friendly cyber-police officer with cap, badge and raised shield
const POLICE = [
  '..bbbbb..',
  '.bbbbbbb.',
  '.bGGGGGb.',
  '..sssss..',
  '.wswswsw.',
  '..sssss..',
  '.bbBBBbb.',
  'sbBwBwBbs',
  's.BBBBB.s',
  '..BB.BB..',
  '..b...b..',
  '.bb...bb.',
]
const POLICE_PAL = {
  b: C.blue,
  G: C.dark,
  s: C.skin,
  w: C.white,
  B: C.white,
}

export function ThiefSprite({ pixel = 5 }: { pixel?: number }) {
  return <PixelSprite grid={THIEF} palette={THIEF_PAL} pixel={pixel} />
}

export function PoliceSprite({ pixel = 5 }: { pixel?: number }) {
  return <PixelSprite grid={POLICE} palette={POLICE_PAL} pixel={pixel} />
}
