'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const items = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'Process', href: '#process' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Our Story', href: '#about' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="fixed top-4 md:top-6 left-0 right-0 z-[100] px-4 md:px-8 pointer-events-none font-jakarta">
        <nav
          className={`pointer-events-auto mx-auto max-w-6xl flex items-center justify-between gap-4 bg-surface rounded-clay-pill pl-4 pr-3 py-3 md:pl-6 md:pr-4 md:py-3 transition-shadow duration-300 ${scrolled ? 'shadow-neu-raised-lg' : 'shadow-neu-raised'
            }`}
        >
          {/* Logo in inset well */}
          <a href="#top" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-clay-pill bg-surface shadow-neu-inset-deep flex items-center justify-center overflow-hidden">
              <Image src="/logo-mark.png" alt="Ony's Boutique" width={32} height={32} priority className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="hidden sm:block font-display text-base md:text-lg leading-none tracking-tight text-ink">
              Ony&apos;s Boutique
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 bg-surface shadow-neu-inset rounded-clay-pill px-2 py-1.5">
            {items.map(it => (
              <li key={it.href}>
                <a
                  href={it.href}
                  className="block px-4 py-2 rounded-clay-pill text-sm font-semibold text-ink-soft hover:text-ink hover:bg-surface hover:shadow-neu-flat transition-all duration-200"
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <a
              href="#order-form"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-clay-pill bg-clay-pink-deep text-ink-inverse shadow-clay-button hover:-translate-y-0.5 active:scale-[0.96] active:shadow-clay-pressed transition-all duration-200 ease-press focus-clay"
            >
              Get a Quote
            </a>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="md:hidden w-11 h-11 rounded-clay-pill bg-surface shadow-neu-raised active:shadow-neu-pressed flex items-center justify-center text-ink focus-clay transition-shadow duration-200"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-x-4 top-24 z-[99] origin-top transition-all duration-300 ease-clay font-jakarta ${open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
          }`}
      >
        <div className="bg-surface shadow-neu-raised-lg rounded-clay-lg p-4 flex flex-col gap-2">
          {items.map(it => (
            <a
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="px-5 py-3 rounded-clay-md text-base font-semibold text-ink shadow-neu-flat active:shadow-neu-pressed transition-all"
            >
              {it.label}
            </a>
          ))}
          <a
            href="#order-form"
            onClick={() => setOpen(false)}
            className="mt-2 px-5 py-3 rounded-clay-pill bg-clay-pink-deep text-ink-inverse text-center font-semibold shadow-clay-button active:scale-[0.96] active:shadow-clay-pressed transition-all"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </>
  )
}
