import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  isActive?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

function Button({
  children,
  className = '',
  isActive = false,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={`button ${isActive ? 'is-active' : ''} ${className}`}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  )
}

export default Button