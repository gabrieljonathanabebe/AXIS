import type { HTMLAttributes, ReactNode } from "react";

type WidgetProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

function Widget({ children, className = '', ...divProps }: WidgetProps) {
  return (
    <div className={`widget ${className}`} {...divProps}>
      {children}
    </div>
  )
}

export default Widget