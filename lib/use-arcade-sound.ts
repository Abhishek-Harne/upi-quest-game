'use client'

import { useCallback, useRef } from 'react'

export type SoundName =
  | 'blip'
  | 'step'
  | 'send'
  | 'success'
  | 'error'
  | 'coin'
  | 'levelup'

// Simple Web Audio synth for retro arcade beeps. No assets needed.
export function useArcadeSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      if (Ctor) ctxRef.current = new Ctor()
    }
    return ctxRef.current
  }, [])

  const tone = useCallback(
    (
      freq: number,
      duration: number,
      type: OscillatorType,
      startAt: number,
      gain = 0.08,
    ) => {
      const ctx = getCtx()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt)
      g.gain.setValueAtTime(0.0001, ctx.currentTime + startAt)
      g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + startAt + 0.01)
      g.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + startAt + duration,
      )
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(ctx.currentTime + startAt)
      osc.stop(ctx.currentTime + startAt + duration + 0.02)
    },
    [getCtx],
  )

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return
      const ctx = getCtx()
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume()

      switch (name) {
        case 'blip':
          tone(660, 0.07, 'square', 0)
          break
        case 'step':
          tone(520, 0.08, 'square', 0)
          tone(780, 0.06, 'square', 0.04)
          break
        case 'send':
          tone(440, 0.08, 'square', 0)
          tone(660, 0.08, 'square', 0.08)
          tone(880, 0.12, 'square', 0.16)
          break
        case 'coin':
          tone(988, 0.07, 'square', 0)
          tone(1319, 0.18, 'square', 0.07)
          break
        case 'success':
          tone(523, 0.1, 'square', 0)
          tone(659, 0.1, 'square', 0.1)
          tone(784, 0.1, 'square', 0.2)
          tone(1047, 0.25, 'square', 0.3)
          break
        case 'levelup':
          tone(659, 0.09, 'triangle', 0)
          tone(880, 0.09, 'triangle', 0.09)
          tone(1175, 0.22, 'triangle', 0.18)
          break
        case 'error':
          tone(200, 0.18, 'sawtooth', 0, 0.06)
          tone(140, 0.28, 'sawtooth', 0.12, 0.06)
          break
      }
    },
    [enabled, getCtx, tone],
  )

  return play
}
