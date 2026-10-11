import { LOCALE } from '../config'

const dateFormat = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

export function formatDate(value: string | number): string {
  return dateFormat.format(new Date(value))
}
