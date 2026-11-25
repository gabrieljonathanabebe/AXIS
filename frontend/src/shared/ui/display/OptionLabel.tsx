import type { ReactNode } from 'react'
import type { OptionItem } from '@/shared/optionItem'

type OptionLabelProps<TValue extends string> = {
  icon?: ReactNode
  iconOnly?: boolean
  option: OptionItem<TValue>
}

/**
 * Icon and label of one option, the same in menus, selects and icon groups.
 * `icon` takes the place of the option's icon, e.g. a preview of a paint;
 * `iconOnly` shows just the icon when there is one, e.g. an alignment.
 * @param props Option to show, an optional own icon and the display.
 */
function OptionLabel<TValue extends string>({
  icon,
  iconOnly = false,
  option,
}: OptionLabelProps<TValue>) {
  const OptionIcon = option.icon
  const shownIcon =
    icon ?? (OptionIcon ? <OptionIcon aria-hidden="true" size={14} /> : null)
  return (
    <span className="option-label">
      {shownIcon}
      {iconOnly && shownIcon ? null : (
        <span className="option-label-text">{option.label}</span>
      )}
    </span>
  )
}

export default OptionLabel
