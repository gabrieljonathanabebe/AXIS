import Button from './Button'

type ToggleProps = {
  checked: boolean
  label: string
  disabled?: boolean
  onCheckedChange: (checked: boolean) => void
}

function Toggle({
  checked,
  label,
  disabled = false,
  onCheckedChange,
}: ToggleProps) {
  return (
    <Button
      className="toggle"
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      isActive={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
    >
      <span className="toggle-thumb" />
    </Button>
  )
}

export default Toggle
