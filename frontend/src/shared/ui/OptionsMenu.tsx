import { Check } from 'lucide-react'

import Button from './Button'
import OptionContent from './OptionContent'
import Widget from './Widget'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** One choice of a menu or icon group; some controls show its icon. */
export type OptionItem<TValue extends string> = {
  disabled?: boolean
  icon?: LucideIcon
  label: string
  value: TValue
}

type OptionsMenuProps<TValue extends string> = {
  options: OptionItem<TValue>[]
  renderOption?: (option: OptionItem<TValue>) => ReactNode
  value: TValue
  onChange: (value: TValue) => void
}

/**
 * List of options in a menu, e.g. of a select; each shows its icon and
 * label, or what `renderOption` returns, e.g. a preview. The selected one
 * is marked with a check.
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
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            <span>
              {renderOption?.(option) ?? <OptionContent option={option} />}
            </span>
            {isSelected ? <Check size={14} /> : null}
          </Button>
        )
      })}
    </Widget>
  )
}

export default OptionsMenu
