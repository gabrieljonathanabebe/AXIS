import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { ActiveDrag, DragPayload } from '../types/ui'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { getDefaultEncoding } from '../chart/getDefaultEncoding'
import { createDemoDataset } from '../data/createDemoDataset'
import type {
  ChartConfig,
  ChartEncoding,
  ChartType,
  DataField,
  Dataset,
} from '../types/chart'

export function useChartWorkspace() {
  const [dataset] = useState<Dataset>(() => createDemoDataset())
  const [selectedField, setSelectedField] = useState<DataField | null>(null)
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null)
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    encoding: {},
  })
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  function selectChartType(type: ChartType) {
    setChartConfig({
      type,
      encoding: getDefaultEncoding(type, dataset),
      aggregate: type === 'scatter' ? undefined : 'sum',
    })
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

  function getDragPayload(event: DragStartEvent | DragEndEvent): DragPayload | null {
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

  function resetChart() {
    setChartConfig({
      encoding: {},
    })
  }
  return {
    activeDrag,
    chartConfig,
    dataset,
    handleDragEnd,
    handleDragStart,
    resetChart,
    selectedField,
    selectChartType,
    sensors,
    setSelectedField,
  }
}