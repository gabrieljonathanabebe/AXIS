import { Check } from 'lucide-react'
import { useState } from 'react'

import OptionLabel from '../display/OptionLabel'
import Button from './Button'
import Popover from './Popover'

import type { OptionItem } from '@/shared/optionItem'
import type { ReactNode } from 'react'
import type { PopoverTriggerProps } from './Popover'

type SelectMenuProps<TValue extends string> = {
  label: string
  matchTriggerWidth?: boolean
  options: OptionItem<TValue>[]
  renderOption?: (option: OptionItem<TValue>) => ReactNode
  value: TValue
  onChange: (value: TValue) => void
  renderTrigger: (props: PopoverTriggerProps) => ReactNode
}

/**
 * Menu of a select that opens below its trigger; each option shows its
 * icon and label, or what `renderOption` returns, e.g. a preview. The
 * selected one is marked with a check; choosing one closes the menu.
 * @param props Label, options, selected value, trigger and handler.
 */
function SelectMenu<TValue extends string>({
  label,
  matchTriggerWidth = false,
  options,
  renderOption,
  value,
  onChange,
  renderTrigger,
}: SelectMenuProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Hands on the chosen option and closes the menu.
   * @param nextValue Value of the chosen option.
   */
  function handleChange(nextValue: TValue): void {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <Popover
      label={label}
      open={isOpen}
      placement="bottom-start"
      role="listbox"
      matchTriggerWidth={matchTriggerWidth}
      onOpenChange={setIsOpen}
      renderTrigger={renderTrigger}
    >
      <div className="select-menu stack">
        {options.map((option) => {
          const isSelected = option.value === value
          return (
            <Button
              className="select-menu-item spread"
              variant="ghost"
              role="option"
              aria-selected={isSelected}
              isActive={isSelected}
              disabled={option.disabled}
              onClick={() => handleChange(option.value)}
              key={option.value}
            >
              <span>
                {renderOption?.(option) ?? <OptionLabel option={option} />}
              </span>
              {isSelected ? <Check size={14} /> : null}
            </Button>
          )
        })}
      </div>
    </Popover>
  )
}

export default SelectMenu
