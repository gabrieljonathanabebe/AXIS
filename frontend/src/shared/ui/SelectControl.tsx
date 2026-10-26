import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import Button from './Button'
import OptionsMenu from './OptionsMenu'
import Popover from './Popover'

import type { ReactNode } from 'react'
import type { OptionItem } from './OptionsMenu'

type SelectControlVariant = 'field' | 'title'

type SelectControlProps<TValue extends string> = {
  disabled?: boolean
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  placeholder?: string
  /** Content of an option and of the button, e.g. a preview. */
  renderOption?: (option: OptionItem<TValue>) => ReactNode
  variant?: SelectControlVariant
  onChange: (value: TValue) => void
}

/** Picks one option from a menu; the title variant reads as a heading. */
function SelectControl<TValue extends string>({
  disabled = false,
  label,
  options,
  value,
  placeholder,
  renderOption,
  variant = 'field',
  onChange,
}: SelectControlProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((option) => {
    return option.value === value
  })

  function handleChange(nextValue: TValue): void {
    onChange(nextValue)
    setIsOpen(false)
  }

  /** Content of the button: the selected option, else the placeholder. */
  function renderValue(): ReactNode {
    if (!selectedOption) {
      return placeholder ?? value
    }
    return renderOption?.(selectedOption) ?? selectedOption.label
  }

  return (
    <div className={`select-control ${variant === 'title' ? 'is-title' : ''}`}>
      <Popover
        label={`${label} options`}
        open={isOpen}
        className="options-menu-popover glass glass-thick"
        placement="bottom-start"
        role="listbox"
        matchTriggerWidth={variant === 'field'}
        onOpenChange={setIsOpen}
        renderTrigger={(triggerProps) => (
          <Button
            {...triggerProps}
            className="select-control-button spread"
            aria-label={label}
            disabled={disabled}
            onClick={() => {
              setIsOpen((currentValue) => !currentValue)
            }}
          >
            <span className="select-control-value">{renderValue()}</span>
            <ChevronDown size={16} />
          </Button>
        )}
      >
        <OptionsMenu
          options={options}
          renderOption={renderOption}
          value={value}
          onChange={handleChange}
        />
      </Popover>
    </div>
  )
}

export default SelectControl
