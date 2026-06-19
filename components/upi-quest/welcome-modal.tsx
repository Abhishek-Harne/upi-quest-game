'use client'

import { useState } from 'react'
import {
  Check,
  Github,
  Globe,
  Heart,
  Linkedin,
  PlayCircle,
} from 'lucide-react'
import { PixelModal } from './pixel-modal'
import { PixelButton } from './pixel-button'

const PERKS = [
  'Follow your money through India\u2019s UPI infrastructure',
  'Learn how NPCI routes every transaction',
  'Discover what banks, PSPs and aggregators do',
  'Explore real-world payment failures',
  'Unlock 100+ hidden payment facts',
  'Become a UPI Infrastructure Master',
]

interface WelcomeModalProps {
  open: boolean
  onStartDemo: () => void
  onClose: (dontShowAgain: boolean) => void
}

export function WelcomeModal({
  open,
  onStartDemo,
  onClose,
}: WelcomeModalProps) {
  const [dontShow, setDontShow] = useState(false)

  return (
    <PixelModal
      open={open}
      onClose={() => onClose(dontShow)}
      title="Welcome to UPI Quest"
      accent="var(--coin)"
      disableBackdropClose
    >
      <p className="text-pretty text-base leading-relaxed text-card-foreground">
        Ever wondered what actually happens after you tap{' '}
        <span className="font-semibold text-[var(--coin)]">Send Money</span>?
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <span
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border-2 border-[var(--chart-4)] text-[var(--chart-4)]"
              aria-hidden
            >
              <Check className="h-3 w-3" />
            </span>
            <span className="text-sm leading-relaxed text-card-foreground">
              {perk}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <PixelButton
          variant="primary"
          className="flex-1"
          onClick={() => {
            onClose(dontShow)
            onStartDemo()
          }}
        >
          <PlayCircle className="h-4 w-4" />
          Start Demo Mode
        </PixelButton>
        <PixelButton
          variant="ghost"
          className="flex-1"
          onClick={() => onClose(dontShow)}
        >
          Explore Freely
        </PixelButton>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Recommended: start with Demo Mode for a guided tour.
      </p>

      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={dontShow}
          onChange={(e) => setDontShow(e.target.checked)}
          className="h-4 w-4 accent-[var(--coin)]"
        />
        Don&apos;t show this again
      </label>

      <div className="mt-5 border-t-2 border-border pt-4 text-center">
        <p className="flex items-center justify-center gap-1.5 text-sm text-card-foreground">
          Built with <Heart className="h-4 w-4 text-[var(--arcade-magenta)]" />{' '}
          and curiosity
        </p>
        <p className="mt-1 font-pixel text-[10px] uppercase text-[var(--coin)]">
          Abhishek Harne
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <CreatorLink
            href="https://www.linkedin.com/in/abhishek-harne/"
            label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </CreatorLink>
          <CreatorLink
            href="https://github.com/Abhishek-Harne"
            label="GitHub"
          >
            <Github className="h-4 w-4" />
          </CreatorLink>
          <CreatorLink
            href="https://abhishekharne.vercel.app/#ai"
            label="Website"
          >
            <Globe className="h-4 w-4" />
          </CreatorLink>
        </div>
      </div>
    </PixelModal>
  )
}

function CreatorLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center gap-1.5 border-2 border-border bg-secondary px-2.5 py-1.5 text-xs text-secondary-foreground transition-colors hover:border-[var(--coin)] hover:text-[var(--coin)]"
    >
      {children}
      <span>{label}</span>
    </a>
  )
}
