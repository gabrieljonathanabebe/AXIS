import {
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
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
  const [activeDragField, setActiveDragField] = useState<DataField | null>(null)
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

  function findFieldByDragId(id: string) {
    const fieldName = id.replace('field:', '')
    return dataset.fields.find((field) => field.name === fieldName)
  }

  function handleDragStart(event: DragStartEvent) {
    const field = findFieldByDragId(String(event.active.id))
    setActiveDragField(field ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragField(null)
    const field = findFieldByDragId(String(event.active.id))
    const axis = String(event.over?.id)
    if (!field) {
      return
    }
    if (axis === 'axis:x') {
      assignFieldToAxis('x', field)
    }
    if (axis === 'axis:y') {
      assignFieldToAxis('y', field)
    }
  }

  function resetChart() {
    setChartConfig({
      encoding: {},
    })
  }
  return {
    activeDragField,
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