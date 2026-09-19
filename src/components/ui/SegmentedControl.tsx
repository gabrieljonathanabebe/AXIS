import Button from './Button'

import type { OptionItem } from './OptionsMenu'

type SegmentedControlProps<TValue extends string> = {
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  onValueChange: (value: TValue) => void
}

function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onValueChange,
}: SegmentedControlProps<TValue>) {
  return (
    <div className="segmented-control" role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <Button
            className="segmented-control-option"
            isActive={isActive}
            aria-pressed={isActive}
            onClick={() => onValueChange(option.value)}
            key={option.value}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
