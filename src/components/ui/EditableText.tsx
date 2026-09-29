import { useState } from 'react'

import InlineTextInput from './InlineTextInput'

type EditableTextProps = {
  label: string
  value: string
  placeholder: string
  className?: string
  onCommit: (value: string) => void
}

function EditableText({
  label,
  value,
  placeholder,
  className = '',
  onCommit,
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
      title={value.trim() || placeholder}
      onClick={() => setIsEditing(true)}
    >
      {value.trim() || placeholder}
    </button>
  )
}

export default EditableText
