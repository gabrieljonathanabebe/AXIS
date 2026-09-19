type TextInputProps = {
  label: string
  value: string
  placeholder?: string
  disabled?: boolean
  onValueChange: (value: string) => void
}

function TextInput({
  label,
  value,
  placeholder,
  disabled = false,
  onValueChange,
}: TextInputProps) {
  return (
    <input
      className="text-input"
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
}

export default TextInput
