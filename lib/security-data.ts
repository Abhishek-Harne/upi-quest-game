export interface SecurityScenario {
  id: string
  /** The attack the pixel hacker attempts */
  attack: string
  attackDesc: string
  /** How the Cyber Guardian blocks it */
  defense: string
  defenseDesc: string
  /** The takeaway lesson */
  lesson: string
}

export const SECURITY_SCENARIOS: SecurityScenario[] = [
  {
    id: 'phishing',
    attack: 'Phishing Attack',
    attackDesc:
      'A fake "bank" message asks you to share your UPI PIN to "verify" your account.',
    defense: 'PIN Never Shared',
    defenseDesc:
      'UPI never asks for your PIN to receive money. The Guardian blocks the request before it reaches the rails.',
    lesson:
      'You only ever enter your UPI PIN to SEND money \u2014 never to receive it, and never to anyone who asks.',
  },
  {
    id: 'fake-link',
    attack: 'Fake Payment Link',
    attackDesc:
      'A scammer sends a collect request disguised as "cashback you will receive".',
    defense: 'Collect Request Flagged',
    defenseDesc:
      'Approving a collect request PAYS money out. The Guardian highlights that this is a debit, not a credit.',
    lesson:
      'Approving a request sends money FROM you. Read every request carefully before approving.',
  },
  {
    id: 'credential-theft',
    attack: 'Credential Theft',
    attackDesc:
      'Malware tries to read your UPI PIN as you type it into the app.',
    defense: 'Encrypted Common Library',
    defenseDesc:
      'The NPCI Common Library captures and encrypts the PIN end-to-end, so even the app never sees it in plain text.',
    lesson:
      'Your UPI PIN is encrypted on a secure layer \u2014 keep your device locked and avoid untrusted apps.',
  },
  {
    id: 'session-hijack',
    attack: 'Session Hijack',
    attackDesc:
      'An attacker tries to reuse your payment session from another device.',
    defense: 'Device Binding',
    defenseDesc:
      'UPI binds your account to your registered device and SIM. The Guardian rejects the unknown device.',
    lesson:
      'Device binding means a stolen session is useless without your specific phone and SIM.',
  },
  {
    id: 'qr-tamper',
    attack: 'QR Code Tampering',
    attackDesc:
      'A sticker with a different VPA is pasted over a shop\u2019s real QR code.',
    defense: 'Payee Name Check',
    defenseDesc:
      'UPI shows the resolved payee name before you confirm. The Guardian surfaces the mismatch.',
    lesson:
      'Always check the payee name shown by your app matches the person you intend to pay.',
  },
  {
    id: 'sim-swap',
    attack: 'SIM Swap',
    attackDesc:
      'An attacker ports your number to a new SIM to capture OTPs.',
    defense: 'Re-registration Required',
    defenseDesc:
      'A new SIM must re-register and re-verify before it can transact. The Guardian halts the new device.',
    lesson:
      'If your mobile network suddenly stops, contact your operator \u2014 it could be a SIM-swap attempt.',
  },
]
