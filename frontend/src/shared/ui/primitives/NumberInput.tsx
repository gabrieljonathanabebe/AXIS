import Input from './Input'
import { boundNumber, getArrowSteps, readNumberDraft } from './inputDraft'

import type { KeyboardEvent } from 'react'
import type { InputProps } from './Input'
import type { NumberBounds } from './inputDraft'

// ===== TYPES =================================================================
type NumberInputProps = Omit<
  InputProps,
  'max' | 'min' | 'mode' | 'step' | 'type' | 'value' | 'onValueChange'
> &
  NumberBounds & {
    value: number | null
    onAuto?: () => void
    onValueChange: (value: number) => void
  }

// ===== COMPONENT =============================================================
/**
 * Number field that commits on Enter or leaving, rounded to the step and
 * within min and max, e.g. 3 with min 9 → 9. Arrow keys step at once, ten
 * steps with Shift. With `onAuto` an empty field shows "Auto", and
 * emptying it calls `onAuto`. Its frame, e.g. `NumberControl`, draws the
 * pill.
 * @param props Value, bounds, auto action and the props of `Input`.
 */
function NumberInput({
  className = '',
  max,
  min,
  step = 1,
  value,
  onAuto,
  onValueChange,
  ...inputProps
}: NumberInputProps) {
  const bounds = { max, min, step }

  /**
   * Hands on the typed number, or auto for an emptied field.
   * @param draft Text of the field.
   */
  function handleCommit(draft: string): void {
    const read = readNumberDraft(draft, Boolean(onAuto))
    if (read.kind === 'auto' && value !== null) {
      onAuto?.()
    }
    if (read.kind === 'number') {
      onValueChange(boundNumber(read.value, bounds))
    }
  }

  /**
   * Steps with the arrow keys from the value, or from min when auto.
   * @param event Key press in the field.
   */
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const steps = getArrowSteps(event.key, event.shiftKey)
    if (steps === null) {
      return
    }
    event.preventDefault()
    onValueChange(boundNumber((value ?? min ?? 0) + steps * step, bounds))
  }

  return (
    <Input
      {...inputProps}
      className={['number-input', className].filter(Boolean).join(' ')}
      max={max}
      min={min}
      mode="commit"
      placeholder={onAuto ? 'Auto' : undefined}
      step={step}
      type="number"
      value={value === null ? '' : String(value)}
      onKeyDown={handleKeyDown}
      onValueChange={handleCommit}
    />
  )
}

export default NumberInput
