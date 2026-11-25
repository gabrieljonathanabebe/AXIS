import { ChevronDown } from 'lucide-react'

import Button from './Button'

import type { ComponentProps, ReactNode } from 'react'
import type { ButtonVariant } from './Button'

type SelectButtonProps = {
  children: ReactNode
  label: string
  variant?: ButtonVariant
} & Omit<ComponentProps<'button'>, 'aria-label' | 'children'>

/**
 * Button that shows a value with a chevron and opens a menu, e.g. the
 * trigger of a select; `label` names it for screen readers.
 * @param props Shown value, name, variant and native props.
 */
function SelectButton({ children, label, ...buttonProps }: SelectButtonProps) {
  return (
    <Button
      {...buttonProps}
      aria-label={label}
      className="select-button spread"
    >
      <span className="select-button-value">{children}</span>
      <ChevronDown size={16} />
    </Button>
  )
}

export default SelectButton
