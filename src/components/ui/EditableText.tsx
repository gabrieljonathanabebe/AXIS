import { useState } from 'react'

import type { KeyboardEvent } from 'react'

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
  const [draft, setDraft] = useState<string | null>(null)
  const isEditing = draft !== null

  function commit(): void {
    if (draft !== null && draft.trim() !== value.trim()) {
      onCommit(draft.trim())
    }
    setDraft(null)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    event.stopPropagation()
    if (event.key === 'Enter') {
      commit()
    }
    if (event.key === 'Escape') {
      setDraft(null)
    }
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        className={`editable-text-input ${className}`}
        type="text"
        aria-label={label}
        placeholder={placeholder}
        value={draft}
        onBlur={commit}
        onChange={(event) => setDraft(event.target.value)}
        onFocus={(event) => event.currentTarget.select()}
        onKeyDown={handleKeyDown}
      />
    )
  }

  return (
    <button
      className={`editable-text ${className}`}
      type="button"
      aria-label={`Edit ${label.toLowerCase()}`}
      title={value.trim() || placeholder}
      onClick={() => setDraft(value)}
    >
      {value.trim() || placeholder}
    </button>
  )
}

export default EditableText
