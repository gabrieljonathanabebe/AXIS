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

type DragState = {
  pointerId: number
  startX: number
  startValue: number
  lastValue: number
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
 * sideways, by typing or with the arrow keys. With `onAuto` the value may
 * be auto: an empty field shows "Auto", emptying it calls `onAuto`, and
 * dragging or stepping starts from the minimum.
 * @param props Value, bounds, step, optional icon, unit and auto action.
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
  onAuto,
  onValueChange,
}: ScrubbableNumberProps) {
  const [draftValue, setDraftValue, resetDraftValue] = useDraftValue(value)
  const dragState = useRef<DragState | null>(null)
  const pendingValue = useRef<number | null>(null)
  const frameRequest = useRef<number | null>(null)
  const baseValue = value ?? min ?? 0

  function commitValue(nextValue: number): void {
    const normalizedValue = normalizeValue(nextValue, step)
    const boundedValue = clampValue(normalizedValue, min, max)

    setDraftValue(String(boundedValue))
    onValueChange(boundedValue)
  }

  /** Commits the value a drag left for this frame, if there is one. */
  function flushPendingValue(): void {
    frameRequest.current = null
    const nextValue = pendingValue.current
    pendingValue.current = null
    if (nextValue !== null) {
      commitValue(nextValue)
    }
  }

  /**
   * Leaves a dragged value for the next frame, so a fast drag commits at
   * most once per frame and panel and charts update once.
   * @param nextValue Value at the latest pointer position.
   */
  function scheduleValue(nextValue: number): void {
    pendingValue.current = nextValue
    if (frameRequest.current === null) {
      frameRequest.current = requestAnimationFrame(flushPendingValue)
    }
  }

  /** Commits the typed number; an emptied field turns auto when allowed. */
  function commitDraftValue(): void {
    if (onAuto && draftValue === '') {
      if (value !== null) {
        onAuto()
      }
      return
    }
    const parsedValue = Number(draftValue)

    if (!Number.isFinite(parsedValue)) {
      resetDraftValue()
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
      startValue: baseValue,
      lastValue: baseValue,
    }
  }

  /**
   * Turns a sideways drag into steps; a new value waits for the next frame,
   * and an unchanged value is not committed again.
   */
  function handlePointerMove(
    event: ReactPointerEvent<HTMLButtonElement>,
  ): void {
    const currentDrag = dragState.current

    if (!currentDrag || currentDrag.pointerId !== event.pointerId) {
      return
    }

    const distance = event.clientX - currentDrag.startX
    const stepCount = Math.round(distance / pixelsPerStep)
    const nextValue = clampValue(
      normalizeValue(currentDrag.startValue + stepCount * step, step),
      min,
      max,
    )
    if (nextValue === currentDrag.lastValue) {
      return
    }
    currentDrag.lastValue = nextValue
    scheduleValue(nextValue)
  }

  /** Ends a drag and commits a value still waiting for its frame. */
  function stopDragging(): void {
    dragState.current = null
    if (frameRequest.current !== null) {
      cancelAnimationFrame(frameRequest.current)
      flushPendingValue()
    }
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
      commitValue(baseValue + direction * stepCount * step)
    }

    if (event.key === 'Enter') {
      commitDraftValue()
      event.currentTarget.blur()
    }

    if (event.key === 'Escape') {
      resetDraftValue()
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
        placeholder={onAuto ? 'Auto' : undefined}
        value={draftValue}
        onChange={(event) => {
          setDraftValue(event.currentTarget.value)
        }}
        onBlur={commitDraftValue}
        onKeyDown={handleKeyDown}
      />
      {unit && value !== null ? (
        <span className="scrubbable-number-unit">{unit}</span>
      ) : null}
    </div>
  )
}

export default ScrubbableNumber
