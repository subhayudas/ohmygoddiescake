'use client'

import { motion } from 'framer-motion'
import { FileText, Cake, CheckCircle, Clock, Sparkles, CreditCard } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    step: '01',
    title: 'Fill Out the Cake Order Form',
    body: 'Tell us about your dream cake — flavour, design, occasion, and servings. Takes less than 2 minutes.',
    accent: Clock,
    accentLabel: '< 2 min',
  },
  {
    icon: Cake,
    step: '02',
    title: 'Customize Your Cake',
    body: 'Our baker reviews your order and reaches out to finalize every detail — design, colours, and any special touches.',
    accent: Sparkles,
    accentLabel: 'Personalized',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Confirm & Lock In Your Date',
    body: "Once your cake is finalized, you'll receive a payment link for your 50% deposit to secure your order.",
    accent: CreditCard,
    accentLabel: '50% deposit',
  },
]

const cardVariants = {
  hidden: { opacity: 0, rotateX: -8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
}

export default function HowItWorks() {
  return (
    <section id="process" className="section-padding section-ambient bg-amber-muted overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <p className="label-tag mb-4">The Process</p>
          <h2 className="heading-lg text-charcoal">
            How to Order Your{' '}
            <span className="text-rose-gold italic">Custom Cake</span>
          </h2>
          <p className="mt-4 text-charcoal/55 max-w-xl mx-auto text-sm">
            Three simple steps from first message to first bite. We keep it straightforward so you can focus on celebrating.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* SVG connector line with draw-in animation */}
          <div
            className="hidden md:block absolute top-12 left-[16.666%] right-[16.666%]"
            style={{ overflow: 'visible', height: '2px' }}
          >
            <svg
              width="100%"
              height="2"
              viewBox="0 0 100 2"
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              <motion.path
                d="M0 1 L100 1"
                stroke="rgba(245,158,66,0.4)"
                strokeWidth="0.25"
                strokeDasharray="1.2 1.2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
              />
            </svg>
            {/* Animated glow dot */}
            <motion.div
              animate={{ x: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-gold shadow-[0_0_12px_rgba(201,149,106,0.7)]"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon
              const AccentIcon = s.accent
              return (
                <motion.div
                  key={s.step}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{ perspective: 800 }}
                  className="relative flex flex-col items-center md:items-start text-center md:text-left"
                >
                  {/* Step circle with pulse */}
                  <div className="relative mb-6 z-10">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
                      className="w-24 h-24 rounded-full bg-amber-light border-2 border-amber/20 flex items-center justify-center shadow-[0_0_32px_rgba(245,158,66,0.12)]"
                    >
                      <Icon size={28} className="text-rose-gold" />
                    </motion.div>
                  </div>

                  {/* Content card */}
                  <div className="glass-border warm-card rounded-3xl p-6 w-full relative overflow-hidden">
                    {/* Ghost step number */}
                    <span className="absolute bottom-3 right-4 font-serif text-6xl font-bold text-[#A67C52]/55 leading-none select-none">
                      {s.step}
                    </span>

                    <h3 className="font-serif text-lg text-charcoal mb-2 pr-8 leading-snug">{s.title}</h3>
                    <p className="text-sm text-charcoal/60 leading-relaxed mb-4">{s.body}</p>

                    {/* Accent chip */}
                    <div className="inline-flex items-center gap-1.5 bg-amber-glow/30 rounded-full px-3 py-1">
                      <AccentIcon size={11} className="text-rose-gold" />
                      <span className="text-[11px] font-semibold text-charcoal/70">{s.accentLabel}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 flex justify-center"
        >
          <a
            href="#order-form"
            className="btn-glow btn-amber-glow bg-rose-gold text-white text-sm font-semibold px-10 py-4 rounded-full hover:bg-opacity-90 transition-all duration-500 ease-in-out"
          >
            Order My Cake
          </a>
        </motion.div>
      </div>
    </section>
  )
}
