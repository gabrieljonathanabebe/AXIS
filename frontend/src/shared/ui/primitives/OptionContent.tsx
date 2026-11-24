import type { OptionItem } from './OptionsMenu'

type OptionContentProps<TValue extends string> = {
  option: OptionItem<TValue>
}

/**
 * Icon and label of one option, the same in menus, selects and icon groups.
 * @param props Option to show.
 */
function OptionContent<TValue extends string>({
  option,
}: OptionContentProps<TValue>) {
  const OptionIcon = option.icon
  return (
    <span className="option-content">
      {OptionIcon ? <OptionIcon aria-hidden="true" size={14} /> : null}
      <span className="option-content-label">{option.label}</span>
    </span>
  )
}

export default OptionContent
