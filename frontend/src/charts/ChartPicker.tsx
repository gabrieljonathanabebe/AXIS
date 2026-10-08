import { Ellipsis } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'

import { chartDefinitionList, getChartDefinition } from './chartDefinitions'
import WidgetButton from '../shared/ui/WidgetButton'

import type { ChartType } from './types'

type ChartPickerProps = {
  onSelectChartType: (type: ChartType) => void
}

type ChartTypeOptionContentProps = {
  type: ChartType
}

type DraggableChartTypeProps = {
  type: ChartType
  label: string
  onSelectChartType: (type: ChartType) => void
}

export function ChartTypeOptionContent({ type }: ChartTypeOptionContentProps) {
  const { label, icon: Icon } = getChartDefinition(type)

  return (
    <>
      <Icon size={20} />
      <span className="chart-type-option-label">{label}</span>
    </>
  )
}

function DraggableChartType({
  type,
  label,
  onSelectChartType,
}: DraggableChartTypeProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `chart-type:${type}`,
    data: {
      payload: {
        kind: 'chart-type',
        chartType: type,
      },
    },
  })

  return (
    <WidgetButton
      ref={setNodeRef}
      aria-label={`Add ${label} chart`}
      title={`Add ${label} chart`}
      className={`chart-type-option stack center ${isDragging ? 'is-dragging' : ''}`}
      onClick={() => onSelectChartType(type)}
      {...listeners}
      {...attributes}
    >
      <ChartTypeOptionContent type={type} />
    </WidgetButton>
  )
}

function ChartPicker({ onSelectChartType }: ChartPickerProps) {
  return (
    <div className="chart-type-picker auto-grid">
      {chartDefinitionList.map(({ type, label }) => (
        <DraggableChartType
          type={type}
          label={label}
          onSelectChartType={onSelectChartType}
          key={type}
        />
      ))}
      <WidgetButton
        aria-label="More visuals"
        title="More visuals coming soon"
        className="chart-type-option chart-type-more stack center"
        disabled
      >
        <Ellipsis size={20} />
        <span className="chart-type-option-label">More</span>
      </WidgetButton>
    </div>
  )
}

export default ChartPicker
