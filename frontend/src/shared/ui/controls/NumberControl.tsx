import { GripVertical } from 'lucide-react'

import Button from '../primitives/Button'
import NumberInput from '../primitives/NumberInput'
import { useScrub } from './useScrub'

import type { ReactNode } from 'react'

type NumberControlProps = {
  icon?: ReactNode
  label: string
  value: number | null
  min?: number
  max?: number
  step?: number
  pixelsPerStep?: number
  unit?: string
  onAuto?: () => void
  onValueChange: (value: number) => void
}

/**
 * Number field with a drag handle: dragging the icon or grip sideways
 * steps the value, typing and arrow keys go to `NumberInput`. With
 * `onAuto` the value may be auto; dragging then starts from the minimum.
 * @param props Value, bounds, step, optional icon, unit and auto action.
 */
function NumberControl({
  icon,
  label,
  value,
  min,
  max,
  step = 1,
  pixelsPerStep = 6,
  unit,
  onAuto,
  onValueChange,
}: NumberControlProps) {
  const scrubHandlers = useScrub({
    bounds: { max, min, step },
    pixelsPerStep,
    startValue: value ?? min ?? 0,
    onValueChange,
  })

  return (
    <div className={`control-frame number-control ${icon ? 'has-icon' : ''}`}>
      <Button
        {...scrubHandlers}
        className="number-control-handle"
        variant="ghost"
        aria-label={`Drag to change ${label}`}
        title={icon ? label : 'Drag horizontally to adjust'}
      >
        {icon ?? <GripVertical size={13} />}
      </Button>
      <NumberInput
        label={label}
        max={max}
        min={min}
        step={step}
        value={value}
        onAuto={onAuto}
        onValueChange={onValueChange}
      />
      {unit && value !== null ? (
        <span className="number-control-unit">{unit}</span>
      ) : null}
    </div>
  )
}

export default NumberControl
