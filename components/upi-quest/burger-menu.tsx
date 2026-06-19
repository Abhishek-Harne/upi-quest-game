'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronDown,
  Code2,
  Globe,
  Heart,
  Info,
  Briefcase,
  Settings2,
  Sparkles,
  Trophy,
  Workflow,
  X,
} from 'lucide-react'
import { APP_META, CHANGELOG, HOW_UPI_WORKS } from '@/lib/app-meta'
import { useGameStore } from '@/lib/game-store'
import { FUN_FACTS } from '@/lib/upi-facts'
import { LEVELS, formatDuration } from '@/lib/upi-data'
import { SettingsPanel } from './settings-panel'
import { cn } from '@/lib/utils'

interface BurgerMenuProps {
  open: boolean
  onClose: () => void
}

type SectionId =
  | 'about'
  | 'how'
  | 'achievements'
  | 'settings'
  | 'changelog'
  | 'credits'

export function BurgerMenu({ open, onClose }: BurgerMenuProps) {
  const { stats, level } = useGameStore()
  const [openSection, setOpenSection] = useState<SectionId | null>('about')

  const toggle = (id: SectionId) =>
    setOpenSection((cur) => (cur === id ? null : id))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            tabIndex={-1}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute right-0 top-0 flex h-dvh w-[88vw] max-w-sm flex-col border-l-4 border-[var(--coin)] bg-card shadow-[-8px_0_0_0_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b-4 border-[var(--coin)] px-4 py-3">
              <h2 className="font-pixel text-[11px] uppercase text-[var(--coin)] crt-glow">
                Menu
              </h2>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-7 w-7 place-items-center border-2 border-border bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <Section
                id="about"
                title="About"
                icon={<Info className="h-4 w-4" />}
                open={openSection === 'about'}
                onToggle={toggle}
              >
                <p className="text-sm leading-relaxed text-card-foreground">
                  UPI Quest is a playable, pixel-art explainer of how a UPI
                  payment travels across India&apos;s payment infrastructure.
                  It&apos;s &quot;Duolingo meets Pok&eacute;mon meets payment
                  rails&quot; &mdash; learn by following your money.
                </p>
              </Section>

              <Section
                id="how"
                title="How UPI Works"
                icon={<Workflow className="h-4 w-4" />}
                open={openSection === 'how'}
                onToggle={toggle}
              >
                <ol className="flex flex-col gap-2">
                  {HOW_UPI_WORKS.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed">
                      <span className="font-pixel text-[9px] text-[var(--coin)]">
                        {i + 1}
                      </span>
                      <span className="text-card-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section
                id="achievements"
                title="Achievements"
                icon={<Trophy className="h-4 w-4" />}
                open={openSection === 'achievements'}
                onToggle={toggle}
              >
                <div className="grid grid-cols-2 gap-2">
                  <Stat label="Level" value={`${level.level}`} sub={level.title} />
                  <Stat label="XP" value={`${stats.xp}`} />
                  <Stat label="Transactions" value={`${stats.transactions}`} />
                  <Stat
                    label="Facts"
                    value={`${stats.factsUnlocked.length}/${FUN_FACTS.length}`}
                  />
                  <Stat label="Cyber Wins" value={`${stats.cyberWins}`} />
                  <Stat
                    label="Time"
                    value={formatDuration(stats.timeSpentMs)}
                  />
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  {LEVELS.map((l) => (
                    <div
                      key={l.level}
                      className={cn(
                        'flex items-center justify-between border-2 px-2 py-1 text-xs',
                        stats.xp >= l.minXp
                          ? 'border-[var(--coin)] text-[var(--coin)]'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      <span>
                        Lvl {l.level}: {l.title}
                      </span>
                      <span className="font-pixel text-[7px]">
                        {l.minXp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section
                id="settings"
                title="Accessibility & Settings"
                icon={<Settings2 className="h-4 w-4" />}
                open={openSection === 'settings'}
                onToggle={toggle}
              >
                <SettingsPanel />
              </Section>

              <Section
                id="changelog"
                title="Version History"
                icon={<Sparkles className="h-4 w-4" />}
                open={openSection === 'changelog'}
                onToggle={toggle}
              >
                <div className="flex flex-col gap-3">
                  {CHANGELOG.map((c) => (
                    <div key={c.version}>
                      <p className="font-pixel text-[9px] uppercase text-[var(--arcade-cyan)]">
                        v{c.version} &middot; {c.date}
                      </p>
                      <ul className="mt-1.5 flex flex-col gap-1">
                        {c.notes.map((n, i) => (
                          <li
                            key={i}
                            className="flex gap-1.5 text-xs leading-relaxed text-card-foreground"
                          >
                            <span className="text-[var(--coin)]">&bull;</span>
                            {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>

              <Section
                id="credits"
                title="Credits & Creator"
                icon={<Heart className="h-4 w-4" />}
                open={openSection === 'credits'}
                onToggle={toggle}
              >
                <p className="text-sm leading-relaxed text-card-foreground">
                  Designed and built with love and curiosity by{' '}
                  <span className="font-semibold text-[var(--coin)]">
                    {APP_META.creator}
                  </span>
                  .
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <MenuLink href={APP_META.links.linkedin} label="LinkedIn">
                    <Briefcase className="h-4 w-4" />
                  </MenuLink>
                  <MenuLink href={APP_META.links.github} label="GitHub">
                    <Code2 className="h-4 w-4" />
                  </MenuLink>
                  <MenuLink href={APP_META.links.website} label="Website">
                    <Globe className="h-4 w-4" />
                  </MenuLink>
                  <MenuLink href={APP_META.links.source} label="Source Code">
                    <Code2 className="h-4 w-4" />
                  </MenuLink>
                </div>
              </Section>
            </div>

            <div className="border-t-2 border-border px-4 py-3 text-center">
              <p className="font-pixel text-[7px] uppercase text-muted-foreground">
                Build {APP_META.build} &middot; v{APP_META.version}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last updated {APP_META.lastUpdated}
              </p>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Section({
  id,
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  id: SectionId
  title: string
  icon: React.ReactNode
  open: boolean
  onToggle: (id: SectionId) => void
  children: React.ReactNode
}) {
  return (
    <div className="mb-2 border-2 border-border bg-background/40">
      <button
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-[var(--coin)]">
          {icon}
          <span className="font-pixel text-[9px] uppercase leading-tight text-card-foreground">
            {title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t-2 border-border px-3 py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="border-2 border-border bg-card p-2">
      <p className="font-pixel text-[7px] uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-pixel text-[11px] text-[var(--coin)]">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  )
}

function MenuLink({
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
      className="flex items-center gap-1.5 border-2 border-border bg-secondary px-2.5 py-1.5 text-xs text-secondary-foreground transition-colors hover:border-[var(--coin)] hover:text-[var(--coin)]"
    >
      {children}
      {label}
    </a>
  )
}
