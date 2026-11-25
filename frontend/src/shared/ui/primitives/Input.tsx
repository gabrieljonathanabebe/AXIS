import { useRef } from 'react'

import { useDraftValue } from '@/shared/useDraftValue'
import { getDraftKeyAction } from './inputDraft'

import type { ComponentProps, FocusEvent, KeyboardEvent } from 'react'

// ===== TYPES =================================================================
/** When typed text counts: on every key, or on Enter and leaving. */
export type InputMode = 'commit' | 'live'

export type InputProps = Omit<
  ComponentProps<'input'>,
  'aria-label' | 'onChange' | 'value'
> & {
  label: string
  mode?: InputMode
  value: string
  onCancel?: () => void
  onValueChange: (value: string) => void
}

// ===== COMPONENT =============================================================
/**
 * Native field; `live` hands on every key, e.g. a search. `commit` keeps a
 * draft: Enter or leaving hands it on, Escape drops it and calls
 * `onCancel`. Afterwards the field shows `value` again, so a value the
 * caller bounds or rejects replaces the draft.
 * @param props Label, mode, value, handlers and native input props.
 */
function Input({
  label,
  mode = 'live',
  value,
  onBlur,
  onCancel,
  onKeyDown,
  onValueChange,
  ...inputProps
}: InputProps) {
  const [draft, setDraft, resetDraft] = useDraftValue(value)
  const isCancelledRef = useRef(false)
  const isLive = mode === 'live'

  /**
   * Leaving ends every edit: hands the draft on, or drops it after Escape.
   * @param event Blur of the field.
   */
  function handleBlur(event: FocusEvent<HTMLInputElement>): void {
    if (isCancelledRef.current) {
      isCancelledRef.current = false
      onCancel?.()
    } else {
      onValueChange(draft)
    }
    resetDraft()
    onBlur?.(event)
  }

  /**
   * Enter and Escape leave the field; Escape first marks the draft as
   * dropped, so leaving does not hand it on.
   * @param event Key press in the field.
   */
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    onKeyDown?.(event)
    const action = getDraftKeyAction(event.key)
    if (!action) {
      return
    }
    isCancelledRef.current = action === 'cancel'
    event.currentTarget.blur()
  }

  return (
    <input
      {...inputProps}
      aria-label={label}
      value={isLive ? value : draft}
      onBlur={isLive ? onBlur : handleBlur}
      onChange={(event) => {
        if (isLive) {
          onValueChange(event.target.value)
        } else {
          setDraft(event.target.value)
        }
      }}
      onKeyDown={isLive ? onKeyDown : handleKeyDown}
    />
  )
}

export default Input
