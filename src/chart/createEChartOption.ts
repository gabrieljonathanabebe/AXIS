import type { EChartsOption } from 'echarts'
import type { ChartSpec, ChartType, Dataset } from '../types/chart'

type ChartsTokens = {
  accent: string
  axis: string
  textMuted: string
}

type ChartValue = string | number | null | undefined

function getValue(row: Record<string, ChartValue>, fieldName?: string) {
  if (!fieldName) {
    return null
  }
  return row[fieldName]
}

function toNumber(value: ChartValue) {
  return typeof value === 'number' ? value : 0
}

function aggregateSumByXValue(
  rows: Dataset['rows'],
  xFieldName: string,
  yFieldName: string,
) {
  const groupedValues = new Map<string, number>()
  rows.forEach((row) => {
    const xValue = String(getValue(row, xFieldName) ?? '')
    const value = toNumber(getValue(row, yFieldName))
    groupedValues.set(xValue, (groupedValues.get(xValue) ?? 0) + value)
  })
  return {
    categories: Array.from(groupedValues.keys()),
    data: Array.from(groupedValues.values()),
  }
}

export function createEChartOption(
  chartType: ChartType,
  spec: ChartSpec,
  dataset: Dataset,
  tokens: ChartsTokens,
): EChartsOption {
  const { data: dataSpec, appearance, interaction } = spec
  const xField = dataSpec.encoding.x
  const yField = dataSpec.encoding.y
  const shouldAggregate =
    chartType !== 'scatter' &&
    dataSpec.aggregation === 'sum' &&
    xField?.name &&
    yField?.name
  const aggregated = shouldAggregate
    ? aggregateSumByXValue(dataset.rows, xField.name, yField.name)
    : null
  const categories =
    aggregated?.categories ??
    dataset.rows.map((row) => String(getValue(row, xField?.name) ?? ''))
  const data =
    aggregated?.data ??
    (chartType === 'scatter'
      ? dataset.rows.map((row) => [
          getValue(row, xField?.name),
          getValue(row, yField?.name),
        ])
      : dataset.rows.map((row) => getValue(row, yField?.name)))

  const seriesAppearance =
    chartType === 'scatter'
      ? {
          symbolSize: appearance.scatter.pointSize,
          itemStyle: {
            color: appearance.color,
            opacity: appearance.scatter.opacity,
          },
        }
      : chartType === 'line'
        ? {
            smooth: appearance.line.smooth,
            showSymbol: appearance.line.showSymbol,
            lineStyle: {
              color: appearance.color,
              width: appearance.line.lineWidth,
            },
            itemStyle: {
              color: appearance.color,
            },
          }
        : {
            barWidth: appearance.bar.barWidth,
            itemStyle: {
              color: appearance.color,
              borderRadius: appearance.bar.borderRadius,
            },
          }

  return {
    color: [appearance.color],
    backgroundColor: 'transparent',
    animation: interaction.animation.enabled,
    tooltip: {
      show: interaction.tooltip.enabled,
      trigger: chartType === 'scatter' ? 'item' : 'axis',
      backgroundColor: 'rgba(10, 14, 22, 0.92)',
      borderColor: 'rgba(30, 144, 255, 0.45)',
      borderWidth: 1,
      textStyle: {
        color: '#f5f7fb',
        fontSize: 13,
      },
      extraCssText: [
        'backdrop-filter: blur(18px)',
        'border-radius: 14px',
        'box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35)',
      ].join(';'),
    },
    grid: {
      top: 56,
      right: 56,
      bottom: 72,
      left: 72,
      containLabel: false,
    },
    xAxis: {
      type: chartType === 'scatter' ? 'value' : 'category',
      data: chartType === 'scatter' ? undefined : categories,
      name: xField?.name ?? '',
      nameLocation: 'middle',
      nameGap: 32,
      axisLabel: {
        color: tokens.textMuted,
      },
      splitLine: {
        show: appearance.showGrid,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.08)',
          width: 1,
          opacity: 0.25,
        },
      },
    },
    yAxis: {
      type: 'value',
      name: yField?.name ?? '',
      nameLocation: 'middle',
      nameGap: 48,
      axisLabel: {
        color: tokens.textMuted,
      },
      splitLine: {
        show: appearance.showGrid,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.08)',
          width: 1,
          opacity: 0.25,
        },
      },
    },
    series: [
      {
        type: chartType,
        data,
        ...seriesAppearance,
      },
    ],
  }
}
