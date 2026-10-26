import { Check } from 'lucide-react'

import Button from './Button'
import Widget from './Widget'

import type { ReactNode } from 'react'

export type OptionItem<TValue extends string> = {
  label: string
  value: TValue
}

type OptionsMenuProps<TValue extends string> = {
  options: OptionItem<TValue>[]
  /** Content of an option, e.g. a preview; without it, the label. */
  renderOption?: (option: OptionItem<TValue>) => ReactNode
  value: TValue
  onChange: (value: TValue) => void
}

/**
 * List of options in a menu, e.g. of a select; the selected one is marked
 * with a check.
 * @param props Options, selected value, optional rendering and handler.
 */
function OptionsMenu<TValue extends string>({
  options,
  renderOption,
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
            role="option"
            aria-selected={isSelected}
            isActive={isSelected}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            <span>{renderOption?.(option) ?? option.label}</span>
            {isSelected ? <Check size={16} /> : null}
          </Button>
        )
      })}
    </Widget>
  )
}

export default OptionsMenu
