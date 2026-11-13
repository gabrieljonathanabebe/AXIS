import { useState } from 'react'

import { getRectInFrame } from '../objects/elementRect'
import { getTextStyleCss } from '../shared/textStyle'
import EditableText from '../shared/ui/EditableText'
import InlineTextInput from '../shared/ui/InlineTextInput'
import { getChartDefinition } from './chartDefinitions'
import EChartCanvas from './EChartCanvas'
import EncodingDropSlots from './EncodingDropSlots'
import { getDefaultAxisTitle, getDefaultChartTitle } from './getChartTitle'

import type { CSSProperties } from 'react'
import type { DashboardStyle } from '../dashboardStyle/types'
import type { DataField, Dataset } from '../datasets/types'
import type { ShowFormatFocus, ShowFormatHint } from '../objects/ObjectFrame'
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
  style: DashboardStyle
  onFormatFocus: ShowFormatFocus
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
  style,
  onFormatFocus,
  onFormatHint,
}: ChartItemProps) {
  const [axisTitleEdit, setAxisTitleEdit] = useState<AxisTitleEdit | null>(null)
  const definition = getChartDefinition(chart.type)
  const title = chart.spec.appearance.title

  /** Remembers the hovered axis title as format hint. */
  function handleHoverAxisTitle(edit: AxisTitleEdit | null): void {
    if (edit) {
      onFormatHint({ element: `${edit.axis}Axis`, rect: edit.rect })
    }
  }

  /** Remembers the chart title as format hint. */
  function showTitleHint(target: HTMLElement): void {
    const rect = getRectInFrame(target)
    if (rect) {
      onFormatHint({ element: 'title', rect })
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
      <EChartCanvas
        actions={actions}
        animation={animation}
        chart={chart}
        dataset={dataset}
        datasetId={datasetId}
        editingAxisTitle={axisTitleEdit?.axis ?? null}
        formattedElement={formattedElement}
        onEditAxisTitle={setAxisTitleEdit}
        onFormatFocus={onFormatFocus}
        onHoverAxisTitle={handleHoverAxisTitle}
        onHoverElement={onFormatHint}
        selection={selection}
        style={style}
      />
      {title.visible ? (
        <div
          className="chart-item-header"
          style={{
            ...getTextStyleCss(title.textStyle),
            textAlign: title.layout.alignment,
          }}
        >
          <EditableText
            className="chart-item-title"
            formatElement="title"
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
            onPointerLeave={() => onFormatHint(null)}
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
