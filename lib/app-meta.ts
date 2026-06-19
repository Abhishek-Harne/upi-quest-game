export const APP_META = {
  name: 'UPI Quest: Follow Your Money',
  version: '2.0.0',
  build: '2026.06.19',
  lastUpdated: 'June 19, 2026',
  creator: 'Abhishek Harne',
  links: {
    linkedin: 'https://www.linkedin.com/in/abhishek-harne/',
    github: 'https://github.com/Abhishek-Harne',
    website: 'https://abhishekharne.vercel.app/#ai',
    source: 'https://github.com/Abhishek-Harne/upi-quest-game',
  },
}

export interface ChangelogEntry {
  version: string
  date: string
  notes: string[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: 'June 2026',
    notes: [
      'Guided museum-tour demo mode with node narration',
      'Visible energy packet that travels the network',
      'Infrastructure X-Ray (technical) mode',
      'Customisable apps, aggregators and banks',
      'Mobile-first vertical journey timeline',
      'Cyber Security Challenge: Defend the Transaction',
      '100+ collectible educational facts',
      'Persistent session stats, XP and 5 levels',
      'Toast notifications, tooltips and accessibility controls',
    ],
  },
  {
    version: '1.0.0',
    date: 'May 2026',
    notes: [
      'Initial pixel-art UPI journey',
      'Basic transaction animation and failure modes',
      'First set of fun facts and XP',
    ],
  },
]

export const HOW_UPI_WORKS = [
  'You enter an amount and approve it with your secret UPI PIN on your phone.',
  'Your UPI app packages the request with your VPA and hands it to the rails.',
  'An aggregator/gateway validates and forwards business payments.',
  'Your bank verifies the account and balance, then authorises the debit.',
  'NPCI \u2014 the central switch \u2014 routes the request to the right destination bank.',
  'The receiver\u2019s bank credits the money and a confirmation flows back instantly.',
]
