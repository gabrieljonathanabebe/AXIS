import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { useEffect, useRef } from 'react'
import { createEChartOption } from '../chart/createEChartOption'
import type { ChartConfig, Dataset } from '../types/chart'

type EChartCanvasProps = {
  chartConfig: ChartConfig
  dataset: Dataset
}

function readChartTokens() {
  const styles = getComputedStyle(document.documentElement)
  return {
    accent: styles.getPropertyValue("--color-accent").trim(),
    axis: styles.getPropertyValue("--border-axis").trim(),
    textMuted: styles.getPropertyValue("--color-text-muted").trim(),
  }
}

function EChartCanvas({ chartConfig, dataset }: EChartCanvasProps) {
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
      createEChartOption(chartConfig, dataset, readChartTokens()),
      true
    )
  }, [chartConfig, dataset])

  return <div className="echart-canvas" ref={containerRef} />
}

export default EChartCanvas

