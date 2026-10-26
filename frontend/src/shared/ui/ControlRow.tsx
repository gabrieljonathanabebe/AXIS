import type { ReactNode } from 'react'

type ControlRowProps = {
  /** Name left of the controls; without it, the row is compact. */
  label?: string
  children: ReactNode
}

/**
 * One row of controls. With a label, the label stands left of the
 * controls; without one, the controls share the row in two equal columns,
 * followed by icon buttons, e.g. an icon toggle.
 * @param props Controls and optional label.
 */
function ControlRow({ label, children }: ControlRowProps) {
  if (!label) {
    return <div className="control-row control-row-compact">{children}</div>
  }

  return (
    <div className="control-row">
      <span className="control-row-label">{label}</span>
      <div className="control-row-control">{children}</div>
    </div>
  )
}

export default ControlRow
