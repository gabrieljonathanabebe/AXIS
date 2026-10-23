import * as echarts from 'echarts'
import { TriangleAlert } from 'lucide-react'
import { useEffect, useEffectEvent, useRef } from 'react'

import { COLOR_TOKEN_VARIABLES } from '../shared/colorValue'
import EmptyState from '../shared/ui/EmptyState'
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
import { usePointsQuery } from './usePointsQuery'

import type { ECElementEvent, ECharts, ElementEvent } from 'echarts'
import type { DataRow, Dataset } from '../datasets/types'
import type { ElementRect } from '../objects/types'
import type { ColorToken } from '../shared/colorValue'
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
  onHoverElement: (element: ChartFormatElement, rect: ElementRect) => void
  selection: DataSelection | null
}

function readToken(styles: CSSStyleDeclaration, name: string): string {
  return styles.getPropertyValue(name).trim()
}

function readNumberToken(styles: CSSStyleDeclaration, name: string): number {
  const value = readToken(styles, name)
  const numericValue = Number.parseFloat(value)

  if (value.endsWith('rem')) {
    const rootFontSize = Number.parseFloat(styles.fontSize)
    return numericValue * rootFontSize
  }

  return numericValue
}

/**
 * Reads the current color of each token, so ECharts can resolve tokens.
 * @param styles Computed styles of the document root.
 * @returns Color per token, e.g. the primary text color for `text`.
 */
function readColorTokens(
  styles: CSSStyleDeclaration,
): Record<ColorToken, string> {
  const entries = Object.entries(COLOR_TOKEN_VARIABLES).map(
    ([token, variable]) => [token, readToken(styles, variable)],
  )
  return Object.fromEntries(entries) as Record<ColorToken, string>
}

function readChartTheme(): ChartTheme {
  const styles = getComputedStyle(document.documentElement)
  return {
    accent: readToken(styles, '--color-accent'),
    axis: readToken(styles, '--color-border-strong'),
    colors: readColorTokens(styles),
    text: readToken(styles, '--color-text-primary'),
    textMuted: readToken(styles, '--color-text-secondary'),
    tooltip: {
      background: readToken(styles, '--color-surface-overlay'),
      borderColor: readToken(styles, '--color-border-accent'),
      borderWidth: readNumberToken(styles, '--border-width-thin'),
      fontSize: readNumberToken(styles, '--font-size-sm'),
      blur: readToken(styles, '--blur-sm'),
      radius: readToken(styles, '--radius-md'),
      shadow: readToken(styles, '--shadow-md'),
    },
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
}: EChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<ECharts | null>(null)
  const query = createChartQuery(chart, dataset.fields)
  const { result, isLoading, error } = useChartQuery(datasetId, query)
  const highlightQuery = createHighlightQuery(query, selection)
  const { result: highlightResult } = useChartQuery(datasetId, highlightQuery)
  const pointsQuery = usePointsQuery(datasetId, createPointsQuery(chart))
  const points = pointsQuery.result?.rows ?? EMPTY_POINTS
  const isChartLoading = isLoading || pointsQuery.isLoading
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
    const axisTitleEdit = getAxisTitleEdit(event)
    if (axisTitleEdit) {
      onEditAxisTitle(axisTitleEdit)
      return
    }
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
      onHoverElement(formatHint.element, offsetRect(formatHint.rect, container))
    }
  })

  const handleMouseOut = useEffectEvent((event: ECElementEvent) => {
    if (isAxisTitleEvent(event)) {
      onHoverAxisTitle(null)
    }
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
    instance.on('brushEnd', (event) => handleBrushEnd(event))
    instance.on('mousemove', (event) => {
      if (isAxisTitleEvent(event)) {
        zr.setCursorStyle('text')
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
    const theme = readChartTheme()
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
    syncBrush(instance, chart, selection, formattedElement !== null)
    syncFormatFocus(instance, formattedElement, theme.accent)
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
    editingAxisTitle,
    formattedElement,
    highlightResult,
    points,
    result,
    selection,
  ])

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
