import { GripHorizontal } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { useEffect, useRef, useState } from 'react'

import CommandButton from '../app/CommandButton'
import { getObjectDefinition } from './objectDefinitions'
import { getRectStyle } from './elementRect'
import { moveLayout, resizeLayout } from '../workspace/chartLayout'
import { getStrokeBorderCss } from '../shared/strokeStyle'

import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import type { WorkspaceCommands } from '../app/types'
import type { GridDelta } from '../workspace/chartLayout'
import type {
  CanvasActions,
  DataSelection,
  DragPayload,
  ObjectLayoutMode,
} from '../workspace/types'
import type {
  DashboardObject,
  ElementRect,
  ObjectBackground,
  ObjectFormatElement,
} from './types'

// ===== TYPES =================================================================
/** The element under the pointer; in format mode it shows its region. */
type FormatHint = {
  element: ObjectFormatElement
  rect: ElementRect
}

/** Lets the content report the element under the pointer and its bounds. */
export type ShowFormatHint = (
  element: ObjectFormatElement,
  rect: ElementRect,
) => void

type ObjectFrameStyle = CSSProperties & {
  '--chart-canvas-inset': string
  '--chart-background'?: string
  '--chart-radius': string
}

type ObjectFrameProps = {
  actions: CanvasActions
  children: (showFormatHint: ShowFormatHint) => ReactNode
  commands: WorkspaceCommands
  formattedElement: ObjectFormatElement | null
  isSelected: boolean
  label: string
  object: DashboardObject
  selection: DataSelection | null
  style: CSSProperties
  onFormatElement: (element: ObjectFormatElement, anchor: HTMLElement) => void
}

type LayoutHandleProps = {
  mode: ObjectLayoutMode
  objectId: string
  objectLabel: string
}

// ===== CONSTANTS =============================================================
const resizeEdgeLabels: Record<Exclude<ObjectLayoutMode, 'move'>, string> = {
  e: 'right edge',
  n: 'top edge',
  ne: 'top right corner',
  nw: 'top left corner',
  s: 'bottom edge',
  se: 'bottom right corner',
  sw: 'bottom left corner',
  w: 'left edge',
}

const layoutHandleModes: ObjectLayoutMode[] = [
  'move',
  ...(Object.keys(resizeEdgeLabels) as ObjectLayoutMode[]),
]

const formatRegionLabels: Record<ObjectFormatElement, string> = {
  container: 'Format container',
  legend: 'Format legend',
  marks: 'Format marks',
  selectionLabel: 'Format selection label',
  title: 'Format title',
  value: 'Format value',
  xAxis: 'Format X axis',
  xAxisLabels: 'Format X axis labels',
  yAxis: 'Format Y axis',
  yAxisLabels: 'Format Y axis labels',
}

const backgroundClassNames: Record<ObjectBackground['kind'], string> = {
  blue: 'glass is-background-blue',
  color: 'glass is-background-color',
  glass: 'glass glass-liquid',
  surface: 'glass',
  violet: 'glass is-background-violet',
}

const arrowKeyDeltas: Partial<Record<string, GridDelta>> = {
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
}

// ===== HELPERS ===============================================================
/**
 * Names a layout handle for screen readers.
 * @param mode Whether the handle moves the object or which edge it resizes.
 * @param objectLabel Name of the kind of object, e.g. "chart".
 * @returns A label like "Resize chart from right edge".
 */
function getLayoutHandleLabel(
  mode: ObjectLayoutMode,
  objectLabel: string,
): string {
  return mode === 'move'
    ? `Move ${objectLabel}`
    : `Resize ${objectLabel} from ${resizeEdgeLabels[mode]}`
}

// ===== LAYOUT HANDLE =========================================================
/** Moves or resizes the object when its edge or grip is dragged. */
function LayoutHandle({ mode, objectId, objectLabel }: LayoutHandleProps) {
  const payload: DragPayload = {
    kind: 'object-layout',
    mode,
    objectId,
  }
  const { attributes, listeners, setNodeRef } = useDraggable({
    data: { payload },
    id: `object:${objectId}:${mode}`,
  })
  return (
    <div
      {...listeners}
      {...attributes}
      aria-label={getLayoutHandleLabel(mode, objectLabel)}
      className={`chart-layout-handle chart-${mode}-handle`}
      ref={setNodeRef}
      tabIndex={-1}
    >
      {mode === 'move' ? <GripHorizontal size={14} /> : null}
    </div>
  )
}

