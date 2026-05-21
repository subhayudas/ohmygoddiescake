'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Instagram,
  Phone,
  Mail,
  ClipboardList,
  Cake,
  Heart,
  Baby,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'
import Image from 'next/image'

const TOTAL_STEPS = 5

const STEP_LABELS = ['Celebrate', 'Cake', 'Add-ons', 'Date', 'Contact']

/** In-card main step tabs (step numbers 1–5). */
const MAIN_STEP_TABS = [
  { step: 1, label: 'Occasion' },
  { step: 2, label: 'Cake' },
  { step: 3, label: 'Add-ons' },
  { step: 4, label: 'Summary' },
  { step: 5, label: 'Contact' },
] as const

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDateInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function calendarDaysFromToday(dateStr: string): number {
  const t0 = startOfToday().getTime()
  const t1 = new Date(`${dateStr}T12:00:00`)
  t1.setHours(0, 0, 0, 0)
  return Math.round((t1.getTime() - t0) / 86400000)
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function dateAtLocalMidnight(y: number, monthIndex: number, day: number): Date {
  const d = new Date(y, monthIndex, day)
  d.setHours(0, 0, 0, 0)
  return d
}

function parseYmdToLocalDate(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const day = Number(m[3])
  return dateAtLocalMidnight(y, mo, day)
}

function formatPickupDisplay(ymd: string): string {
  if (!ymd.trim()) return '—'
  const d = parseYmdToLocalDate(ymd)
  if (!d) return ymd
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** 6×7 grid: null = empty cell */
function buildCalendarGridCells(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1)
  const leading = first.getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < leading; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  while (cells.length < 42) cells.push(null)
  return cells
}

const CELEBRATIONS = [
  { id: 'Birthday', label: 'Birthday', Icon: Cake },
  { id: 'Wedding', label: 'Wedding', Icon: Heart },
  { id: 'Anniversary', label: 'Anniversary', Icon: Heart },
  { id: 'Baby Shower', label: 'Baby Shower', Icon: Baby },
  { id: 'Corporate', label: 'Corporate', Icon: Briefcase },
  { id: 'Other', label: 'Other', Icon: Sparkles },
] as const

/** Public paths for celebration tiles with a hero image (filename must match `public/`). */
const CELEBRATION_CARD_IMAGES: Partial<Record<(typeof CELEBRATIONS)[number]['id'], string>> = {
  Birthday: '/Celebration Birthday.png',
  Wedding: '/Celebration Wedding.png',
  Anniversary: '/Celebration Anniversary.png',
  'Baby Shower': '/Celebration Baby Shower.png',
  Corporate: '/Celebration Corporate.png',
  Other: '/Celebration Other.png',
}


const FLAVOURS = [
  'Vanilla',
  'Chocolate',
  'Marble',
  'Lemon',
  'Coconut',
  'Carrot',
  'Red Velvet',
  'Funfetti',
] as const

/** Public assets: `public/Flavor <name>.png` */
const FLAVOR_CARD_IMAGES: Record<string, string> = {
  Vanilla: '/Flavor Vanilla.png',
  Chocolate: '/Flavor Chocolate.png',
  Marble: '/Flavor Marble.png',
  Lemon: '/Flavor lemon.png',
  Coconut: '/Flavor Coconut.png',
  Carrot: '/Flavor Carrot.png',
  'Red Velvet': '/Flavor Red Velvet.png',
  Funfetti: '/Flavor Funfetti.png',
}
const FROSTINGS = ['Buttercream', 'Fondant', 'Ganache', 'Semi-naked', 'Naked', 'Not sure'] as const

/** Public paths for frosting tiles with a hero image (filename must match `public/`). */
const FROSTING_CARD_IMAGES: Partial<Record<(typeof FROSTINGS)[number], string>> = {
  Buttercream: '/Frosting Buttercream.png',
  Fondant: '/Frosting Fondant.png',
  Ganache: '/Frosting Ganache.png',
  'Semi-naked': '/Frosting Semi-naked.png',
  Naked: '/Frosting Naked.png',
}

const ADD_ONS = [
  { id: 'disco', label: 'Disco balls', price: 10 },
  { id: 'butterflies', label: 'Butterflies', price: 5 },
  { id: 'edible', label: 'Edible image sheet', price: 20 },
  { id: 'freshFlorals', label: 'Fresh florals', price: 30 },
  { id: 'fauxFlorals', label: 'Faux flowers', price: 15 },
  { id: 'crown', label: 'Crown', price: 7 },
  { id: 'macarons', label: 'French macarons', price: 20 },
  { id: 'strawberries', label: 'Dipped strawberries', price: 15 },
  { id: 'metallic', label: 'Gold or silver covered', price: 25 },
  { id: 'cherries', label: 'Cherries', price: 5 },
  { id: 'miniLiquor', label: 'Mini liquor bottles', price: 7 },
  { id: 'burnaway', label: 'Burn-away image', price: 40 },
] as const

type AddonId = (typeof ADD_ONS)[number]['id']

/** Public paths for add-on tiles with a photo (filename must match `public/`). */
const ADD_ON_CARD_IMAGES: Partial<Record<AddonId, string>> = {
  disco: '/Addon Disco.png',
  butterflies: '/Addon Butterfly.png',
  edible: '/Addon Edible.png',
  freshFlorals: '/Addon Fresh Florals.png',
  fauxFlorals: '/Addon Faux Flowers.png',
  crown: '/Addon Crown.png',
  macarons: '/Addon French Macarons.png',
  strawberries: '/Addon Dipped Strawberries.png',
  metallic: '/Addon SIlver or Gold COvered.png',
  cherries: '/Addon Cherries.png',
  miniLiquor: '/Addon Mini Liquor Bottles.png',
  burnaway: '/Burn-away Image.png',
}

const WEDDING_PRICE_PER_SERVING = 13

type OrderFormValues = {
  celebration: string
  celebrationOtherNote: string
  servings: number | ''
  flavour: string
  frosting: string
  addonIds: string[]
  pickupDate: string
  name: string
  email: string
  phone: string
  fulfillment: 'pickup' | 'delivery' | ''
  /** Required when fulfillment is delivery. */
  deliveryAddress: string
  /** Dietary restriction labels; `None` is mutually exclusive with other options. */
  dietaryRestrictions: string[]
}

type OrderFormNav = {
  step: number
  occasionSubStep: number
  /** Cake sub-steps: 1=flavour, 2=frosting, 3=dietary */
  cakeSubStep: number
}

function cakeDetailsComplete(form: OrderFormValues): boolean {
  return !!(form.flavour && form.frosting)
}

function cakeNavFromForm(form: OrderFormValues): Pick<OrderFormNav, 'cakeSubStep'> {
  if (cakeDetailsComplete(form)) return { cakeSubStep: 3 }
  if (form.flavour) return { cakeSubStep: 2 }
  return { cakeSubStep: 1 }
}

type OrderWizardState = {
  form: OrderFormValues
  nav: OrderFormNav
  submitted: boolean
}

const INITIAL_FORM: OrderFormValues = {
  celebration: '',
  celebrationOtherNote: '',
  servings: '',
  flavour: '',
  frosting: '',
  addonIds: [],
  pickupDate: '',
  name: '',
  email: '',
  phone: '',
  fulfillment: '',
  deliveryAddress: '',
  dietaryRestrictions: [],
}

const INITIAL_NAV: OrderFormNav = {
  step: 1,
  occasionSubStep: 1,
  cakeSubStep: 1,
}

const DIETARY_OPTIONS = ['Gluten-free', 'Dairy-free', 'Vegan', 'Halal', 'None'] as const

export function OrderForm() {
  const [minPickupStr, setMinPickupStr] = useState('')
  useEffect(() => {
    setMinPickupStr(formatDateInput(addDays(startOfToday(), 3)))
  }, [])

  const [wizard, setWizard] = useState<OrderWizardState>(() => ({
    form: { ...INITIAL_FORM },
    nav: { ...INITIAL_NAV },
    submitted: false,
  }))

  const { form, nav, submitted } = wizard
  const { step, occasionSubStep, cakeSubStep } = nav
  const {
    celebration,
    celebrationOtherNote,
    servings,
    pickupDate,
    flavour,
    frosting,
    addonIds,
    name,
    email,
    phone,
    fulfillment,
    deliveryAddress,
    dietaryRestrictions,
  } = form

  const [otherCelebrationModalOpen, setOtherCelebrationModalOpen] = useState(false)
  const [otherCelebrationDraft, setOtherCelebrationDraft] = useState('')
  const [deliveryAddressModalOpen, setDeliveryAddressModalOpen] = useState(false)
  const [deliveryAddressDraft, setDeliveryAddressDraft] = useState('')
  const [maxReachedStep, setMaxReachedStep] = useState(1)
  const resumeAfterEditingFromStepRef = useRef<number | null>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const [calendarView, setCalendarView] = useState(() => {
    const n = new Date()
    return { year: n.getFullYear(), month: n.getMonth() }
  })

  useEffect(() => {
    if (!submitted) return
    const el = successRef.current
    if (!el) return
    const scrollToSuccess = () => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToSuccess)
    })
  }, [submitted])

  useEffect(() => {
    setMaxReachedStep(m => Math.max(m, step))
  }, [step])

  const prevStepForCalendarRef = useRef(step)
  useEffect(() => {
    const enteredDateStep = step === 4 && prevStepForCalendarRef.current !== 4
    if (enteredDateStep) {
      if (pickupDate) {
        const parsed = parseYmdToLocalDate(pickupDate)
        if (parsed) {
          setCalendarView({ year: parsed.getFullYear(), month: parsed.getMonth() })
        }
      } else {
        const n = new Date()
        setCalendarView({ year: n.getFullYear(), month: n.getMonth() })
      }
    }
    prevStepForCalendarRef.current = step
  }, [step, pickupDate])

  const minSelectableDate = useMemo(() => {
    if (!minPickupStr) return null
    return parseYmdToLocalDate(minPickupStr)
  }, [minPickupStr])

  const calendarCells = useMemo(
    () => buildCalendarGridCells(calendarView.year, calendarView.month),
    [calendarView.year, calendarView.month]
  )

  const monthTitle = useMemo(
    () =>
      new Date(calendarView.year, calendarView.month, 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    [calendarView.year, calendarView.month]
  )

  useEffect(() => {
    if (!otherCelebrationModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOtherCelebrationModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [otherCelebrationModalOpen])

  useEffect(() => {
    if (!deliveryAddressModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeliveryAddressModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deliveryAddressModalOpen])

  const progressSuffix = useMemo(() => {
    if (step === 1 && occasionSubStep === 1) return ' · Occasion'
    if (step === 1 && occasionSubStep === 2) return ' · Servings'
    if (step === 2 && cakeSubStep === 1) return ' · Flavour'
    if (step === 2 && cakeSubStep === 2) return ' · Frosting'
    if (step === 2 && cakeSubStep === 3) return ' · Dietary'
    if (step === 3) return ' · Add-ons'
    if (step === 4) return ' · Date'
    if (step === 5) return ' · Contact'
    return ''
  }, [step, occasionSubStep, cakeSubStep])

  const showRushNote = useMemo(() => {
    if (!pickupDate || !minPickupStr) return false
    if (pickupDate < minPickupStr) return true
    const d = calendarDaysFromToday(pickupDate)
    return d > 0 && d <= 3
  }, [pickupDate, minPickupStr])

  const toggleAddon = (id: string) => {
    setWizard(w => ({
      ...w,
      form: {
        ...w.form,
        addonIds: w.form.addonIds.includes(id)
          ? w.form.addonIds.filter(x => x !== id)
          : [...w.form.addonIds, id],
      },
    }))
  }

  const addonTotal = useMemo(() => {
    return addonIds.reduce((sum, id) => {
      const row = ADD_ONS.find(a => a.id === id)
      return sum + (row?.price ?? 0)
    }, 0)
  }, [addonIds])

  const weddingEstimate = useMemo(() => {
    if (celebration !== 'Wedding' || servings === '' || servings <= 0) return null
    return servings * WEDDING_PRICE_PER_SERVING
  }, [celebration, servings])

  const contactSummaryRows = useMemo(() => {
    const rows: { key: string; label: string; value: string }[] = []

    const occasionDisplay =
      celebration === 'Other' && celebrationOtherNote.trim()
        ? `Other (${celebrationOtherNote.trim()})`
        : celebration || '—'
    rows.push({ key: 'occasion', label: 'Occasion', value: occasionDisplay })

    rows.push({ key: 'servings', label: 'Servings', value: servings !== '' ? String(servings) : '—' })

    rows.push({ key: 'flavour', label: 'Flavour', value: flavour || '—' })

    rows.push({ key: 'frosting', label: 'Frosting', value: frosting || '—' })
    rows.push({
      key: 'dietary',
      label: 'Dietary',
      value: dietaryRestrictions.length === 0 ? '—' : dietaryRestrictions.join(', '),
    })
    rows.push({ key: 'pickup', label: 'Pickup date', value: formatPickupDisplay(pickupDate) })

    if (addonIds.length > 0) {
      const addonParts = addonIds.map(id => {
        const row = ADD_ONS.find(a => a.id === id)
        return row ? `${row.label} $${row.price}` : ''
      }).filter(Boolean)
      rows.push({
        key: 'addons',
        label: 'Add-ons',
        value: addonParts.join(', '),
      })
      rows.push({
        key: 'addons-total',
        label: 'Add-ons total',
        value: `$${addonTotal}`,
      })
    }

    return rows
  }, [
    addonIds,
    addonTotal,
    celebration,
    celebrationOtherNote,
    dietaryRestrictions,
    flavour,
    frosting,
    pickupDate,
    servings,
  ])

  const goPrevMonth = () => {
    setCalendarView(v => {
      let { year, month } = v
      month -= 1
      if (month < 0) {
        month = 11
        year -= 1
      }
      return { year, month }
    })
  }

  const goNextMonth = () => {
    setCalendarView(v => {
      let { year, month } = v
      month += 1
      if (month > 11) {
        month = 0
        year += 1
      }
      return { year, month }
    })
  }

  const selectCalendarDay = (dayNum: number) => {
    if (!minSelectableDate) return
    const cellDate = dateAtLocalMidnight(calendarView.year, calendarView.month, dayNum)
    if (cellDate.getTime() < minSelectableDate.getTime()) return
    const ymd = formatDateInput(cellDate)
    if (minPickupStr !== '' && ymd < minPickupStr) return
    setWizard(w => ({
      ...w,
      form: { ...w.form, pickupDate: ymd },
      nav: { ...w.nav, step: 5 },
    }))
  }

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return (
          !!celebration &&
          servings !== '' &&
          (servings as number) > 0 &&
          (celebration !== 'Other' || celebrationOtherNote.trim().length > 0)
        )
      case 2:
        return !!flavour && !!frosting
      case 3:
        return true
      case 4:
        return !!pickupDate && minPickupStr !== '' && pickupDate >= minPickupStr
      case 5:
        return (
          name.trim().length > 0 &&
          email.trim().length > 0 &&
          phone.trim().length > 0 &&
          (fulfillment === 'pickup' ||
            (fulfillment === 'delivery' && deliveryAddress.trim().length > 0))
        )
      default:
        return false
    }
  }

  const handleSubmit = () => {
    if (!canAdvance()) return
    setWizard(w => ({ ...w, submitted: true }))
  }

  const handleOrderNewCake = () => {
    setWizard({
      form: { ...INITIAL_FORM },
      nav: { ...INITIAL_NAV },
      submitted: false,
    })
    setMaxReachedStep(1)
    resumeAfterEditingFromStepRef.current = null
    setOtherCelebrationModalOpen(false)
    setDeliveryAddressModalOpen(false)
    requestAnimationFrame(() => {
      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const canDietaryNext = (): boolean =>
    dietaryRestrictions.length > 0

  const advanceToAddOnsStepWithResume = () => {
    const resumeSnap = resumeAfterEditingFromStepRef.current
    const willResume = resumeSnap != null && resumeSnap > 3
    setWizard(w => ({
      ...w,
      nav: { ...w.nav, step: willResume ? resumeSnap : 3 },
    }))
    if (willResume) {
      resumeAfterEditingFromStepRef.current = null
    }
  }

  const goNext = () => {
    if (step === 2 && cakeSubStep === 3 && canDietaryNext()) {
      advanceToAddOnsStepWithResume()
      return
    }
    if (step === 3 && canAdvance()) {
      setWizard(w => ({ ...w, nav: { ...w.nav, step: 4 } }))
    }
  }

  const advanceServingsToStep2 = () => {
    const resume = resumeAfterEditingFromStepRef.current
    const nextStep = resume != null && resume >= 4 ? resume : 2
    if (resume != null && resume >= 4) {
      resumeAfterEditingFromStepRef.current = null
    }
    setWizard(w => {
      const nextNav: OrderFormNav = { ...w.nav, step: nextStep }
      if (nextStep === 2) {
        const c = cakeNavFromForm(w.form)
        nextNav.cakeSubStep = c.cakeSubStep
      }
      return { ...w, nav: nextNav }
    })
  }

  const goBack = () => {
    if (step === 1 && occasionSubStep === 2) {
      setWizard(w => ({ ...w, nav: { ...w.nav, occasionSubStep: 1 } }))
      return
    }
    if (step <= 1) return

    if (step === 2 && cakeSubStep > 1) {
      if (cakeSubStep === 3) {
        setWizard(w => ({ ...w, nav: { ...w.nav, cakeSubStep: 2 } }))
        return
      }
      if (cakeSubStep === 2) {
        setWizard(w => ({
          ...w,
          form: { ...w.form, frosting: '', dietaryRestrictions: [] },
          nav: { ...w.nav, cakeSubStep: 1 },
        }))
        return
      }
      return
    }

    if (step === 2 && cakeSubStep === 1) {
      setWizard(w => ({
        ...w,
        form: {
          ...w.form,
          flavour: '',
          frosting: '',
          dietaryRestrictions: [],
        },
        nav: {
          step: 1,
          occasionSubStep: 2,
          cakeSubStep: 1,
        },
      }))
      return
    }

    const next = step - 1

    if (step === 3 && next === 2) {
      setWizard(w => {
        const c = cakeNavFromForm(w.form)
        return {
          ...w,
          nav: {
            ...w.nav,
            step: 2,
            cakeSubStep: c.cakeSubStep,
          },
        }
      })
      return
    }

    setWizard(w => ({ ...w, nav: { ...w.nav, step: next } }))
  }

  const pickFlavour = (f: string) => {
    setWizard(w => ({
      ...w,
      form: { ...w.form, flavour: f },
      nav: { ...w.nav, cakeSubStep: 2 },
    }))
  }

  const pickFrosting = (f: string) => {
    setWizard(w => {
      const nextForm = { ...w.form, frosting: f }
      const nextNav = { ...w.nav }
      if (w.nav.step === 2 && cakeDetailsComplete(nextForm)) {
        nextNav.cakeSubStep = 3
      }
      return { ...w, form: nextForm, nav: nextNav }
    })
  }

  const selectDietaryNone = () => {
    const resumeSnap = resumeAfterEditingFromStepRef.current
    const willResume = resumeSnap != null && resumeSnap > 3
    setWizard(w => ({
      ...w,
      form: { ...w.form, dietaryRestrictions: ['None'] },
      nav: { ...w.nav, step: willResume ? resumeSnap : 3 },
    }))
    if (willResume) {
      resumeAfterEditingFromStepRef.current = null
    }
  }

  const toggleDietaryOption = (id: string) => {
    if (id === 'None') {
      selectDietaryNone()
      return
    }
    setWizard(w => {
      const withoutNone = w.form.dietaryRestrictions.filter(x => x !== 'None')
      const has = withoutNone.includes(id)
      const next = has ? withoutNone.filter(x => x !== id) : [...withoutNone, id]
      return { ...w, form: { ...w.form, dietaryRestrictions: next } }
    })
  }

  const goToMainStepByTab = (target: number) => {
    if (target > maxReachedStep) return
    const from = step
    if (target < from && from >= 4 && (target === 1 || target === 2)) {
      resumeAfterEditingFromStepRef.current = from
    } else if (target !== from) {
      resumeAfterEditingFromStepRef.current = null
    }
    setWizard(w => {
      const nextNav: OrderFormNav = { ...w.nav, step: target }
      if (target === 1) {
        nextNav.occasionSubStep = 1
      } else if (target === 2) {
        nextNav.cakeSubStep = 1
      }
      return { ...w, nav: nextNav }
    })
  }

  return (
    <section id="order-form" className="section-padding section-ambient bg-amber-muted overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="label-tag mb-4">Quote Request</p>
          <h2 className="heading-lg text-charcoal">
            Custom Cake{' '}
            <span className="text-rose-gold italic">Order Form</span>
          </h2>
          <p className="mt-3 text-sm text-charcoal/55 max-w-md mx-auto">
            Tell us about your celebration — one step at a time. We&apos;ll follow up with a personalized quote.
          </p>
        </motion.div>

        {submitted ? (
          <div className="min-h-[min(70vh,640px)] flex items-center justify-center py-6">
            <motion.div
              ref={successRef}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-border warm-card rounded-3xl p-8 md:p-10 text-center w-full"
            >
              <p className="font-serif text-xl md:text-2xl text-charcoal leading-relaxed mb-4">
                Your order request has been received!
              </p>
              {dietaryRestrictions.length > 0 && (
                <p className="text-charcoal/60 text-sm mb-4 max-w-md mx-auto">
                  Dietary: {dietaryRestrictions.join(', ')}
                </p>
              )}
              <p className="text-charcoal/70 text-sm leading-relaxed max-w-md mx-auto">
                Onyinye will be in touch within 24 hours with your quote. A 50% deposit via e-transfer will be required
                to confirm your order.
              </p>
              <button
                type="button"
                onClick={handleOrderNewCake}
                className="mt-8 btn-glow btn-amber-glow bg-rose-gold text-white text-sm font-semibold px-10 py-4 rounded-full hover:bg-opacity-90 transition-all duration-500 ease-in-out"
              >
                Order a New Cake
              </button>
            </motion.div>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault()
              if (step === TOTAL_STEPS) handleSubmit()
            }}
          >
            {/* Progress — dot-line stepper */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {/* Connector line behind dots */}
                <div className="absolute left-0 right-0 top-4 h-px bg-charcoal/10 z-0" />
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1
                  const active = step === n
                  const done = step > n
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center z-10 min-w-0">
                      {/* Dot */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ease-in-out mb-2 ${
                          done
                            ? 'bg-amber border-amber text-white'
                            : active
                              ? 'bg-rose-gold border-rose-gold text-white shadow-[0_0_16px_rgba(201,149,106,0.5)]'
                              : 'bg-amber-light border-charcoal/15 text-charcoal/35'
                        }`}
                      >
                        {done ? '✓' : n}
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider text-center leading-tight ${
                          active ? 'text-rose-gold' : done ? 'text-charcoal/50' : 'text-charcoal/28'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="text-center text-xs text-charcoal/40 mt-3">
                Step {step} of {TOTAL_STEPS}{progressSuffix}
              </p>
            </div>

            <div className="glass-border warm-card rounded-3xl p-6 md:p-8 min-h-[320px] flex flex-col overflow-visible" style={{ boxShadow: '0 0 60px rgba(245,158,66,0.12), 0 8px 40px rgba(0,0,0,0.07), inset 0 2px 0 rgba(255,255,255,0.95)' }}>
              <div
                className="mb-4 shrink-0 overflow-visible px-1 pt-1 pb-1.5"
                role="tablist"
                aria-label="Form steps"
              >
                <div className="flex min-h-10 flex-nowrap items-center gap-1.5 overflow-x-auto py-1 px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {MAIN_STEP_TABS.map(({ step: tabStep, label }) => {
                  const locked = tabStep > maxReachedStep
                  const active = tabStep === step
                  const completed = !locked && !active && tabStep <= maxReachedStep
                  return (
                    <button
                      key={tabStep}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      disabled={locked}
                      onClick={() => goToMainStepByTab(tabStep)}
                      className={`inline-flex h-10 w-[5.375rem] shrink-0 flex-row items-center justify-center rounded-full px-0 py-0 text-[10px] font-semibold uppercase leading-none tracking-wider sm:w-[5.75rem] ${
                        locked
                          ? 'cursor-not-allowed text-charcoal/30 opacity-40'
                          : active
                            ? 'bg-amber/15 text-rose-gold ring-1 ring-amber/50'
                            : completed
                              ? 'bg-charcoal/[0.06] text-charcoal/50 hover:bg-charcoal/10 hover:text-charcoal/65'
                              : 'text-charcoal/50 hover:bg-charcoal/5 hover:text-charcoal/70'
                      }`}
                    >
                      <span
                        className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center"
                        aria-hidden
                      >
                        <Check
                          size={12}
                          strokeWidth={2.5}
                          className={`absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 text-charcoal/40 transition-none ${
                            completed
                              ? 'scale-100 opacity-100'
                              : 'scale-0 opacity-0 pointer-events-none'
                          }`}
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate px-0.5 text-center">{label}</span>
                    </button>
                  )
                })}
                </div>
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col"
                  >
                    <AnimatePresence mode="wait">
                      {occasionSubStep === 1 && (
                        <motion.div
                          key="occasion-1"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.22 }}
                          className="flex-1 flex flex-col"
                        >
                          <h3 className="font-serif text-xl text-charcoal mb-1 text-center">What are we celebrating?</h3>
                          <p className="text-center text-xs text-charcoal/50 mb-6">Tap an option to continue</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {CELEBRATIONS.map(({ id, label, Icon }) => {
                              const selected = celebration === id
                              const photoSrc = CELEBRATION_CARD_IMAGES[id]
                              const hasPhoto = Boolean(photoSrc)
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => {
                                    if (id === 'Other') {
                                      setOtherCelebrationDraft(celebration === 'Other' ? celebrationOtherNote : '')
                                      setOtherCelebrationModalOpen(true)
                                      return
                                    }
                                    setWizard(w => ({
                                      ...w,
                                      form: {
                                        ...w.form,
                                        celebration: id,
                                        celebrationOtherNote: '',
                                      },
                                      nav: { ...w.nav, occasionSubStep: 2 },
                                    }))
                                  }}
                                  className={`glass-border rounded-2xl text-center transition-all duration-500 ease-in-out relative overflow-hidden ${
                                    hasPhoto
                                      ? `min-h-[140px] flex flex-col items-center justify-center p-2 border-2 ${
                                          selected
                                            ? 'ring-2 ring-amber ring-offset-2 ring-offset-amber-light border-amber shadow-md'
                                            : 'border-transparent hover:border-amber/40 hover:-translate-y-0.5'
                                        }`
                                      : `p-5 flex flex-col items-center justify-center gap-3 min-h-[112px] ${
                                          selected
                                            ? 'bg-amber/15 border-amber shadow-md ring-2 ring-amber/50'
                                            : 'bg-amber-light hover:bg-amber/10 hover:-translate-y-0.5'
                                        }`
                                  }`}
                                >
                                  {hasPhoto && photoSrc && (
                                    <Image
                                      src={encodeURI(photoSrc)}
                                      alt=""
                                      fill
                                      className="object-cover z-0 pointer-events-none"
                                      sizes="(max-width: 768px) 50vw, 33vw"
                                    />
                                  )}
                                  <span
                                    className={`relative z-10 flex flex-col items-center justify-center rounded-xl shadow-sm ${
                                      hasPhoto ? 'gap-2 bg-white/95 px-3 py-2.5' : 'gap-3'
                                    }`}
                                  >
                                    <Icon size={26} className={selected ? 'text-rose-gold' : 'text-rose-gold/80'} />
                                    <span className={`text-sm font-semibold leading-tight ${selected ? 'text-charcoal' : 'text-charcoal/80'}`}>
                                      {label}
                                    </span>
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}

                      {occasionSubStep === 2 && (
                        <motion.div
                          key="occasion-2"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.22 }}
                          className="flex-1 flex flex-col"
                        >
                          <h3 className="font-serif text-xl text-charcoal mb-1 text-center">
                            How many servings do you need?
                          </h3>
                          <p className="text-center text-xs text-charcoal/50 mb-6">Enter the number of servings</p>

                          <div className="max-w-xs mx-auto w-full">
                            <input
                              type="number"
                              min={1}
                              value={servings === '' ? '' : servings}
                              onChange={e => {
                                const val = e.target.value
                                setWizard(w => ({
                                  ...w,
                                  form: {
                                    ...w.form,
                                    servings: val === '' ? '' : Math.max(1, parseInt(val, 10) || 1),
                                  },
                                }))
                              }}
                              placeholder="e.g. 50"
                              className="w-full rounded-2xl border-2 border-amber/30 bg-amber-light px-5 py-4 text-center text-2xl font-serif text-charcoal focus:outline-none focus:ring-2 focus:ring-rose-gold/35 focus:border-rose-gold/40"
                            />

                            {weddingEstimate !== null && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-5 rounded-2xl px-5 py-4 text-center"
                                style={{
                                  background: 'linear-gradient(135deg, #C9956A 0%, #D4845A 100%)',
                                  boxShadow: '0 4px 20px rgba(201,149,106,0.3)',
                                }}
                              >
                                <p className="text-white/75 text-xs font-semibold uppercase tracking-widest mb-1">
                                  Estimated starting price
                                </p>
                                <p className="font-serif text-3xl font-bold text-white">
                                  ${weddingEstimate.toLocaleString()}
                                </p>
                                <p className="text-white/60 text-xs mt-1">
                                  ${WEDDING_PRICE_PER_SERVING}/serving · final quote on request
                                </p>
                              </motion.div>
                            )}

                            <button
                              type="button"
                              disabled={servings === '' || (servings as number) <= 0}
                              onClick={advanceServingsToStep2}
                              className="mt-6 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-rose-gold text-white font-bold text-sm px-7 py-3 hover:bg-opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all duration-500 ease-in-out btn-glow btn-amber-glow shadow-md"
                            >
                              Next
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="s4-date"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col"
                  >
                    <h3 className="font-serif text-xl text-charcoal mb-1 text-center">Pickup date</h3>
                    <p className="text-center text-xs text-charcoal/50 mb-5">We need at least 3 days&apos; notice</p>

                    <div
                      className="max-w-sm mx-auto w-full rounded-2xl border-2 border-amber/30 bg-amber-light px-3 py-4 sm:px-4"
                      role="application"
                      aria-label="Pickup date calendar"
                    >
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <button
                          type="button"
                          onClick={goPrevMonth}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal hover:bg-amber/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
                          aria-label="Previous month"
                        >
                          <ChevronLeft size={20} aria-hidden />
                        </button>
                        <p className="font-serif text-base font-semibold text-charcoal text-center truncate px-1">
                          {monthTitle}
                        </p>
                        <button
                          type="button"
                          onClick={goNextMonth}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal hover:bg-amber/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
                          aria-label="Next month"
                        >
                          <ChevronRight size={20} aria-hidden />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {WEEKDAY_LABELS.map(d => (
                          <div
                            key={d}
                            className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/45 py-1"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarCells.map((dayNum, i) => {
                          if (dayNum === null) {
                            return (
                              <div
                                key={`pad-${calendarView.year}-${calendarView.month}-${i}`}
                                className="aspect-square min-h-[2.25rem]"
                                aria-hidden
                              />
                            )
                          }
                          const cellDate = dateAtLocalMidnight(calendarView.year, calendarView.month, dayNum)
                          const ymd = formatDateInput(cellDate)
                          const selectable =
                            !!minSelectableDate && cellDate.getTime() >= minSelectableDate.getTime()
                          const selected = pickupDate === ymd
                          return (
                            <button
                              key={ymd}
                              type="button"
                              disabled={!selectable}
                              onClick={() => selectable && selectCalendarDay(dayNum)}
                              className={`aspect-square min-h-[2.25rem] w-full rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 ${
                                !selectable
                                  ? 'cursor-not-allowed text-charcoal/25 bg-charcoal/[0.04]'
                                  : selected
                                    ? 'bg-amber/20 text-charcoal ring-2 ring-amber shadow-sm'
                                    : 'text-charcoal hover:bg-rose-gold/10'
                              }`}
                            >
                              {dayNum}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    {showRushNote && (
                      <p className="mt-4 text-center text-sm text-rose-gold font-medium bg-amber/10 rounded-2xl px-4 py-3 border border-amber/25">
                        Orders under 3 days notice incur a rush fee of $15–$25
                      </p>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="s2-cake"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    <p className="label-tag mb-2 text-center shrink-0">Cake details</p>

                    <AnimatePresence mode="wait">
                      {cakeSubStep === 1 && (
                        <motion.div
                          key="cake-sub-1-flavour"
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -14 }}
                          transition={{ duration: 0.22 }}
                          className="flex-1 flex flex-col min-h-0"
                        >
                          <h3 className="font-serif text-xl text-charcoal text-center mb-1 shrink-0">
                            What flavour would you like?
                          </h3>
                          <p className="text-center text-xs text-charcoal/50 mb-3 shrink-0">Tap an option to continue</p>
                          <div className="grid grid-cols-2 grid-rows-4 gap-2 sm:gap-3 flex-1 min-h-0">
                            {FLAVOURS.map(f => {
                              const cardImage = FLAVOR_CARD_IMAGES[f] ?? null
                              const hasPhoto = cardImage != null
                              const selected = flavour === f
                              return (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => pickFlavour(f)}
                                  className={`glass-border rounded-2xl relative flex h-full min-h-[3.75rem] sm:min-h-[4.25rem] w-full items-center justify-center overflow-hidden px-2 py-2 text-center text-sm sm:text-base font-semibold leading-snug transition-all ${
                                    hasPhoto
                                      ? selected
                                        ? 'border-rose-gold shadow-md ring-2 ring-rose-gold'
                                        : 'border-amber/30 hover:brightness-[0.98]'
                                      : selected
                                        ? 'bg-rose-gold text-white border-amber shadow-md'
                                        : 'bg-amber-light text-charcoal hover:bg-amber/10'
                                  }`}
                                >
                                  {hasPhoto && (
                                    <Image
                                      src={encodeURI(cardImage)}
                                      alt=""
                                      fill
                                      sizes="(max-width: 768px) 45vw, 200px"
                                      className="pointer-events-none z-0 object-cover"
                                      aria-hidden
                                    />
                                  )}
                                  <span
                                    className={
                                      hasPhoto
                                        ? 'relative z-10 rounded-lg bg-white/95 px-2.5 py-1.5 text-charcoal shadow-sm'
                                        : selected
                                          ? 'relative z-10 text-white'
                                          : 'relative z-10 text-charcoal'
                                    }
                                  >
                                    {f}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}

                      {cakeSubStep === 2 && (
                        <motion.div
                          key="cake-sub-2-frosting"
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -14 }}
                          transition={{ duration: 0.22 }}
                          className="flex-1 flex flex-col min-h-0"
                        >
                          <h3 className="font-serif text-xl text-charcoal text-center mb-1 shrink-0">
                            What frosting would you like?
                          </h3>
                          <p className="text-center text-xs text-charcoal/50 mb-3 shrink-0">Tap an option to continue</p>
                          <div className="grid grid-cols-2 grid-rows-3 gap-3 flex-1 min-h-0">
                            {FROSTINGS.map(f => {
                              const photoSrc = FROSTING_CARD_IMAGES[f]
                              const hasPhoto = Boolean(photoSrc)
                              const selected = frosting === f
                              return (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => pickFrosting(f)}
                                  className={`glass-border rounded-2xl text-center text-sm sm:text-base font-semibold leading-snug transition-all relative overflow-hidden ${
                                    hasPhoto
                                      ? `min-h-[4.75rem] sm:min-h-[5.35rem] flex items-center justify-center p-2 border-2 ${
                                          selected
                                            ? 'ring-2 ring-amber ring-offset-2 ring-offset-amber-light border-amber shadow-md'
                                            : 'border-transparent hover:border-amber/40 hover:-translate-y-0.5'
                                        }`
                                      : `flex h-full min-h-[4.5rem] sm:min-h-[5.25rem] w-full items-center justify-center px-2 py-2 ${
                                          selected
                                            ? 'bg-rose-gold text-white border-amber shadow-md'
                                            : 'bg-amber-light text-charcoal hover:bg-amber/10'
                                        }`
                                  }`}
                                >
                                  {hasPhoto && photoSrc && (
                                    <Image
                                      src={encodeURI(photoSrc)}
                                      alt=""
                                      fill
                                      className="object-cover z-0 pointer-events-none"
                                      sizes="(max-width: 768px) 45vw, 200px"
                                    />
                                  )}
                                  <span
                                    className={
                                      hasPhoto
                                        ? 'relative z-10 rounded-lg bg-white/95 px-2.5 py-1.5 text-charcoal shadow-sm'
                                        : ''
                                    }
                                  >
                                    {f}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}

                      {cakeSubStep === 3 && (
                        <motion.div
                          key="cake-sub-3-dietary"
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -14 }}
                          transition={{ duration: 0.22 }}
                          className="flex-1 flex flex-col min-h-0"
                        >
                          <h3 className="font-serif text-xl text-charcoal text-center mb-1 shrink-0">
                            Any dietary restrictions?
                          </h3>
                          <p className="text-center text-xs text-charcoal/50 mb-4 shrink-0">Select all that apply</p>
                          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 content-start">
                            {DIETARY_OPTIONS.map(opt => {
                              const selected = dietaryRestrictions.includes(opt)
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => toggleDietaryOption(opt)}
                                  className={`glass-border rounded-2xl flex min-h-[5.25rem] sm:min-h-[5.75rem] w-full items-center justify-center px-3 py-3 text-center text-sm sm:text-base font-semibold leading-snug transition-all ${
                                    selected
                                      ? 'bg-rose-gold text-white border-amber shadow-md'
                                      : 'bg-amber-light text-charcoal border-amber/30 hover:bg-amber/10'
                                  }`}
                                >
                                  {opt}
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="s3-addons"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    <h3 className="font-serif text-xl text-charcoal mb-1 text-center">Add-ons</h3>
                    <p className="text-center text-xs text-charcoal/50 mb-4">Select any that apply — optional</p>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 w-full flex-1 content-start">
                      {ADD_ONS.map(({ id, label, price }) => {
                        const photoSrc = ADD_ON_CARD_IMAGES[id]
                        const hasPhoto = Boolean(photoSrc)
                        const selected = addonIds.includes(id)
                        return (
                          <motion.button
                            key={id}
                            layout
                            type="button"
                            onClick={() => toggleAddon(id)}
                            whileTap={{ scale: 0.96 }}
                            animate={{
                              scale: selected ? 1.04 : 1,
                            }}
                            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                            className={`glass-border relative aspect-square w-full rounded-2xl flex flex-col items-center justify-center gap-1.5 px-2 py-2 text-center shadow-sm overflow-hidden ${
                              hasPhoto
                                ? selected
                                  ? 'border-2 border-rose-gold ring-2 ring-rose-gold ring-offset-2 ring-offset-amber-light shadow-md'
                                  : 'border-2 border-amber/30 bg-amber-light hover:border-amber/50 hover:-translate-y-0.5'
                                : selected
                                  ? 'bg-rose-gold text-white border-rose-gold ring-2 ring-rose-gold/50'
                                  : 'bg-amber-light text-charcoal border-amber/30 hover:bg-amber/10'
                            }`}
                          >
                            {hasPhoto && photoSrc && (
                              <Image
                                src={encodeURI(photoSrc)}
                                alt=""
                                fill
                                className="object-cover z-0 pointer-events-none"
                                sizes="(max-width: 768px) 33vw, 180px"
                              />
                            )}
                            <AnimatePresence initial={false}>
                              {selected && (
                                <motion.span
                                  key="check"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                                  className={`absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full ${
                                    hasPhoto ? 'bg-rose-gold text-white shadow-sm' : 'bg-white/25 text-white'
                                  }`}
                                  aria-hidden
                                >
                                  <Check size={16} strokeWidth={3} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <span
                              className={`relative z-10 font-semibold leading-snug text-[11px] sm:text-xs ${
                                hasPhoto
                                  ? 'rounded-lg bg-white/95 px-2 py-1 text-charcoal shadow-sm'
                                  : selected
                                    ? 'text-white'
                                    : 'text-charcoal'
                              }`}
                            >
                              {label}
                            </span>
                            <span
                              className={`relative z-10 text-xs font-bold tabular-nums ${
                                hasPhoto
                                  ? 'rounded-md bg-white/90 px-2 py-0.5 text-rose-gold'
                                  : selected
                                    ? 'text-white/90'
                                    : 'text-rose-gold'
                              }`}
                            >
                              ${price}
                            </span>
                          </motion.button>
                        )
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border-2 border-amber/30 bg-amber-light px-4 py-3">
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                        Add-ons total
                      </span>
                      <motion.span
                        key={addonTotal}
                        initial={{ scale: 1.08, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="font-serif text-xl sm:text-2xl text-rose-gold tabular-nums"
                      >
                        ${addonTotal}
                      </motion.span>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="s5"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex min-h-[320px] flex-1 flex-col gap-2"
                  >
                    <h3 className="font-serif text-xl text-charcoal mb-0 shrink-0 text-center">Contact</h3>
                    <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,2fr)] gap-2">
                      <div className="flex min-h-0 flex-col overflow-hidden">
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl border-2 border-amber/25 bg-amber-light px-2 py-1 text-left">
                          <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-charcoal/45">
                            Order summary
                          </p>
                          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-px text-[10px] leading-tight">
                            {contactSummaryRows.map(({ key, label, value }) => (
                              <div key={key} className="contents">
                                <span className="text-[9px] font-semibold uppercase tracking-wider text-charcoal/45">
                                  {label}
                                </span>
                                <span className="min-w-0 text-right break-words text-charcoal/70">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex min-h-0 flex-col gap-2">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={e =>
                              setWizard(w => ({ ...w, form: { ...w.form, name: e.target.value } }))
                            }
                            className="mt-1 w-full rounded-2xl border-2 border-amber/25 bg-amber-light px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-rose-gold/35"
                            autoComplete="name"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={e =>
                              setWizard(w => ({ ...w, form: { ...w.form, email: e.target.value } }))
                            }
                            className="mt-1 w-full rounded-2xl border-2 border-amber/25 bg-amber-light px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-rose-gold/35"
                            autoComplete="email"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">
                            Phone number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={e =>
                              setWizard(w => ({ ...w, form: { ...w.form, phone: e.target.value } }))
                            }
                            className="mt-1 w-full rounded-2xl border-2 border-amber/25 bg-amber-light px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-rose-gold/35"
                            autoComplete="tel"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/45 mb-2">
                            Pickup or delivery
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              aria-pressed={fulfillment === 'pickup'}
                              onClick={() => {
                                setDeliveryAddressModalOpen(false)
                                setWizard(w => ({
                                  ...w,
                                  form: { ...w.form, fulfillment: 'pickup' },
                                }))
                              }}
                              className={`glass-border relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
                                fulfillment === 'pickup'
                                  ? 'border-amber bg-rose-gold text-white shadow-md ring-2 ring-amber/55'
                                  : 'bg-amber-light hover:bg-amber/10'
                              }`}
                            >
                              {fulfillment === 'pickup' && (
                                <span
                                  className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-white shadow-sm"
                                  aria-hidden
                                >
                                  <Check size={16} strokeWidth={3} />
                                </span>
                              )}
                              <span
                                className={`relative z-10 font-serif text-lg block ${
                                  fulfillment === 'pickup' ? 'text-white' : 'text-charcoal'
                                }`}
                              >
                                Pickup
                              </span>
                              <span
                                className={`relative z-10 text-sm font-semibold ${
                                  fulfillment === 'pickup' ? 'text-white/95' : 'text-rose-gold'
                                }`}
                              >
                                Free
                              </span>
                            </button>
                            <button
                              type="button"
                              aria-pressed={fulfillment === 'delivery'}
                              onClick={() => {
                                setDeliveryAddressDraft(deliveryAddress)
                                setDeliveryAddressModalOpen(true)
                              }}
                              className={`glass-border relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
                                fulfillment === 'delivery'
                                  ? 'border-amber bg-rose-gold text-white shadow-md ring-2 ring-amber/55'
                                  : 'bg-amber-light hover:bg-amber/10'
                              }`}
                            >
                              {fulfillment === 'delivery' && (
                                <span
                                  className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-white shadow-sm"
                                  aria-hidden
                                >
                                  <Check size={16} strokeWidth={3} />
                                </span>
                              )}
                              <span
                                className={`relative z-10 font-serif text-lg block ${
                                  fulfillment === 'delivery' ? 'text-white' : 'text-charcoal'
                                }`}
                              >
                                Delivery
                              </span>
                              <span
                                className={`relative z-10 text-sm font-semibold ${
                                  fulfillment === 'delivery' ? 'text-white/95' : 'text-rose-gold'
                                }`}
                              >
                                $25
                              </span>
                            </button>
                          </div>
                          {fulfillment === 'delivery' && deliveryAddress.trim().length > 0 && (
                            <p className="text-xs text-charcoal/55 break-words mt-1">
                              Delivery to: {deliveryAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              <div
                className={`flex items-center gap-3 mt-8 pt-6 border-t border-charcoal/10 ${
                  step === 3 || step === 5 || (step === 2 && cakeSubStep === 3)
                    ? 'justify-between'
                    : 'justify-start'
                }`}
              >
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1 && occasionSubStep === 1}
                  className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/20 px-5 py-2.5 text-sm font-semibold text-charcoal/65 hover:text-charcoal hover:border-charcoal/35 hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                {step === 2 && cakeSubStep === 3 && (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canDietaryNext()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-gold text-white font-bold text-sm px-7 py-2.5 hover:bg-opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all duration-500 ease-in-out btn-glow btn-amber-glow shadow-md"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canAdvance()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-gold text-white font-bold text-sm px-7 py-2.5 hover:bg-opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all duration-500 ease-in-out btn-glow btn-amber-glow shadow-md"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                )}
                {step === 5 && (
                  <button
                    type="submit"
                    disabled={!canAdvance()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-gold text-white font-bold text-sm px-7 py-2.5 hover:bg-opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all duration-500 ease-in-out btn-glow btn-amber-glow shadow-md"
                  >
                    Submit request
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {otherCelebrationModalOpen && (
                <motion.div
                  key="other-celebration-overlay"
                  className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    aria-label="Close dialog"
                    className="absolute inset-0 bg-charcoal/45 backdrop-blur-[1px]"
                    onClick={() => setOtherCelebrationModalOpen(false)}
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="other-celebration-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full max-w-md glass-border warm-card rounded-3xl p-5 shadow-xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <h4 id="other-celebration-title" className="font-serif text-lg text-charcoal text-center mb-1">
                      Tell us more
                    </h4>
                    <p className="text-center text-xs text-charcoal/55 mb-4">What are you celebrating?</p>
                    <label htmlFor="other-celebration-input" className="sr-only">
                      Celebration details
                    </label>
                    <textarea
                      id="other-celebration-input"
                      autoFocus
                      rows={4}
                      value={otherCelebrationDraft}
                      onChange={e => setOtherCelebrationDraft(e.target.value)}
                      placeholder="e.g. graduation, engagement party, housewarming…"
                      className="w-full rounded-xl border border-charcoal/15 bg-amber-light/60 px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-amber/40 resize-none mb-4 rounded-2xl"
                    />
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setOtherCelebrationModalOpen(false)}
                        className="rounded-full px-4 py-2.5 text-sm font-semibold text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={otherCelebrationDraft.trim().length === 0}
                        onClick={() => {
                          const t = otherCelebrationDraft.trim()
                          if (!t) return
                          setWizard(w => ({
                            ...w,
                            form: {
                              ...w.form,
                              celebration: 'Other',
                              celebrationOtherNote: t,
                            },
                            nav: { ...w.nav, occasionSubStep: 2 },
                          }))
                          setOtherCelebrationModalOpen(false)
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-rose-gold text-white font-bold text-sm px-5 py-2.5 hover:bg-opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all btn-glow"
                      >
                        Next
                        <ChevronRight size={18} aria-hidden />
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              {deliveryAddressModalOpen && (
                <motion.div
                  key="delivery-address-overlay"
                  className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    aria-label="Close dialog"
                    className="absolute inset-0 bg-charcoal/45 backdrop-blur-[1px]"
                    onClick={() => setDeliveryAddressModalOpen(false)}
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delivery-address-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full max-w-md glass-border warm-card rounded-3xl p-5 shadow-xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <h4 id="delivery-address-title" className="font-serif text-lg text-charcoal text-center mb-1">
                      Delivery address
                    </h4>
                    <p className="text-center text-xs text-charcoal/55 mb-4">
                      Enter the full address where you&apos;d like the cake delivered.
                    </p>
                    <label htmlFor="delivery-address-input" className="sr-only">
                      Street address and delivery details
                    </label>
                    <textarea
                      id="delivery-address-input"
                      autoFocus
                      rows={4}
                      value={deliveryAddressDraft}
                      onChange={e => setDeliveryAddressDraft(e.target.value)}
                      placeholder="Street address, unit, buzzer code, city, postal code…"
                      className="w-full rounded-xl border border-charcoal/15 bg-amber-light/60 px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-amber/40 resize-none mb-4 rounded-2xl"
                    />
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setDeliveryAddressModalOpen(false)}
                        className="rounded-full px-4 py-2.5 text-sm font-semibold text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={deliveryAddressDraft.trim().length === 0}
                        onClick={() => {
                          const t = deliveryAddressDraft.trim()
                          if (!t) return
                          setWizard(w => ({
                            ...w,
                            form: {
                              ...w.form,
                              fulfillment: 'delivery',
                              deliveryAddress: t,
                            },
                          }))
                          setDeliveryAddressModalOpen(false)
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-rose-gold text-white font-bold text-sm px-5 py-2.5 hover:bg-opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all btn-glow"
                      >
                        Save
                        <ChevronRight size={18} aria-hidden />
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        )}
      </div>
    </section>
  )
}
