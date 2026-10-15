import { useDndContext, useDndMonitor, useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'

import {
  CHART_GRID,
  findFreeLayout,
  moveLayout,
  resizeLayout,
} from './chartLayout'
import { getObjectDefinition } from '../objects/objectDefinitions'

import type {
  DashboardObject,
  FormatTarget,
  ObjectFormatElement,
  ObjectLayout,
} from '../objects/types'
import type { ShowFormatHint } from '../objects/ObjectFrame'
import type { DataField, Dataset } from '../datasets/types'
import type { WorkspaceCommands } from '../app/types'
import type {
  CanvasActions,
  ObjectLayoutMode,
  DataSelection,
  DragPayload,
  DropTarget,
} from './types'
import type { GridDelta } from './chartLayout'

import ChartItem from '../charts/ChartItem'
import CardItem from '../cards/CardItem'
import ObjectFrame from '../objects/ObjectFrame'
import { getObjectLabel } from '../objects/getObjectLabel'
import { isChartFormatElement } from '../charts/getFormatElements'

// ===== TYPES =================================================================
type ChartGridProps = {
  actions: CanvasActions
  children?: ReactNode
  commands: WorkspaceCommands
  dataset: Dataset
  datasetId: string | null
  gap: number
  draggedField: DataField | null
  formatTarget: FormatTarget | null
  objects: DashboardObject[]
  selectedObjectId: string | null
  selection: DataSelection | null
  onFormatElement: (target: FormatTarget) => void
}

type LayoutPreview = {
  layout: ObjectLayout
  objectId: string
}

// ===== CONSTANTS =============================================================
const gridStyle: CSSProperties = {
  gridAutoRows: `${CHART_GRID.rowHeight}px`,
  gridTemplateColumns: `repeat(${CHART_GRID.columns}, minmax(0, 1fr))`,
}

const canvasTarget: DropTarget = {
  kind: 'canvas',
}

// ===== HELPERS ===============================================================
function getGridArea(layout: ObjectLayout): CSSProperties {
  return {
    gridColumn: `${layout.x + 1} / span ${layout.width}`,
    gridRow: `${layout.y + 1} / span ${layout.height}`,
  }
}

function getGridStep(grid: HTMLElement): GridDelta {
  const styles = getComputedStyle(grid)
  const columnGap = Number.parseFloat(styles.columnGap)
  const rowGap = Number.parseFloat(styles.rowGap)
  const columnWidth =
    (grid.clientWidth - columnGap * (CHART_GRID.columns - 1)) /
    CHART_GRID.columns
  return {
    x: columnWidth + columnGap,
    y: CHART_GRID.rowHeight + rowGap,
  }
}

/** Compares two previews, so an unchanged drag step does not re-render. */
function isSamePreview(
  first: LayoutPreview | null,
  second: LayoutPreview | null,
): boolean {
  return (
    first?.objectId === second?.objectId &&
    first?.layout.x === second?.layout.x &&
    first?.layout.y === second?.layout.y &&
    first?.layout.width === second?.layout.width &&
    first?.layout.height === second?.layout.height
  )
}

/**
 * Applies a handle drag to an object's layout.
 * @param object Dragged object; its kind sets the minimum size.
 * @param mode Whether the object moves or which edges it resizes.
 * @param delta Drag distance in grid cells.
 * @returns The layout the object would get on release.
 */
function getDraggedLayout(
  object: DashboardObject,
  mode: ObjectLayoutMode,
  delta: GridDelta,
): ObjectLayout {
  if (mode === 'move') {
    return moveLayout(object.layout, delta)
  }
  return resizeLayout(
    object.layout,
    delta,
    {
      bottom: mode.includes('s'),
      left: mode.includes('w'),
      right: mode.includes('e'),
      top: mode.includes('n'),
    },
    getObjectDefinition(object.kind).minSize,
  )
}

// ===== COMPONENT =============================================================
function ChartGrid({
  actions,
  children,
  commands,
  dataset,
  datasetId,
  gap,
  draggedField,
  formatTarget,
  objects,
  selectedObjectId,
  selection,
  onFormatElement,
}: ChartGridProps) {
  const [layoutPreview, setLayoutPreview] = useState<LayoutPreview | null>(null)
  const { active } = useDndContext()
  const activePayload: DragPayload | undefined = active?.data.current?.payload
  const draggedOption =
    activePayload?.kind === 'object-option' ? activePayload.option : null
  const { isOver, node, setNodeRef } = useDroppable({
    data: { target: canvasTarget },
    disabled: !draggedOption,
    id: 'chart-grid',
  })

  /**
   * Turns a handle drag into the layout the object would get on release.
   * @param event Drag event with the pointer offset in pixels.
   * @returns The object and its new layout, or null for other drags.
   */
  function getLayoutPreview(
    event: DragMoveEvent | DragEndEvent,
  ): LayoutPreview | null {
    const payload: DragPayload | undefined = event.active.data.current?.payload
    const object = objects.find((object) => {
      return payload?.kind === 'object-layout' && object.id === payload.objectId
    })
    if (payload?.kind !== 'object-layout' || !object || !node.current) {
      return null
    }
    const step = getGridStep(node.current)
    const delta = {
      x: Math.round(event.delta.x / step.x),
      y: Math.round(event.delta.y / step.y),
    }
    return {
      layout: getDraggedLayout(object, payload.mode, delta),
      objectId: object.id,
    }
  }

  useDndMonitor({
    onDragCancel() {
      setLayoutPreview(null)
    },
    onDragEnd(event) {
      const preview = getLayoutPreview(event)
      setLayoutPreview(null)
      if (preview) {
        actions.updateObjectLayout(preview.objectId, preview.layout)
      }
    },
    onDragMove(event) {
      const preview = getLayoutPreview(event)
      setLayoutPreview((current) => {
        return isSamePreview(current, preview) ? current : preview
      })
    },
  })
  /**
   * Renders the content of an object inside its frame, by kind.
   * @param object Object whose content is rendered.
   * @param formattedElement Element in the popover, or null when it is closed.
   * @param showFormatHint Reports the element under the pointer to the frame.
   * @returns The chart or card.
   */
  function renderContent(
    object: DashboardObject,
    formattedElement: ObjectFormatElement | null,
    showFormatHint: ShowFormatHint,
  ): ReactNode {
    switch (object.kind) {
      case 'chart':
        return (
          <ChartItem
            actions={actions}
            chart={object}
            dataset={dataset}
            datasetId={datasetId}
            draggedField={draggedField}
            formattedElement={
              isChartFormatElement(formattedElement) ? formattedElement : null
            }
            selection={selection}
            onFormatHint={showFormatHint}
          />
        )
      case 'card':
        return (
          <CardItem
            actions={actions}
            datasetId={datasetId}
            draggedField={draggedField}
            formattedElement={formattedElement}
            card={object}
            onFormatHint={showFormatHint}
          />
        )
    }
  }

  /** Selects the dashboard when the empty grid is pressed. */
  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      actions.selectObject(null)
    }
  }

  return (
    <div
      className="chart-grid"
      ref={setNodeRef}
      style={{ ...gridStyle, gap }}
      onPointerDown={handlePointerDown}
    >
      {objects.map((object) => {
        const layout =
          object.id === layoutPreview?.objectId
            ? layoutPreview.layout
            : object.layout
        const formattedElement =
          formatTarget?.objectId === object.id ? formatTarget.element : null
        return (
          <ObjectFrame
            actions={actions}
            commands={commands}
            formattedElement={formattedElement}
            isSelected={object.id === selectedObjectId}
            key={object.id}
            label={getObjectLabel(object, dataset.fields)}
            object={object}
            selection={selection}
            style={getGridArea(layout)}
            onFormatElement={(element, anchor) =>
              onFormatElement({ anchor, element, objectId: object.id })
            }
          >
            {(showFormatHint) =>
              renderContent(object, formattedElement, showFormatHint)
            }
          </ObjectFrame>
        )
      })}
      {isOver && draggedOption ? (
        <div
          className="chart-drop-preview"
          style={getGridArea(
            findFreeLayout(
              objects,
              getObjectDefinition(draggedOption.template.kind).defaultSize,
            ),
          )}
        />
      ) : null}
      {children}
    </div>
  )
}

export default ChartGrid
