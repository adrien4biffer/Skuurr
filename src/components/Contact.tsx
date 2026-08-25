import { BUSINESS } from '../data/business'

export default function Contact() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    BUSINESS.mapsQuery,
  )}&z=16&output=embed`

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-tomato-dark">
            Contact
          </span>
          <h2 className="mt-3 text-4xl font-semibold text-charcoal sm:text-5xl">
            Venez nous rencontrer
          </h2>
        </div>

        <div className="mt-12 grid gap-8 overflow-hidden rounded-3xl border border-charcoal/8 shadow-sm lg:grid-cols-2">
          <div className="aspect-[4/3] w-full lg:aspect-auto">
            <iframe
              title="Localisation de la pizzeria"
              src={mapSrc}
              className="h-full w-full min-h-[320px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col justify-center gap-7 p-8 sm:p-10">
            <ContactRow icon="📍" title="Adresse">
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.zip} {BUSINESS.address.city}, {BUSINESS.address.country}
            </ContactRow>
            <ContactRow icon="📞" title="Téléphone">
              <a href={`tel:${BUSINESS.phoneHref}`} className="hover:text-tomato-dark">
                {BUSINESS.phone}
              </a>
            </ContactRow>
            <ContactRow icon="✉️" title="Email">
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-tomato-dark">
                {BUSINESS.email}
              </a>
            </ContactRow>
            <ContactRow icon="📱" title="Réseaux">
              <a
                href={BUSINESS.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-tomato-dark"
              >
                Facebook
              </a>
            </ContactRow>

            <a
              href="#reservation"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-tomato px-6 py-3 text-sm font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-tomato-dark"
            >
              Réserver une table →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactRow({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-charcoal">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-charcoal-soft">{children}</p>
      </div>
    </div>
  )
}
