import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import { createDemoDataset } from '../data/createDemoDataset'
import { useChartCollection } from './useChartCollection'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { ActiveDrag, DragPayload } from '../types/ui'
import type {
  Aggregation,
  ChartAppearanceSpec,
  ChartEncoding,
  ChartInteractionSpec,
  DataField,
  Dataset,
} from '../types/chart'

type UseChartWorkspaceParams = {
  dataset?: Dataset | null
}

export function useChartWorkspace({
  dataset: externalDataset,
}: UseChartWorkspaceParams = {}) {
  const [demoDataset] = useState<Dataset>(() => createDemoDataset())
  const dataset = externalDataset ?? demoDataset

  const {
    charts,
    selectedChart,
    selectedChartId,
    removeSelectedChart,
    selectChart,
    selectChartType,
    updateChart,
    updateSelectedChart,
  } = useChartCollection(dataset)

  const [selectedField, setSelectedField] = useState<DataField | null>(null)
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  function updateAppearance<TKey extends keyof ChartAppearanceSpec>(
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ): void {
    updateSelectedChart((chart) => ({
      ...chart,
      spec: {
        ...chart.spec,
        appearance: {
          ...chart.spec.appearance,
          [key]: value,
        },
      },
    }))
  }

  function updateInteraction<TKey extends keyof ChartInteractionSpec>(
    key: TKey,
    value: ChartInteractionSpec[TKey],
  ): void {
    updateSelectedChart((chart) => ({
      ...chart,
      spec: {
        ...chart.spec,
        interaction: {
          ...chart.spec.interaction,
          [key]: value,
        },
      },
    }))
  }

  function assignFieldToEncoding(
    key: keyof ChartEncoding,
    field: DataField | undefined,
  ): void {
    updateSelectedChart((chart) => ({
      ...chart,
      spec: {
        ...chart.spec,
        data: {
          ...chart.spec.data,
          encoding: {
            ...chart.spec.data.encoding,
            [key]: field,
          },
        },
      },
    }))
  }

  function setEncodingField(
    axis: keyof ChartEncoding,
    fieldName: string,
  ): void {
    const field = dataset.fields.find((field) => field.name === fieldName)
    if (!field) {
      return
    }
    assignFieldToEncoding(axis, field)
  }

  function setAggregation(aggregation: Aggregation): void {
    updateSelectedChart((chart) => ({
      ...chart,
      spec: {
        ...chart.spec,
        data: {
          ...chart.spec.data,
          aggregation,
        },
      },
    }))
  }

  function setChartAppearance<
    TChartKey extends 'scatter' | 'line' | 'bar',
    TOptionKey extends keyof ChartAppearanceSpec[TChartKey],
  >(
    chartKey: TChartKey,
    optionKey: TOptionKey,
    value: ChartAppearanceSpec[TChartKey][TOptionKey],
  ): void {
    updateSelectedChart((chart) => ({
      ...chart,
      spec: {
        ...chart.spec,
        appearance: {
          ...chart.spec.appearance,
          [chartKey]: {
            ...chart.spec.appearance[chartKey],
            [optionKey]: value,
          },
        },
      },
    }))
  }

  function getDragPayload(
    event: DragStartEvent | DragEndEvent,
  ): DragPayload | null {
    return event.active.data.current?.payload ?? null
  }

  function handleDragStart(event: DragStartEvent): void {
    setActiveDrag(getDragPayload(event))
  }

  function handleDragEnd(event: DragEndEvent): void {
    const payload = getDragPayload(event)
    const overId = String(event.over?.id)
    setActiveDrag(null)
    if (payload?.kind === 'chart-type' && overId === 'chart-drop-zone') {
      selectChartType(payload.chartType)
      return
    }
    if (payload?.kind === 'field') {
      if (overId === 'axis:x') {
        assignFieldToEncoding('x', payload.field)
      }
      if (overId === 'axis:y') {
        assignFieldToEncoding('y', payload.field)
      }
    }
  }

  return {
    activeDrag,
    charts,
    dataset,
    handleDragEnd,
    handleDragStart,
    resetChart: removeSelectedChart,
    selectedChart,
    selectedChartId,
    selectedField,
    selectChart,
    selectChartType,
    sensors,
    setAggregation,
    setChartAppearance,
    setEncodingField,
    setSelectedField,
    updateAppearance,
    updateChart,
    updateInteraction,
    updateSelectedChart,
  }
}
