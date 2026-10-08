import ScrubbableNumber from './ScrubbableNumber'

import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'

// ===== TYPES =================================================================
type RotationDialProps = {
  label: string
  value: number
  onValueChange: (value: number) => void
}

// ===== CONSTANTS =============================================================
const MIN_ANGLE = -90
const MAX_ANGLE = 90
const SNAP_ANGLE = 15

const keyDirections: Record<string, number> = {
  ArrowDown: -1,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: 1,
}

// ===== HELPERS ===============================================================
function clampAngle(angle: number): number {
  return Math.min(MAX_ANGLE, Math.max(MIN_ANGLE, angle))
}

function getPointerAngle(event: ReactPointerEvent<HTMLDivElement>): number {
  const rect = event.currentTarget.getBoundingClientRect()
  const deltaX = event.clientX - (rect.left + rect.width / 2)
  const deltaY = event.clientY - (rect.top + rect.height / 2)
  const angle = (-Math.atan2(deltaY, deltaX) * 180) / Math.PI
  const lineAngle =
    angle > MAX_ANGLE ? angle - 180 : angle < MIN_ANGLE ? angle + 180 : angle
  const snap = event.shiftKey ? SNAP_ANGLE : 1
  return clampAngle(Math.round(lineAngle / snap) * snap)
}

// ===== COMPONENT =============================================================
function RotationDial({ label, value, onValueChange }: RotationDialProps) {
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>): void {
    event.currentTarget.setPointerCapture(event.pointerId)
    onValueChange(getPointerAngle(event))
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>): void {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      onValueChange(getPointerAngle(event))
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>): void {
    const direction = keyDirections[event.key]
    if (!direction) {
      return
    }
    event.preventDefault()
    const step = event.shiftKey ? SNAP_ANGLE : 1
    onValueChange(clampAngle(value + direction * step))
  }

  return (
    <div className="rotation-dial">
      <div
        aria-label={label}
        aria-valuemax={MAX_ANGLE}
        aria-valuemin={MIN_ANGLE}
        aria-valuenow={value}
        className="rotation-dial-knob"
        role="slider"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <span
          className="rotation-dial-needle"
          style={{ transform: `rotate(${-value}deg)` }}
        />
      </div>
      <ScrubbableNumber
        label={`${label} degrees`}
        min={MIN_ANGLE}
        max={MAX_ANGLE}
        step={1}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  )
}

export default RotationDial
