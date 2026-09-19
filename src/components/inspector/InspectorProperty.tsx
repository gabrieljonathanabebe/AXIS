import type { ReactNode } from 'react'

import ControlRow from '../ui/ControlRow'

type InspectorPropertyProps = {
  label: string
  control: ReactNode
  children?: ReactNode
}

function InspectorProperty({
  label,
  control,
  children,
}: InspectorPropertyProps) {
  return (
    <div className="inspector-property">
      <ControlRow label={label}>{control}</ControlRow>
      {children ? (
        <div className="inspector-property-children">{children}</div>
      ) : null}
    </div>
  )
}

export default InspectorProperty
