import type { OptionItem } from '@/shared/optionItem'

type OptionLabelProps<TValue extends string> = {
  option: OptionItem<TValue>
}

/**
 * Icon and label of one option, the same in menus, selects and icon groups.
 * @param props Option to show.
 */
function OptionLabel<TValue extends string>({
  option,
}: OptionLabelProps<TValue>) {
  const OptionIcon = option.icon
  return (
    <span className="option-label">
      {OptionIcon ? <OptionIcon aria-hidden="true" size={14} /> : null}
      <span className="option-label-text">{option.label}</span>
    </span>
  )
}

export default OptionLabel
