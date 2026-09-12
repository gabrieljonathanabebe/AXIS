import { DragOverlay } from '@dnd-kit/core'
import type { DataField } from '../types/chart'
import DataTypeIcon from './DataTypeIcon'

type FieldDragOverlayProps = {
  activeField: DataField | null
}

function FieldDragOverlay({ activeField }: FieldDragOverlayProps) {
  return (
    <DragOverlay>
      {activeField ? (
        <div className="chip field-chip drag-overlay-chip">
          <span className="field-chip-title">
            <span className="field-chip-icon">
              <DataTypeIcon type={activeField.type} />
            </span>
            <span>{activeField.name}</span>
          </span>
        </div>
      ) : null}
    </DragOverlay>
  )
}

export default FieldDragOverlay