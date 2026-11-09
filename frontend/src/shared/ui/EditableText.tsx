import { useState } from 'react'

import InlineTextInput from './InlineTextInput'

import type { PointerEvent } from 'react'

type EditableTextProps = {
  label: string
  value: string
  placeholder: string
  className?: string
  onCommit: (value: string) => void
  onPointerEnter?: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerLeave?: (event: PointerEvent<HTMLButtonElement>) => void
}

function EditableText({
  label,
  value,
  placeholder,
  className = '',
  onCommit,
  onPointerEnter,
  onPointerLeave,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <InlineTextInput
        className={className}
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
