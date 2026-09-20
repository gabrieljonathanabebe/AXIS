import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { useEffect, useRef } from 'react'

import { createEChartOption } from '../../chart/createEChartOption'
import type { ChartInstance, Dataset } from '../../types/chart'

import type { ChartTheme } from '../../chart/chartTheme'

type EChartCanvasProps = {
  chart: ChartInstance
  dataset: Dataset
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

function EChartCanvas({ chart, dataset }: EChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<ECharts | null>(null)

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
      createEChartOption(chart.type, chart.spec, dataset, readChartTheme()),
      true,
    )
  }, [chart, dataset])

  return <div className="echart-canvas" ref={containerRef} />
}

export default EChartCanvas
