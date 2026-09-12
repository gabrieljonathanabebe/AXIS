import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ChipProps = {
  children: ReactNode
  isActive?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
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
      className={`chip ${isActive ? 'is-active' : ''} ${className}`}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  )
})

export default Chip