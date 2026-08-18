import { Instagram, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'Process', href: '#process' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Quote form', href: '#order-form' },
  { label: 'Our Story', href: '#about' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#1E1A16' }}>
      {/* Animated gradient top border */}
      <div className="footer-gradient-border" />

      {/* Top CTA strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b" style={{ borderColor: 'rgba(245,158,66,0.12)' }}>
        <div>
          <p className="text-white font-serif text-lg leading-tight">Ready to order your custom cake?</p>
          <p className="text-white/45 text-sm mt-0.5">We&apos;ll respond with a quote within 24 hours.</p>
        </div>
        <a
          href="#order-form"
          className="inline-flex items-center gap-2 bg-rose-gold text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-opacity-90 transition-all duration-500 ease-in-out flex-shrink-0"
          style={{ boxShadow: '0 0 24px rgba(245,158,66,0.25)' }}
        >
          Start your order
          <ArrowRight size={15} />
        </a>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="relative">
            <div
              className="absolute -top-4 -left-4 w-32 h-16 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,66,0.12) 0%, transparent 70%)' }}
              aria-hidden
            />
            <p className="font-serif text-2xl text-white mb-3 relative">Ony&apos;s Boutique</p>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Luxury custom cakes in Downtown Calgary. Elevated design, exceptional taste — made for your most important moments.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com/omygoodiesyyc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/45 transition-all duration-500 ease-in-out hover:text-amber-glow footer-instagram-btn"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick links with draw-in underline */}
          <div>
            <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5">Quick Links</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className="footer-link-animated text-sm text-white/40 hover:text-amber-glow transition-colors duration-400 ease-in-out"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-5">Contact</p>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-white/40">
                <MapPin size={14} className="text-amber flex-shrink-0 mt-0.5" />
                <span className="leading-snug">Calgary Beltline</span>
              </li>
              <li>
                <a
                  href="tel:4034045262"
                  className="footer-link-animated flex items-center gap-3 text-sm text-white/40 hover:text-amber-glow transition-colors duration-400 ease-in-out group"
                >
                  <Phone size={14} className="text-amber flex-shrink-0" />
                  <span>403-404-5262</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:omygoodiesyyc@gmail.com"
                  className="footer-link-animated flex items-center gap-3 text-sm text-white/40 hover:text-amber-glow transition-colors duration-400 ease-in-out group"
                >
                  <Mail size={14} className="text-amber flex-shrink-0" />
                  <span>omygoodiesyyc@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with diamond ornament */}
        <div className="relative pt-6">
          <div className="absolute top-0 left-0 right-0 flex items-center">
            <div className="flex-1 h-px" style={{ background: 'rgba(245,158,66,0.1)' }} />
            <span className="mx-4 text-amber-glow/40 text-xs">◆</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(245,158,66,0.1)' }} />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20 pt-2">
            <p>© {new Date().getFullYear()} Ony&apos;s Boutique Custom Cakes. All rights reserved.</p>
            <p>Business Reg. TN23607229 · Calgary, AB</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
