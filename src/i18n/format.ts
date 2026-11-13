/**
 * Format an ISO date (YYYY-MM-DD) for display in the active language.
 * Noon UTC keeps the calendar day stable across time zones.
 */
export function formatDate(isoDate: string, language: string): string {
  const date = new Date(`${isoDate}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return isoDate
  return new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(date)
}
