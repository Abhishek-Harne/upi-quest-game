export type StationId =
  | 'sender-phone'
  | 'upi-app'
  | 'aggregator'
  | 'sender-bank'
  | 'internet'
  | 'npci'
  | 'receiver-bank'
  | 'receiver-phone'

export type StationKind =
  | 'phone'
  | 'app'
  | 'aggregator'
  | 'bank'
  | 'internet'
  | 'npci'

export type AccentColor = 'coin' | 'cyan' | 'magenta' | 'primary' | 'green'

/** Which customizable participant slot (if any) this station maps to. */
export type ParticipantSlot =
  | 'app'
  | 'aggregator'
  | 'senderBank'
  | 'receiverBank'
  | null

export interface Station {
  id: StationId
  label: string
  tag: string
  kind: StationKind
  /** Position on the desktop map as percentages (0-100) */
  x: number
  y: number
  /** Toast/status line shown when the packet reaches this node */
  statusMessage: string
  /** Retro dialogue shown when the node is clicked */
  dialogue: string
  /** Calm, guided narration used in demo / creator mode */
  narration: string
  /** Tooltip definition shown on hover (desktop) or tap (mobile) */
  tooltip: {
    term: string
    definition: string
    fullForm?: string
    analogy?: string
  }
  /** Technical step name surfaced in X-Ray mode */
  xray: { phase: string; detail: string }
  color: AccentColor
  slot: ParticipantSlot
}

