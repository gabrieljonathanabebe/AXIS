import { forwardRef } from 'react'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonContent =
  | {
      children: ReactNode
      'aria-label'?: string
    }
  | {
      children?: never
      'aria-label': string
    }

type ButtonVariant = 'accent' | 'secondary'

type ButtonProps = ButtonContent &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
    isActive?: boolean
    size?: 'sm'
    variant?: ButtonVariant
  }

/** Text button; `size` fits it to a row of controls, `variant` sets its weight. */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className = '',
    isActive = false,
    size,
    variant = 'secondary',
    type = 'button',
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={[
        'button',
        size ? `button-${size}` : '',
        variant === 'accent' ? 'button-accent' : '',
        isActive ? 'is-active' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  )
})

export default Button
