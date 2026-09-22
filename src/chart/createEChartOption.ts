import type { EChartsOption } from 'echarts'

import type {
  ChartSpec,
  ChartType,
  Dataset,
  LabelFontWeight,
} from '../types/chart'
import type { ChartQueryResult } from '../api/chartQuery'
import type { ChartTheme } from './chartTheme'
import { createAxisLabelFormatter } from './createAxisLabelFormatter'
import { createScatterVisualMaps } from './createScatterVisualMaps'

type ChartValue = string | number | null | undefined

function getValue(row: Record<string, ChartValue>, fieldName?: string) {
  if (!fieldName) {
    return null
  }
  return row[fieldName]
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

const labelFontWeights = {
  light: 300,
  medium: 500,
  bold: 700,
} satisfies Record<LabelFontWeight, number>

export function createEChartOption(
  chartType: ChartType,
  spec: ChartSpec,
  dataset: Dataset,
  theme: ChartTheme,
  queryResult: ChartQueryResult | null,
): EChartsOption {
  // CONSTANTS
  const { data: dataSpec, appearance, interaction } = spec
  const xField = dataSpec.encoding.x
  const yField = dataSpec.encoding.y
  const defaultTitle = getDefaultChartTitle(
    chartType,
    xField?.name,
    yField?.name,
  )

  const points = queryResult?.points ?? []
  const categories =
    chartType === 'scatter'
      ? []
      : Array.from(new Set(points.map((point) => point.x ?? '')))

  const sizeFieldName = dataSpec.encoding.size?.name
  const colorFieldName = dataSpec.encoding.color?.name
  const scatterData = dataset.rows.map((row) => [
    getValue(row, xField?.name),
    getValue(row, yField?.name),
    getValue(row, sizeFieldName),
    getValue(row, colorFieldName),
  ])
  const scatterColorField = dataSpec.encoding.color
  const scatterCategories =
    chartType === 'scatter' &&
    scatterColorField?.semantic_type === 'categorical'
      ? Array.from(
          new Set(
            dataset.rows.map((row) =>
              String(row[scatterColorField.name] ?? '(empty)'),
            ),
          ),
        )
      : []
  const scatterVisualMaps =
    chartType === 'scatter'
      ? createScatterVisualMaps({
          rows: dataset.rows,
          encoding: dataSpec.encoding,
          appearance,
        })
      : []

  const hasLineSeries =
    chartType === 'line' && Boolean(dataSpec.encoding.series)

  const seriesAppearance =
    chartType === 'scatter'
      ? {
          encode: {
            x: 0,
            y: 1,
          },
          symbol: appearance.scatter.symbol,
          symbolSize: sizeFieldName ? undefined : appearance.scatter.pointSize,
          itemStyle: {
            color: colorFieldName ? undefined : appearance.color,
            opacity: appearance.scatter.opacity,
          },
        }
      : chartType === 'line'
        ? {
            smooth: appearance.line.smooth,
            showSymbol: appearance.line.showSymbol,
            lineStyle: {
              color: hasLineSeries ? undefined : appearance.color,
              width: appearance.line.lineWidth,
              type: appearance.line.lineStyle,
            },
            areaStyle: appearance.line.areaFill
              ? {
                  color: appearance.line.areaColor,
                  opacity: appearance.line.areaOpacity,
                }
              : undefined,
            itemStyle: {
              color: hasLineSeries ? undefined : appearance.color,
            },
          }
        : {
            barWidth: appearance.bar.barWidth,
            itemStyle: {
              color: appearance.color,
              borderRadius: appearance.bar.borderRadius,
            },
          }
  const seriesNames = dataSpec.encoding.series
    ? Array.from(new Set(points.map((point) => point.series)))
    : [null]

  const chartSeries = seriesNames.map((name) => {
    const values = new Map(
      points
        .filter((point) => point.series === name)
        .map((point) => [point.x ?? '', point.value]),
    )
    return {
      type: chartType,
      name: name ?? undefined,
      data: categories.map((category) => values.get(category) ?? null),
      label: {
        show: appearance.labels.enabled,
        position: appearance.labels.position,
        color: appearance.labels.color,
        fontSize: appearance.labels.fontSize,
        fontWeight: labelFontWeights[appearance.labels.fontWeight],
      },
      ...seriesAppearance,
    }
  })

  const scatterCategorySeries = scatterCategories.map((name, index) => ({
    type: 'scatter' as const,
    name,
    data: scatterData.filter((_, rowIndex) => {
      const value = dataset.rows[rowIndex][scatterColorField!.name]
      return String(value ?? '(empty)') === name
    }),
    label: {
      show: appearance.labels.enabled,
      position: appearance.labels.position,
      color: appearance.labels.color,
      fontSize: appearance.labels.fontSize,
      fontWeight: labelFontWeights[appearance.labels.fontWeight],
    },
    ...seriesAppearance,
    itemStyle: {
      color:
        appearance.colorScale.categorical.palette[
          index % appearance.colorScale.categorical.palette.length
        ],
      opacity: appearance.scatter.opacity,
    },
  }))

  const legendPosition = appearance.legend.position
  const legendAlignment = appearance.legend.alignment
  const legendVertical = legendPosition === 'left' || legendPosition === 'right'

  return {
    color: hasLineSeries
      ? appearance.colorScale.categorical.palette
      : [appearance.color],
    legend: {
      show:
        appearance.legend.visible &&
        (Boolean(dataSpec.encoding.series) || scatterCategories.length > 0),
      textStyle: {
        color: appearance.legend.textColor,
        fontSize: appearance.legend.fontSize,
      },
      selectedMode: interaction.legend.enabled
        ? interaction.legend.selectionMode
        : false,
      itemGap: appearance.legend.gap,
      orient: legendVertical ? 'vertical' : 'horizontal',
      top:
        legendPosition === 'top'
          ? 8
          : legendVertical && legendAlignment === 'start'
            ? 56
            : legendVertical && legendAlignment === 'center'
              ? 'middle'
              : undefined,
      bottom:
        legendPosition === 'bottom'
          ? 8
          : legendVertical && legendAlignment === 'end'
            ? 56
            : undefined,
      left:
        legendPosition === 'left'
          ? 8
          : !legendVertical && legendAlignment === 'start'
            ? 72
            : !legendVertical && legendAlignment === 'center'
              ? 'center'
              : undefined,
      right:
        legendPosition === 'right'
          ? 8
          : !legendVertical && legendAlignment === 'end'
            ? 56
            : undefined,
    },
    backgroundColor: 'transparent',
    animation: interaction.animation.enabled,
    animationDuration: interaction.animation.duration,
    animationEasing: interaction.animation.easing,
    visualMap: scatterVisualMaps.length > 0 ? scatterVisualMaps : undefined,
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
        color: theme.text,
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
    series:
      chartType === 'scatter'
        ? scatterCategorySeries.length > 0
          ? scatterCategorySeries
          : [{ ...chartSeries[0], data: scatterData }]
        : chartSeries,
  }
}
