import { useEffect, useRef, useState } from 'react'

import type { CSSProperties, KeyboardEvent } from 'react'

type InlineTextInputProps = {
  label: string
  initialValue: string
  placeholder: string
  className?: string
  formatElement?: string
  style?: CSSProperties
  onClose: () => void
  onCommit: (value: string) => void
}

/**
 * Edits a text in place; Enter or blur commits, Escape cancels.
 * `formatElement` marks it as the part that the format focus frames.
 */
function InlineTextInput({
  label,
  initialValue,
  placeholder,
  className = '',
  formatElement,
  style,
  onClose,
  onCommit,
}: InlineTextInputProps) {
  const [draft, setDraft] = useState(initialValue)
  const isClosedRef = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    function handlePointerDown(event: PointerEvent): void {
      if (event.target !== inputRef.current) {
        inputRef.current?.blur()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [])

  function close(): void {
    isClosedRef.current = true
    onClose()
  }

  function commit(): void {
    if (isClosedRef.current) {
      return
    }
    if (draft.trim() !== initialValue.trim()) {
      onCommit(draft.trim())
    }
    close()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    event.stopPropagation()
    if (event.key === 'Enter') {
      commit()
    }
    if (event.key === 'Escape') {
      close()
    }
  }

  return (
    <input
      autoFocus
      className={`editable-text-input ${className}`}
      data-format-element={formatElement}
      type="text"
      aria-label={label}
      placeholder={placeholder}
      ref={inputRef}
      style={style}
      value={draft}
      onBlur={commit}
      onChange={(event) => setDraft(event.target.value)}
      onFocus={(event) => event.currentTarget.select()}
      onKeyDown={handleKeyDown}
    />
  )
}

export default InlineTextInput
