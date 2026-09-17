import SelectControl from './SelectControl'
import type { OptionItem } from './OptionsMenu'

type DropdownFieldProps<TValue extends string> = {
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  placeholder?: string
  onChange: (value: TValue) => void
}

function DropdownField<TValue extends string>({
  label,
  options,
  value,
  placeholder,
  onChange,
}: DropdownFieldProps<TValue>) {
  return (
    <div className="dropdown-field">
      <span className="dropdown-field-label">{label}</span>

      <SelectControl
        label={label}
        options={options}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  )
}

export default DropdownField
