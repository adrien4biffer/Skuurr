import { useCallback, useState } from 'react'
import { OPENING_HOURS } from '../data/business'

export interface Reservation {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  guests: number
  message?: string
  createdAt: string
}

const STORAGE_KEY = 'marsiglia_reservations'
const SLOT_INTERVAL_MINUTES = 30
const LAST_SEATING_BUFFER_MINUTES = 30

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function toHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0')
  const m = (totalMinutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

/** Génère les créneaux horaires disponibles pour une date donnée, en fonction des horaires d'ouverture. */
export function getAvailableSlots(dateStr: string): string[] {
  if (!dateStr) return []
  const date = new Date(`${dateStr}T00:00:00`)
  const periods = OPENING_HOURS[date.getDay()] ?? []
  const slots: string[] = []

  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  for (const period of periods) {
    const start = toMinutes(period.start)
    const end = toMinutes(period.end) - LAST_SEATING_BUFFER_MINUTES
    for (let t = start; t <= end; t += SLOT_INTERVAL_MINUTES) {
      if (isToday && t <= nowMinutes + 60) continue // au moins 1h à l'avance
      slots.push(toHHMM(t))
    }
  }
  return slots
}

export function isDayOpen(dateStr: string): boolean {
  if (!dateStr) return false
  const date = new Date(`${dateStr}T00:00:00`)
  return (OPENING_HOURS[date.getDay()] ?? []).length > 0
}

function loadReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Reservation[]) : []
  } catch {
    return []
  }
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(loadReservations)

  const addReservation = useCallback((data: Omit<Reservation, 'id' | 'createdAt'>) => {
    const reservation: Reservation = {
      ...data,
      id: `MAR-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    }
    setReservations((prev) => {
      const next = [...prev, reservation]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
    return reservation
  }, [])

  return { reservations, addReservation }
}
