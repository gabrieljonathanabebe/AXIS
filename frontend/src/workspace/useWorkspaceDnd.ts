import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'

import { createCardData } from '../cards/createCardInstance'

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { ObjectTemplate } from '../objects/types'
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
 * Drops picker options onto the canvas and fields onto chart encodings
 * and cards; moving and resizing objects is handled by ChartGrid.
 */
export function useWorkspaceDnd(
  dispatch: (action: WorkspaceAction) => void,
  addObject: (template: ObjectTemplate) => void,
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

  /** Adds a dropped picker option or puts a dropped field on its target. */
  function handleDragEnd(event: DragEndEvent): void {
    const payload = getDragPayload(event)
    const target = getDropTarget(event)
    setActiveDrag(null)
    if (payload?.kind === 'object-option' && target?.kind === 'canvas') {
      addObject(payload.option.template)
      return
    }
    if (payload?.kind === 'field' && target?.kind === 'encoding') {
      dispatch({ type: 'object/select', objectId: target.chartId })
      dispatch({
        type: 'chart/updateEncoding',
        chartId: target.chartId,
        patch: { [target.encodingKey]: payload.field.name },
      })
    }
    if (payload?.kind === 'field' && target?.kind === 'card') {
      dispatch({ type: 'object/select', objectId: target.cardId })
      dispatch({
        type: 'card/updateData',
        cardId: target.cardId,
        patch: createCardData(payload.field),
      })
    }
  }

  return { activeDrag, handleDragEnd, handleDragStart, sensors }
}
