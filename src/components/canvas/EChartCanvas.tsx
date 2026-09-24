import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { useEffect, useRef } from 'react'

import { createEChartOption } from '../../chart/echarts/createEChartOption'
import { useChartQuery } from '../../hooks/useChartQuery'

import type { ChartInstance, Dataset } from '../../types/chart'
import type { ChartQueryRequest } from '../../api/chartQuery'
import type { ChartTheme } from '../../chart/echarts/chartTheme'

type EChartCanvasProps = {
  chart: ChartInstance
  dataset: Dataset
  datasetId: string | null
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

function EChartCanvas({ chart, dataset, datasetId }: EChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<ECharts | null>(null)
  const { encoding, aggregation, colorAggregation } = chart.spec.data
  const colorField =
    chart.type === 'bar' ? (encoding.color?.name ?? null) : null

  const query: ChartQueryRequest | null =
    chart.type !== 'scatter' &&
    aggregation !== 'none' &&
    encoding.x &&
    encoding.y
      ? {
          x: encoding.x.name,
          y: encoding.y.name,
          series: encoding.series?.name ?? null,
          color: colorField,
          color_aggregation: colorField ? colorAggregation : null,
          aggregation,
        }
      : null

  const { result, isLoading, error } = useChartQuery(datasetId, query)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const chart = echarts.init(containerRef.current)
    chartRef.current = chart

    return () => {
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(
      createEChartOption(
        chart.type,
        chart.spec,
        dataset,
        readChartTheme(),
        result,
      ),
      true,
    )
  }, [chart, dataset, result])

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
