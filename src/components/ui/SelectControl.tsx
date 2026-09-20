import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import Button from './Button'
import OptionsMenu from './OptionsMenu'
import Popover from './Popover'

import type { OptionItem } from './OptionsMenu'

type SelectControlProps<TValue extends string> = {
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  placeholder?: string
  onChange: (value: TValue) => void
}

function SelectControl<TValue extends string>({
  label,
  options,
  value,
  placeholder,
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

  return (
    <div className="select-control">
      <Popover
        label={`${label} options`}
        open={isOpen}
        className="options-menu-popover"
        placement="bottom-start"
        role="listbox"
        matchTriggerWidth
        onOpenChange={setIsOpen}
        renderTrigger={(triggerProps) => (
          <Button
            {...triggerProps}
            className="select-control-button spread"
            aria-label={label}
            onClick={() => {
              setIsOpen((currentValue) => !currentValue)
            }}
          >
            <span className="select-control-value">
              {selectedOption?.label ?? placeholder ?? value}
            </span>
            <ChevronDown size={16} />
          </Button>
        )}
      >
        <OptionsMenu options={options} value={value} onChange={handleChange} />
      </Popover>
    </div>
  )
}

export default SelectControl
