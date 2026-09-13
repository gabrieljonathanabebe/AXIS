import { DragOverlay } from '@dnd-kit/core'
import type { DataField } from '../types/chart'
import DataTypeIcon from './DataTypeIcon'
import IconBadge from './ui/IconBadge'

type FieldDragOverlayProps = {
  activeField: DataField | null
}

function FieldDragOverlay({ activeField }: FieldDragOverlayProps) {
  return (
    <DragOverlay>
      {activeField ? (
        <div className="chip field-chip cluster full-width drag-overlay-chip">
          <IconBadge label={activeField.name}>
            <DataTypeIcon type={activeField.type} />
          </IconBadge>
        </div>
      ) : null}
    </DragOverlay>
  )
}

export default FieldDragOverlay