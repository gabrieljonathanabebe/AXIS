import type { NumericDomain } from './getNumericDomain'

// ===== CONSTANTS =============================================================
/** Round steps per power of ten, e.g. 25 for ticks at 0, 25, 50 … */
const NICE_STEPS = [1, 2, 2.5, 5, 10]

/** Slack against rounding errors, e.g. 0.3 / 0.1 = 2.9999999999999996. */
const EPSILON = 1e-9

// ===== HELPERS ===============================================================
/**
 * Smallest round step that is at least the rough step, so the scale
 * never gets more sections than wanted.
 * @param roughStep Range divided by the wanted number of sections.
 * @returns A step of 1, 2, 2.5 or 5 times a power of ten.
 */
function getNiceStep(roughStep: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  const factor = NICE_STEPS.find((step) => step * magnitude >= roughStep) ?? 10
  return factor * magnitude
}

// ===== FUNCTION ==============================================================
/**
 * Values the continuous color scale labels. Automatic shows only its
 * minimum and maximum; a tick count shows round values inside the range,
 * like the sections of an axis. The range itself stays, so the colors of
 * the marks do not change.
 * @param range Minimum and maximum of the color scale.
 * @param tickCount Wanted number of sections, or null for automatic.
 * @returns Tick values from small to large.
 */
export function getColorScaleTicks(
  { max, min }: NumericDomain,
  tickCount: number | null,
): number[] {
  if (max <= min) {
    return [min]
  }
  if (tickCount === null) {
    return [min, max]
  }
  const step = getNiceStep((max - min) / tickCount)
  const decimals = Math.max(0, 1 - Math.floor(Math.log10(step)))
  const first = Math.ceil(min / step - EPSILON)
  const last = Math.floor(max / step + EPSILON)
  return Array.from({ length: last - first + 1 }, (_, index) => {
    return Number(((first + index) * step).toFixed(decimals))
  })
}
