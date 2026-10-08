import type { ReactNode } from 'react'

type TextInputProps = {
  label: string
  value: string
  icon?: ReactNode
  placeholder?: string
  disabled?: boolean
  onValueChange: (value: string) => void
}

function TextInput({
  label,
  value,
  icon,
  placeholder,
  disabled = false,
  onValueChange,
}: TextInputProps) {
  const input = (
    <input
      className={`text-input ${icon ? 'has-icon' : ''}`}
      type="text"
      aria-label={label}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => {
        onValueChange(event.target.value)
      }}
    />
  )

  if (!icon) {
    return input
  }

  return (
    <span className="text-input-field">
      <span className="text-input-icon" aria-hidden="true">
        {icon}
      </span>
      {input}
    </span>
  )
}

export default TextInput
