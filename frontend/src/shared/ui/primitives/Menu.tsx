import { Check } from 'lucide-react'

import OptionContent from '../display/OptionContent'
import Tile from '../tiles/Tile'
import Button from './Button'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** One choice of a menu or icon group; some controls show its icon. */
export type OptionItem<TValue extends string> = {
  disabled?: boolean
  icon?: LucideIcon
  label: string
  /** Shorter text for the select button, e.g. "Auto" for "Auto · Month". */
  shortLabel?: string
  value: TValue
}

type MenuProps<TValue extends string> = {
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
function Menu<TValue extends string>({
  options,
  renderOption,
  value,
  onChange,
}: MenuProps<TValue>) {
  return (
    <Tile className="menu stack">
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <Button
            className="menu-item spread"
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
    </Tile>
  )
}

export default Menu
