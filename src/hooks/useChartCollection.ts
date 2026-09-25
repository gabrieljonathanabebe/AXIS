import { useState } from 'react'
import {
  createChartInstance,
  createDefaultChartSpec,
} from '../chart/createChartInstance'
import type { ChartInstance, ChartType, Dataset } from '../types/chart'

type ChartUpdater = (chart: ChartInstance) => ChartInstance

export function useChartCollection(dataset: Dataset) {
  const [charts, setCharts] = useState<ChartInstance[]>([])
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null)
  const selectedChart =
    charts.find((chart) => chart.id === selectedChartId) ?? null

  function updateChart(chartId: string, updater: ChartUpdater): void {
    setCharts((currentCharts) =>
      currentCharts.map((chart) => {
        return chart.id === chartId ? updater(chart) : chart
      }),
    )
  }

  function updateSelectedChart(updater: ChartUpdater): void {
    if (!selectedChartId) {
      return
    }
    updateChart(selectedChartId, updater)
  }

  function selectChart(chartId: string): void {
    const chartExists = charts.some((chart) => chart.id === chartId)
    if (chartExists) {
      setSelectedChartId(chartId)
    }
  }

  function selectChartType(type: ChartType): void {
    if (!selectedChartId) {
      const chart = createChartInstance({
        type,
        dataset,
      })
      setCharts((currentCharts) => [...currentCharts, chart])
      setSelectedChartId(chart.id)
      return
    }
    const defaultSpec = createDefaultChartSpec(type, dataset)
    updateSelectedChart((chart) => ({
      ...chart,
      type,
      spec: {
        ...chart.spec,
        appearance: {
          ...chart.spec.appearance,
          labels: {
            ...chart.spec.appearance.labels,
            position: defaultSpec.appearance.labels.position,
          },
        },
        data: defaultSpec.data,
        interaction: {
          ...chart.spec.interaction,
          tooltip: {
            ...chart.spec.interaction.tooltip,
            trigger: defaultSpec.interaction.tooltip.trigger,
          },
        },
      },
    }))
  }

  function removeSelectedChart(): void {
    if (!selectedChartId) {
      return
    }
    setCharts((currentCharts) => {
      return currentCharts.filter((chart) => chart.id !== selectedChartId)
    })
    setSelectedChartId(null)
  }

  return {
    charts,
    selectedChart,
    selectedChartId,
    removeSelectedChart,
    selectChart,
    selectChartType,
    updateChart,
    updateSelectedChart,
  }
}
