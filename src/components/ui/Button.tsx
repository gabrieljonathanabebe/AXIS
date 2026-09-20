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

type ButtonProps = ButtonContent &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
    isActive?: boolean
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className = '',
    isActive = false,
    type = 'button',
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={['button', isActive ? 'is-active' : '', className]
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
