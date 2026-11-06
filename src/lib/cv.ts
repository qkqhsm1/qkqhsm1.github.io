export const THIN = String.fromCharCode(0x2009) // thin space

export function formatYearRange(start: number, end: number | 'Present'): string {
  return `${start}${THIN}–${THIN}${end}`
}

export function formatMonthDay(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function isUpcoming(isoDate: string, today: Date): boolean {
  // Upcoming through the day of the event itself.
  return new Date(isoDate).getTime() + 86_400_000 > today.getTime()
}
