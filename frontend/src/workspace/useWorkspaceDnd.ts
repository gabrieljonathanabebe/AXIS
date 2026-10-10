import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { ChartType } from '../charts/types'
import type {
  ActiveDrag,
  DragPayload,
  DropTarget,
  WorkspaceAction,
} from './types'

// ===== HELPERS ===============================================================
function getDragPayload(
  event: DragStartEvent | DragEndEvent,
): DragPayload | null {
  return event.active.data.current?.payload ?? null
}

function getDropTarget(event: DragEndEvent): DropTarget | null {
  return event.over?.data.current?.target ?? null
}

// ===== HOOK ==================================================================
/**
 * Drops chart types onto the canvas and fields onto chart encodings; moving
 * and resizing charts is handled by ChartGrid.
 */
export function useWorkspaceDnd(
  dispatch: (action: WorkspaceAction) => void,
  addChart: (type: ChartType) => void,
) {
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  function handleDragStart(event: DragStartEvent): void {
    setActiveDrag(getDragPayload(event))
  }

  function handleDragEnd(event: DragEndEvent): void {
    const payload = getDragPayload(event)
    const target = getDropTarget(event)
    setActiveDrag(null)
    if (payload?.kind === 'chart-type' && target?.kind === 'canvas') {
      addChart(payload.chartType)
      return
    }
    if (payload?.kind === 'field' && target?.kind === 'encoding') {
      dispatch({ type: 'chart/select', chartId: target.chartId })
      dispatch({
        type: 'chart/updateEncoding',
        chartId: target.chartId,
        patch: { [target.encodingKey]: payload.field.name },
      })
    }
  }

  return { activeDrag, handleDragEnd, handleDragStart, sensors }
}
