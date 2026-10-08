// ===== CONSTANTS =============================================================
const MEASURE_STEP_COUNT = 200

// ===== FUNCTIONS =============================================================
// Evenly spaced values from min to max; integers stay whole and unique.
export function createMeasureSteps(
  min: number,
  max: number,
  isInteger: boolean,
): number[] {
  if (min === max) {
    return [min]
  }
  const steps = Array.from({ length: MEASURE_STEP_COUNT + 1 }, (_, index) => {
    const value = min + ((max - min) * index) / MEASURE_STEP_COUNT
    return isInteger ? Math.round(value) : value
  })
  return [...new Set(steps)]
}
