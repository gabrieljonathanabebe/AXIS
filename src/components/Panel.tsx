import type { ReactNode } from 'react'

type PanelProps = {
  as?: 'aside' | 'section'
  eyebrow: string
  title?: string
  className?: string
  actions?: ReactNode
  children?: ReactNode
}

function Panel({
  as: Element = 'section',
  eyebrow,
  title,
  className = '',
  actions,
  children,
}: PanelProps) {
  return (
    <Element className={`panel glass ${className}`}>
      <header className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          {title ? <h2>{title}</h2> : null}
        </div>

        {actions ? <div className="panel-actions">{actions}</div> : null}
      </header>

      {children ? <div className="panel-content">{children}</div> : null}
    </Element>
  )
}

export default Panel
