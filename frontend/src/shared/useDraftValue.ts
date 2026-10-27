import { useState } from 'react'

/**
 * Editable text of a number input; follows `value` when it changes. No
 * value, e.g. auto, shows an empty input.
 * @param value Number the input shows, or null for none.
 * @returns The draft, its setter and a reset to the shown value.
 */
export function useDraftValue(value: number | null) {
  const shownDraft = value === null ? '' : String(value)
  const [draft, setDraft] = useState(shownDraft)
  const [shownValue, setShownValue] = useState(value)

  if (value !== shownValue) {
    setShownValue(value)
    setDraft(shownDraft)
  }

  /** Shows the value again and drops what was typed. */
  function resetDraft(): void {
    setDraft(shownDraft)
  }

  return [draft, setDraft, resetDraft] as const
}
