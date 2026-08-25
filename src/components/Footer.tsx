import { BUSINESS } from '../data/business'

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-cream-dark/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-xl font-semibold text-tomato-dark">
            {BUSINESS.name}
          </p>
          <p className="mt-1 text-sm text-charcoal-soft">
            {BUSINESS.address.street}, {BUSINESS.address.zip} {BUSINESS.address.city}
          </p>
        </div>
        <p className="text-xs text-charcoal-soft">
          © {new Date().getFullYear()} {BUSINESS.name}. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
