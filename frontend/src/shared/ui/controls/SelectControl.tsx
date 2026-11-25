import OptionLabel from '../display/OptionLabel'
import SelectButton from '../primitives/SelectButton'
import SelectMenu from '../primitives/SelectMenu'

import type { ReactNode } from 'react'
import type { OptionItem } from '@/shared/optionItem'

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
 * @param props Options, selected value, variant and handler.
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
  const selectedOption = options.find((option) => {
    return option.value === value
  })

  /** Content of the button: the selected option (short label if set). */
  function renderValue(): ReactNode {
    if (!selectedOption) {
      return placeholder ?? value
    }
    const { shortLabel } = selectedOption
    const shown = shortLabel
      ? { ...selectedOption, label: shortLabel }
      : selectedOption
    return renderOption?.(shown) ?? <OptionLabel option={shown} />
  }

  return (
    <div className={`select-control ${variant === 'title' ? 'is-title' : ''}`}>
      <SelectMenu
        label={`${label} options`}
        matchTriggerWidth={variant === 'control'}
        options={options}
        renderOption={renderOption}
        value={value}
        onChange={onChange}
        renderTrigger={(triggerProps) => (
          <SelectButton
            {...triggerProps}
            disabled={disabled}
            label={label}
            variant={variant === 'title' ? 'ghost' : 'secondary'}
          >
            {renderValue()}
          </SelectButton>
        )}
      />
    </div>
  )
}

export default SelectControl
