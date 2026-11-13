import { useDraggable } from '@dnd-kit/core'
import { FloatingPortal } from '@floating-ui/react'
import { GripHorizontal, Paintbrush } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import CommandButton from '../app/CommandButton'
import { formatKeyLabel, isFormatClick } from '../shared/platform'
import { getSurfaceStyle } from '../shared/surface'
import SurfaceLayers from '../shared/ui/SurfaceLayers'
import { useIsFormatKeyHeld } from '../shared/useIsFormatKeyHeld'
import { moveLayout, resizeLayout } from '../workspace/chartLayout'
import { getRectInFrame, getRectStyle } from './elementRect'
import { getObjectDefinition } from './objectDefinitions'

import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from 'react'
import type { WorkspaceCommands } from '../app/types'
import type { SurfaceStyle } from '../shared/surface'
import type { GridDelta } from '../workspace/chartLayout'
import type {
  CanvasActions,
  DataSelection,
  DragPayload,
  ObjectLayoutMode,
} from '../workspace/types'
import type { DashboardObject, ElementRect, ObjectFormatElement } from './types'

// ===== TYPES =================================================================
/** The element under the pointer and its bounds in the frame. */
export type FormatHint = {
  element: ObjectFormatElement
  rect: ElementRect
}

/**
 * Lets the content report the element under the pointer, or null when the
 * pointer leaves it.
 */
export type ShowFormatHint = (hint: FormatHint | null) => void

/** Parts of the element in focus and their bounds in the frame. */
export type FormatFocus = {
  element: ObjectFormatElement
  rects: ElementRect[]
}

/** Lets the content report the parts of the element in focus. */
export type ShowFormatFocus = (focus: FormatFocus) => void

type ObjectFrameStyle = SurfaceStyle & {
  '--chart-canvas-inset': string
}

