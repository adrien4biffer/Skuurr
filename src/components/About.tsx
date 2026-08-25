import { useReveal } from '../hooks/useReveal'
import { BUSINESS } from '../data/business'

const VALUES = [
  {
    icon: '🌾',
    title: 'Pâte maison',
    text: 'Farine italienne, longue fermentation de 48h pour une pâte légère et digeste.',
  },
  {
    icon: '🍅',
    title: 'Produits frais',
    text: 'Tomates San Marzano, mozzarella fior di latte et légumes de saison.',
  },
  {
    icon: '🇮🇹',
    title: 'Recettes siciliennes',
    text: 'Des classiques transmis en famille : arancini, caponata, cannoli maison.',
  },
]

export default function About() {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <section id="histoire" className="bg-cream-dark/60 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div
          ref={ref}
          className={`reveal grid gap-14 lg:grid-cols-2 lg:items-center ${visible ? 'reveal-visible' : ''}`}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-tomato-dark">
              Notre histoire
            </span>
            <h2 className="mt-3 text-4xl font-semibold text-charcoal sm:text-5xl">
              Une histoire de famille,
              <br />
              venue de Sicile.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-charcoal-soft">
              Fondée en {BUSINESS.founded} au cœur d’Orbe, la Pizzeria Marsiglia
              est née de l’envie de partager l’hospitalité et les saveurs
              authentiques de la Sicile. Ici, chaque pizza est façonnée à la
              main et cuite au four à bois, chaque spécialité préparée comme
              à la maison — avec le même soin qu’en famille.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-charcoal-soft">
              Que vous veniez pour un dîner entre amis, une pause déjeuner ou
              une pizza à emporter, notre équipe vous accueille avec le
              sourire dans une ambiance chaleureuse et généreuse.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {VALUES.map((value, i) => (
              <div
                key={value.title}
                className={`rounded-2xl border border-charcoal/8 bg-cream p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md ${
                  i === 0 ? 'sm:col-span-2' : ''
                }`}
              >
                <span className="text-3xl">{value.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-charcoal">
                  {value.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
