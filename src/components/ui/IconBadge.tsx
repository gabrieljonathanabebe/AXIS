import type { ReactNode } from 'react'

type IconBadgeProps = {
  children: ReactNode
  className?: string
  label?: ReactNode
}

function IconBadge({ children, className = '', label }: IconBadgeProps) {
  return (
    <span className={`icon-badge ${className}`} aria-hidden={label ? undefined : true}>
      <span className="icon-badge-icon">{children}</span>
      {label ? <span className="icon-badge-label">{label}</span> : null}
    </span>
  )
}

export default IconBadge