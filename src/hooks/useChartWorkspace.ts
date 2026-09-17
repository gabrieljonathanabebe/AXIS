import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { ActiveDrag, DragPayload } from '../types/ui'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { getChartDefinition } from '../chart/chartDefinitions'
import { getDefaultEncoding } from '../chart/getDefaultEncoding'
import { createDemoDataset } from '../data/createDemoDataset'
import type { DatasetSummary } from '../api/datasets'
import type {
  Aggregation,
  ChartAppearance,
  ChartConfig,
  ChartEncoding,
  ChartType,
  DataField,
  Dataset,
} from '../types/chart'

const defaultAppearance: ChartAppearance = {
  color: '#1e90ff',
  showGrid: true,
  showTooltip: true,
  animation: true,
  scatter: {
    pointSize: 10,
    opacity: 0.9,
  },
  line: {
    lineWidth: 3,
    smooth: false,
    showSymbol: true,
  },
  bar: {
    borderRadius: 4,
    barWidth: 24,
  },
}

type UseChartWorkspaceParams = {
  dataset?: Dataset | null
}

export function useChartWorkspace({
  dataset: externalDataset,
}: UseChartWorkspaceParams = {}) {
  const [demoDataset] = useState<Dataset>(() => createDemoDataset())
  const dataset = externalDataset ?? demoDataset
  const [activeDatasetSummary, setActiveDatasetSummary] =
    useState<DatasetSummary | null>(null)
  const [selectedField, setSelectedField] = useState<DataField | null>(null)
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null)
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    encoding: {},
    appearance: defaultAppearance,
  })
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  function selectChartType(type: ChartType) {
    const definition = getChartDefinition(type)
    setChartConfig((currentConfig) => ({
      type,
      encoding: getDefaultEncoding(type, dataset),
      aggregate: definition.defaultAggregation,
      appearance: currentConfig.appearance,
    }))
  }

  function setAppearance<TKey extends keyof ChartAppearance>(
    key: TKey,
    value: ChartAppearance[TKey],
  ): void {
    setChartConfig((currentConfig) => ({
      ...currentConfig,
      appearance: {
        ...currentConfig.appearance,
        [key]: value,
      },
    }))
  }

  function assignFieldToAxis(axis: keyof ChartEncoding, field: DataField) {
    setChartConfig((currentConfig) => ({
      ...currentConfig,
      encoding: {
        ...currentConfig.encoding,
        [axis]: field,
      },
    }))
  }

  function setEncodingField(axis: keyof ChartEncoding, fieldName: string) {
    const field = dataset.fields.find((field) => field.name === fieldName)
    if (!field) {
      return
    }
    assignFieldToAxis(axis, field)
  }

  function setAggregation(aggregate: Aggregation) {
    setChartConfig((currentConfig) => ({
      ...currentConfig,
      aggregate,
    }))
  }

  function getDragPayload(
    event: DragStartEvent | DragEndEvent,
  ): DragPayload | null {
    return event.active.data.current?.payload ?? null
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDrag(getDragPayload(event))
  }

  function handleDragEnd(event: DragEndEvent) {
    const payload = getDragPayload(event)
    const overId = String(event.over?.id)
    setActiveDrag(null)
    if (payload?.kind === 'chart-type' && overId === 'chart-drop-zone') {
      selectChartType(payload.chartType)
      return
    }
    if (payload?.kind === 'field') {
      if (overId === 'axis:x') {
        assignFieldToAxis('x', payload.field)
      }
      if (overId === 'axis:y') {
        assignFieldToAxis('y', payload.field)
      }
    }
  }

  function setChartAppearance<
    TChartKey extends 'scatter' | 'line' | 'bar',
    TOptionKey extends keyof ChartAppearance[TChartKey],
  >(
    chartKey: TChartKey,
    optionKey: TOptionKey,
    value: ChartAppearance[TChartKey][TOptionKey],
  ): void {
    setChartConfig((currentConfig) => ({
      ...currentConfig,
      appearance: {
        ...currentConfig.appearance,
        [chartKey]: {
          ...currentConfig.appearance[chartKey],
          [optionKey]: value,
        },
      },
    }))
  }

  function resetChart() {
    setChartConfig({
      encoding: {},
      appearance: defaultAppearance,
    })
  }
  return {
    activeDrag,
    activeDatasetSummary,
    chartConfig,
    dataset,
    handleDragEnd,
    handleDragStart,
    resetChart,
    selectedField,
    selectChartType,
    sensors,
    setActiveDatasetSummary,
    setAggregation,
    setAppearance,
    setChartAppearance,
    setEncodingField,
    setSelectedField,
  }
}
