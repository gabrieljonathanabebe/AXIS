import { ArrowRight } from 'lucide-react'

import { boundNumber } from '../primitives/inputDraft'

import type { ReactNode } from 'react'
import type { NumberBounds } from '../primitives/inputDraft'

// ===== TYPES =================================================================
/** Unit of a number control; its name says what the model stores. */
export type NumberUnit = 'degree' | 'fraction' | 'ms' | 'percent' | 'px'

type NumberUnitSpec = NumberBounds & {
  /** Shown value per stored one, e.g. 100 for a fraction shown in percent. */
  scale?: number
  suffix: string
  /** Icon that shows the value, e.g. an arrow turned by the angle. */
  renderIcon?: (value: number) => ReactNode
}

/** Value and bounds as the field shows them. */
type ShownNumber = {
  bounds: NumberBounds
  value: number | null
}

// ===== CONSTANTS =============================================================
/** Sign, scale, default bounds and icon of each unit. */
export const NUMBER_UNITS: Record<NumberUnit, NumberUnitSpec> = {
  degree: {
    max: 90,
    min: -90,
    suffix: '°',
    renderIcon: (value) => (
      <ArrowRight size={14} style={{ transform: `rotate(${-value}deg)` }} />
    ),
  },
  fraction: { max: 1, min: 0, scale: 100, step: 0.01, suffix: '%' },
  ms: { suffix: 'ms' },
  percent: { suffix: '%' },
  px: { suffix: 'px' },
}

// ===== FUNCTIONS =============================================================
/**
 * Value and bounds as the field shows them; bounds the caller leaves out
 * come from the unit, e.g. a fraction 0.4 shows as 40 within 0–100.
 * @param value Stored value, or null for auto.
 * @param bounds Stored bounds and step of the caller.
 * @param unit Unit of the control, if any.
 * @returns Shown value and bounds.
 */
export function getShownNumber(
  value: number | null,
  bounds: NumberBounds,
  unit?: NumberUnit,
): ShownNumber {
  const spec: Partial<NumberUnitSpec> = unit ? NUMBER_UNITS[unit] : {}
  const scale = spec.scale ?? 1
  const step = (bounds.step ?? spec.step ?? 1) * scale

  /**
   * Scales a stored number and drops float noise, e.g. 0.07 → 7.
   * @param stored Stored number, if there is one.
   */
  function show(stored: number | undefined): number | undefined {
    return stored === undefined
      ? undefined
      : boundNumber(stored * scale, { step })
  }

  return {
    bounds: {
      max: show(bounds.max ?? spec.max),
      min: show(bounds.min ?? spec.min),
      step,
    },
    value: value === null ? null : (show(value) ?? null),
  }
}

/**
 * Stored value of a shown one, e.g. 40 % of a fraction → 0.4.
 * @param shown Value as the field shows it.
 * @param unit Unit of the control, if any.
 * @returns The value to store.
 */
export function toStoredNumber(shown: number, unit?: NumberUnit): number {
  const scale = unit ? (NUMBER_UNITS[unit].scale ?? 1) : 1
  return shown / scale
}
