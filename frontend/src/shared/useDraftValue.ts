import { useState } from 'react'

/**
 * Draft of a field that commits; follows `value` when it changes, e.g. a
 * number field shows "12", or "" for auto.
 * @param value Text the field shows.
 * @returns The draft, its setter and a reset to the shown value.
 */
export function useDraftValue(value: string) {
  const [draft, setDraft] = useState(value)
  const [shownValue, setShownValue] = useState(value)

  if (value !== shownValue) {
    setShownValue(value)
    setDraft(value)
  }

  /** Shows the value again and drops what was typed. */
  function resetDraft(): void {
    setDraft(value)
  }

  return [draft, setDraft, resetDraft] as const
}
