import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { useEffect, useRef } from 'react'

import { createEChartOption } from '../chart/createEChartOption'
import type { ChartInstance, Dataset } from '../types/chart'

import type { ChartTheme } from '../chart/chartTheme'

type EChartCanvasProps = {
  chart: ChartInstance
  dataset: Dataset
}

function readToken(styles: CSSStyleDeclaration, name: string): string {
  return styles.getPropertyValue(name).trim()
}

function readNumberToken(styles: CSSStyleDeclaration, name: string): number {
  return Number.parseFloat(readToken(styles, name))
}

function readChartTheme(): ChartTheme {
  const styles = getComputedStyle(document.documentElement)

  return {
    accent: readToken(styles, '--color-accent'),
    axis: readToken(styles, '--border-axis'),
    text: readToken(styles, '--color-text'),
    textMuted: readToken(styles, '--color-text-muted'),
    tooltip: {
      background: readToken(styles, '--chart-tooltip-background'),
      borderColor: readToken(styles, '--chart-tooltip-border'),
      borderWidth: readNumberToken(styles, '--chart-tooltip-border-width'),
      fontSize: readNumberToken(styles, '--chart-tooltip-font-size'),
      blur: readToken(styles, '--chart-tooltip-blur'),
      radius: readToken(styles, '--chart-tooltip-radius'),
      shadow: readToken(styles, '--chart-tooltip-shadow'),
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
