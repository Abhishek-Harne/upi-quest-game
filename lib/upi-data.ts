export type StationId =
  | 'sender-phone'
  | 'upi-app'
  | 'aggregator'
  | 'psp-bank'
  | 'npci'
  | 'receiver-psp'
  | 'receiver-bank'
  | 'receiver-phone'

export type StationKind =
  | 'phone'
  | 'app'
  | 'aggregator'
  | 'bank'
  | 'npci'

export interface Station {
  id: StationId
  /** Short label shown under the node */
  label: string
  /** Sub label / company style tag */
  tag: string
  kind: StationKind
  /** Position on the map as percentages (0-100) */
  x: number
  y: number
  /** Status popup shown when the pulse reaches this node */
  statusMessage: string
  /** Retro dialogue shown when the node is clicked */
  dialogue: string
  /** Accent color token for this node */
  color: 'coin' | 'cyan' | 'magenta' | 'primary'
}

export const STATIONS: Station[] = [
  {
    id: 'sender-phone',
    label: 'Sender',
    tag: 'YOUR PHONE',
    kind: 'phone',
    x: 11,
    y: 22,
    statusMessage: 'Payment initiated from sender phone',
    dialogue:
      "Hi! I'm the sender's phone. You tap SEND and I kick off the whole UPI journey in under a second.",
    color: 'cyan',
  },
  {
    id: 'upi-app',
    label: 'UPI App',
    tag: 'PAY APP',
    kind: 'app',
    x: 36,
    y: 22,
    statusMessage: 'UPI app creates a secure payment request',
    dialogue:
      "I'm your UPI app. I build a secure collect/pay request with your VPA (you@bank) and hand it onward.",
    color: 'cyan',
  },
  {
    id: 'aggregator',
    label: 'Aggregator',
    tag: 'GATEWAY',
    kind: 'aggregator',
    x: 62,
    y: 22,
    statusMessage: 'Aggregator received the payment request',
    dialogue:
      'I am the Payment Aggregator / gateway. I help apps and businesses collect payments and route them to banks.',
    color: 'magenta',
  },
  {
    id: 'psp-bank',
    label: 'Sender Bank',
    tag: 'PSP BANK',
    kind: 'bank',
    x: 87,
    y: 22,
    statusMessage: 'Sender bank validates account & balance',
    dialogue:
      'I am the sender PSP bank. I verify your account, check your balance and authorise the debit.',
    color: 'primary',
  },
  {
    id: 'npci',
    label: 'NPCI',
    tag: 'COMMAND TOWER',
    kind: 'npci',
    x: 50,
    y: 53,
    statusMessage: 'NPCI switch routes the payment',
    dialogue:
      'I am the NPCI Switch \u2014 India\u2019s central command tower. I route billions of UPI requests every single day between every bank.',
    color: 'coin',
  },
  {
    id: 'receiver-psp',
    label: 'Receiver PSP',
    tag: 'PSP BANK',
    kind: 'bank',
    x: 87,
    y: 84,
    statusMessage: 'Receiver PSP bank receives routed request',
    dialogue:
      'I am the receiver PSP bank. NPCI routes the request to me so I can find the right destination account.',
    color: 'primary',
  },
  {
    id: 'receiver-bank',
    label: 'Receiver Bank',
    tag: 'CREDIT',
    kind: 'bank',
    x: 50,
    y: 84,
    statusMessage: 'Receiver bank confirms the credit',
    dialogue:
      'I am the receiver\u2019s bank. I confirm the account is valid and credit the money instantly.',
    color: 'primary',
  },
  {
    id: 'receiver-phone',
    label: 'Receiver',
    tag: 'THEIR PHONE',
    kind: 'phone',
    x: 15,
    y: 84,
    statusMessage: 'Money received successfully!',
    dialogue:
      "I'm the receiver's phone. Ding! I buzz with a credit notification the instant the money lands.",
    color: 'cyan',
  },
]

export const UPI_MAX_AMOUNT = 100000

export interface FunFact {
  id: string
  title: string
  body: string
}

export const FUN_FACTS: FunFact[] = [
  {
    id: 'volume',
    title: 'BILLIONS MONTHLY',
    body: 'UPI processes well over 10 billion transactions every month across India.',
  },
  {
    id: 'npci',
    title: 'WHO RUNS IT',
    body: 'NPCI (National Payments Corporation of India) operates the UPI infrastructure.',
  },
  {
    id: 'speed',
    title: 'INSTANT',
    body: 'A UPI transfer usually settles within a couple of seconds, 24x7.',
  },
  {
    id: 'vpa',
    title: 'NO ACCOUNT NUMBER',
    body: 'You send money using a VPA like name@bank \u2014 no IFSC or account number needed.',
  },
  {
    id: 'free',
    title: 'ZERO FEE',
    body: 'Person-to-person UPI payments are free for users in India.',
  },
  {
    id: 'interoperable',
    title: 'ANY APP, ANY BANK',
    body: 'UPI is interoperable \u2014 any UPI app can pay any bank account.',
  },
  {
    id: 'global',
    title: 'GOING GLOBAL',
    body: 'UPI is being accepted in several countries beyond India.',
  },
]

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
  /** Index of station at which it fails, or null if it succeeds */
  failAt: number | null
  /** Custom failure message */
  failMessage?: string
  /** Extra delay multiplier for the journey */
  speed: number
}

export const MODES: GameMode[] = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'A healthy transaction that completes successfully.',
    failAt: null,
    speed: 1,
  },
  {
    id: 'bank-busy',
    label: 'Bank Server Busy',
    description: 'The sender bank is overloaded and cannot respond in time.',
    failAt: 3,
    failMessage: 'Sender bank server busy \u2014 please try again',
    speed: 1.1,
  },
  {
    id: 'network-delay',
    label: 'Network Delay',
    description: 'Everything works, but each hop is sluggish.',
    failAt: null,
    speed: 2.1,
  },
  {
    id: 'insufficient',
    label: 'Insufficient Balance',
    description: 'The sender account does not have enough money.',
    failAt: 3,
    failMessage: 'Insufficient balance in sender account',
    speed: 1,
  },
  {
    id: 'npci-timeout',
    label: 'NPCI Timeout',
    description: 'The NPCI switch times out while routing the request.',
    failAt: 4,
    failMessage: 'NPCI timeout \u2014 transaction reversed',
    speed: 1.4,
  },
]

export interface Level {
  level: number
  title: string
  minXp: number
}

export const LEVELS: Level[] = [
  { level: 1, title: 'UPI Beginner', minXp: 0 },
  { level: 2, title: 'Payment Explorer', minXp: 30 },
  { level: 3, title: 'Network Wizard', minXp: 80 },
  { level: 4, title: 'Infrastructure Master', minXp: 160 },
]

export function getLevel(xp: number): Level {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) current = lvl
  }
  return current
}

export function getNextLevel(xp: number): Level | null {
  return LEVELS.find((l) => l.minXp > xp) ?? null
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
