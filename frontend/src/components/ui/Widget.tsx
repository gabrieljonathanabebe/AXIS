import type { HTMLAttributes, ReactNode } from 'react'

type WidgetProps = {
  children: ReactNode
  isInteractive?: boolean
} & HTMLAttributes<HTMLDivElement>

function Widget({
  children,
  className = '',
  isInteractive = false,
  ...divProps
}: WidgetProps) {
  return (
    <div
      className={`widget ${isInteractive ? 'is-interactive' : ''} ${className}`}
      {...divProps}
    >
      {children}
    </div>
  )
}

export default Widget
