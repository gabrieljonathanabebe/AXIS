import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type WidgetButtonProps = {
  children: ReactNode
  isActive?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const WidgetButton = forwardRef<HTMLButtonElement, WidgetButtonProps>(
  function WidgetButton(
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
        className={`widget is-interactive ${isActive ? 'is-active' : ''} ${className}`}
        type={type}
        {...buttonProps}
      >
        {children}
      </button>
    )
  },
)

export default WidgetButton
