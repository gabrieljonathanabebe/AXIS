import { DragOverlay } from '@dnd-kit/core'

import { ObjectOptionContent } from '../objects/ObjectPicker'

import type { ActiveDrag } from './types'

type DragPreviewOverlayProps = {
  activeDrag: ActiveDrag
}

function DragPreviewOverlay({ activeDrag }: DragPreviewOverlayProps) {
  return (
    <DragOverlay>
      {activeDrag?.kind === 'field' ? (
        <div className="chip field-chip cluster full-width drag-overlay-chip">
          <span className="field-chip-label">{activeDrag.field.name}</span>
        </div>
      ) : activeDrag?.kind === 'object-option' ? (
        <div className="widget chart-type-option stack center chart-type-drag-overlay">
          <ObjectOptionContent option={activeDrag.option} />
        </div>
      ) : null}
    </DragOverlay>
  )
}

export default DragPreviewOverlay
