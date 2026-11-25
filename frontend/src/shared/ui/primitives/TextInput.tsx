import { useEffect, useRef } from 'react'

import Input from './Input'

import type { ReactNode } from 'react'
import type { InputProps } from './Input'

// ===== TYPES =================================================================
/** Look of a text field: a pill in a panel, or the text itself in place. */
type TextInputVariant = 'field' | 'inline'

type TextInputProps = Omit<InputProps, 'type'> & {
  icon?: ReactNode
  variant?: TextInputVariant
  onClose?: () => void
}

// ===== COMPONENT =============================================================
/**
 * Text field of a panel, e.g. a search; `icon` sits inside on the left.
 * Live by default, `mode="commit"` keeps a draft. `inline` edits a text in
 * place, e.g. a title on the canvas: it focuses and selects itself, ends
 * on a press elsewhere, keeps its keys from the canvas, hands on changed
 * text trimmed and then calls `onClose`; Escape only calls `onClose`.
 * @param props Variant, icon, close handler and the props of `Input`.
 */
function TextInput({
  className = '',
  icon,
  value,
  variant = 'field',
  onClose,
  onValueChange,
  ...inputProps
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isInline = variant === 'inline'

  useEffect(() => {
    if (!isInline) {
      return
    }
    /**
     * A press elsewhere ends the edit, also where the canvas keeps focus.
     * @param event Pointer down anywhere in the document.
     */
    function handlePointerDown(event: PointerEvent): void {
      if (event.target !== inputRef.current) {
        inputRef.current?.blur()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [isInline])

  /**
   * Hands on the trimmed text if it changed, then ends the edit.
   * @param draft Text of the field.
   */
  function handleInlineCommit(draft: string): void {
    const text = draft.trim()
    if (text !== value.trim()) {
      onValueChange(text)
    }
    onClose?.()
  }

  if (isInline) {
    return (
      <Input
        {...inputProps}
        autoFocus
        className={['editable-text-input', className].filter(Boolean).join(' ')}
        mode="commit"
        ref={inputRef}
        type="text"
        value={value}
        onCancel={onClose}
        onFocus={(event) => event.currentTarget.select()}
        onKeyDown={(event) => event.stopPropagation()}
        onValueChange={handleInlineCommit}
      />
    )
  }

  const input = (
    <Input
      {...inputProps}
      className={['text-input', icon ? 'has-icon' : '', className]
        .filter(Boolean)
        .join(' ')}
      type="text"
      value={value}
      onValueChange={onValueChange}
    />
  )

  if (!icon) {
    return input
  }

  return (
    <span className="text-input-wrapper">
      <span className="text-input-icon" aria-hidden="true">
        {icon}
      </span>
      {input}
    </span>
  )
}

export default TextInput
