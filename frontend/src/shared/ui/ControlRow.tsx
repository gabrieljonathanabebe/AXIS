import type { ReactNode } from 'react'

type ControlRowProps = {
  actions?: ReactNode
  label?: string
  children: ReactNode
}

/**
 * One row of controls. With a label, the label stands left of the
 * controls; without one, the controls share the row in two columns,
 * followed by icon buttons, e.g. an icon toggle. `actions` are xs icon
 * buttons at the end of a row without label, e.g. gear and minus of an
 * effect, spaced like the actions of a widget header; their slot keeps
 * its width, so the rows of a list line up.
 * @param props Controls, optional label and actions.
 */
function ControlRow({ actions, label, children }: ControlRowProps) {
  if (!label) {
    return (
      <div className="control-row control-row-compact">
        {children}
        {actions ? (
          <div className="control-row-actions cluster">{actions}</div>
        ) : null}
      </div>
    )
  }
  return (
    <div className="control-row">
      <span className="control-row-label">{label}</span>
      <div className="control-row-control">{children}</div>
    </div>
  )
}

export default ControlRow
