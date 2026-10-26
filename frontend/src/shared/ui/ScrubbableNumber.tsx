import { GripVertical } from 'lucide-react'
import { useRef } from 'react'

import { useDraftValue } from '../useDraftValue'
import Button from './Button'

import type {
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from 'react'

type ScrubbableNumberProps = {
  /** Icon in the field that scrubs the value; without one, a grip. */
  icon?: ReactNode
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  pixelsPerStep?: number
  /** Unit after the value, e.g. `px` or `%`. */
  unit?: string
  onValueChange: (value: number) => void
}

type DragState = {
  pointerId: number
  startX: number
  startValue: number
}

function clampValue(value: number, min?: number, max?: number): number {
  const lowerBound = min ?? Number.NEGATIVE_INFINITY
  const upperBound = max ?? Number.POSITIVE_INFINITY

  return Math.min(upperBound, Math.max(lowerBound, value))
}

function normalizeValue(value: number, step: number): number {
  const decimals = String(step).split('.')[1]?.length ?? 0
  return Number(value.toFixed(decimals))
}

/**
 * Number field that changes its value by dragging the icon or grip
 * sideways, by typing or with the arrow keys.
 * @param props Value, bounds, step, optional icon and unit.
 */
function ScrubbableNumber({
  icon,
  label,
  value,
  min,
  max,
  step = 1,
  pixelsPerStep = 6,
  unit,
  onValueChange,
}: ScrubbableNumberProps) {
  const [draftValue, setDraftValue] = useDraftValue(value)
  const dragState = useRef<DragState | null>(null)

  function commitValue(nextValue: number): void {
    const normalizedValue = normalizeValue(nextValue, step)
    const boundedValue = clampValue(normalizedValue, min, max)

    setDraftValue(String(boundedValue))
    onValueChange(boundedValue)
  }

  function commitDraftValue(): void {
    const parsedValue = Number(draftValue)

    if (!Number.isFinite(parsedValue)) {
      setDraftValue(String(value))
      return
    }

    commitValue(parsedValue)
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
  ): void {
    if (event.button !== 0) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startValue: value,
    }
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLButtonElement>,
  ): void {
    const currentDrag = dragState.current

    if (!currentDrag || currentDrag.pointerId !== event.pointerId) {
      return
    }

    const distance = event.clientX - currentDrag.startX
    const stepCount = Math.round(distance / pixelsPerStep)

    commitValue(currentDrag.startValue + stepCount * step)
  }

  function stopDragging(): void {
    dragState.current = null
  }

  /**
   * Commits with Enter, discards the draft with Escape and steps with the
   * arrow keys, ten steps at a time with Shift.
   * @param event Key press in the number field.
   */
  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const direction = event.key === 'ArrowUp' ? 1 : -1
      const stepCount = event.shiftKey ? 10 : 1
      commitValue(value + direction * stepCount * step)
    }

    if (event.key === 'Enter') {
      commitDraftValue()
      event.currentTarget.blur()
    }

    if (event.key === 'Escape') {
      setDraftValue(String(value))
      event.currentTarget.blur()
    }
  }

  return (
    <div className={`field scrubbable-number ${icon ? 'has-icon' : ''}`}>
      <Button
        className="scrubbable-number-handle"
        aria-label={`Drag to change ${label}`}
        title={icon ? label : 'Drag horizontally to adjust'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        {icon ?? <GripVertical size={13} />}
      </Button>
      <input
        className="scrubbable-number-input"
        type="number"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={draftValue}
        onChange={(event) => {
          setDraftValue(event.currentTarget.value)
        }}
        onBlur={commitDraftValue}
        onKeyDown={handleKeyDown}
      />
      {unit ? <span className="scrubbable-number-unit">{unit}</span> : null}
    </div>
  )
}

export default ScrubbableNumber
