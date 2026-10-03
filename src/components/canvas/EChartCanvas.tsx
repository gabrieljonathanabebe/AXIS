import * as echarts from 'echarts'
import type { ECElementEvent, ECharts, ElementEvent } from 'echarts'
import { useEffect, useRef } from 'react'

import {
  createChartQuery,
  createHighlightQuery,
} from '../../chart/createChartQuery'
import { createEChartOption } from '../../chart/echarts/createEChartOption'
import { syncBrush } from '../../chart/echarts/createBrushOption'
import {
  createAxisTitleEditFromEvent,
  isAxisTitleEvent,
  syncAxisTitleEdit,
} from '../../chart/echarts/createAxisTitleEditFromEvent'

import {
  createSelectionFromBrush,
  createSelectionFromEvent,
} from '../../chart/echarts/createSelectionFromEvent'

import { isSameSelection } from '../../workspace/dataSelection'
import { useChartQuery } from '../../hooks/useChartQuery'

import type { AxisTitleEdit } from '../../types/ui'
import type { ChartInstance, Dataset } from '../../types/chart'
import type { ChartTheme } from '../../chart/echarts/chartTheme'
import type { DataSelection } from '../../types/workspace'

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

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    const chart = echarts.init(container)
    chartRef.current = chart
    const resizeObserver = new ResizeObserver(() => chart.resize())
    resizeObserver.observe(container)
    return () => {
      resizeObserver.disconnect()
      chart.dispose()
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
        selection,
        chart.id,
      ),
      true,
    )
    syncBrush(instance, chart, selection)
    syncAxisTitleEdit(instance, editingAxisTitle)
  }, [chart, dataset, editingAxisTitle, highlightResult, result, selection])

  useEffect(() => {
    const instance = chartRef.current
    const container = containerRef.current
    if (!instance || !container) {
      return
    }
    const zr = instance.getZr()

    function handleClick(event: ECElementEvent): void {
      const axisTitleEdit = createAxisTitleEditFromEvent(event)
      if (axisTitleEdit && container) {
        onEditAxisTitle(offsetAxisTitleEdit(axisTitleEdit, container))
        return
      }
      const nextSelection = createSelectionFromEvent(
        chart,
        event,
        dataset.fields,
      )

      if (!nextSelection) {
        return
      }
      if (isSameSelection(selection, nextSelection)) {
        onClearSelection()
        return
      }
      onSelectData(nextSelection)
    }

    function handleBackgroundClick(event: ElementEvent): void {
      if (!event.target) {
        onClearSelection()
      }
    }

    function handleBrushEnd(event: unknown): void {
      const nextSelection = createSelectionFromBrush(chart, event)
      if (nextSelection) {
        onSelectData(nextSelection)
        return
      }
      onClearSelection()
    }

    function handleMouseMove(event: ECElementEvent): void {
      if (isAxisTitleEvent(event)) {
        zr.setCursorStyle('text')
      }
    }

    function handleMouseOver(event: ECElementEvent): void {
      const axisTitleEdit = createAxisTitleEditFromEvent(event)
      if (axisTitleEdit && container) {
        onHoverAxisTitle(offsetAxisTitleEdit(axisTitleEdit, container))
      }
    }

    function handleMouseOut(event: ECElementEvent): void {
      if (isAxisTitleEvent(event)) {
        onHoverAxisTitle(null)
      }
    }

    instance.on('click', handleClick)
    instance.on('brushEnd', handleBrushEnd)
    instance.on('mousemove', handleMouseMove)
    instance.on('mouseout', handleMouseOut)
    instance.on('mouseover', handleMouseOver)
    zr.on('click', handleBackgroundClick)
    return () => {
      instance.off('click', handleClick)
      instance.off('brushEnd', handleBrushEnd)
      instance.off('mousemove', handleMouseMove)
      instance.off('mouseout', handleMouseOut)
      instance.off('mouseover', handleMouseOver)
      zr.off('click', handleBackgroundClick)
    }
  }, [
    chart,
    dataset,
    onClearSelection,
    onEditAxisTitle,
    onHoverAxisTitle,
    onSelectData,
    selection,
  ])

  useEffect(() => {
    if (isLoading) {
      chartRef.current?.showLoading('default', {
        text: 'Loading chart...',
        maskColor: 'rgba(255, 255, 255, 0)',
      })
    } else {
      chartRef.current?.hideLoading()
    }
  }, [isLoading])

  return (
    <>
      <div className="echart-canvas" ref={containerRef} />
      {error && (
        <div className="chart-query-error" role="alert">
          {error}
        </div>
      )}
    </>
  )
}

export default EChartCanvas
