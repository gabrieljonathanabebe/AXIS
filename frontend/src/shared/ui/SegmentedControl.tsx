import Button from './Button'
import OptionContent from './OptionContent'

import type { ReactNode } from 'react'
import type { OptionItem } from './OptionsMenu'

type SegmentedControlProps<TValue extends string> = {
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  className?: string
  renderOption?: (option: OptionItem<TValue>) => ReactNode
  onValueChange: (value: TValue) => void
}

/**
 * Group of exclusive options; each shows its icon and label, or what
 * `renderOption` returns, e.g. only an icon that shows the result. When
 * `renderOption` returns null, the option keeps its icon and label.
 */
function SegmentedControl<TValue extends string>({
  label,
  className = '',
  options,
  value,
  renderOption,
  onValueChange,
}: SegmentedControlProps<TValue>) {
  return (
    <div
      className={`segmented-control ${className}`}
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <Button
            className="segmented-control-option"
            isActive={isActive}
            aria-label={option.label}
            aria-pressed={isActive}
            title={option.label}
            onClick={() => onValueChange(option.value)}
            key={option.value}
          >
            {renderOption?.(option) ?? <OptionContent option={option} />}
          </Button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
