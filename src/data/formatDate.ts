const dateFormat = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

export function formatDate(value: string): string {
  return dateFormat.format(new Date(value))
}
