'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    quote:
      'The cake was the centerpiece of our reception — guests took photos before we even cut it. And the flavour? Everyone asked who made it.',
    name: 'Wedding hosts',
    detail: 'Downtown Calgary',
  },
  {
    quote:
      "We've ordered more than once and each cake has been more beautiful than the last. The studio listens and then somehow exceeds what you pictured.",
    name: 'Repeat celebration client',
    detail: 'Calgary',
  },
  {
    quote:
      'We needed something polished for a corporate milestone — on-brand, professional, and delicious. Our team was genuinely impressed.',
    name: 'Corporate client',
    detail: 'Calgary',
  },
] as const

const starSizes = [14, 16, 18, 16, 14]

const reviewMarqueeText = "★★★★★  5-Star Reviews  ·  Calgary  ·  O' My Goodies  ·  "

export default function Reviews() {
  return (
    <section id="reviews" className="section-padding section-ambient overflow-hidden relative" style={{ backgroundImage: 'url(/Celebration Wedding.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-amber-muted/88 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-10"
        >
          <p className="label-tag mb-4">Reviews</p>
          <h2 className="heading-lg text-charcoal">
            Love from{' '}
            <span className="text-rose-gold italic">Calgary</span>
          </h2>
          <p className="mt-4 text-charcoal/55 max-w-xl mx-auto text-sm leading-relaxed">
            Real celebrations, real reactions — here&apos;s what clients say about working with O&apos; My Goodies.
          </p>
        </motion.div>

        {/* Amber star marquee band */}
        <div className="marquee-wrap mb-10 -mx-6 md:-mx-12 lg:-mx-24">
          <div
            className="marquee-track py-2.5"
            style={{
              background: 'rgba(245,158,66,0.12)',
              borderTop: '1px solid rgba(245,158,66,0.2)',
              borderBottom: '1px solid rgba(245,158,66,0.2)',
            }}
          >
            {[0, 1].map((setIdx) => (
              <span key={setIdx} className="flex items-center flex-shrink-0">
                {Array(8).fill(null).map((_, j) => (
                  <span
                    key={j}
                    className="text-[11px] font-semibold text-amber/80 tracking-wider whitespace-nowrap px-6"
                  >
                    {reviewMarqueeText}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial cards — slide in from right */}
        <div className="grid lg:grid-cols-3 gap-5 mb-10">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              className="warm-card group rounded-3xl p-8 flex flex-col h-full relative overflow-hidden border-t-2 border-rose-gold/40 hover:-translate-y-1 transition-all duration-500 ease-in-out"
              style={{ background: 'rgba(255,248,236,0.85)' }}
            >
              {/* Decorative large quote mark */}
              <span
                className="absolute top-4 right-6 font-serif text-[7rem] leading-none text-amber-glow/25 select-none pointer-events-none"
                aria-hidden
              >
                &ldquo;
              </span>

              {/* Stars — staggered sizes */}
              <div className="flex items-center gap-0.5 mb-5">
                {starSizes.map((size, j) => (
                  <Star key={j} size={size} className="text-amber fill-amber/90" aria-hidden />
                ))}
              </div>

              <p className="font-serif text-base text-charcoal/85 leading-relaxed flex-1 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-6 pt-5 flex items-center gap-3" style={{ borderTop: '1px solid rgba(245,158,66,0.2)' }}>
                <div className="w-9 h-9 rounded-full bg-rose-gold/15 border border-rose-gold/30 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-sm font-bold text-rose-gold">{t.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm leading-tight">{t.name}</p>
                  <p className="text-xs text-rose-gold mt-0.5">{t.detail}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Portfolio photo grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10"
        >
          {[
            '/5B99DEE4-E800-4DF2-B996-E194343F3627.png',
            '/13C93E34-9AE7-4229-860B-5C30D64A3501.png',
            '/8B0413F2-95B7-4B1C-AA81-F4316D8E16DC.png',
            '/F8FF9757-50F0-4FF1-B6C5-EB0B30785CB4.png',
            '/9E94165E-DB30-4B8E-A797-5E58FB3C7D0E.png',
            '/7D294E86-802D-4F67-B12C-E32BD7B29B65.png',
          ].map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative aspect-square rounded-2xl overflow-hidden glass-border-img"
            >
              <Image
                src={src}
                alt="Cake gallery"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
                sizes="(max-width: 768px) 33vw, 16vw"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
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