export const STATIONS: Station[] = [
  {
    id: 'sender-phone',
    label: 'Sender Phone',
    tag: 'YOU',
    kind: 'phone',
    x: 10,
    y: 20,
    statusMessage: 'Payment request started on your phone',
    dialogue:
      "Hi! I'm the sender's phone. You tap SEND and I kick off the entire UPI journey in under a second.",
    narration: 'This is where the payment request begins.',
    tooltip: {
      term: 'Sender Phone',
      definition:
        'Your device, where you enter the amount and authorise the payment with your UPI PIN.',
      analogy:
        'Think of it as the counter where you fill out a deposit slip before handing it over.',
    },
    xray: {
      phase: 'Request Creation',
      detail:
        'The app builds a payment intent containing payer VPA, payee VPA, amount and a unique transaction ID.',
    },
    color: 'cyan',
    slot: null,
  },
  {
    id: 'upi-app',
    label: 'UPI App',
    tag: 'PSP APP',
    kind: 'app',
    x: 34,
    y: 20,
    statusMessage: 'UPI app securely packaged the request',
    dialogue:
      "I'm your UPI app. I build a secure request with your VPA (you@bank) and your encrypted UPI PIN, then hand it onward.",
    narration: 'The UPI app packages your payment information securely.',
    tooltip: {
      term: 'UPI',
      fullForm: 'Unified Payments Interface',
      definition:
        'A Payment Service Provider app (PhonePe, GPay, Paytm, BHIM) that lets you create a VPA and pay from your bank, all powered by UPI.',
      analogy:
        'Think of UPI as a universal language that lets every bank communicate with one another.',
    },
    xray: {
      phase: 'Authentication',
      detail:
        'The UPI PIN is captured on the NPCI common library and encrypted end-to-end; the app never sees it in plain text.',
    },
    color: 'cyan',
    slot: 'app',
  },
  {
    id: 'aggregator',
    label: 'Aggregator',
    tag: 'GATEWAY',
    kind: 'aggregator',
    x: 58,
    y: 20,
    statusMessage: 'Aggregator routed the request to the bank',
    dialogue:
      'I am the Payment Aggregator / gateway. I help apps and businesses collect payments and pass them to the banking rails.',
    narration: 'Aggregators help businesses accept and manage payments.',
    tooltip: {
      term: 'Aggregator',
      fullForm: 'Payment Aggregator',
      definition:
        'A licensed entity (Razorpay, BharatPe, Cashfree) that helps businesses accept digital payments without building their own payment infrastructure.',
      analogy:
        'Think of an aggregator as a delivery partner that collects parcels from customers and routes them through the logistics network.',
    },
    xray: {
      phase: 'Validation',
      detail:
        'The aggregator validates the request schema, applies risk checks and forwards it to the sponsor PSP bank.',
    },
    color: 'magenta',
    slot: 'aggregator',
  },
  {
    id: 'sender-bank',
    label: 'Sender Bank',
    tag: 'PSP BANK',
    kind: 'bank',
    x: 85,
    y: 30,
    statusMessage: 'Sender bank verified balance & authorised debit',
    dialogue:
      'I am the sender PSP bank. I verify your account, check your balance and authorise the debit before anything moves.',
    narration: 'The bank verifies account ownership and your balance.',
    tooltip: {
      term: 'PSP Bank',
      fullForm: 'Payment Service Provider Bank',
      definition:
        'A bank that participates directly in UPI routing and connects banks and UPI apps onto the network.',
      analogy:
        'Think of a PSP Bank as a railway station connecting passengers to the larger railway network.',
    },
    xray: {
      phase: 'Debit Authorisation',
      detail:
        'The core banking system confirms account ownership, checks available balance and places a debit hold.',
    },
    color: 'primary',
    slot: 'senderBank',
  },
  {
    id: 'internet',
    label: 'Internet',
    tag: 'SECURE TUNNEL',
    kind: 'internet',
    x: 68,
    y: 55,
    statusMessage: 'Request encrypted & tunneled across the internet',
    dialogue:
      'I am the secure internet tunnel. Your request travels through me wrapped in encryption \u2014 nobody can read or tamper with it in transit.',
    narration:
      'The request travels across the internet inside an encrypted, tamper-proof tunnel.',
    tooltip: {
      term: 'Internet',
      fullForm: 'Secure Encrypted Tunnel',
      definition:
        'UPI traffic moves over the internet inside encrypted TLS tunnels between licensed parties, so data stays private end-to-end.',
      analogy:
        'Think of it as an armoured courier van — the road is public, but nobody can see or touch what is inside.',
    },
    xray: {
      phase: 'Encrypted Transport',
      detail:
        'Messages are signed and sent over mutually-authenticated TLS connections; payloads are encrypted so they cannot be read or altered in transit.',
    },
    color: 'cyan',
    slot: null,
  },
  {
    id: 'npci',
    label: 'NPCI Switch',
    tag: 'COMMAND TOWER',
    kind: 'npci',
    x: 50,
    y: 55,
    statusMessage: 'NPCI switch routed the transaction',
    dialogue:
      'I am the NPCI Switch \u2014 India\u2019s central command tower. I route billions of UPI requests every day between every bank.',
    narration: 'NPCI acts as the central routing layer for every UPI transaction.',
    tooltip: {
      term: 'NPCI',
      fullForm: 'National Payments Corporation of India',
      definition:
        'It operates the UPI payment rails and routes and coordinates transactions between every bank.',
      analogy:
        'Think of NPCI as an air traffic control tower directing thousands of flights safely to their destinations.',
    },
    xray: {
      phase: 'Routing',
      detail:
        'NPCI resolves the payee VPA to a destination bank and routes the credit leg to the correct PSP.',
    },
    color: 'coin',
    slot: null,
  },
  {
    id: 'receiver-bank',
    label: 'Receiver Bank',
    tag: 'CREDIT',
    kind: 'bank',
    x: 85,
    y: 80,
    statusMessage: 'Receiver bank credited the account',
    dialogue:
      'I am the receiver\u2019s bank. I confirm the destination account is valid and credit the money instantly.',
    narration: 'The receiving bank confirms and credits the money.',
    tooltip: {
      term: 'Receiver Bank',
      definition:
        'The beneficiary\u2019s bank, which confirms the destination account and credits funds to the recipient.',
      analogy:
        'Think of it as the final post office delivering a parcel to the recipient\u2019s home.',
    },
    xray: {
      phase: 'Settlement',
      detail:
        'The credit is posted to the beneficiary account; net settlement between banks happens in scheduled cycles.',
    },
    color: 'primary',
    slot: 'receiverBank',
  },
  {
    id: 'receiver-phone',
    label: 'Receiver Phone',
    tag: 'THEM',
    kind: 'phone',
    x: 13,
    y: 80,
    statusMessage: 'Money delivered \u2014 receiver notified!',
    dialogue:
      "I'm the receiver's phone. Ding! I buzz with a credit notification the instant the money lands.",
    narration: 'The recipient gets notified instantly that the money arrived.',
    tooltip: {
      term: 'Receiver Phone',
      definition:
        'The beneficiary\u2019s device, which receives an instant credit notification.',
    },
    xray: {
      phase: 'Confirmation',
      detail:
        'A success response travels back along the chain and both parties receive real-time confirmation.',
    },
    color: 'green',
    slot: null,
  },
]

export const UPI_MAX_AMOUNT = 100000

/* ----------------------------- Participants ----------------------------- */

export interface Provider {
  id: string
  name: string
  /** Brand-ish accent color as hex (used only as data for pixel badges) */
  color: string
  /** Two-letter pixel badge initials */
  initials: string
  description: string
}

export const UPI_APPS: Provider[] = [
  { id: 'phonepe', name: 'PhonePe', color: '#5f259f', initials: 'Pe', description: 'India\u2019s most used UPI app by volume.' },
  { id: 'gpay', name: 'Google Pay', color: '#1a73e8', initials: 'GP', description: 'Google\u2019s UPI app with a huge user base.' },
  { id: 'paytm', name: 'Paytm', color: '#00baf2', initials: 'Pt', description: 'A pioneer of digital wallets and UPI in India.' },
  { id: 'bhim', name: 'BHIM', color: '#00853f', initials: 'Bh', description: 'NPCI\u2019s own reference UPI app.' },
]

