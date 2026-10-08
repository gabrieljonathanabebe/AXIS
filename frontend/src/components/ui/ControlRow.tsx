import type { ReactNode } from 'react'

type ControlRowProps = {
  label: string
  children: ReactNode
}

function ControlRow({ label, children }: ControlRowProps) {
  return (
    <div className="control-row">
      <span className="control-row-label">{label}</span>
      <div className="control-row-control">{children}</div>
    </div>
  )
}

export default ControlRow
