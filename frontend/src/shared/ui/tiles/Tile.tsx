import type { HTMLAttributes, ReactNode } from 'react'

type WidgetProps = {
  children: ReactNode
  isInteractive?: boolean
} & HTMLAttributes<HTMLDivElement>

function Tile({
  children,
  className = '',
  isInteractive = false,
  ...divProps
}: WidgetProps) {
  return (
    <div
      className={`tile ${isInteractive ? 'is-interactive' : ''} ${className}`}
      {...divProps}
    >
      {children}
    </div>
  )
}

export default Tile
