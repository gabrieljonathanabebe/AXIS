import { DragOverlay } from '@dnd-kit/core'

import { getChartDefinition } from '../../chart/chartDefinitions'
import DataTypeIcon from '../data/DataTypeIcon'
import IconBadge from '../ui/IconBadge'

import type { ActiveDrag } from '../../types/ui'

type DragPreviewOverlayProps = {
  activeDrag: ActiveDrag
}

function DragPreviewOverlay({ activeDrag }: DragPreviewOverlayProps) {
  return (
    <DragOverlay>
      {activeDrag?.kind === 'field' ? (
        <div className="chip field-chip cluster full-width drag-overlay-chip">
          <IconBadge label={activeDrag.field.name}>
            <DataTypeIcon type={activeDrag.field.semantic_type} />
          </IconBadge>
        </div>
      ) : activeDrag?.kind === 'chart-type' ? (
        <div className="widget chart-type-option stack center chart-type-drag-overlay">
          {(() => {
            const { label, icon: Icon } = getChartDefinition(
              activeDrag.chartType,
            )
            return (
              <>
                <Icon size={22} />
                <span>{label}</span>
              </>
            )
          })()}
        </div>
      ) : null}
    </DragOverlay>
  )
}

export default DragPreviewOverlay
