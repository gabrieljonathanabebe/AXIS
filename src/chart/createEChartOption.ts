import type { EChartsOption } from 'echarts'

import type { ChartSpec, ChartType, Dataset } from '../types/chart'
import type { ChartTheme } from './chartTheme'
import { createAxisLabelFormatter } from './createAxisLabelFormatter'

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

function getDefaultChartTitle(
  chartType: ChartType,
  xFieldName?: string,
  yFieldName?: string,
): string {
  if (!xFieldName && !yFieldName) {
    return 'Untitled chart'
  }

  const xLabel = xFieldName ?? 'Category'
  const yLabel = yFieldName ?? 'Value'

  if (chartType === 'scatter') {
    return `${yLabel} vs. ${xLabel}`
  }

  return `${yLabel} by ${xLabel}`
}

export function createEChartOption(
  chartType: ChartType,
  spec: ChartSpec,
  dataset: Dataset,
  theme: ChartTheme,
): EChartsOption {
  const { data: dataSpec, appearance, interaction } = spec
  const xField = dataSpec.encoding.x
  const yField = dataSpec.encoding.y
  const defaultTitle = getDefaultChartTitle(
    chartType,
    xField?.name,
    yField?.name,
  )
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
    animationDuration: interaction.animation.duration,
    animationEasing: interaction.animation.easing,
    tooltip: {
      show: interaction.tooltip.enabled,
      trigger: interaction.tooltip.trigger,
      showDelay: interaction.tooltip.delay,
      backgroundColor: theme.tooltip.background,
      borderColor: theme.tooltip.borderColor,
      borderWidth: theme.tooltip.borderWidth,
      textStyle: {
        color: theme.text,
        fontSize: theme.tooltip.fontSize,
      },
      extraCssText: [
        `backdrop-filter: blur(${theme.tooltip.blur})`,
        `border-radius: ${theme.tooltip.radius}`,
        `box-shadow: ${theme.tooltip.shadow}`,
      ].join(';'),
    },
    grid: {
      top: 56,
      right: 56,
      bottom: 72,
      left: 72,
      containLabel: false,
    },
    dataZoom: interaction.zoom.enabled
      ? [
          ...(interaction.zoom.inside
            ? [
                {
                  type: 'inside' as const,
                },
              ]
            : []),
          ...(interaction.zoom.slider
            ? [
                {
                  type: 'slider' as const,
                },
              ]
            : []),
        ]
      : undefined,
    title: {
      show: appearance.title.enabled,
      text: appearance.title.text.trim() || defaultTitle,
      left: appearance.title.alignment,
      top: 16,
      textStyle: {
        color: theme.axis,
        fontSize: 16,
        fontWeight: 600,
      },
    },
    xAxis: {
      show: appearance.xAxis.enabled,
      type: chartType === 'scatter' ? 'value' : 'category',
      data: chartType === 'scatter' ? undefined : categories,
      name: appearance.xAxis.title.trim() || xField?.name || '',
      nameLocation: 'middle',
      nameGap: 32,
      min: appearance.xAxis.min ?? undefined,
      max: appearance.xAxis.max ?? undefined,
      axisLabel: {
        show: appearance.xAxis.enabled,
        color: theme.textMuted,
        formatter: createAxisLabelFormatter(appearance.xAxis),
      },
      axisLine: {
        show: appearance.xAxis.enabled,
      },
      axisTick: {
        show: appearance.xAxis.enabled,
      },
      splitLine: {
        show: appearance.xAxis.enabled && appearance.grid.enabled,
        lineStyle: {
          color: appearance.grid.color,
          opacity: appearance.grid.opacity,
          type: appearance.grid.lineStyle,
          width: 1,
        },
      },
    },
    yAxis: {
      show: appearance.yAxis.enabled,
      type: 'value',
      name: appearance.yAxis.title.trim() || yField?.name || '',
      nameLocation: 'middle',
      nameGap: 48,
      min: appearance.yAxis.min ?? undefined,
      max: appearance.yAxis.max ?? undefined,
      axisLabel: {
        show: appearance.yAxis.enabled,
        color: theme.textMuted,
        formatter: createAxisLabelFormatter(appearance.yAxis),
      },
      axisLine: {
        show: appearance.yAxis.enabled,
      },
      axisTick: {
        show: appearance.yAxis.enabled,
      },
      splitLine: {
        show: appearance.yAxis.enabled && appearance.grid.enabled,
        lineStyle: {
          color: appearance.grid.color,
          opacity: appearance.grid.opacity,
          type: appearance.grid.lineStyle,
          width: 1,
        },
      },
    },
    series: [
      {
        type: chartType,
        data,
        label: {
          show: appearance.labels.enabled,
          position: appearance.labels.position,
          color: theme.text,
        },
        ...seriesAppearance,
      },
    ],
  }
}
