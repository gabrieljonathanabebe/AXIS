import { Check } from 'lucide-react'
import Button from './Button'
import Widget from './Widget'

export type OptionItem<TValue extends string> = {
  label: string
  value: TValue
}

type OptionsMenuProps<TValue extends string> = {
  options: OptionItem<TValue>[]
  value: TValue
  onChange: (value: TValue) => void
}

function OptionsMenu<TValue extends string>({
  options,
  value,
  onChange,
}: OptionsMenuProps<TValue>) {
  return (
    <Widget className="options-menu stack">
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <Button
            className="options-menu-item spread"
            isActive={isSelected}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            <span>{option.label}</span>
            {isSelected ? <Check size={16} /> : null}
          </Button>
        )
      })}
    </Widget>
  )
}

export default OptionsMenu
