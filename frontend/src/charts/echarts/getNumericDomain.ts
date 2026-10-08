export type NumericDomain = {
  min: number
  max: number
}

export function getNumericDomain(
  values: readonly unknown[],
): NumericDomain | null {
  const numericValues = values.filter((value): value is number => {
    return typeof value === 'number' && Number.isFinite(value)
  })

  if (numericValues.length === 0) {
    return null
  }

  return {
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
  }
}
