import { DragOverlay } from '@dnd-kit/core'

import { ChartTypeOptionContent } from '../build/ChartPicker'

import type { ActiveDrag } from '../../types/ui'

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
      ) : activeDrag?.kind === 'chart-type' ? (
        <div className="widget chart-type-option stack center chart-type-drag-overlay">
          <ChartTypeOptionContent type={activeDrag.chartType} />
        </div>
      ) : null}
    </DragOverlay>
  )
}

export default DragPreviewOverlay
