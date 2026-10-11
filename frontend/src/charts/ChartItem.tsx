import { GripHorizontal, Pencil } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { useEffect, useRef, useState } from 'react'

import type { WorkspaceCommands } from '../app/types'
import type {
  CanvasActions,
  ChartLayoutMode,
  DataSelection,
  DragPayload,
} from '../workspace/types'
import type { AxisTitleEdit, ChartFormatElement } from './types'

import CommandButton from '../app/CommandButton'
import EChartCanvas from './EChartCanvas'
import EditableText from '../shared/ui/EditableText'
import EncodingDropSlots from './EncodingDropSlots'
import IconButton from '../shared/ui/IconButton'
import InlineTextInput from '../shared/ui/InlineTextInput'
import { getChartDefinition } from './chartDefinitions'
import {
  getChartTitle,
  getDefaultAxisTitle,
  getDefaultChartTitle,
} from './getChartTitle'
import { moveChartLayout, resizeChartLayout } from '../workspace/chartLayout'

import type { CSSProperties, KeyboardEvent } from 'react'
import type { ChartContainerBackground, ChartInstance } from './types'

import type { DataField, Dataset } from '../datasets/types'
import type { GridDelta } from '../workspace/chartLayout'

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
  mode: ChartLayoutMode
}

const layoutHandleLabels: Record<ChartLayoutMode, string> = {
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

const backgroundClassNames: Record<ChartContainerBackground['kind'], string> = {
  blue: 'glass is-background-blue',
  color: 'glass is-background-color',
  glass: 'glass glass-liquid',
  surface: 'glass',
  violet: 'glass is-background-violet',
}

const layoutHandleModes = Object.keys(layoutHandleLabels) as ChartLayoutMode[]

function ChartLayoutHandle({ chartId, mode }: ChartLayoutHandleProps) {
  const payload: DragPayload = {
    chartId,
    kind: 'chart-layout',
    mode,
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

function getFormattedAxis(
  element: ChartFormatElement | null,
): AxisTitleEdit['axis'] | null {
  if (element === 'xAxis') {
    return 'x'
  }
  if (element === 'yAxis') {
    return 'y'
  }
  return null
}

function getAxisFormatButtonStyle({
  axis,
  rect,
}: AxisTitleEdit): CSSProperties {
  return axis === 'x'
    ? { left: rect.x + rect.width, top: rect.y + rect.height / 2 }
    : { left: rect.x + rect.width / 2, top: rect.y }
}

function getAxisTitleHoverStyle({
  height,
  width,
  x,
  y,
}: AxisTitleEdit['rect']): CSSProperties {
  return {
    height,
    left: x,
    top: y,
    width,
  }
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
  const [formatAxis, setFormatAxis] = useState<AxisTitleEdit | null>(null)
  const { container } = chart
  const { background } = container
  const title = chart.spec.appearance.title
  const backgroundClassName = backgroundClassNames[background.kind]
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
        ? resizeChartLayout(chart.layout, delta, {
            bottom: true,
            left: false,
            right: true,
            top: false,
          })
        : moveChartLayout(chart.layout, delta)
      actions.updateChartLayout(chart.id, layout)
      return
    }

    if (event.key === 'Escape') {
      if (selection) {
        actions.clearSelection()
        return
      }
      actions.selectChart(null)
      event.currentTarget.blur()
    }
  }

  function handleEditAxisTitle(edit: AxisTitleEdit): void {
    setHoveredAxisTitle(null)
    setAxisTitleEdit(edit)
  }

  function handleHoverAxisTitle(edit: AxisTitleEdit | null): void {
    setHoveredAxisTitle(edit)
    if (edit) {
      setFormatAxis(edit)
    }
  }

  function openAxisFormat(axis: AxisTitleEdit['axis']): void {
    const item = itemRef.current
    if (item) {
      onFormatElement(`${axis}Axis`, item)
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
      ref={itemRef}
      role="group"
      style={itemStyle}
      tabIndex={0}
      onFocus={() => actions.selectChart(chart.id)}
      onKeyDown={handleKeyDown}
      onPointerDown={() => actions.selectChart(chart.id)}
      onPointerLeave={() => setFormatAxis(null)}
    >
      {draggedField ? (
        <EncodingDropSlots
          chartId={chart.id}
          definition={definition}
          encoding={chart.spec.data.encoding}
          field={draggedField}
        />
      ) : null}
      {hoveredAxisTitle && !axisTitleEdit ? (
        <span
          className={`editable-text-highlight chart-axis-title-hover is-${hoveredAxisTitle.axis}-axis`}
          style={getAxisTitleHoverStyle(hoveredAxisTitle.rect)}
        />
      ) : null}

      <EChartCanvas
        actions={actions}
        chart={chart}
        dataset={dataset}
        datasetId={datasetId}
        editingAxisTitle={axisTitleEdit?.axis ?? null}
        highlightedAxis={getFormattedAxis(formattedElement)}
        onEditAxisTitle={handleEditAxisTitle}
        onHoverAxisTitle={handleHoverAxisTitle}
        selection={selection}
      />
      {title.enabled ? (
        <div
          className="chart-item-header"
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
      {isSelected && formatAxis && !axisTitleEdit ? (
        <IconButton
          className={`chart-axis-format-button is-${formatAxis.axis}-axis`}
          label={`Format ${formatAxis.axis.toUpperCase()} axis`}
          size="xs"
          style={getAxisFormatButtonStyle(formatAxis)}
          onClick={() => openAxisFormat(formatAxis.axis)}
        >
          <Pencil size={12} />
        </IconButton>
      ) : null}
      {isSelected ? (
        <div className="chart-item-actions">
          <CommandButton command={commands['chart.duplicate']} size="sm" />
          <CommandButton command={commands['chart.delete']} size="sm" />
        </div>
      ) : null}
      {layoutHandleModes.map((mode) => (
        <ChartLayoutHandle chartId={chart.id} key={mode} mode={mode} />
      ))}
    </div>
  )
}

export default ChartItem
