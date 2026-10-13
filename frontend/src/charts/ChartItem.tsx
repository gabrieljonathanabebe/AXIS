import { GripHorizontal } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { useEffect, useRef, useState } from 'react'

import type { WorkspaceCommands } from '../app/types'
import type {
  CanvasActions,
  ObjectLayoutMode,
  DataSelection,
  DragPayload,
} from '../workspace/types'
import type { AxisTitleEdit, ChartFormatElement } from './types'

import CommandButton from '../app/CommandButton'
import EChartCanvas from './EChartCanvas'
import EditableText from '../shared/ui/EditableText'
import EncodingDropSlots from './EncodingDropSlots'
import InlineTextInput from '../shared/ui/InlineTextInput'
import { getChartDefinition } from './chartDefinitions'
import {
  getChartTitle,
  getDefaultAxisTitle,
  getDefaultChartTitle,
} from './getChartTitle'
import { moveLayout, resizeLayout } from '../workspace/chartLayout'

import type { CSSProperties, KeyboardEvent } from 'react'
import type { ChartInstance } from './types'
import type { ElementRect, ObjectBackground } from '../objects/types'

import type { DataField, Dataset } from '../datasets/types'
import type { GridDelta } from '../workspace/chartLayout'

/** The element under the pointer; in format mode it shows its region. */
type FormatHint = {
  element: ChartFormatElement
  rect: ElementRect
}

type ChartItemStyle = CSSProperties & {
  '--chart-canvas-inset': string
  '--chart-background'?: string
  '--chart-radius': string
}

type ChartItemProps = {
  actions: CanvasActions
  chart: ChartInstance
  commands: WorkspaceCommands
  dataset: Dataset
  datasetId: string | null
  draggedField: DataField | null
  formattedElement: ChartFormatElement | null
  isSelected: boolean
  selection: DataSelection | null
  style: CSSProperties
  onFormatElement: (element: ChartFormatElement, anchor: HTMLElement) => void
}

type ChartLayoutHandleProps = {
  chartId: string
  mode: ObjectLayoutMode
}

const layoutHandleLabels: Record<ObjectLayoutMode, string> = {
  e: 'Resize chart from right edge',
  move: 'Move chart',
  n: 'Resize chart from top edge',
  ne: 'Resize chart from top right corner',
  nw: 'Resize chart from top left corner',
  s: 'Resize chart from bottom edge',
  se: 'Resize chart from bottom right corner',
  sw: 'Resize chart from bottom left corner',
  w: 'Resize chart from left edge',
}

const formatRegionLabels: Record<ChartFormatElement, string> = {
  legend: 'Format legend',
  title: 'Format title',
  xAxis: 'Format X axis',
  yAxis: 'Format Y axis',
}

const backgroundClassNames: Record<ObjectBackground['kind'], string> = {
  blue: 'glass is-background-blue',
  color: 'glass is-background-color',
  glass: 'glass glass-liquid',
  surface: 'glass',
  violet: 'glass is-background-violet',
}

const layoutHandleModes = Object.keys(layoutHandleLabels) as ObjectLayoutMode[]

function ChartLayoutHandle({ chartId, mode }: ChartLayoutHandleProps) {
  const payload: DragPayload = {
    kind: 'object-layout',
    mode,
    objectId: chartId,
  }
  const { attributes, listeners, setNodeRef } = useDraggable({
    data: { payload },
    id: `chart:${chartId}:${mode}`,
  })
  return (
    <div
      {...listeners}
      {...attributes}
      aria-label={layoutHandleLabels[mode]}
      className={`chart-layout-handle chart-${mode}-handle`}
      ref={setNodeRef}
      tabIndex={-1}
    >
      {mode === 'move' ? <GripHorizontal size={14} /> : null}
    </div>
  )
}

const arrowKeyDeltas: Partial<Record<string, GridDelta>> = {
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
}

function getAxisTitleInputStyle({ axis, rect }: AxisTitleEdit): CSSProperties {
  return {
    left: axis === 'x' ? rect.x + rect.width / 2 : rect.x,
    top: rect.y + rect.height / 2,
  }
}

/** Measures an element relative to the chart item, like the ECharts rects. */
function getRectInItem(target: Element, item: HTMLElement): ElementRect {
  const targetRect = target.getBoundingClientRect()
  const itemRect = item.getBoundingClientRect()
  return {
    height: targetRect.height,
    width: targetRect.width,
    x: targetRect.x - itemRect.x - item.clientLeft,
    y: targetRect.y - itemRect.y - item.clientTop,
  }
}

/** Positions an overlay exactly over a rect. */
function getRectStyle({ height, width, x, y }: ElementRect): CSSProperties {
  return {
    height,
    left: x,
    top: y,
    width,
  }
}

/**
 * Mirrors the format focus on the HTML title, which ECharts does not draw.
 * @param formattedElement Element in the popover, or null when it is closed.
 * @returns Glow while the title is formatted, dimmed for other elements.
 */
function getTitleFocusClassName(
  formattedElement: ChartFormatElement | null,
): string {
  if (!formattedElement) {
    return ''
  }
  return formattedElement === 'title' ? 'is-formatted' : 'is-dimmed'
}

