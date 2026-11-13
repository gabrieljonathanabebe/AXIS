import * as echarts from 'echarts'
import { TriangleAlert } from 'lucide-react'
import { useEffect, useEffectEvent, useRef } from 'react'

import EmptyState from '../shared/ui/EmptyState'
import { useIsFormatKeyHeld } from '../shared/useIsFormatKeyHeld'
import { isSameSelection } from '../workspace/dataSelection'
import { getChartDefinition, getMissingEncodings } from './chartDefinitions'
import {
  createChartQuery,
  createHighlightQuery,
  createPointsQuery,
} from './createChartQuery'
import {
  createAxisTitleEditFromEvent,
  isAxisTitleEvent,
  syncAxisTitleEdit,
} from './echarts/createAxisTitleEditFromEvent'
import { syncBrush } from './echarts/createBrushOption'
import { createEChartOption } from './echarts/createEChartOption'
import { createFormatHintFromEvent } from './echarts/createFormatHintFromEvent'
import {
  createSelectionFromBrush,
  createSelectionFromEvent,
} from './echarts/createSelectionFromEvent'
import { measureFocusRects } from './echarts/measureFocusRects'
import { useChartQuery } from './useChartQuery'
import { useDocumentTheme } from './useDocumentTheme'
import { usePointsQuery } from './usePointsQuery'

import type { ECElementEvent, ECharts, ElementEvent } from 'echarts'
import type { DashboardStyle } from '../dashboardStyle/types'
import type { DataRow, Dataset } from '../datasets/types'
import type { ShowFormatFocus, ShowFormatHint } from '../objects/ObjectFrame'
import type { ElementRect } from '../objects/types'
import type {
  CanvasActions,
  DashboardAnimation,
  DataSelection,
} from '../workspace/types'
import type { ChartTheme } from './echarts/chartTheme'
import type { AxisTitleEdit, ChartFormatElement, ChartInstance } from './types'

// Stable empty list, so non-scatter charts do not re-render the option.
const EMPTY_POINTS: DataRow[] = []

type EChartCanvasProps = {
  actions: CanvasActions
  animation: DashboardAnimation
  chart: ChartInstance
  dataset: Dataset
  datasetId: string | null
  editingAxisTitle: AxisTitleEdit['axis'] | null
  formattedElement: ChartFormatElement | null
  onEditAxisTitle: (edit: AxisTitleEdit) => void
  onFormatFocus: ShowFormatFocus
  onHoverAxisTitle: (edit: AxisTitleEdit | null) => void
  onHoverElement: ShowFormatHint
  selection: DataSelection | null
  style: DashboardStyle
}

/** Moves a rect from canvas into chart item coordinates. */
function offsetRect(rect: ElementRect, container: HTMLElement): ElementRect {
  return {
    ...rect,
    x: rect.x + container.offsetLeft,
    y: rect.y + container.offsetTop,
  }
}

