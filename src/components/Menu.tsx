import { useState } from 'react'
import { MENU } from '../data/menu'
import { useReveal } from '../hooks/useReveal'

const TAG_LABELS: Record<string, string> = {
  vege: 'Végé',
  piquant: 'Piquant',
  signature: 'Signature',
}

const TAG_STYLES: Record<string, string> = {
  vege: 'bg-olive/10 text-olive',
  piquant: 'bg-tomato/10 text-tomato-dark',
  signature: 'bg-gold/20 text-charcoal',
}

export default function Menu() {
  const [active, setActive] = useState(MENU[0].id)
  const { ref, visible } = useReveal<HTMLDivElement>()
  const category = MENU.find((c) => c.id === active) ?? MENU[0]

  return (
    <section id="menu" className="py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-tomato-dark">
            La Carte
          </span>
          <h2 className="mt-3 text-4xl font-semibold text-charcoal sm:text-5xl">
            Notre menu
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-charcoal-soft">
            Une sélection de pizzas et spécialités préparées chaque jour avec
            des produits frais. Prix en CHF.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {MENU.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                active === cat.id
                  ? 'bg-tomato text-cream shadow-md shadow-tomato/20'
                  : 'bg-cream-dark text-charcoal-soft hover:bg-cream-dark/70'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div
          ref={ref}
          key={category.id}
          className={`reveal mt-12 ${visible ? 'reveal-visible' : ''}`}
        >
          {category.subtitle && (
            <p className="mb-6 text-center text-sm italic text-charcoal-soft">
              {category.subtitle}
            </p>
          )}

          <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {category.items.map((item) => (
              <li
                key={item.name}
                className="flex items-start justify-between gap-4 border-b border-charcoal/10 pb-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-medium text-charcoal">
                      {item.name}
                    </h3>
                    {item.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TAG_STYLES[tag]}`}
                      >
                        {TAG_LABELS[tag]}
                      </span>
                    ))}
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-charcoal-soft">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="whitespace-nowrap font-display text-lg font-semibold text-tomato-dark">
                  {item.price.toFixed(2).replace('.00', '')}.–
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-center text-xs text-charcoal-soft">
          Menu et prix donnés à titre indicatif — allergènes et ingrédients
          détaillés sur demande.
        </p>
      </div>
    </section>
  )
}
