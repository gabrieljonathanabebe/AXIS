import { ArrowRight } from 'lucide-react'

import NumberControl from './NumberControl'

// ===== TYPES =================================================================
type RotationDialProps = {
  label: string
  max?: number
  min?: number
  value: number
  onValueChange: (value: number) => void
}

// ===== CONSTANTS =============================================================
const MIN_ANGLE = -90
const MAX_ANGLE = 90

// ===== COMPONENT =============================================================
/**
 * Angle control of a rotation or direction, e.g. of axis labels or a
 * gradient: its arrow points in the angle and scrubs it when dragged
 * sideways; typing and the arrow keys change it as well. Without `min` and
 * `max` it turns a quarter each way.
 */
function RotationDial({
  label,
  max = MAX_ANGLE,
  min = MIN_ANGLE,
  value,
  onValueChange,
}: RotationDialProps) {
  return (
    <NumberControl
      icon={
        <ArrowRight size={14} style={{ transform: `rotate(${-value}deg)` }} />
      }
      label={label}
      max={max}
      min={min}
      unit="°"
      value={value}
      onValueChange={onValueChange}
    />
  )
}

export default RotationDial
