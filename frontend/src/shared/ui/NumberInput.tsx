import { useDraftValue } from '../useDraftValue'

// ===== TYPES =================================================================
type NumberInputProps = {
  label: string
  max: number
  min: number
  step?: number
  value: number
  onValueChange: (value: number) => void
}

// ===== COMPONENT =============================================================
/**
 * Small number field next to a slider. The typed text stays a draft until
 * Enter or blur; then it is clamped to min and max and committed.
 */
function NumberInput({
  label,
  max,
  min,
  step = 1,
  value,
  onValueChange,
}: NumberInputProps) {
  const [draftValue, setDraftValue] = useDraftValue(value)

  /** Commits the draft within min and max, or restores the last value. */
  function commitDraftValue() {
    const parsedValue = Number(draftValue)
    if (!Number.isFinite(parsedValue)) {
      setDraftValue(String(value))
      return
    }
    const nextValue = Math.min(max, Math.max(min, parsedValue))
    setDraftValue(String(nextValue))
    onValueChange(nextValue)
  }

  return (
    <input
      className="number-input"
      type="number"
      aria-label={label}
      max={max}
      min={min}
      step={step}
      value={draftValue}
      onBlur={commitDraftValue}
      onChange={(event) => setDraftValue(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          commitDraftValue()
          event.currentTarget.blur()
        }
      }}
    />
  )
}

export default NumberInput
