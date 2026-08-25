import { useEffect, useState } from 'react'
import { BUSINESS } from '../data/business'

const LINKS = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#histoire', label: 'Notre histoire' },
  { href: '#menu', label: 'Menu' },
  { href: '#reservation', label: 'Réservation' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/95 shadow-[0_4px_20px_rgba(42,28,20,0.08)] backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#accueil" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-tomato-dark">
            Marsiglia
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-charcoal-soft sm:inline">
            Pizzeria · Orbe
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal-soft transition-colors hover:text-tomato-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${BUSINESS.phoneHref}`}
            className="text-sm font-semibold text-charcoal-soft hover:text-tomato-dark"
          >
            {BUSINESS.phone}
          </a>
          <a
            href="#reservation"
            className="rounded-full bg-tomato px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all hover:-translate-y-0.5 hover:bg-tomato-dark hover:shadow-md"
          >
            Réserver une table
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-charcoal/10 lg:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          <span
            className={`h-0.5 w-5 bg-charcoal transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`h-0.5 w-5 bg-charcoal transition-opacity ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-0.5 w-5 bg-charcoal transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-charcoal/10 bg-cream px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="rounded-lg px-2 py-3 text-base font-medium text-charcoal-soft hover:bg-cream-dark"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reservation"
              onClick={handleNavClick}
              className="mt-2 rounded-full bg-tomato px-5 py-3 text-center text-sm font-semibold text-cream"
            >
              Réserver une table
            </a>
            <a
              href={`tel:${BUSINESS.phoneHref}`}
              className="mt-1 px-2 py-2 text-center text-sm font-semibold text-charcoal-soft"
            >
              {BUSINESS.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