// ===== COMPONENT =============================================================
/**
 * Frames one object on the canvas: container, selection, keyboard, layout
 * handles, action bar and format regions. The content comes from `children`.
 */
function ObjectFrame({
  actions,
  children,
  commands,
  formattedElement,
  isSelected,
  label,
  object,
  selection,
  style,
  onFormatElement,
}: ObjectFrameProps) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [formatHint, setFormatHint] = useState<FormatHint | null>(null)
  const { container } = object
  const definition = getObjectDefinition(object.kind)
  const { background } = container
  const isFormatMode = formattedElement !== null
  const frameStyle: ObjectFrameStyle = {
    ...style,
    '--chart-canvas-inset': `${container.padding}px`,
    '--chart-background':
      background.kind === 'color' ? background.color : undefined,
    '--chart-radius': `${container.borderRadius}px`,
  }

  useEffect(() => {
    frameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (isSelected && frame && !frame.contains(document.activeElement)) {
      frame.focus({ preventScroll: true })
    }
  }, [isSelected])

  /** Moves with the arrow keys, resizes with Shift, deselects with Escape. */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget) {
      return
    }
    const delta = arrowKeyDeltas[event.key]
    if (delta) {
      event.preventDefault()
      const layout = event.shiftKey
        ? resizeLayout(
            object.layout,
            delta,
            { bottom: true, left: false, right: true, top: false },
            definition.minSize,
          )
        : moveLayout(object.layout, delta)
      actions.updateObjectLayout(object.id, layout)
      return
    }

    if (event.key === 'Escape') {
      if (selection) {
        actions.clearSelection()
        return
      }
      actions.selectObject(null)
      event.currentTarget.blur()
    }
  }

  /** Remembers the element under the pointer; format mode shows its region. */
  function showFormatHint(
    element: ObjectFormatElement,
    rect: ElementRect,
  ): void {
    setFormatHint({ element, rect })
  }

  /** Opens the format popover for an element, anchored to the frame. */
  function openFormat(element: ObjectFormatElement): void {
    const frame = frameRef.current
    if (frame) {
      onFormatElement(element, frame)
    }
  }

  /** In format mode, a click on free space formats the object as a whole. */
  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    const target = event.target as HTMLElement
    if (isFormatMode && !target.closest('button, .chart-layout-handle')) {
      openFormat('container')
    }
  }

  return (
    <div
      aria-label={label}
      className={`chart-item ${backgroundClassNames[background.kind]} ${
        isSelected ? 'is-selected' : ''
      }`}
      data-object-id={object.id}
      ref={frameRef}
      role="group"
      style={frameStyle}
      tabIndex={0}
      onClick={handleClick}
      onFocus={() => actions.selectObject(object.id)}
      onKeyDown={handleKeyDown}
      onPointerDown={() => actions.selectObject(object.id)}
      onPointerLeave={() => setFormatHint(null)}
    >
      {children(showFormatHint)}
      {container.border.width > 0 ? (
        <span
          aria-hidden="true"
          className="chart-item-border"
          style={getStrokeBorderCss(container.border)}
        />
      ) : null}
      {isFormatMode && formatHint ? (
        <button
          aria-label={formatRegionLabels[formatHint.element]}
          className="chart-format-region"
          style={getRectStyle(formatHint.rect)}
          type="button"
          onClick={() => openFormat(formatHint.element)}
          onPointerLeave={() => setFormatHint(null)}
        />
      ) : null}
      {isFormatMode && !formatHint ? (
        <span
          aria-hidden="true"
          className={`chart-format-region is-container ${
            formattedElement === 'container' ? 'is-active' : ''
          }`}
        />
      ) : null}
      {isSelected ? (
        <div className="chart-item-actions">
          <CommandButton command={commands['object.duplicate']} size="sm" />
          <CommandButton command={commands['object.delete']} size="sm" />
        </div>
      ) : null}
      {layoutHandleModes.map((mode) => (
        <LayoutHandle
          key={mode}
          mode={mode}
          objectId={object.id}
          objectLabel={definition.label}
        />
      ))}
    </div>
  )
}

export default ObjectFrame
