# Ony's Boutique - Codebase Context

> **This is the authoritative context for the whole codebase.** Claude Code automatically
> loads this file at the start of **every** session, so read it instead of re-reading every
> source file. Treat it as the source of truth for structure, conventions, and IDs.
>
> **How it stays current (see [Maintaining This File](#maintaining-this-file) at the bottom):**
> 1. Claude Code loads `CLAUDE.md` into context on every session start — no manual step needed.
> 2. A `PostToolUse` hook in `.claude/settings.json` fires after any `Edit`/`Write` to a
>    source file and reminds Claude to reconcile the affected section of this file before
>    finishing. Keep this file in sync as part of normal work — do not let it drift.

---

## Project Identity

| Field | Value |
|---|---|
| Package name | `omygoodies-website` |
| Version | `0.1.0` |
| Business | Ony's Boutique - luxury custom cake bakery, Calgary AB |
| Site title | "Ony's Boutique Custom Cakes \| Calgary Custom Cakes" |
| GitHub remote | `https://github.com/CoffeeAurCode/ohmygoddiescake_work` |

**What it is:** A single-page marketing + ordering website. The order form POSTs to `/api/book`
which upserts a Square Customer, creates a Square Appointment (Bookings API), and sends an SMS to
the bakery via Twilio. No payment is collected on the site.

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI runtime | React 19.2.5 + React DOM 19.2.5 |
| Types | TypeScript 5, `@types/react` ^18, `@types/react-dom` ^18 (types lag the 19 runtime) |
| Styling | Tailwind CSS 3.4.1 + PostCSS 8 + Autoprefixer |
| Animation (React) | Framer Motion 11.18.2 |
| Animation (imperative) | GSAP 3.15.0 |
| Icons | Lucide React 0.525.0 |
| Fonts | Playfair Display, DM Sans, Plus Jakarta Sans, Fraunces (Google Fonts via `layout.tsx`) |
| Booking backend | Square SDK `square` ^44.1.0 — Customers + Bookings (Appointments) + Catalog APIs |
| SMS | Twilio `twilio` ^6.0.2 — notifies bakery on every order |
| Analytics | Google Ads/Analytics gtag `AW-18161715420` + Microsoft Clarity (`x5m78bkkkd`), both loaded in `layout.tsx` via `next/script` |
| Scripts env | `dotenv` ^17.4.2 (dev dep) — loads `.env.local` in standalone `tsx` scripts |

> `node_modules` also contains `square-legacy` (a transitive/transitional dependency). Application
> code imports from `square` (v44), not `square-legacy`.

---

## Commands

```bash
npm install        # install deps
npm run dev        # dev server -> http://localhost:3000
npm run build      # production build
npm start          # serve production build

# One-off scripts (run from project root)
npx tsx scripts/verify-square.ts        # confirm all 3 Square IDs resolve
npx tsx scripts/test-all.ts             # full automated test suite
npx tsx scripts/test-pure-functions.ts  # test buildBookingNote / buildSmsText (no network)
npx tsx scripts/test-sms.ts             # send a test SMS to BAKERY_PHONE_NUMBER
npx tsx scripts/test-booking.ts         # create a test booking in isolation
npx tsx scripts/test-customer.ts        # test customer upsert in isolation
npx tsx scripts/check-bookings.ts       # debug: dump booking/service/team-member profiles
```

Dev server config lives in `.claude/launch.json` (port 3000).

---

## Environment Variables (`.env.local` — never commit)

```bash
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=...           # Production personal access token
SQUARE_LOCATION_ID=LQM8M66HZ3T9Y
SQUARE_SERVICE_VARIATION_ID=5UMWC66OIJ34W5C3OZYJVYIQ
SQUARE_TEAM_MEMBER_ID=TMVuMCy5R3MIM7D5

TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+13653892801
BAKERY_PHONE_NUMBER=+919998064026
```

**Critical pattern:** `lib/square.ts` and `lib/sms.ts` initialize their clients lazily (at call
time, not module load time). This is required because scripts load `.env.local` via
`config({ path: '.env.local' })` in the module body — ES module hoisting means the client must not
be created at the top level or env vars won't be set yet. Next.js API routes are unaffected
(Next.js loads env before any module), but do NOT revert the lazy pattern.

---

## Directory Map

```
ohmygoddiescake_work/
  app/
    layout.tsx            # Root layout - fonts, <html>, metadata (incl. metadataBase), gtag + Microsoft Clarity scripts, ScrollProgressBar, grain overlay
    icon.png              # Favicon (32px OB mark) - Next.js file-based metadata, auto-wired
    apple-icon.png        # 180px apple-touch-icon on brand cream - auto-wired
    opengraph-image.jpg   # 1200x630 social share card - auto-wired
    page.tsx              # Main page - imports & orders the rendered section components
    globals.css           # All global utilities, animations, grain overlay, marquee keyframes
    api/
      book/
        route.ts          # POST /api/book — upserts Square customer, creates booking, sends SMS
  components/
    Navbar.tsx            # Fixed top nav, desktop + mobile hamburger menu
    Hero.tsx              # Full-screen video background, Framer Motion staggered headline
    Services.tsx          # Bento/parallax image grid - 3 service cards
    HowItWorks.tsx        # 3-step timeline (fill form -> customize -> confirm)
    Pricing.tsx           # Price tables: Birthday, Wedding, Corporate, Extras (NOT rendered in page.tsx)
    OrderCTA.tsx          # 5-step order wizard — LIVE, POSTs to /api/book. Exports named `OrderForm`
    FlavorsOptions.tsx    # Tabbed display: Flavors / Frostings / Sizes (used inside OrderCTA)
    AddOns.tsx            # Add-on picker: disco balls, florals, etc. (used inside OrderCTA)
    Reviews.tsx           # Testimonials marquee strip
    About.tsx             # "Our Story" - founded 2020, Ony's background
    Footer.tsx            # Contact, nav links, Instagram
    FAQ.tsx               # FAQ accordion (NOT rendered in page.tsx)
    Policies.tsx          # Policies section (NOT rendered in page.tsx)
    WhyUs.tsx             # Brand-value section (NOT rendered in page.tsx)
    PillNav.tsx           # Reusable pill tab navigator - GSAP hover animations
    PillNav.css           # Scoped styles for PillNav
    SectionReveal.tsx     # Scroll-triggered fade-in wrapper (Framer Motion whileInView)
    ScrollProgressBar.tsx # Thin progress bar at top of viewport tied to page scroll
  lib/
    square.ts             # Square client (lazy) + OrderPayload type + booking/customer helpers
    sms.ts                # Twilio client (lazy) + notifyBakery() + buildSmsText()
    pricing.ts            # Shared pricing rules — MINIMUM_ORDER_TOTAL. Client-safe (no env/secrets)
  scripts/
    setup-square.ts          # One-time: create "Custom Cake Order" service in Square Catalog
    fix-service-type.ts      # One-time: set productType=APPOINTMENTS_SERVICE (already run)
    verify-square.ts         # Confirm all 3 Square IDs resolve — run after any ID change
    test-all.ts              # Full automated test suite
    test-pure-functions.ts   # Unit-test pure formatters (buildBookingNote/buildSmsText), no network
    test-customer.ts         # Isolated customer upsert test
    test-booking.ts          # Isolated booking creation test
    test-sms.ts              # Isolated SMS send test
    check-bookings.ts        # Debug: dump booking profile + service variation + team member profiles
  public/
    logo.jpg              # Master brand logo as supplied (1536x1024, cream background)
    logo-mark.png         # 512px square OB mark, transparent - navbar well + icon source
    logo-full.png         # Full lockup (mark + wordmark), transparent - light surfaces
    logo-full-light.png   # Cream-inked lockup, transparent - dark surfaces (Footer)
    2165958_Ceremony_Wedding_1920x1080.mp4   # Hero video
    Startinglogorevealanimation.mp4
    Celebration_*.png     # Birthday, Wedding, Corporate, Baby Shower, Anniversary, Other
    Flavor_*.png          # Vanilla, Chocolate, Lemon, Coconut, Carrot, RedVelvet, Marble, Funfetti
    Frosting_*.png        # Buttercream, Fondant, Ganache, Naked, SemiNaked
    Addon_*.png           # Butterflies, Cherries, Crown, DippedStrawberries, Disco, etc.
    [UUID].jpg/png        # Portfolio showcase photos
  tailwind.config.js    # Custom color palette, shadows, animations - read before adding styles
  next.config.js        # Minimal (empty options object)
  tsconfig.json         # Target ES2017, strict mode
  postcss.config.js
  package.json
  client-guide.html     # Client-facing guide for using the Square Dashboard (BUILT)
  .claude/
    launch.json         # Dev server launch config
    settings.json       # Claude Code hooks (incl. CLAUDE.md sync reminder)
  INTEGRATION_COMPLETE.md     # Record of what was built, IDs, test results, known limitations
  CLIENT_GUIDE_PLAN.md        # Plan behind client-guide.html
  SQUARE_INTEGRATION_PLAN.md  # Original implementation spec (reference)
  SQUARE_TEST_PLAN.md         # Test strategy reference
  SQUARE_FULL_TEST_PLAN.md    # Expanded test plan reference
  SESSION_*.md                # Transient Claude session logs — not project docs, safe to ignore
```

---

## Page Composition (`app/page.tsx`)

Components render in this order — single page scroll flow. `OrderForm` is imported as a **named**
export from `OrderCTA.tsx` (`import { OrderForm } from '@/components/OrderCTA'`); there is no
default export. Most below-the-fold sections are wrapped in `<SectionReveal>`:

1. `<Navbar />`
2. `<Hero />`
3. `<Services />`
4. `<SectionReveal><HowItWorks /></SectionReveal>`
5. `<SectionReveal><OrderForm /></SectionReveal>` ← main conversion section, form is live
6. `<SectionReveal><Reviews /></SectionReveal>`
7. `<SectionReveal><About /></SectionReveal>`
8. `<Footer />`

**Built but NOT currently rendered in `page.tsx`:** `Pricing`, `FAQ`, `Policies`, `WhyUs`.

---

## OrderCTA.tsx — Key Component Detail

The most complex component. Self-contained multi-step wizard, fully wired to the backend. Exported
as the named function `OrderForm()`. `TOTAL_STEPS = 5`.

| Step | `STEP_LABELS` | Tab label | Content |
|---|---|---|---|
| 1 | Celebrate | Occasion | Occasion selection (Birthday, Wedding, Corporate, Baby Shower, Anniversary, Other) |
| 2 | Cake | Cake | Flavor, frosting, size, layers, servings (uses `FlavorsOptions`) |
| 3 | Add-ons | Add-ons | Add-on selection (uses `AddOns`) |
| 4 | Date | Summary | Custom calendar date picker + pickup time slot + fulfillment (pickup/delivery) |
| 5 | Contact | Contact | Name, email, phone, notes + **Submit** button |

- All wizard state is local React (`useState`).
- On submit: POSTs the `OrderPayload`-shaped `form` state to `POST /api/book`.
- `submitting` state disables the button and shows a sending label.
- `submitError` state shows an inline error if the API call fails.
- `submitted: true` triggers the success confirmation screen.
- Dynamic pricing preview (`estimatedTotal`) updates as the user selects options.
- **Minimum order:** `MINIMUM_ORDER_TOTAL` ($130, from `lib/pricing.ts`) gates the wizard. Step 3's
  Next button and step 5's Submit button are both disabled while `orderTotal < MINIMUM_ORDER_TOTAL`,
  each with an inline note showing the shortfall. Step 3 is the last step where the total can still
  change, but step 5 is gated too because the step tabs let a user edit back down below the minimum.

---

## `app/api/book/route.ts` — API Route

`POST /api/book`. Parses JSON into `OrderPayload`; rejects with 400 if `name`, `email`, or
`pickupDate` is missing, or if `estimatedTotal` is absent/non-numeric/below `MINIMUM_ORDER_TOTAL`
(the server-side half of the $130 minimum). Then runs three operations in sequence:

1. `upsertCustomer(order)` — searches Square by email; creates if not found
2. `createBooking(customerId, order, note)` — creates Square Appointment at the chosen pickup slot
3. `notifyBakery(smsText)` — sends Twilio SMS to `BAKERY_PHONE_NUMBER`
   (**non-fatal**: logs the error but does not fail the order if SMS fails)

Returns `{ success: true, bookingId }` (200) on success; `{ error: string }` with 400/500 on failure.

---

## `lib/square.ts` — Key Exports

| Export | Type | Description |
|---|---|---|
| `getSquareClient()` | function | Lazily creates & caches the `SquareClient` (reads env at first call) |
| `squareClient` | `SquareClient` (Proxy) | Convenience proxy that forwards to `getSquareClient()` |
| `OrderPayload` | type | Shape of the form data POSTed to `/api/book` (see below) |
| `buildBookingNote(order)` | function | Formats the multi-line appointment note for the Square calendar |
| `upsertCustomer(order)` | async function | Search-or-create customer in Square CRM, returns `customerId` |
| `createBooking(customerId, order, note)` | async function | Creates the appointment (fetches the real service-variation version dynamically) |

`ADDON_LABELS` is a module-private map turning add-on IDs into human labels (with prices) for the note.

**`OrderPayload` fields:** `name`, `email`, `phone`, `celebration`, `celebrationOtherNote`,
`servings` (`number | ''`), `cakeSize?`, `cakeLayers?` (`number | ''`), `flavour`, `frosting`,
`addonIds: string[]`, `pickupDate`, `pickupTime`, `fulfillment: 'pickup' | 'delivery' | ''`,
`deliveryAddress`, `estimatedTotal?`.

**Booking start time:** `createBooking` maps the selected `pickupTime` (Calgary MDT, UTC-6) to a UTC
slot — `8:00 AM→T14:00Z`, `10:00 AM→T16:00Z`, `12:00 PM→T18:00Z`, `2:00 PM→T20:00Z`,
`4:00 PM→T22:00Z` — defaulting to noon (`T18:00:00Z`) if the slot is unrecognized.
`upsertCustomer` uses a deterministic idempotency key derived from the email hash so rapid duplicate
submissions don't create two customer records.

---

## `lib/sms.ts` — Key Exports

| Export | Description |
|---|---|
| `notifyBakery(body)` | Sends SMS via Twilio to `BAKERY_PHONE_NUMBER` (lazy client init) |
| `buildSmsText(order)` | Builds a compact order summary string (name, phone, date, fulfillment, occasion, cake, add-ons, `estimatedTotal`) |

---

## `lib/pricing.ts` — Key Exports

| Export | Description |
|---|---|
| `MINIMUM_ORDER_TOTAL` | `130` — smallest estimated total (CAD) the bakery accepts. Enforced in `OrderCTA.tsx` (steps 3 and 5) and in `/api/book`. Client-safe to import. |

---

## Square Production Config

| Resource | ID |
|---|---|
| Location | `LQM8M66HZ3T9Y` — Ony's Boutique Cakes |
| Catalog Item | `FSLRXKRKWEBVWCMLHYCFCKTA` — Custom Cake Order |
| Service Variation | `5UMWC66OIJ34W5C3OZYJVYIQ` — Standard |
| Team Member | `TMVuMCy5R3MIM7D5` — Onyinye Ekwulugo |

---

## Design System

### Colors (defined in `tailwind.config.js`)

| Token | Value | Usage |
|---|---|---|
| `surface-*` | `#F3EDE4` to `#EFE7DB` | Page backgrounds |
| `ink` | `#2A241E` | Body text |
| `accent-rose` | `#C9956A` | Primary CTAs, highlights |
| `accent-gold` | `#C5A35A` | Decorative accents |
| `accent-amber` | `#F59E42` | Warm highlights |
| `clay-pink/gold/violet/mint/cream/sky` | Various | Decorative chip/badge colors |

### Shadows
Custom neumorphic shadow utilities in `tailwind.config.js`: `shadow-raised`, `shadow-pressed`,
`shadow-inset-*`. Use these instead of raw Tailwind shadow classes.

### Typography
- **Headings:** Playfair Display (serif)
- **Body / UI:** DM Sans
- **Nav / Labels:** Plus Jakarta Sans
- **Decorative display:** Fraunces

### Animations
All keyframes live in `globals.css`, registered in `tailwind.config.js`:
- `fade-in`, `float`, `float-delayed`, `breathe`, `drift`, `wobble`
- `marquee` — horizontal scroll for Reviews strip
- `gradient-shift` — footer border gradient
- Framer Motion (`SectionReveal`, `Hero`, `Services`) for scroll-triggered reveals
- GSAP (`PillNav`) for tab hover timelines

---

## Conventions & Patterns

- **Backend exists at `/api/book` only.** Do not add more API routes without discussing first.
- **Static data in components.** Prices, flavor lists, add-on lists are hardcoded arrays inside their respective component files.
- **`lib/square.ts` and `lib/sms.ts` are server-only.** Never import them from client components — they read secret env vars.
- **Lazy client init.** Both Square and Twilio clients must be created inside function calls, not at module top level. See env var note above.
- **Scripts use `config({ path: '.env.local' })`** as the first lines — not `import 'dotenv/config'` which loads `.env`.
- **Tailwind-first styling.** Avoid raw CSS unless it must be a keyframe or complex selector — put those in `globals.css`.
- **SectionReveal wrapper** — wrap any new full-width section with `<SectionReveal>` for consistent scroll-reveal behavior.
- **Images go in `/public`** and are referenced with the Next.js `<Image>` component for optimization.
- **One logo, three cuts.** `public/logo.jpg` is the master supplied by the client; everything on the
  site uses a derived transparent PNG — `logo-mark.png` (square mark) on small/light surfaces,
  `logo-full.png` (full lockup) on light surfaces, `logo-full-light.png` (cream ink) on dark ones.
  Never render `logo.jpg` directly: its cream `#FDF8F4` background shows as a box against the
  `#F3EDE4` page surface. Regenerate the cuts from the master rather than hand-editing them.
- **Single-page app** — there are no sub-routes. Do not add `app/` subdirectories unless explicitly requested.

---

## Known Gaps / Future Work

- No rate limiting on `/api/book` — add Vercel edge middleware before high-traffic launch
- No email confirmation to customer — could add Resend/SendGrid in the same route
- No CMS or admin panel
- `Pricing`, `FAQ`, `Policies`, `WhyUs` components built but not rendered in `page.tsx`
- No authentication

---

## Maintaining This File

This file is the codebase context every Claude session starts from, so it must stay accurate.

- **Auto-loaded:** Claude Code reads `CLAUDE.md` into context automatically at session start.
  New sessions get the full picture here instead of re-reading every source file.
- **Auto-reminded:** `.claude/settings.json` defines a `PostToolUse` hook (matcher `Edit|Write`)
  that fires whenever a source file under `app/`, `components/`, `lib/`, `scripts/`, or a root
  config file is edited. The hook injects a reminder for Claude to update the relevant section of
  this file and bump the **Last Updated** date below before ending the turn.
- **When you change code, update the matching section here in the same turn** — directory map,
  exports tables, page composition, env vars, IDs, or conventions. Do not rely on the date alone;
  the date is meaningful only if the content is reconciled with it.

---

## Last Updated

**2026-08-18** — Added a $130 minimum order. New `lib/pricing.ts` holds the single
`MINIMUM_ORDER_TOTAL` constant (client-safe, so both the wizard and the API import the same
number). `OrderCTA.tsx` disables the step-3 Next and step-5 Submit buttons below the minimum with
inline shortfall notes; `/api/book` rejects any payload whose `estimatedTotal` is missing or under
it with a 400.

**2026-08-18** — Replaced the placeholder `logo.svg` (now deleted) with the real Ony's Boutique
brand logo. Added `public/logo.jpg` (master) plus three transparent derivatives, pointed the Navbar
well at `logo-mark.png` and the Footer brand at `logo-full-light.png`, and added file-based
`app/icon.png`, `app/apple-icon.png`, and `app/opengraph-image.jpg`. Set `metadataBase` in
`layout.tsx` from `VERCEL_PROJECT_PRODUCTION_URL` so icon/OG URLs resolve absolutely in production.

**2026-06-14** — Added the Microsoft Clarity analytics snippet (project `x5m78bkkkd`) to
`app/layout.tsx` via `next/script` (`afterInteractive`), alongside the existing gtag; updated the
Tech Stack analytics row and the layout.tsx directory-map entry to reflect it.

**2026-06-14** — Synced CLAUDE.md to the live codebase: corrected page composition (Pricing not
rendered; `OrderForm` is OrderCTA's named export; sections wrapped in `SectionReveal`), documented
Google Analytics gtag, expanded `OrderPayload` and pickup-time→UTC mapping, added
`getSquareClient`, `test-pure-functions.ts`, `client-guide.html`, and `SQUARE_FULL_TEST_PLAN.md`.
Replaced the cosmetic timestamp-bump hook with a content-sync reminder hook.
