import type { Dataset } from '../types/chart'

function createRandom(seed: number) {
  return function random() {
    let value = seed += 0x6d2b79f5
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function randomBetween(random: () => number, min: number, max: number) {
  return Math.round(min + random() * (max - min))
}

function pickOne<T>(random: () => number, items: T[]) {
  return items[Math.floor(random() * items.length)]
}

function createMonthDate(index: number) {
  const month = String((index % 12) + 1).padStart(2, '0')
  const year = 2025 + Math.floor(index / 12)

  return `${year}-${month}-01`
}

export function createDemoDataset(rowCount = 60): Dataset {
  const random = createRandom(42)

  const countries = ['Germany', 'France', 'Spain', 'United States', 'Japan']
  const categories = ['Software', 'Services', 'Hardware', 'Training']

  return {
    fields: [
      { name: 'date', type: 'date' },
      { name: 'revenue', type: 'number' },
      { name: 'profit', type: 'number' },
      { name: 'country', type: 'category' },
      { name: 'category', type: 'category' },
      { name: 'customers', type: 'number' },
    ],
    rows: Array.from({ length: rowCount }, (_, index) => {
      const revenue = randomBetween(random, 80000, 260000)
      const margin = randomBetween(random, 16, 36) / 100

      return {
        date: createMonthDate(index),
        revenue,
        profit: Math.round(revenue * margin),
        country: pickOne(random, countries),
        category: pickOne(random, categories),
        customers: randomBetween(random, 80, 360),
      }
    }),
  }
}