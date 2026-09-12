import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = {
  children: ReactNode
  isActive?: boolean
  label: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>

function IconButton({
  children,
  className = "",
  isActive = false,
  label,
  title,
  type = "button",
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      className={`control ${isActive ? "is-active" : ""} ${className}`}
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