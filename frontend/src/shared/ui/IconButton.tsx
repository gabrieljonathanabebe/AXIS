import type { ComponentProps, ReactNode } from 'react'

export type IconButtonSize = 'xs' | 'sm' | 'md'

export type IconButtonVariant = 'default' | 'ghost'

type IconButtonProps = {
  children: ReactNode
  isActive?: boolean
  label: string
  size?: IconButtonSize
  variant?: IconButtonVariant
} & Omit<ComponentProps<'button'>, 'aria-label'>

/**
 * Square button with only an icon, named by `label` for screen readers and
 * as tooltip; `isActive` marks a pressed toggle. A `ref` reaches the
 * button, e.g. as the trigger of a popover.
 */
function IconButton({
  children,
  className = '',
  isActive = false,
  label,
  size = 'md',
  title,
  type = 'button',
  variant = 'default',
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      className={`control control-${size} ${
        variant === 'ghost' ? 'control-ghost' : ''
      } ${isActive ? 'is-active' : ''} ${className}`}
      type={type}
      aria-label={label}
      title={title ?? label}
      {...buttonProps}
    >
      {children}
    </button>
  )
}

export default IconButton