function ChartItem({
  actions,
  chart,
  commands,
  dataset,
  datasetId,
  draggedField,
  formattedElement,
  isSelected,
  selection,
  style,
  onFormatElement,
}: ChartItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null)
  const [axisTitleEdit, setAxisTitleEdit] = useState<AxisTitleEdit | null>(null)
  const [hoveredAxisTitle, setHoveredAxisTitle] =
    useState<AxisTitleEdit | null>(null)
  const definition = getChartDefinition(chart.type)
  const [formatHint, setFormatHint] = useState<FormatHint | null>(null)
  const { container } = chart
  const { background } = container
  const title = chart.spec.appearance.title
  const backgroundClassName = backgroundClassNames[background.kind]
  const isFormatMode = formattedElement !== null
  const titleFocusClassName = getTitleFocusClassName(formattedElement)
  const itemStyle: ChartItemStyle = {
    ...style,
    '--chart-canvas-inset': `${container.padding}px`,
    '--chart-background':
      background.kind === 'color' ? background.color : undefined,
    '--chart-radius': `${container.borderRadius}px`,
  }

  useEffect(() => {
    itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => {
    const item = itemRef.current
    if (isSelected && item && !item.contains(document.activeElement)) {
      item.focus({ preventScroll: true })
    }
  }, [isSelected])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget) {
      return
    }
    const delta = arrowKeyDeltas[event.key]
    if (delta) {
      event.preventDefault()
      const layout = event.shiftKey
        ? resizeLayout(chart.layout, delta, {
            bottom: true,
            left: false,
            right: true,
            top: false,
          })
        : moveLayout(chart.layout, delta)
      actions.updateObjectLayout(chart.id, layout)
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

  function handleEditAxisTitle(edit: AxisTitleEdit): void {
    setHoveredAxisTitle(null)
    setAxisTitleEdit(edit)
  }

  /** Highlights the hovered axis title and remembers it as format hint. */
  function handleHoverAxisTitle(edit: AxisTitleEdit | null): void {
    setHoveredAxisTitle(edit)
    if (edit) {
      showFormatHint(`${edit.axis}Axis`, edit.rect)
    }
  }

  /** Remembers the chart title as format hint. */
  function showTitleHint(target: HTMLElement): void {
    const item = itemRef.current
    if (item) {
      showFormatHint('title', getRectInItem(target, item))
    }
  }

  /** Remembers the hovered element; format mode shows its region. */
  function showFormatHint(
    element: ChartFormatElement,
    rect: ElementRect,
  ): void {
    setFormatHint({ element, rect })
  }

  function openFormat(element: ChartFormatElement): void {
    const item = itemRef.current
    if (item) {
      onFormatElement(element, item)
    }
  }

  function commitAxisTitle(axis: AxisTitleEdit['axis'], text: string): void {
    const axisKey = `${axis}Axis` as const
    actions.updateChartAppearance(chart.id, axisKey, {
      ...chart.spec.appearance[axisKey],
      title: text,
    })
  }

  return (
    <div
      aria-label={getChartTitle(chart, dataset.fields)}
      className={`chart-item ${backgroundClassName} ${
        isSelected ? 'is-selected' : ''
      }`}
      data-object-id={chart.id}
      ref={itemRef}
      role="group"
      style={itemStyle}
      tabIndex={0}
      onFocus={() => actions.selectObject(chart.id)}
      onKeyDown={handleKeyDown}
      onPointerDown={() => actions.selectObject(chart.id)}
      onPointerLeave={() => setFormatHint(null)}
    >
      {draggedField ? (
        <EncodingDropSlots
          chartId={chart.id}
          definition={definition}
          encoding={chart.spec.data.encoding}
          field={draggedField}
        />
      ) : null}
      {hoveredAxisTitle && !axisTitleEdit && !isFormatMode ? (
        <span
          className={`editable-text-highlight chart-axis-title-hover is-${hoveredAxisTitle.axis}-axis`}
          style={getRectStyle(hoveredAxisTitle.rect)}
        />
      ) : null}

      <EChartCanvas
        actions={actions}
        chart={chart}
        dataset={dataset}
        datasetId={datasetId}
        editingAxisTitle={axisTitleEdit?.axis ?? null}
        formattedElement={formattedElement}
        onEditAxisTitle={handleEditAxisTitle}
        onHoverAxisTitle={handleHoverAxisTitle}
        onHoverLegend={(rect) => showFormatHint('legend', rect)}
        selection={selection}
      />
      {title.enabled ? (
        <div
          className={`chart-item-header ${titleFocusClassName}`}
          style={{ textAlign: title.alignment }}
        >
          <EditableText
            className="chart-item-title"
            label="Chart title"
            placeholder={getDefaultChartTitle(chart, dataset.fields)}
            value={title.text}
            onCommit={(text) =>
              actions.updateChartAppearance(chart.id, 'title', {
                ...title,
                text,
              })
            }
            onPointerEnter={(event) => showTitleHint(event.currentTarget)}
          />
        </div>
      ) : null}
      {axisTitleEdit ? (
        <InlineTextInput
          className={`chart-axis-title-input is-${axisTitleEdit.axis}-axis`}
          initialValue={
            chart.spec.appearance[`${axisTitleEdit.axis}Axis`].title
          }
          key={axisTitleEdit.axis}
          label={`${axisTitleEdit.axis.toUpperCase()} axis title`}
          placeholder={getDefaultAxisTitle(
            chart,
            dataset.fields,
            axisTitleEdit.axis,
          )}
          style={getAxisTitleInputStyle(axisTitleEdit)}
          onClose={() => setAxisTitleEdit(null)}
          onCommit={(text) => commitAxisTitle(axisTitleEdit.axis, text)}
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
      {isSelected ? (
        <div className="chart-item-actions">
          <CommandButton command={commands['object.duplicate']} size="sm" />
          <CommandButton command={commands['object.delete']} size="sm" />
        </div>
      ) : null}
      {layoutHandleModes.map((mode) => (
        <ChartLayoutHandle chartId={chart.id} key={mode} mode={mode} />
      ))}
    </div>
  )
}

export default ChartItem
