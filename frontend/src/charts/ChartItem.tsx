import { useState } from 'react'

import { getRectInFrame, getRectStyle } from '../objects/elementRect'
import { getFormatFocusClassName } from '../objects/getFormatFocusClassName'
import { getTextStyleCss } from '../shared/textStyle'
import EditableText from '../shared/ui/EditableText'
import InlineTextInput from '../shared/ui/InlineTextInput'
import { getChartDefinition } from './chartDefinitions'
import EChartCanvas from './EChartCanvas'
import EncodingDropSlots from './EncodingDropSlots'
import { getDefaultAxisTitle, getDefaultChartTitle } from './getChartTitle'

import type { CSSProperties } from 'react'
import type { DataField, Dataset } from '../datasets/types'
import type { ShowFormatHint } from '../objects/ObjectFrame'
import type {
  CanvasActions,
  DashboardAnimation,
  DataSelection,
} from '../workspace/types'
import type { AxisTitleEdit, ChartFormatElement, ChartInstance } from './types'

type ChartItemProps = {
  actions: CanvasActions
  animation: DashboardAnimation
  chart: ChartInstance
  dataset: Dataset
  datasetId: string | null
  draggedField: DataField | null
  formattedElement: ChartFormatElement | null
  selection: DataSelection | null
  onFormatHint: ShowFormatHint
}

function getAxisTitleInputStyle({ axis, rect }: AxisTitleEdit): CSSProperties {
  return {
    left: axis === 'x' ? rect.x + rect.width / 2 : rect.x,
    top: rect.y + rect.height / 2,
  }
}

/**
 * Shows a chart inside its object frame: ECharts canvas, HTML title, inline
 * editing of the axis titles and the drop slots for fields.
 */
function ChartItem({
  actions,
  animation,
  chart,
  dataset,
  datasetId,
  draggedField,
  formattedElement,
  selection,
  onFormatHint,
}: ChartItemProps) {
  const [axisTitleEdit, setAxisTitleEdit] = useState<AxisTitleEdit | null>(null)
  const [hoveredAxisTitle, setHoveredAxisTitle] =
    useState<AxisTitleEdit | null>(null)
  const definition = getChartDefinition(chart.type)
  const title = chart.spec.appearance.title
  const isFormatMode = formattedElement !== null
  const titleFocusClassName = getFormatFocusClassName('title', formattedElement)

  /** Opens the inline input for an axis title. */
  function handleEditAxisTitle(edit: AxisTitleEdit): void {
    setHoveredAxisTitle(null)
    setAxisTitleEdit(edit)
  }

  /** Highlights the hovered axis title and remembers it as format hint. */
  function handleHoverAxisTitle(edit: AxisTitleEdit | null): void {
    setHoveredAxisTitle(edit)
    if (edit) {
      onFormatHint(`${edit.axis}Axis`, edit.rect)
    }
  }

  /** Remembers the chart title as format hint. */
  function showTitleHint(target: HTMLElement): void {
    const rect = getRectInFrame(target)
    if (rect) {
      onFormatHint('title', rect)
    }
  }

  /** Saves an axis title typed directly on the chart. */
  function commitAxisTitle(axis: AxisTitleEdit['axis'], text: string): void {
    const axisKey = `${axis}Axis` as const
    const axisAppearance = chart.spec.appearance[axisKey]
    actions.updateChartAppearance(chart.id, axisKey, {
      ...axisAppearance,
      title: { ...axisAppearance.title, text },
    })
  }

  return (
    <>
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
        animation={animation}
        chart={chart}
        dataset={dataset}
        datasetId={datasetId}
        editingAxisTitle={axisTitleEdit?.axis ?? null}
        formattedElement={formattedElement}
        onEditAxisTitle={handleEditAxisTitle}
        onHoverAxisTitle={handleHoverAxisTitle}
        onHoverElement={onFormatHint}
        selection={selection}
      />
      {title.visible ? (
        <div
          className={`chart-item-header ${titleFocusClassName}`}
          style={{
            ...getTextStyleCss(title.textStyle),
            textAlign: title.layout.alignment,
          }}
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
            chart.spec.appearance[`${axisTitleEdit.axis}Axis`].title.text
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
    </>
  )
}

export default ChartItem
