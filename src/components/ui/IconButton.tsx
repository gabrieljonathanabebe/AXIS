import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonSize = 'sm' | 'md'

type IconButtonProps = {
  children: ReactNode
  isActive?: boolean
  label: string
  size?: IconButtonSize
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>

function IconButton({
  children,
  className = '',
  isActive = false,
  label,
  size = 'md',
  title,
  type = 'button',
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      className={`control control-${size} ${
        isActive ? 'is-active' : ''
      } ${className}`}
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
