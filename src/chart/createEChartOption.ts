import type { EChartsOption } from "echarts";
import type { ChartConfig, Dataset } from "../types/chart";

type ChartsTokens = {
  accent: string
  axis: string,
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
  return typeof value === "number" ? value : 0
}

function aggregateSumByXValue(
  rows: Dataset["rows"],
  xFieldName: string,
  yFieldName: string,
) {
  const groupedValues = new Map<string, number>()
  rows.forEach((row) => {
    const xValue = String(getValue(row, xFieldName) ?? "")
    const value = toNumber(getValue(row, yFieldName))
    groupedValues.set(xValue, (groupedValues.get(xValue) ?? 0) + value)
  })
  return {
    categories: Array.from(groupedValues.keys()),
    data: Array.from(groupedValues.values()),
  }
}

export function createEChartOption(
  chartConfig: ChartConfig,
  dataset: Dataset,
  tokens: ChartsTokens,
): EChartsOption {
  const chartType = chartConfig.type ?? "scatter"
  const xField = chartConfig.encoding.x
  const yField = chartConfig.encoding.y
  const shouldAggregate =
    chartType !== "scatter" &&
    chartConfig.aggregate === "sum" &&
    xField?.name &&
    yField?.name
  const aggregated =
    shouldAggregate
      ? aggregateSumByXValue(dataset.rows, xField.name, yField.name)
      : null
  const categories =
    aggregated?.categories ??
    dataset.rows.map((row) => String(getValue(row, xField?.name) ?? ""))
  const data =
    aggregated?.data ??
    (chartType === "scatter"
      ? dataset.rows.map((row) => [
        getValue(row, xField?.name),
        getValue(row, yField?.name),
      ])
      : dataset.rows.map((row) => getValue(row, yField?.name)))

  return {
    backgroundColor: "transparent",
    animation: true,
    xAxis: {
      type: chartType === "scatter" ? "value" : "category",
      data: chartType === "scatter" ? undefined : categories,
      name: xField?.name ?? "",
      nameLocation: "middle",
      nameGap: 32,
      axisLabel: {
        color: tokens.textMuted,
      },
      splitLine: {
        lineStyle: {
          color: tokens.axis,
          opacity: 0.25,
        }
      }
    },
    yAxis: {
      type: 'value',
      name: yField?.name ?? "",
      nameLocation: "middle",
      nameGap: 48,
      axisLabel: {
        color: tokens.textMuted,
      },
      splitLine: {
        lineStyle: {
          color: tokens.axis,
          opacity: 0.25,
        },
      },
    },
    series: [
      {
        type: chartType,
        data,
        itemStyle: {
          color: tokens.accent,
        },
        lineStyle: {
          color: tokens.accent
        },
      }
    ]
  }
}