import { type FormEvent, useMemo, useState } from 'react'
import { BUSINESS, DAY_LABELS, OPENING_HOURS } from '../data/business'
import {
  getAvailableSlots,
  isDayOpen,
  type Reservation,
  useReservations,
} from '../hooks/useReservations'

const MAX_GUESTS_ONLINE = 12

function todayISO(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

function maxDateISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 60)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  message: string
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: '2',
  message: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+()\s.-]{6,20}$/

export default function ReservationSection() {
  const { addReservation } = useReservations()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [confirmed, setConfirmed] = useState<Reservation | null>(null)

  const slots = useMemo(() => getAvailableSlots(form.date), [form.date])
  const dayOpen = useMemo(() => isDayOpen(form.date), [form.date])

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'date' ? { time: '' } : {}),
    }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}

    if (!form.firstName.trim()) next.firstName = 'Prénom requis'
    if (!form.lastName.trim()) next.lastName = 'Nom requis'
    if (!EMAIL_RE.test(form.email)) next.email = 'Email invalide'
    if (!PHONE_RE.test(form.phone)) next.phone = 'Téléphone invalide'
    if (!form.date) next.date = 'Choisissez une date'
    else if (!dayOpen) next.date = 'Fermé ce jour-là'
    if (!form.time) next.time = 'Choisissez un horaire'
    const guests = Number(form.guests)
    if (!guests || guests < 1) next.guests = 'Nombre de personnes invalide'
    else if (guests > MAX_GUESTS_ONLINE)
      next.guests = `Pour plus de ${MAX_GUESTS_ONLINE} personnes, merci de nous appeler`

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const reservation = addReservation({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      message: form.message.trim() || undefined,
    })
    setConfirmed(reservation)
  }

  const startOver = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setConfirmed(null)
  }

  return (
    <section id="reservation" className="bg-charcoal py-24 text-cream">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            Réservation
          </span>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Réservez votre table
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-cream/70">
            Confirmez votre venue en quelques secondes. Nous vous
            recontactons uniquement en cas de besoin — sinon, votre table
            vous attend à l’heure choisie.
          </p>

          <dl className="mt-10 space-y-5">
            <div className="flex gap-4">
              <dt className="text-xl">📍</dt>
              <dd className="text-sm leading-relaxed text-cream/80">
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.zip} {BUSINESS.address.city}, {BUSINESS.address.country}
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-xl">📞</dt>
              <dd className="text-sm text-cream/80">
                <a href={`tel:${BUSINESS.phoneHref}`} className="hover:text-gold-light">
                  {BUSINESS.phone}
                </a>
                <br />
                <span className="text-cream/50">
                  Plus de {MAX_GUESTS_ONLINE} personnes ? Appelez-nous directement.
                </span>
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-xl">🕒</dt>
              <dd className="w-full text-sm text-cream/80">
                <ul className="space-y-1">
                  {DAY_LABELS.map((label, idx) => {
                    const periods = OPENING_HOURS[idx]
                    return (
                      <li key={label} className="flex justify-between gap-6">
                        <span>{label}</span>
                        <span className="text-cream/60">
                          {periods.length
                            ? periods.map((p) => `${p.start}–${p.end}`).join(' / ')
                            : 'Fermé'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl bg-cream p-6 text-charcoal shadow-2xl sm:p-8">
          {confirmed ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-olive/15 text-3xl">
                ✓
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-charcoal">
                Réservation enregistrée !
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-charcoal-soft">
                Merci {confirmed.firstName} ! Votre table pour{' '}
                <strong>{confirmed.guests}</strong> personne
                {confirmed.guests > 1 ? 's' : ''} est prévue le{' '}
                <strong>
                  {new Date(`${confirmed.date}T00:00:00`).toLocaleDateString('fr-CH', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </strong>{' '}
                à <strong>{confirmed.time}</strong>.
              </p>
              <p className="mt-3 text-xs text-charcoal-soft">
                Référence : {confirmed.id} · un SMS/appel de confirmation
                pourra vous être envoyé au {confirmed.phone}.
              </p>
              <button
                type="button"
                onClick={startOver}
                className="mt-7 rounded-full border-2 border-charcoal/15 px-6 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-tomato hover:text-tomato-dark"
              >
                Faire une nouvelle réservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Prénom" error={errors.firstName}>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    className={inputClass(!!errors.firstName)}
                    placeholder="Marco"
                  />
                </Field>
                <Field label="Nom" error={errors.lastName}>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    className={inputClass(!!errors.lastName)}
                    placeholder="Rossi"
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={inputClass(!!errors.email)}
                    placeholder="marco@email.com"
                  />
                </Field>
                <Field label="Téléphone" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={inputClass(!!errors.phone)}
                    placeholder="079 000 00 00"
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Date" error={errors.date}>
                  <input
                    type="date"
                    value={form.date}
                    min={todayISO()}
                    max={maxDateISO()}
                    onChange={(e) => update('date', e.target.value)}
                    className={inputClass(!!errors.date)}
                  />
                </Field>
                <Field label="Heure" error={errors.time}>
                  <select
                    value={form.time}
                    onChange={(e) => update('time', e.target.value)}
                    disabled={!form.date || !dayOpen}
                    className={`${inputClass(!!errors.time)} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <option value="">
                      {!form.date
                        ? 'Choisir une date'
                        : !dayOpen
                          ? 'Fermé'
                          : slots.length
                            ? 'Choisir'
                            : 'Plus de créneau'}
                    </option>
                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Personnes" error={errors.guests}>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={form.guests}
                    onChange={(e) => update('guests', e.target.value)}
                    className={inputClass(!!errors.guests)}
                  />
                </Field>
              </div>

              <Field label="Message (optionnel)">
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  rows={3}
                  className={inputClass(false)}
                  placeholder="Allergie, chaise haute, anniversaire..."
                />
              </Field>

              <button
                type="submit"
                className="w-full rounded-full bg-tomato px-6 py-3.5 text-base font-semibold text-cream shadow-lg shadow-tomato/20 transition-all hover:-translate-y-0.5 hover:bg-tomato-dark"
              >
                Confirmer la réservation
              </button>
              <p className="text-center text-xs text-charcoal-soft">
                En réservant, vous acceptez d’être contacté(e) pour confirmer
                votre venue si nécessaire.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition-colors placeholder:text-charcoal-soft/50 focus:border-tomato focus:ring-2 focus:ring-tomato/15 ${
    hasError ? 'border-tomato' : 'border-charcoal/15'
  }`
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block text-sm font-medium text-charcoal-soft">
      {label}
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs font-medium text-tomato">{error}</p>}
    </label>
  )
}
