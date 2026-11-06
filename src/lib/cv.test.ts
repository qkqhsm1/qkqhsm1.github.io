import { formatYearRange, formatMonthDay, isUpcoming } from './cv'
import { education, publications, profile } from '@/content/cv'

test('year ranges use a thin-spaced en dash', () => {
  expect(formatYearRange(2025, 'Present')).toBe('2025 – Present')
  expect(formatYearRange(2023, 2025)).toBe('2023 – 2025')
})

test('month-day ignores the local time zone', () => {
  expect(formatMonthDay('2026-09-05')).toBe('Sep 5')
  expect(formatMonthDay('2026-11-19')).toBe('Nov 19')
})

test('a presentation is upcoming only until its date passes', () => {
  expect(isUpcoming('2026-11-19', new Date('2026-11-06'))).toBe(true)
  expect(isUpcoming('2026-11-19', new Date('2026-11-20'))).toBe(false)
})

test('cv data matches the approved content', () => {
  expect(education).toHaveLength(3)
  expect(publications.map((p) => p.doi)).toEqual([
    '10.1016/j.jpowsour.2026.241369',
    '10.1149/1945-7111/adfd1a',
  ])
  expect(profile.links.find((l) => l.label === 'CV')?.href).toBeUndefined()
  expect(profile.links.some((l) => l.label === 'GitHub')).toBe(false)
})
