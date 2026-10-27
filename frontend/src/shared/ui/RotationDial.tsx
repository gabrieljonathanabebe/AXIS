import ScrubbableNumber from './ScrubbableNumber'

// ===== TYPES =================================================================
type RotationDialProps = {
  label: string
  value: number
  onValueChange: (value: number) => void
}

// ===== CONSTANTS =============================================================
const MIN_ANGLE = -90
const MAX_ANGLE = 90

// ===== COMPONENT =============================================================
/**
 * Angle field of a rotation, e.g. of axis labels: its needle shows the
 * angle and scrubs it when dragged sideways; typing and the arrow keys
 * change it as well.
 */
function RotationDial({ label, value, onValueChange }: RotationDialProps) {
  return (
    <ScrubbableNumber
      icon={
        <span
          aria-hidden="true"
          className="rotation-dial-needle"
          style={{ transform: `rotate(${-value}deg)` }}
        />
      }
      label={label}
      max={MAX_ANGLE}
      min={MIN_ANGLE}
      step={1}
      unit="°"
      value={value}
      onValueChange={onValueChange}
    />
  )
}

export default RotationDial
