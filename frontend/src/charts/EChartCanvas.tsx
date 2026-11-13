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
import { syncFormatFocus } from './echarts/syncFormatFocus'
import { syncFormatTooltip } from './echarts/syncFormatTooltip'
import { useChartQuery } from './useChartQuery'
import { useDocumentTheme } from './useDocumentTheme'
import { usePointsQuery } from './usePointsQuery'

import type { ECElementEvent, ECharts, ElementEvent } from 'echarts'
import type { DashboardStyle } from '../dashboardStyle/types'
import type { DataRow, Dataset } from '../datasets/types'
import type { ShowFormatHint } from '../objects/ObjectFrame'
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
  onHoverAxisTitle: (edit: AxisTitleEdit | null) => void
  onHoverElement: ShowFormatHint
  selection: DataSelection | null
  style: DashboardStyle
}

function readToken(styles: CSSStyleDeclaration, name: string): string {
  return styles.getPropertyValue(name).trim()
}

/**
 * Reads the app accent at the chart element, which marks the formatted
 * element; all other colors come from the spec and the dashboard style.
 * @param element Container element of the chart.
 * @param style Current dashboard style.
 * @returns Theme for the ECharts option and the format focus.
 */
function readChartTheme(
  element: HTMLElement,
  style: DashboardStyle,
): ChartTheme {
  const styles = getComputedStyle(element)
  return {
    formatFocus: readToken(styles, '--color-accent'),
    style,
  }
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
    const theme = readChartTheme(instance.getDom(), style)
    instance.setOption(
      createEChartOption({
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
      }),
      true,
    )
    syncBrush(instance, chart, selection)
    syncFormatFocus(instance, formattedElement, theme.formatFocus)
    syncFormatTooltip(
      instance,
      formattedElement,
      chart.spec.interaction.tooltip.enabled,
    )
    syncAxisTitleEdit(instance, editingAxisTitle)
  }, [
    animation,
    chart,
    dataset,
    documentTheme,
    editingAxisTitle,
    formattedElement,
    highlightResult,
    points,
    result,
    selection,
    style,
  ])

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