type ObjectFrameProps = {
  actions: CanvasActions
  children: (
    showFormatHint: ShowFormatHint,
    showFormatFocus: ShowFormatFocus,
  ) => ReactNode
  commands: WorkspaceCommands
  formattedElement: ObjectFormatElement | null
  isSelected: boolean
  label: string
  object: DashboardObject
  selection: DataSelection | null
  style: CSSProperties
  onFormatElement: (element: ObjectFormatElement) => void
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

/** Distance of the format label from the pointer, in pixels. */
const FORMAT_LABEL_OFFSET = 12

/**
 * Pointer travel in pixels up to which a press counts as a click, the same
 * as the distance that starts a drag in `useWorkspaceDnd`.
 */
const CLICK_TOLERANCE = 6

/**
 * Elements whose click has a data action of its own, e.g. a bar filters or
 * a legend entry toggles its series; only Cmd/Ctrl+click formats them.
 */
const dataActionElements: ReadonlySet<ObjectFormatElement> = new Set([
  'labels',
  'legend',
  'marks',
])

const formatRegionLabels: Record<ObjectFormatElement, string> = {
  colorScale: 'Format color scale',
  container: 'Format container',
  labels: 'Format data labels',
  legend: 'Format legend',
  marks: 'Format marks',
  selectionLabel: 'Format selection label',
  title: 'Format title',
  tooltip: 'Format tooltip',
  value: 'Format value',
  xAxis: 'Format X axis',
  xAxisLabels: 'Format X axis labels',
  yAxis: 'Format Y axis',
  yAxisLabels: 'Format Y axis labels',
}

const arrowKeyDeltas: Partial<Record<string, GridDelta>> = {
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
}

// ===== HELPERS ===============================================================
/**
 * Keeps the current focus when a report repeats it, so content may report
 * after every render or resize without a loop.
 * @param current Focus in the frame, or null before the first report.
 * @param next Reported element and bounds of its parts.
 * @returns The current focus when equal, else the report.
 */
function keepFormatFocus(
  current: FormatFocus | null,
  next: FormatFocus,
): FormatFocus {
  return current && JSON.stringify(current) === JSON.stringify(next)
    ? current
    : next
}

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

/**
 * Tells whether a click lands on a control of the frame, which handles it
 * itself: the action bar, a layout handle or a text input.
 * @param target Element the click landed on.
 * @returns True for a control of the frame.
 */
function isFrameControl(target: EventTarget): boolean {
  return (
    target instanceof Element &&
    target.closest(
      '.chart-item-actions, .chart-layout-handle, input, textarea',
    ) !== null
  )
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
  const labelRef = useRef<HTMLSpanElement | null>(null)
  const [formatHint, setFormatHint] = useState<FormatHint | null>(null)
  const [formatFocus, setFormatFocus] = useState<FormatFocus | null>(null)
  const [isPointerInside, setIsPointerInside] = useState(false)
  const pressRef = useRef<{ x: number; y: number } | null>(null)
  const { container } = object
  const definition = getObjectDefinition(object.kind)
  const isFormatKeyHeld = useIsFormatKeyHeld()
  // Places with a data action, e.g. bars, show their hint only while the
  // format key is held; free space shows one only on the selected object.
  const shownHint =
    formatHint &&
    (isFormatKeyHeld || !dataActionElements.has(formatHint.element))
      ? formatHint
      : null
  const showsObjectHint = isSelected && isPointerInside && formatHint === null
  const focusRects =
    formatFocus && formatFocus.element === formattedElement
      ? formatFocus.rects
      : []

  /**
   * Keeps the parts of the element in focus that the content reports.
   * @param focus Element in focus and the bounds of its parts.
   */
  function showFormatFocus(focus: FormatFocus): void {
    setFormatFocus((current) => keepFormatFocus(current, focus))
  }

  const frameStyle: ObjectFrameStyle = {
    ...style,
    ...getSurfaceStyle(container),
    '--chart-canvas-inset': `${container.layout.padding}px`,
  }
  // HTML parts of the content, e.g. a title, carry `data-format-element`.
  // The frame measures the part in focus and again when its size changes;
  // a part React replaced, e.g. a title by its input, is looked up anew.
  useLayoutEffect(() => {
    const element = formattedElement
    const frame = frameRef.current
    if (!element || !frame) {
      return
    }
    const selector = `[data-format-element="${element}"]`
    let part = frame.querySelector(selector)
    if (!part) {
      return
    }
    const observer = new ResizeObserver(() => reportPart())
    observer.observe(part)
    /**
     * Measures the part in focus; when React replaced it, it looks the part
     * up anew. An input in its place, e.g. while a title is edited, gets no
     * frame; its closing brings the frame back.
     */
    const reportPart = (): void => {
      if (!part?.isConnected) {
        part = frame.querySelector(selector)
        if (part) {
          observer.observe(part)
        }
      }
      const isEdited = part instanceof HTMLInputElement
      const rect = part && !isEdited ? getRectInFrame(part) : null
      setFormatFocus((current) => {
        return keepFormatFocus(current, { element, rects: rect ? [rect] : [] })
      })
    }
    reportPart()
    return () => observer.disconnect()
  }, [formattedElement, object])

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

  /**
   * Selects the object and remembers where the press began, so a click can
   * tell itself from a drag, e.g. a brush. Pressing an object that is not
   * selected yet shows at once what the click will format, so the panel
   * does not show the element of the last object first.
   */
  function startPress(event: MouseEvent<HTMLDivElement>): void {
    pressRef.current = { x: event.clientX, y: event.clientY }
    const element = formatHint?.element ?? 'container'
    const formatsElement =
      isFormatClick(event) || !dataActionElements.has(element)
    if (!isSelected && formatsElement && !isFrameControl(event.target)) {
      onFormatElement(element)
    }
    actions.selectObject(object.id)
  }

  /**
   * Keeps a Cmd/Ctrl press from the content, so it starts no brush and no
   * chart reacts to it; the frame still selects the object.
   */
  function holdFormatPress(event: MouseEvent<HTMLDivElement>): void {
    if (isFormatClick(event) && !isFrameControl(event.target)) {
      event.stopPropagation()
      startPress(event)
    }
  }

  /**
   * Cmd/Ctrl+click formats whatever lies under the pointer, also a bar or
   * the legend, and the click does not reach the content.
   */
  function handleFormatClick(event: MouseEvent<HTMLDivElement>): void {
    if (isFormatClick(event) && !isFrameControl(event.target)) {
      event.stopPropagation()
      onFormatElement(formatHint?.element ?? 'container')
    }
  }

  /**
   * A click formats where it lands, unless the place has a data action of
   * its own, e.g. a bar filters; on free space it formats the object as a
   * whole. A press that moved, e.g. a brush, is no click.
   */
  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    const press = pressRef.current
    const hasMoved =
      press !== null &&
      Math.hypot(event.clientX - press.x, event.clientY - press.y) >
        CLICK_TOLERANCE
    const element = formatHint?.element ?? 'container'
    if (
      !hasMoved &&
      !isFrameControl(event.target) &&
      !dataActionElements.has(element)
    ) {
      onFormatElement(element)
    }
  }

  /**
   * Moves the format label next to the pointer, flipped at the edges of the
   * window. Writes the position straight to the label, so moving renders
   * nothing.
   */
  function moveFormatLabel(event: PointerEvent<HTMLDivElement>): void {
    const label = labelRef.current
    if (!label) {
      return
    }
    let x = event.clientX + FORMAT_LABEL_OFFSET
    let y = event.clientY + FORMAT_LABEL_OFFSET
    if (x + label.offsetWidth > window.innerWidth) {
      x -= label.offsetWidth + 2 * FORMAT_LABEL_OFFSET
    }
    if (y + label.offsetHeight > window.innerHeight) {
      y -= label.offsetHeight + 2 * FORMAT_LABEL_OFFSET
    }
    label.style.setProperty('--format-label-x', `${x}px`)
    label.style.setProperty('--format-label-y', `${y}px`)
  }

  return (
    <div
      aria-label={label}
      className={`chart-item surface ${isSelected ? 'is-selected' : ''}`}
      data-object-id={object.id}
      ref={frameRef}
      role="group"
      style={frameStyle}
      tabIndex={0}
      onClick={handleClick}
      onClickCapture={handleFormatClick}
      onFocus={() => actions.selectObject(object.id)}
      onKeyDown={handleKeyDown}
      onMouseDownCapture={holdFormatPress}
      onPointerDown={startPress}
      onPointerDownCapture={holdFormatPress}
      onPointerEnter={() => setIsPointerInside(true)}
      onPointerLeave={() => {
        setIsPointerInside(false)
        setFormatHint(null)
      }}
      onPointerMove={moveFormatLabel}
    >
      <SurfaceLayers surface={container}>
        {children(setFormatHint, showFormatFocus)}
      </SurfaceLayers>
      {shownHint ? (
        <span
          aria-hidden="true"
          className="chart-format-region"
          style={getRectStyle(shownHint.rect)}
        />
      ) : null}
      {focusRects.map((rect, index) => (
        <span
          aria-hidden="true"
          className="chart-format-region is-focus"
          key={index}
          style={getRectStyle(rect)}
        />
      ))}
      {showsObjectHint || formattedElement === 'container' ? (
        <span
          aria-hidden="true"
          className={`chart-format-region is-container ${
            formattedElement === 'container' ? 'is-active' : ''
          }`}
        />
      ) : null}
      {isPointerInside ? (
        <FloatingPortal>
          <span
            aria-hidden="true"
            className={`chip chart-format-label ${
              shownHint || showsObjectHint ? 'is-visible' : ''
            }`}
            ref={labelRef}
          >
            <Paintbrush size={12} />
            {shownHint
              ? formatRegionLabels[shownHint.element]
              : `Format ${definition.label} · ${formatKeyLabel}-click any part`}
          </span>
        </FloatingPortal>
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
