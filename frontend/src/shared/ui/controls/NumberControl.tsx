import { GripVertical } from 'lucide-react'

import Button from '../primitives/Button'
import NumberInput from '../primitives/NumberInput'
import { getShownNumber, NUMBER_UNITS, toStoredNumber } from './numberUnits'
import { useScrub } from './useScrub'

import type { ReactNode } from 'react'
import type { NumberUnit } from './numberUnits'

type NumberControlProps = {
  icon?: ReactNode
  label: string
  value: number | null
  min?: number
  max?: number
  step?: number
  pixelsPerStep?: number
  unit?: NumberUnit
  onAuto?: () => void
  onValueChange: (value: number) => void
}

/**
 * Number field with a drag handle: dragging the icon or grip sideways
 * steps the value, typing and arrow keys go to `NumberInput`. `unit` adds
 * its sign and converts, e.g. a stored fraction 0.4 shows as 40 %; value,
 * bounds and step stay as stored. A degree shows an arrow turned by the
 * angle. With `onAuto` the value may be auto; dragging then starts from
 * the minimum.
 * @param props Value, bounds, step, optional icon, unit and auto action.
 */
function NumberControl({
  icon,
  label,
  value,
  min,
  max,
  step,
  pixelsPerStep = 6,
  unit,
  onAuto,
  onValueChange,
}: NumberControlProps) {
  const shown = getShownNumber(value, { max, min, step }, unit)
  const shownIcon =
    icon ?? (unit ? NUMBER_UNITS[unit].renderIcon?.(value ?? 0) : undefined)

  /**
   * Hands on a shown value as stored, e.g. 40 % → 0.4.
   * @param shownValue Value as the field shows it.
   */
  function handleValueChange(shownValue: number): void {
    onValueChange(toStoredNumber(shownValue, unit))
  }

  const scrubHandlers = useScrub({
    bounds: shown.bounds,
    pixelsPerStep,
    startValue: shown.value ?? shown.bounds.min ?? 0,
    onValueChange: handleValueChange,
  })

  return (
    <div
      className={`control-frame number-control ${shownIcon ? 'has-icon' : ''}`}
    >
      <Button
        {...scrubHandlers}
        className="number-control-handle"
        variant="ghost"
        aria-label={`Drag to change ${label}`}
        title={shownIcon ? label : 'Drag horizontally to adjust'}
      >
        {shownIcon ?? <GripVertical size={13} />}
      </Button>
      <NumberInput
        label={label}
        max={shown.bounds.max}
        min={shown.bounds.min}
        step={shown.bounds.step}
        value={shown.value}
        onAuto={onAuto}
        onValueChange={handleValueChange}
      />
      {unit && value !== null ? (
        <span className="number-control-unit">{NUMBER_UNITS[unit].suffix}</span>
      ) : null}
    </div>
  )
}

export default NumberControl
