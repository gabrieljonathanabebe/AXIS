import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { useEffect, useRef } from 'react'
import { createEChartOption } from '../chart/createEChartOption'
import type { ChartInstance, Dataset } from '../types/chart'

type EChartCanvasProps = {
  chart: ChartInstance
  dataset: Dataset
}

function readChartTokens() {
  const styles = getComputedStyle(document.documentElement)
  return {
    accent: styles.getPropertyValue('--color-accent').trim(),
    axis: styles.getPropertyValue('--border-axis').trim(),
    textMuted: styles.getPropertyValue('--color-text-muted').trim(),
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
      createEChartOption(chart.type, chart.spec, dataset, readChartTokens()),
      true,
    )
  }, [chart, dataset])

  return <div className="echart-canvas" ref={containerRef} />
}

export default EChartCanvas
