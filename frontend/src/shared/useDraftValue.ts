import { useState } from 'react'

/** Editable text of a number input; follows `value` when it changes. */
export function useDraftValue(value: number) {
  const [draft, setDraft] = useState(String(value))
  const [shownValue, setShownValue] = useState(value)

  if (value !== shownValue) {
    setShownValue(value)
    setDraft(String(value))
  }

  return [draft, setDraft] as const
}
