import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import Button from './Button'
import OptionContent from './OptionContent'
import OptionsMenu from './OptionsMenu'
import Popover from './Popover'

import type { ReactNode } from 'react'
import type { OptionItem } from './OptionsMenu'

type SelectControlVariant = 'control' | 'title'

type SelectControlProps<TValue extends string> = {
  disabled?: boolean
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  placeholder?: string
  renderOption?: (option: OptionItem<TValue>) => ReactNode
  variant?: SelectControlVariant
  onChange: (value: TValue) => void
}

/**
 * Picks one option from a menu; options show their icon and label, or what
 * `renderOption` returns, e.g. a palette preview, in the menu and in the
 * button. The title variant reads as a heading.
 */
function SelectControl<TValue extends string>({
  disabled = false,
  label,
  options,
  value,
  placeholder,
  renderOption,
  variant = 'control',
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

  /** Content of the button: the selected option (short label if set). */
  function renderValue(): ReactNode {
    if (!selectedOption) {
      return placeholder ?? value
    }
    const { shortLabel } = selectedOption
    const shown = shortLabel
      ? { ...selectedOption, label: shortLabel }
      : selectedOption
    return renderOption?.(shown) ?? <OptionContent option={shown} />
  }

  return (
    <div className={`select-control ${variant === 'title' ? 'is-title' : ''}`}>
      <Popover
        label={`${label} options`}
        open={isOpen}
        className="options-menu-popover"
        placement="bottom-start"
        role="listbox"
        matchTriggerWidth={variant === 'control'}
        onOpenChange={setIsOpen}
        renderTrigger={(triggerProps) => (
          <Button
            {...triggerProps}
            className="select-control-button spread"
            aria-label={label}
            disabled={disabled}
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