export const AGGREGATORS: Provider[] = [
  { id: 'razorpay', name: 'Razorpay', color: '#3f7fff', initials: 'Rz', description: 'Popular payment gateway for businesses.' },
  { id: 'bharatpe', name: 'BharatPe', color: '#0d2366', initials: 'BP', description: 'Merchant-focused payments and QR.' },
  { id: 'cashfree', name: 'Cashfree', color: '#0baf60', initials: 'Cf', description: 'Payments and payouts platform.' },
]

export const BANKS: Provider[] = [
  { id: 'hdfc', name: 'HDFC Bank', color: '#004c8f', initials: 'HD', description: 'One of India\u2019s largest private banks.' },
  { id: 'sbi', name: 'SBI', color: '#22409a', initials: 'SB', description: 'State Bank of India, the largest PSU bank.' },
  { id: 'icici', name: 'ICICI Bank', color: '#b02a30', initials: 'IC', description: 'Major private sector bank.' },
  { id: 'axis', name: 'Axis Bank', color: '#97144d', initials: 'Ax', description: 'Leading private bank and PSP.' },
  { id: 'kotak', name: 'Kotak', color: '#ed1c24', initials: 'Ko', description: 'Private bank active in UPI.' },
]

export interface Participants {
  app: string
  aggregator: string
  senderBank: string
  receiverBank: string
}

export const DEFAULT_PARTICIPANTS: Participants = {
  app: 'phonepe',
  aggregator: 'razorpay',
  senderBank: 'hdfc',
  receiverBank: 'sbi',
}

export function providerById(list: Provider[], id: string): Provider {
  return list.find((p) => p.id === id) ?? list[0]
}

/* ------------------------------- Modes ---------------------------------- */

export type ModeId =
  | 'normal'
  | 'bank-busy'
  | 'network-delay'
  | 'insufficient'
  | 'npci-timeout'

export interface GameMode {
  id: ModeId
  label: string
  description: string
  /** StationId at which it fails, or null if it succeeds */
  failAt: StationId | null
  failMessage?: string
  /** Journey speed multiplier */
  speed: number
  /** XP awarded for trying this failure scenario (once) */
  xp: number
}

export const MODES: GameMode[] = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'A healthy transaction that completes successfully.',
    failAt: null,
    speed: 1,
    xp: 0,
  },
  {
    id: 'bank-busy',
    label: 'Bank Server Busy',
    description: 'The sender bank is overloaded and cannot respond in time.',
    failAt: 'sender-bank',
    failMessage: 'Sender bank server busy \u2014 please try again',
    speed: 1.1,
    xp: 20,
  },
  {
    id: 'network-delay',
    label: 'Network Delay',
    description: 'Everything works, but each hop is sluggish.',
    failAt: null,
    speed: 2,
    xp: 20,
  },
  {
    id: 'insufficient',
    label: 'Insufficient Balance',
    description: 'The sender account does not have enough money.',
    failAt: 'sender-bank',
    failMessage: 'Insufficient balance in sender account',
    speed: 1,
    xp: 20,
  },
  {
    id: 'npci-timeout',
    label: 'NPCI Timeout',
    description: 'The NPCI switch times out while routing the request.',
    failAt: 'npci',
    failMessage: 'NPCI timeout \u2014 transaction auto-reversed',
    speed: 1.4,
    xp: 20,
  },
]

/* ------------------------------- Levels --------------------------------- */

export interface Level {
  level: number
  title: string
  minXp: number
}

export const LEVELS: Level[] = [
  { level: 1, title: 'UPI Beginner', minXp: 0 },
  { level: 2, title: 'Payment Explorer', minXp: 60 },
  { level: 3, title: 'Network Wizard', minXp: 150 },
  { level: 4, title: 'Infrastructure Master', minXp: 320 },
  { level: 5, title: 'UPI Legend', minXp: 600 },
]

export function getLevel(xp: number): Level {
  let current = LEVELS[0]
  for (const lvl of LEVELS) if (xp >= lvl.minXp) current = lvl
  return current
}

export function getNextLevel(xp: number): Level | null {
  return LEVELS.find((l) => l.minXp > xp) ?? null
}

export function levelProgress(xp: number): number {
  const cur = getLevel(xp)
  const next = getNextLevel(xp)
  if (!next) return 100
  return Math.round(((xp - cur.minXp) / (next.minXp - cur.minXp)) * 100)
}

/* ------------------------------ XP rewards ------------------------------ */

export const XP = {
  transaction: 10,
  readNode: 5,
  unlockFact: 5,
  failureScenario: 20,
  cyberChallenge: 25,
} as const

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
