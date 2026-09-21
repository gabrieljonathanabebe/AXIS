import { GripVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import Button from '../../components/ui/Button'

import type { PointerEvent as ReactPointerEvent } from 'react'

type ScrubbableNumberProps = {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  pixelsPerStep?: number
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

function ScrubbableNumber({
  label,
  value,
  min,
  max,
  step = 1,
  pixelsPerStep = 6,
  onValueChange,
}: ScrubbableNumberProps) {
  const [draftValue, setDraftValue] = useState(String(value))
  const dragState = useRef<DragState | null>(null)

  useEffect(() => {
    setDraftValue(String(value))
  }, [value])

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

  return (
    <div className="scrubbable-number">
      <Button
        className="scrubbable-number-handle"
        aria-label={`Drag to change ${label}`}
        title="Drag horizontally to adjust"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <GripVertical size={13} />
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
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commitDraftValue()
            event.currentTarget.blur()
          }

          if (event.key === 'Escape') {
            setDraftValue(String(value))
            event.currentTarget.blur()
          }
        }}
      />
    </div>
  )
}

export default ScrubbableNumber
