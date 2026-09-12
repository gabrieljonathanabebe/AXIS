import type { ButtonHTMLAttributes, ReactNode } from 'react'

type WidgetButtonProps = {
  children: ReactNode
  isActive?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

function WidgetButton({
  children,
  className = '',
  isActive = false,
  type = 'button',
  ...buttonProps
}: WidgetButtonProps) {
  return (
    <button
      className={`widget ${isActive ? 'is-active' : ''} ${className}`}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  )
}

export default WidgetButton