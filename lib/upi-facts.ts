export type FactDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export interface FunFact {
  id: string
  title: string
  fact: string
  why: string
  difficulty: FactDifficulty
}

/**
 * 100+ educational facts about UPI and India's payment infrastructure.
 * Facts unlock randomly with no duplicates until all are discovered.
 */
export const FUN_FACTS: FunFact[] = [
  // ----------------------------- Beginner -----------------------------
  { id: 'b1', title: 'What UPI Means', fact: 'UPI stands for Unified Payments Interface.', why: 'It unifies many banks under one simple, instant payment system.', difficulty: 'Beginner' },
  { id: 'b2', title: 'No Account Number', fact: 'You can pay using a VPA like name@bank instead of an account number and IFSC.', why: 'It makes sending money as easy as typing an email address.', difficulty: 'Beginner' },
  { id: 'b3', title: 'Open 24x7', fact: 'UPI works around the clock, including weekends and holidays.', why: 'Money moves whenever you need it, not just on banking days.', difficulty: 'Beginner' },
  { id: 'b4', title: 'Free For You', fact: 'Person-to-person UPI payments are free for users.', why: 'Zero fees encouraged hundreds of millions to adopt digital payments.', difficulty: 'Beginner' },
  { id: 'b5', title: 'Instant Transfer', fact: 'A UPI payment usually settles within a couple of seconds.', why: 'Speed makes UPI feel like handing over cash.', difficulty: 'Beginner' },
  { id: 'b6', title: 'Who Runs UPI', fact: 'NPCI (National Payments Corporation of India) operates UPI.', why: 'A single trusted operator keeps every bank interoperable.', difficulty: 'Beginner' },
  { id: 'b7', title: 'One QR Code', fact: 'A single UPI QR code can be scanned by any UPI app.', why: 'Merchants need just one sticker for every customer.', difficulty: 'Beginner' },
  { id: 'b8', title: 'Any App, Any Bank', fact: 'A UPI app from one company can pay an account at any other bank.', why: 'Interoperability means you are never locked into one provider.', difficulty: 'Beginner' },
  { id: 'b9', title: 'PIN Protected', fact: 'Every payment is authorised with a secret UPI PIN.', why: 'Even if someone has your phone, they cannot pay without the PIN.', difficulty: 'Beginner' },
  { id: 'b10', title: 'Launched In 2016', fact: 'UPI was launched in April 2016.', why: 'In under a decade it became the world\u2019s busiest real-time payment system.', difficulty: 'Beginner' },
  { id: 'b11', title: 'BHIM App', fact: 'BHIM is NPCI\u2019s own reference UPI app, named after Dr. B. R. Ambedkar.', why: 'It set a standard that other apps build on.', difficulty: 'Beginner' },
  { id: 'b12', title: 'Scan And Pay', fact: 'You can pay just by scanning a merchant\u2019s QR code.', why: 'No card machine or cash needed at the shop.', difficulty: 'Beginner' },
  { id: 'b13', title: 'Request Money', fact: 'UPI lets you send a collect request to ask someone to pay you.', why: 'Useful for splitting bills or collecting dues.', difficulty: 'Beginner' },
  { id: 'b14', title: 'Mobile Number Pay', fact: 'You can send money using just a registered mobile number.', why: 'You don\u2019t even need to know the person\u2019s VPA.', difficulty: 'Beginner' },
  { id: 'b15', title: 'Small Or Large', fact: 'UPI works for a tiny tea-stall payment or a large transfer alike.', why: 'It serves both street vendors and big purchases.', difficulty: 'Beginner' },
  { id: 'b16', title: 'Bank In Charge', fact: 'Your money always stays in your bank account until you pay.', why: 'UPI moves money directly, not through a stored wallet.', difficulty: 'Beginner' },
  { id: 'b17', title: 'Many Languages', fact: 'UPI apps support multiple Indian languages.', why: 'It brings digital payments to non-English speakers.', difficulty: 'Beginner' },
  { id: 'b18', title: 'Daily Habit', fact: 'Millions use UPI several times a day for everyday spends.', why: 'It replaced loose change for many Indians.', difficulty: 'Beginner' },
  { id: 'b19', title: 'No Internet Option', fact: 'UPI can work without internet using the *99# USSD service.', why: 'Even basic feature phones can make payments.', difficulty: 'Beginner' },
  { id: 'b20', title: 'Linked Accounts', fact: 'You can link more than one bank account to a single UPI app.', why: 'Pay from whichever account you choose.', difficulty: 'Beginner' },
  { id: 'b21', title: 'Receiver Notified', fact: 'The receiver gets an instant notification when money lands.', why: 'Both sides get certainty within seconds.', difficulty: 'Beginner' },
  { id: 'b22', title: 'Refunds Travel Back', fact: 'A failed payment is auto-reversed to your account.', why: 'You don\u2019t lose money when something goes wrong.', difficulty: 'Beginner' },
  { id: 'b23', title: 'Check Balance', fact: 'You can check your bank balance inside a UPI app.', why: 'No need to visit an ATM or net banking.', difficulty: 'Beginner' },
  { id: 'b24', title: 'Set Your VPA', fact: 'You can create a custom VPA like yourname@bank.', why: 'Easy to remember and share.', difficulty: 'Beginner' },
  { id: 'b25', title: 'Works On Festivals', fact: 'UPI keeps running during festivals when banks are closed.', why: 'Gifting money instantly is always possible.', difficulty: 'Beginner' },

  // --------------------------- Intermediate ---------------------------
  { id: 'i1', title: 'PSP Explained', fact: 'A PSP is a Payment Service Provider that connects you to UPI.', why: 'PSPs let non-banks like GPay offer bank-grade payments.', difficulty: 'Intermediate' },
  { id: 'i2', title: 'VPA Resolution', fact: 'NPCI resolves a VPA to the correct destination bank account.', why: 'This routing is why any VPA can receive money.', difficulty: 'Intermediate' },
  { id: 'i3', title: 'Two Legs', fact: 'A UPI transfer has a debit leg and a credit leg.', why: 'Money is taken from one account and added to another atomically.', difficulty: 'Intermediate' },
  { id: 'i4', title: 'Daily Limits', fact: 'UPI has per-transaction and daily limits set by NPCI and banks.', why: 'Limits reduce the damage from fraud or errors.', difficulty: 'Intermediate' },
  { id: 'i5', title: 'Collect vs Pay', fact: 'A pay request pushes money; a collect request pulls it.', why: 'Merchants often use collect; you use pay.', difficulty: 'Intermediate' },
  { id: 'i6', title: 'UPI Lite', fact: 'UPI Lite enables small-value payments without entering a PIN.', why: 'Faster checkout for tiny everyday amounts.', difficulty: 'Intermediate' },
  { id: 'i7', title: 'UPI AutoPay', fact: 'AutoPay allows recurring mandates for subscriptions.', why: 'Automates rent, OTT and bill payments safely.', difficulty: 'Intermediate' },
  { id: 'i8', title: 'Sponsor Bank', fact: 'Apps connect to UPI through a sponsoring PSP bank.', why: 'Banks remain the regulated backbone of every payment.', difficulty: 'Intermediate' },
  { id: 'i9', title: 'Beneficiary Validation', fact: 'UPI can verify the payee name before you confirm.', why: 'You see who you are actually paying.', difficulty: 'Intermediate' },
  { id: 'i10', title: 'Merchant MDR', fact: 'P2M payments may carry merchant fees, while P2P stays free.', why: 'It funds the ecosystem without charging consumers.', difficulty: 'Intermediate' },
  { id: 'i11', title: 'Aggregator Role', fact: 'Aggregators help businesses accept and reconcile payments.', why: 'They simplify integration for thousands of merchants.', difficulty: 'Intermediate' },
  { id: 'i12', title: 'Static vs Dynamic QR', fact: 'Static QR has no amount; dynamic QR encodes a specific amount.', why: 'Dynamic QR reduces wrong-amount mistakes.', difficulty: 'Intermediate' },
  { id: 'i13', title: 'Transaction ID', fact: 'Every UPI payment carries a unique transaction reference (RRN).', why: 'It lets you trace and dispute a specific payment.', difficulty: 'Intermediate' },
  { id: 'i14', title: 'Mandate', fact: 'A UPI mandate pre-authorises a future or recurring payment.', why: 'Enables IPOs, SIPs and subscriptions.', difficulty: 'Intermediate' },
  { id: 'i15', title: 'UPI Numbers', fact: 'A UPI Number is a mobile-like ID you can map to your account.', why: 'Easier to share than a full VPA.', difficulty: 'Intermediate' },
  { id: 'i16', title: 'Chargeback Window', fact: 'Disputes follow defined chargeback timelines set by NPCI.', why: 'Gives a fair process when payments go wrong.', difficulty: 'Intermediate' },
  { id: 'i17', title: 'Multi-bank Apps', fact: 'A single app can register VPAs across several banks.', why: 'Flexibility to pay from any linked account.', difficulty: 'Intermediate' },
  { id: 'i18', title: 'Credit On UPI', fact: 'Credit lines and RuPay credit cards can be linked to UPI.', why: 'You can pay on credit by scanning a QR.', difficulty: 'Intermediate' },
  { id: 'i19', title: 'Reversal Timelines', fact: 'Stuck debits are auto-reversed within a defined TAT.', why: 'Regulation protects users from being left out of pocket.', difficulty: 'Intermediate' },
  { id: 'i20', title: 'P2P vs P2M', fact: 'UPI separates person-to-person from person-to-merchant flows.', why: 'Different rules, limits and fees apply to each.', difficulty: 'Intermediate' },
  { id: 'i21', title: 'Tap To Pay', fact: 'UPI Tap & Pay uses NFC to pay by tapping a tag.', why: 'Brings contactless convenience to UPI.', difficulty: 'Intermediate' },
  { id: 'i22', title: 'International UPI', fact: 'UPI now works in several countries for Indian travellers.', why: 'Pay abroad with the same app you use at home.', difficulty: 'Intermediate' },
  { id: 'i23', title: 'Two-Factor', fact: 'Device binding plus UPI PIN gives two-factor security.', why: 'Both your phone and your secret PIN are required.', difficulty: 'Intermediate' },
  { id: 'i24', title: 'Bill Payments', fact: 'UPI integrates with BBPS for utility bill payments.', why: 'One app pays electricity, gas and more.', difficulty: 'Intermediate' },
  { id: 'i25', title: 'Switch Banks', fact: 'You can change your default UPI bank account anytime.', why: 'Control which account funds your payments.', difficulty: 'Intermediate' },

  // ----------------------------- Advanced -----------------------------
  { id: 'a1', title: 'The Central Switch', fact: 'NPCI runs a central switch that routes every UPI message.', why: 'It is the traffic controller for the whole network.', difficulty: 'Advanced' },
  { id: 'a2', title: 'ISO 8583 Roots', fact: 'UPI messaging evolved from card-style financial message standards.', why: 'Proven banking protocols made it reliable from day one.', difficulty: 'Advanced' },
  { id: 'a3', title: 'API Driven', fact: 'UPI is built on open APIs that banks and apps implement.', why: 'Open standards let anyone innovate on top of it.', difficulty: 'Advanced' },
  { id: 'a4', title: 'Common Library', fact: 'The NPCI Common Library (CL) captures and encrypts the UPI PIN.', why: 'The app never touches your raw PIN, improving security.', difficulty: 'Advanced' },
  { id: 'a5', title: 'Net Settlement', fact: 'Banks settle net positions with each other in scheduled cycles.', why: 'Individual instant credits are reconciled in bulk later.', difficulty: 'Advanced' },
  { id: 'a6', title: 'Deemed Approval', fact: 'If a bank is silent too long, NPCI can apply deemed rules.', why: 'Prevents transactions from hanging forever.', difficulty: 'Advanced' },
  { id: 'a7', title: 'Idempotency', fact: 'Unique RRNs prevent the same payment from being processed twice.', why: 'Protects against accidental double debits on retries.', difficulty: 'Advanced' },
  { id: 'a8', title: 'TPV Checks', fact: 'Third-party validation confirms account ownership during linking.', why: 'Stops people from linking accounts they don\u2019t own.', difficulty: 'Advanced' },
  { id: 'a9', title: 'Risk Scoring', fact: 'Transactions are scored for fraud risk in real time.', why: 'Suspicious payments can be challenged or blocked.', difficulty: 'Advanced' },
  { id: 'a10', title: 'Mapper Database', fact: 'NPCI keeps a mapper linking mobile numbers to bank accounts.', why: 'It powers pay-by-mobile-number routing.', difficulty: 'Advanced' },
  { id: 'a11', title: 'Throughput Scale', fact: 'UPI handles tens of thousands of transactions per second at peak.', why: 'Few systems on earth operate at this real-time scale.', difficulty: 'Advanced' },
  { id: 'a12', title: 'Multiplexing PSPs', fact: 'Large apps spread load across multiple sponsor banks.', why: 'It keeps success rates high during traffic spikes.', difficulty: 'Advanced' },
  { id: 'a13', title: 'Signed Requests', fact: 'UPI messages are digitally signed end to end.', why: 'Signatures prove a message wasn\u2019t tampered with.', difficulty: 'Advanced' },
  { id: 'a14', title: 'Credit Leg Routing', fact: 'NPCI routes the credit leg to the resolved beneficiary PSP.', why: 'This is the step that finds the receiver\u2019s bank.', difficulty: 'Advanced' },
  { id: 'a15', title: 'Reconciliation Files', fact: 'Banks exchange daily recon files to match every transaction.', why: 'Ensures no payment is silently lost.', difficulty: 'Advanced' },
  { id: 'a16', title: 'Mandate Engine', fact: 'A dedicated mandate engine manages recurring authorisations.', why: 'Powers AutoPay across millions of subscriptions.', difficulty: 'Advanced' },
  { id: 'a17', title: 'UPI Circle', fact: 'UPI Circle lets a primary user delegate payments to others.', why: 'Family members can transact within set controls.', difficulty: 'Advanced' },
  { id: 'a18', title: 'Hello UPI', fact: 'Conversational and voice-based UPI payments are being rolled out.', why: 'Lowers the barrier for first-time and rural users.', difficulty: 'Advanced' },
  { id: 'a19', title: 'Geo-tagging', fact: 'Transactions can be geo-tagged for infrastructure planning.', why: 'Helps expand acceptance where demand is high.', difficulty: 'Advanced' },
  { id: 'a20', title: 'Fraud Negative List', fact: 'Known fraudulent VPAs can be flagged across the network.', why: 'Shared intelligence protects all users at once.', difficulty: 'Advanced' },
  { id: 'a21', title: 'Latency Budget', fact: 'Each hop has strict response-time expectations.', why: 'Tight budgets keep the end-to-end experience instant.', difficulty: 'Advanced' },
  { id: 'a22', title: 'Switch Redundancy', fact: 'The central switch runs with high-availability redundancy.', why: 'A single failure shouldn\u2019t stop national payments.', difficulty: 'Advanced' },
  { id: 'a23', title: 'Tokenisation', fact: 'Sensitive identifiers are tokenised across the flow.', why: 'Reduces exposure of real account details.', difficulty: 'Advanced' },
  { id: 'a24', title: 'Purpose Codes', fact: 'Transactions carry purpose codes for regulatory clarity.', why: 'Useful for compliance and reporting.', difficulty: 'Advanced' },
  { id: 'a25', title: 'Sandbox Testing', fact: 'NPCI offers a sandbox for banks and apps to test integrations.', why: 'New features are validated before going live.', difficulty: 'Advanced' },

  // ------------------------------ Expert ------------------------------
  { id: 'e1', title: 'Volume Crown', fact: 'UPI is the world\u2019s largest real-time payment system by volume.', why: 'It processes more instant payments than any other network.', difficulty: 'Expert' },
  { id: 'e2', title: 'Billions Monthly', fact: 'UPI processes well over 10 billion transactions per month.', why: 'Shows the staggering scale of India\u2019s digital economy.', difficulty: 'Expert' },
  { id: 'e3', title: 'Global Expansion', fact: 'UPI is being linked with other countries\u2019 fast-payment systems.', why: 'Cross-border instant payments are becoming reality.', difficulty: 'Expert' },
  { id: 'e4', title: 'PayNow Link', fact: 'UPI is interlinked with Singapore\u2019s PayNow system.', why: 'Enables near-instant India\u2013Singapore remittances.', difficulty: 'Expert' },
  { id: 'e5', title: 'Public Good', fact: 'UPI is run as digital public infrastructure, not for profit.', why: 'Its goal is financial inclusion, not maximising fees.', difficulty: 'Expert' },
  { id: 'e6', title: 'Stack Layer', fact: 'UPI is a key layer of the broader India Stack.', why: 'It combines with Aadhaar and eKYC for inclusion at scale.', difficulty: 'Expert' },
  { id: 'e7', title: 'Zero-MDR Policy', fact: 'Government policy has kept MDR at zero for many UPI flows.', why: 'It accelerated merchant acceptance nationwide.', difficulty: 'Expert' },
  { id: 'e8', title: 'CBDC Bridge', fact: 'UPI QR is being made interoperable with the digital rupee (CBDC).', why: 'One QR could accept both UPI and central-bank money.', difficulty: 'Expert' },
  { id: 'e9', title: 'Offline Payments', fact: 'NPCI is expanding offline and proximity payment modes.', why: 'Keeps payments working with poor connectivity.', difficulty: 'Expert' },
  { id: 'e10', title: 'Open Protocol Export', fact: 'Several countries are adopting UPI-like models or the tech itself.', why: 'India\u2019s rails are becoming a global template.', difficulty: 'Expert' },
  { id: 'e11', title: 'Resilience Drills', fact: 'The ecosystem runs disaster-recovery and failover drills.', why: 'National payment uptime is treated as critical infrastructure.', difficulty: 'Expert' },
  { id: 'e12', title: 'Throughput Records', fact: 'UPI repeatedly breaks its own monthly volume records.', why: 'Growth has compounded year after year.', difficulty: 'Expert' },
  { id: 'e13', title: 'Inclusion Engine', fact: 'UPI brought millions of first-time users into formal finance.', why: 'Digital payments became a gateway to credit and savings.', difficulty: 'Expert' },
  { id: 'e14', title: 'Interchange Debate', fact: 'Interchange on PPI-based merchant payments sparked policy debate.', why: 'It shapes who pays for running the network.', difficulty: 'Expert' },
  { id: 'e15', title: 'Data Localisation', fact: 'UPI payment data is stored within India per RBI rules.', why: 'Sovereignty over sensitive financial data.', difficulty: 'Expert' },
  { id: 'e16', title: 'Market Cap Rule', fact: 'A volume cap per app was proposed to avoid concentration.', why: 'Keeps the ecosystem competitive and resilient.', difficulty: 'Expert' },
  { id: 'e17', title: 'Real-time Settlement', fact: 'Instant credit is decoupled from slower interbank settlement.', why: 'Users get speed while banks settle safely in cycles.', difficulty: 'Expert' },
  { id: 'e18', title: 'Fraud Economics', fact: 'Most UPI fraud is social engineering, not protocol hacking.', why: 'The weakest link is human trust, not the technology.', difficulty: 'Expert' },
  { id: 'e19', title: 'Lite X', fact: 'UPI Lite X enables offline small payments via on-device balance.', why: 'Pay even with no network on either side.', difficulty: 'Expert' },
  { id: 'e20', title: 'Voice In Vernacular', fact: 'Conversational UPI supports regional languages and voice.', why: 'Brings the next hundred million users online.', difficulty: 'Expert' },
  { id: 'e21', title: 'Credit Line Rails', fact: 'Pre-sanctioned bank credit lines are accessible over UPI.', why: 'Turns UPI into a distribution channel for credit.', difficulty: 'Expert' },
  { id: 'e22', title: 'Tap Ecosystem', fact: 'NFC tap acceptance is expanding for faster offline checkout.', why: 'Combines card-like tapping with UPI economics.', difficulty: 'Expert' },
  { id: 'e23', title: 'Interop CBDC QR', fact: 'A unified QR can route to UPI or CBDC depending on choice.', why: 'Simplifies acceptance as digital currency rolls out.', difficulty: 'Expert' },
  { id: 'e24', title: 'Sound Box', fact: 'Audio confirmation devices announce successful UPI payments.', why: 'Lets busy merchants confirm payments without a screen.', difficulty: 'Expert' },
  { id: 'e25', title: 'Always Evolving', fact: 'NPCI ships new UPI features continuously based on usage data.', why: 'The rails keep adapting to how India actually pays.', difficulty: 'Expert' },
]

export const DIFFICULTY_ORDER: FactDifficulty[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
]

export const DIFFICULTY_COLOR: Record<FactDifficulty, string> = {
  Beginner: 'var(--arcade-cyan)',
  Intermediate: 'var(--coin)',
  Advanced: 'var(--arcade-magenta)',
  Expert: 'var(--destructive)',
}