function EChartCanvas({
  actions,
  animation,
  chart,
  dataset,
  datasetId,
  editingAxisTitle,
  formattedElement,
  onEditAxisTitle,
  onFormatFocus,
  onHoverAxisTitle,
  onHoverElement,
  selection,
  style,
}: EChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<ECharts | null>(null)
  const documentTheme = useDocumentTheme()
  const isFormatKeyHeld = useIsFormatKeyHeld()
  const isTooltipEnabled = chart.spec.interaction.tooltip.enabled
  const query = createChartQuery(chart, dataset.fields)
  const { result, isLoading, error } = useChartQuery(datasetId, query)
  const highlightQuery = createHighlightQuery(query, selection)
  const { result: highlightResult } = useChartQuery(datasetId, highlightQuery)
  const pointsQuery = usePointsQuery(
    datasetId,
    createPointsQuery(chart, dataset.fields, selection),
  )
  const points = pointsQuery.result?.rows ?? EMPTY_POINTS
  const isChartLoading =
    isLoading || (pointsQuery.isLoading && !pointsQuery.result)
  const chartError = error ?? pointsQuery.error
  const missingLabels = getMissingEncodings(
    chart.type,
    chart.spec.data.encoding,
  ).map((definition) => definition.label)

  const isEmpty = missingLabels.length > 0
  const ChartIcon = getChartDefinition(chart.type).icon

  function getAxisTitleEdit(event: ECElementEvent): AxisTitleEdit | null {
    const edit = createAxisTitleEditFromEvent(event)
    const container = containerRef.current
    return edit && container
      ? { ...edit, rect: offsetRect(edit.rect, container) }
      : null
  }

  // Effect events always see the latest props, so ECharts listeners are
  // registered once when the chart is created.
  const handleClick = useEffectEvent((event: ECElementEvent) => {
    const nextSelection = createSelectionFromEvent(chart, event, dataset.fields)
    if (!nextSelection) {
      return
    }
    if (isSameSelection(selection, nextSelection)) {
      actions.clearSelection()
      return
    }
    actions.selectData(nextSelection)
  })

  /** Opens the inline input for an axis title on a double click. */
  const handleDoubleClick = useEffectEvent((event: ECElementEvent) => {
    const axisTitleEdit = getAxisTitleEdit(event)
    if (axisTitleEdit) {
      onEditAxisTitle(axisTitleEdit)
    }
  })

  const handleBrushEnd = useEffectEvent((event: unknown) => {
    const nextSelection = createSelectionFromBrush(chart, event)
    if (nextSelection) {
      actions.selectData(nextSelection)
      return
    }
    actions.clearSelection()
  })

  /** Reports a hovered axis title, legend or axis labels to the chart item. */
  const handleMouseOver = useEffectEvent((event: ECElementEvent) => {
    const axisTitleEdit = getAxisTitleEdit(event)
    if (axisTitleEdit) {
      onHoverAxisTitle(axisTitleEdit)
    }
    const formatHint = createFormatHintFromEvent(event)
    const container = containerRef.current
    if (formatHint && container) {
      onHoverElement({
        element: formatHint.element,
        rect: offsetRect(formatHint.rect, container),
      })
    }
  })

  /** Clears the hint of an element the pointer leaves, e.g. a bar. */
  const handleMouseOut = useEffectEvent((event: ECElementEvent) => {
    if (isAxisTitleEvent(event)) {
      onHoverAxisTitle(null)
    }
    onHoverElement(null)
  })

  const handleBackgroundClick = useEffectEvent((event: ElementEvent) => {
    if (!event.target) {
      actions.clearSelection()
    }
  })

  /**
   * Reports the bounds of the element in focus that ECharts draws, e.g. the
   * bars, to the frame; other elements like the title report themselves.
   */
  const reportFormatFocus = useEffectEvent(() => {
    const instance = chartRef.current
    const container = containerRef.current
    if (!instance || !container || !formattedElement) {
      return
    }
    const rects = measureFocusRects(instance, formattedElement)
    if (rects) {
      onFormatFocus({
        element: formattedElement,
        rects: rects.map((rect) => offsetRect(rect, container)),
      })
    }
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    const instance = echarts.init(container)
    const zr = instance.getZr()
    chartRef.current = instance
    instance.on('click', (event) => handleClick(event))
    instance.on('dblclick', (event) => handleDoubleClick(event))
    instance.on('brushEnd', (event) => handleBrushEnd(event))
    instance.on('mousemove', (event) => {
      if (isAxisTitleEvent(event)) {
        zr.setCursorStyle('default')
      }
    })
    instance.on('mouseout', (event) => handleMouseOut(event))
    instance.on('mouseover', (event) => handleMouseOver(event))
    instance.on('finished', () => reportFormatFocus())
    zr.on('click', (event) => handleBackgroundClick(event))
    const resizeObserver = new ResizeObserver(() => instance.resize())
    resizeObserver.observe(container)
    return () => {
      resizeObserver.disconnect()
      instance.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    const instance = chartRef.current
    if (!instance) {
      return
    }
    const theme: ChartTheme = { style }
    const option = createEChartOption({
      animation,
      chartId: chart.id,
      chartType: chart.type,
      dataset,
      highlightResult,
      points,
      queryResult: result,
      selection,
      spec: chart.spec,
      theme,
    })
    instance.setOption(option, true)
    syncBrush(instance, chart, selection)
    syncAxisTitleEdit(instance, editingAxisTitle)
  }, [
    animation,
    chart,
    dataset,
    documentTheme,
    editingAxisTitle,
    highlightResult,
    points,
    result,
    selection,
    style,
  ])

  // Measures when another element comes into focus; later changes report on
  // `finished`, once ECharts has animated to the new state.
  useEffect(() => {
    reportFormatFocus()
  }, [formattedElement])

  // While the format key is held, a click formats, so the data tooltip
  // makes room for the format label at the pointer.
  useEffect(() => {
    const instance = chartRef.current
    if (!instance) {
      return
    }
    if (isFormatKeyHeld) {
      instance.dispatchAction({ type: 'hideTip' })
    }
    instance.setOption({
      tooltip: { show: isTooltipEnabled && !isFormatKeyHeld },
    })
  }, [isFormatKeyHeld, isTooltipEnabled])

  useEffect(() => {
    if (isChartLoading) {
      chartRef.current?.showLoading('default', {
        text: 'Loading chart...',
        maskColor: 'rgba(255, 255, 255, 0)',
      })
    } else {
      chartRef.current?.hideLoading()
    }
  }, [isChartLoading])

  return (
    <>
      <div
        className={`echart-canvas ${isEmpty || chartError ? 'is-empty' : ''}`}
        ref={containerRef}
      />
      {isEmpty && (
        <div className="chart-state">
          <EmptyState
            description="Drag it from the Build panel or pick it under Chart data."
            icon={<ChartIcon />}
            iconVariant="illustration"
            size="sm"
            title={`Drop a field on ${missingLabels.join(' and ')}`}
          />
        </div>
      )}
      {chartError && (
        <div className="chart-state">
          <EmptyState
            description={chartError}
            icon={<TriangleAlert />}
            size="sm"
            title="Chart unavailable"
            tone="danger"
          />
        </div>
      )}
    </>
  )
}

export default EChartCanvas
