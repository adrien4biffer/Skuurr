export interface OpeningPeriod {
  start: string // "HH:MM"
  end: string // "HH:MM"
}

// 0 = Dimanche ... 6 = Samedi
export const OPENING_HOURS: Record<number, OpeningPeriod[]> = {
  0: [
    { start: '11:15', end: '14:00' },
    { start: '17:30', end: '21:30' },
  ],
  1: [{ start: '18:00', end: '21:30' }],
  2: [
    { start: '11:15', end: '14:00' },
    { start: '18:00', end: '21:30' },
  ],
  3: [
    { start: '11:15', end: '14:00' },
    { start: '18:00', end: '21:30' },
  ],
  4: [
    { start: '11:15', end: '14:00' },
    { start: '18:00', end: '21:30' },
  ],
  5: [
    { start: '11:15', end: '14:00' },
    { start: '18:00', end: '22:00' },
  ],
  6: [{ start: '18:00', end: '22:00' }],
}

export const DAY_LABELS = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
]

export const BUSINESS = {
  name: 'Pizzeria Marsiglia',
  founded: 2017,
  tagline: 'Pizzas napolitaines & saveurs de Sicile',
  address: {
    street: 'Rue du Grand-Pont 8',
    zip: '1350',
    city: 'Orbe',
    country: 'Suisse',
  },
  phone: '024 441 60 40',
  phoneHref: '+41244416040',
  email: 'contact@pizzeria-marsiglia.ch',
  facebook: 'https://www.facebook.com/pizzeria.marsiglia/',
  mapsQuery: 'Pizzeria Marsiglia, Rue du Grand-Pont 8, 1350 Orbe',
}
