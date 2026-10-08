import * as echarts from 'echarts'
import type { ECElementEvent, ECharts, ElementEvent } from 'echarts'
import { useEffect, useEffectEvent, useRef } from 'react'

import {
  createChartQuery,
  createHighlightQuery,
  createPointsQuery,
} from './createChartQuery'

import { createEChartOption } from './echarts/createEChartOption'
import { syncBrush } from './echarts/createBrushOption'
import {
  createAxisTitleEditFromEvent,
  isAxisTitleEvent,
  syncAxisTitleEdit,
} from './echarts/createAxisTitleEditFromEvent'

import {
  createSelectionFromBrush,
  createSelectionFromEvent,
} from './echarts/createSelectionFromEvent'

import { isSameSelection } from '../workspace/dataSelection'
import { useChartQuery } from './useChartQuery'
import { usePointsQuery } from './usePointsQuery'

import type { AxisTitleEdit } from './types'
import type { ChartInstance } from './types'
import type { DataRow, Dataset } from '../datasets/types'
import type { ChartTheme } from './echarts/chartTheme'
import type { DataSelection } from '../workspace/types'

// Stable empty list, so non-scatter charts do not re-render the option.
const EMPTY_POINTS: DataRow[] = []

type EChartCanvasProps = {
  chart: ChartInstance
  dataset: Dataset
  datasetId: string | null
  editingAxisTitle: AxisTitleEdit['axis'] | null
  onClearSelection: () => void
  onEditAxisTitle: (edit: AxisTitleEdit) => void
  onHoverAxisTitle: (edit: AxisTitleEdit | null) => void
  onSelectData: (selection: DataSelection) => void
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

function readChartTheme(): ChartTheme {
  const styles = getComputedStyle(document.documentElement)

  return {
    accent: readToken(styles, '--color-accent'),
    axis: readToken(styles, '--color-border-strong'),
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

function offsetAxisTitleEdit(
  edit: AxisTitleEdit,
  container: HTMLElement,
): AxisTitleEdit {
  return {
    ...edit,
    rect: {
      ...edit.rect,
      x: edit.rect.x + container.offsetLeft,
      y: edit.rect.y + container.offsetTop,
    },
  }
}

function EChartCanvas({
  chart,
  dataset,
  datasetId,
  editingAxisTitle,
  onClearSelection,
  onEditAxisTitle,
  onHoverAxisTitle,
  onSelectData,
  selection,
}: EChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<ECharts | null>(null)
  const query = createChartQuery(chart)
  const { result, isLoading, error } = useChartQuery(datasetId, query)
  const highlightQuery = createHighlightQuery(query, selection)
  const { result: highlightResult } = useChartQuery(datasetId, highlightQuery)
  const pointsQuery = usePointsQuery(datasetId, createPointsQuery(chart))
  const points = pointsQuery.result?.rows ?? EMPTY_POINTS
  const isChartLoading = isLoading || pointsQuery.isLoading
  const chartError = error ?? pointsQuery.error

  function getAxisTitleEdit(event: ECElementEvent): AxisTitleEdit | null {
    const edit = createAxisTitleEditFromEvent(event)
    const container = containerRef.current
    return edit && container ? offsetAxisTitleEdit(edit, container) : null
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
      onClearSelection()
      return
    }
    onSelectData(nextSelection)
  })

  const handleBrushEnd = useEffectEvent((event: unknown) => {
    const nextSelection = createSelectionFromBrush(chart, event)
    if (nextSelection) {
      onSelectData(nextSelection)
      return
    }
    onClearSelection()
  })

  const handleMouseOver = useEffectEvent((event: ECElementEvent) => {
    const axisTitleEdit = getAxisTitleEdit(event)
    if (axisTitleEdit) {
      onHoverAxisTitle(axisTitleEdit)
    }
  })

  const handleMouseOut = useEffectEvent((event: ECElementEvent) => {
    if (isAxisTitleEvent(event)) {
      onHoverAxisTitle(null)
    }
  })

  const handleBackgroundClick = useEffectEvent((event: ElementEvent) => {
    if (!event.target) {
      onClearSelection()
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
    instance.setOption(
      createEChartOption(
        chart.type,
        chart.spec,
        dataset,
        readChartTheme(),
        result,
        highlightResult,
        points,
        selection,
        chart.id,
      ),
      true,
    )
    syncBrush(instance, chart, selection)
    syncAxisTitleEdit(instance, editingAxisTitle)
  }, [
    chart,
    dataset,
    editingAxisTitle,
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
      <div className="echart-canvas" ref={containerRef} />
      {chartError && (
        <div className="chart-query-error" role="alert">
          {chartError}
        </div>
      )}
    </>
  )
}

export default EChartCanvas
