'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    quote: 'We ordered cakes from Boutique Cakes multiple times and they were absolutely amazing! The cakes were so soft, fresh, and full of flavour. Everything looked beautiful and was decorated perfectly, exactly like the inspo. Everyone loved them!',
    name: 'Marwa Alemi',
    detail: '5 reviews · a day ago',
  },
  {
    quote: 'She has made our birthday cakes since she’s started. Her cakes are delicious, moist, and perfect flavour profiles. She does her best to get the design you request, and has not disappointed me! She’s someone I would return to for every event!',
    name: 'Dyane Marcelin',
    detail: '6 reviews · 2 photos · 2 days ago',
  },
  {
    quote: 'Such an amazing experience from start to finish! I was frantically looking for someone to bake a cake for my husbands birthday last minute. She connected with me very quickly, which I really appreciated, and her online form was super easy to fill out!',
    name: 'anita',
    detail: 'Local Guide · 10 reviews · 3 photos · 3 days ago',
  },
  {
    quote: 'I honestly can’t recommend her enough! She’s made multiple cakes for my birthdays and special events, and every single one has been absolutely amazing. Not only are her cakes beautiful and customized perfectly, but they taste incredible too!',
    name: 'Ameena M',
    detail: '7 reviews · 3 photos · 4 days ago',
  },
  {
    quote: 'Extra Fresh cake delicious too the design was 100% accurate and exactly like it was on the inspo picture',
    name: 'Shamiso Oworu',
    detail: '1 review · 1 photo · 5 days ago',
  },
  {
    quote: 'Perfect execution of the design!',
    name: 'Ruth Tesfay',
    detail: '1 review · 5 days ago',
  },
] as const

const starSizes = [14, 16, 18, 16, 14]

const reviewMarqueeText = "★★★★★  5-Star Reviews  ·  Calgary  ·  Ony's Boutique  ·  "

const portfolioPhotos = [
  {
    src: '/WhatsApp Image.jpeg',
    alt: 'Just Married sheet cake decorated with white roses and ruffled buttercream',
  },
  {
    src: '/WhatsApp Image 1.jpeg',
    alt: 'Three-tier white wedding cake with vintage piped buttercream details',
  },
  {
    src: '/WhatsApp Image 2026-08-10 at 2.47.06 PM.jpeg',
    alt: 'Three-tier pearl wedding cake decorated with white roses',
  },
  {
    src: '/5B99DEE4-E800-4DF2-B996-E194343F3627.png',
    alt: "Custom cake from Ony's Boutique gallery",
  },
  {
    src: '/13C93E34-9AE7-4229-860B-5C30D64A3501.png',
    alt: "Custom cake from Ony's Boutique gallery",
  },
  {
    src: '/8B0413F2-95B7-4B1C-AA81-F4316D8E16DC.png',
    alt: "Custom cake from Ony's Boutique gallery",
  },
  {
    src: '/F8FF9757-50F0-4FF1-B6C5-EB0B30785CB4.png',
    alt: "Custom cake from Ony's Boutique gallery",
  },
  {
    src: '/9E94165E-DB30-4B8E-A797-5E58FB3C7D0E.png',
    alt: "Custom cake from Ony's Boutique gallery",
  },
  {
    src: '/7D294E86-802D-4F67-B12C-E32BD7B29B65.png',
    alt: "Custom cake from Ony's Boutique gallery",
  },
] as const

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
            Real celebrations, real reactions — here&apos;s what clients say about working with Ony&apos;s Boutique.
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
              transition={{ duration: 0.6, delay: (i % 3) * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
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

        {/* Infinite portfolio marquee */}
        <motion.div
          id="gallery"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="gallery-marquee marquee-wrap -mx-6 md:-mx-12 lg:-mx-24 mb-10 scroll-mt-28"
          aria-label="Cake gallery"
        >
          <div className="gallery-marquee-track py-2">
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                className={`gallery-marquee-set ${setIndex === 1 ? 'gallery-marquee-set-duplicate' : ''}`}
                aria-hidden={setIndex === 1 ? true : undefined}
              >
                {portfolioPhotos.map(({ src, alt }) => (
                  <div
                    key={`${setIndex}-${src}`}
                    className="gallery-marquee-item relative aspect-[4/5] rounded-2xl overflow-hidden glass-border-img"
                  >
                    <Image
                      src={src}
                      alt={setIndex === 0 ? alt : ''}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
                      sizes="(max-width: 768px) 208px, 320px"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
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
