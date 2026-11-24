import Button from './Button'

import type { ComponentProps, ReactNode } from 'react'
import type { ButtonOptions } from './Button'

type IconButtonProps = {
  children: ReactNode
  label: string
} & Omit<ButtonOptions, 'kind'> &
  Omit<ComponentProps<'button'>, 'aria-label' | 'children'>

/**
 * Square button with only an icon, named by `label` for screen readers and
 * as tooltip. A `ref` reaches the button, e.g. as the trigger of a popover.
 */
function IconButton({
  label,
  size = 'md',
  title,
  ...buttonProps
}: IconButtonProps) {
  return (
    <Button
      {...buttonProps}
      aria-label={label}
      kind="icon"
      size={size}
      title={title ?? label}
    />
  )
}

export default IconButton
