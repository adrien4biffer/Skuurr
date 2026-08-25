import { BUSINESS } from '../data/business'

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-dark via-cream to-cream" />

      <div
        className="absolute -right-24 top-24 -z-10 h-[420px] w-[420px] rounded-full bg-tomato/10 blur-3xl sm:h-[520px] sm:w-[520px]"
        aria-hidden
      />
      <div
        className="absolute -left-32 bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-olive/10 blur-3xl"
        aria-hidden
      />

      <div
        className="animate-float absolute right-[8%] top-[22%] hidden text-6xl opacity-90 sm:block"
        style={{ '--rot': '-8deg' } as React.CSSProperties}
        aria-hidden
      >
        🍕
      </div>
      <div
        className="animate-float absolute left-[6%] top-[62%] hidden text-5xl opacity-80 sm:block"
        style={{ '--rot': '6deg', animationDelay: '1.2s' } as React.CSSProperties}
        aria-hidden
      >
        🌿
      </div>
      <div
        className="animate-float absolute right-[16%] top-[68%] hidden text-4xl opacity-80 sm:block"
        style={{ '--rot': '10deg', animationDelay: '2.4s' } as React.CSSProperties}
        aria-hidden
      >
        🍅
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-tomato/25 bg-tomato/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-tomato-dark">
            Depuis {BUSINESS.founded} · {BUSINESS.address.city}, Vaud
          </span>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] text-charcoal sm:text-6xl lg:text-[4.2rem]">
            L’Italie du Sud,
            <br />
            <span className="text-tomato">au feu de bois.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal-soft">
            Pizzas napolitaines à pâte longue fermentation et spécialités
            siciliennes faites maison, servies dans une ambiance conviviale
            au cœur d’Orbe. Sur place, à emporter, ou en livraison.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#reservation"
              className="rounded-full bg-tomato px-7 py-3.5 text-base font-semibold text-cream shadow-lg shadow-tomato/20 transition-all hover:-translate-y-0.5 hover:bg-tomato-dark hover:shadow-xl"
            >
              Réserver une table
            </a>
            <a
              href="#menu"
              className="rounded-full border-2 border-charcoal/15 px-7 py-3.5 text-base font-semibold text-charcoal transition-all hover:-translate-y-0.5 hover:border-charcoal/30"
            >
              Découvrir le menu
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            <div>
              <p className="font-display text-3xl font-semibold text-charcoal">100%</p>
              <p className="text-sm text-charcoal-soft">Pâte maison, longue fermentation</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-charcoal">{new Date().getFullYear() - BUSINESS.founded}+</p>
              <p className="text-sm text-charcoal-soft">Ans de tradition sicilienne</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-charcoal">4.6★</p>
              <p className="text-sm text-charcoal-soft">Avis clients</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-tomato to-tomato-dark shadow-2xl shadow-tomato/25">
            <div className="bg-noise absolute inset-0 opacity-30" aria-hidden />
            <div className="absolute inset-0 flex items-center justify-center text-[10rem] drop-shadow-xl">
              🍕
            </div>
            <div
              className="animate-steam absolute left-[46%] top-[38%] h-14 w-2 -translate-x-1/2 rounded-full bg-white/40 blur-[2px]"
              aria-hidden
            />
            <div
              className="animate-steam absolute left-[56%] top-[34%] h-16 w-2 -translate-x-1/2 rounded-full bg-white/30 blur-[2px]"
              style={{ animationDelay: '1.3s' }}
              aria-hidden
            />
          </div>

          <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
            <span className="text-2xl">🔥</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-charcoal">Four à bois traditionnel</p>
              <p className="text-xs text-charcoal-soft">Cuisson 90 secondes, 450°C</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
