import { useState } from 'react'

import InlineTextInput from './InlineTextInput'

import type { PointerEvent } from 'react'

type EditableTextProps = {
  label: string
  value: string
  placeholder: string
  className?: string
  formatElement?: string
  onCommit: (value: string) => void
  onPointerEnter?: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerLeave?: (event: PointerEvent<HTMLButtonElement>) => void
}

/**
 * Shows a text that turns into an input on a double click. `formatElement`
 * marks it as a part of its object that the format focus frames.
 */
function EditableText({
  label,
  value,
  placeholder,
  className = '',
  formatElement,
  onCommit,
  onPointerEnter,
  onPointerLeave,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <InlineTextInput
        className={className}
        formatElement={formatElement}
        initialValue={value}
        label={label}
        placeholder={placeholder}
        onClose={() => setIsEditing(false)}
        onCommit={onCommit}
      />
    )
  }

  return (
    <button
      className={`editable-text ${className}`}
      data-format-element={formatElement}
      type="button"
      aria-label={`Edit ${label.toLowerCase()}`}
      onClick={(event) => {
        if (event.detail === 0) {
          setIsEditing(true)
        }
      }}
      onDoubleClick={() => setIsEditing(true)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {value.trim() || placeholder}
    </button>
  )
}

export default EditableText
