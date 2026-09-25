import { useDraggable } from '@dnd-kit/core'
import type { LucideIcon } from 'lucide-react'

import { chartDefinitionList } from '../../chart/chartDefinitions'
import WidgetButton from '../ui/WidgetButton'

import type { ChartType } from '../../types/chart'

type ChartPickerProps = {
  onSelectChartType: (type: ChartType) => void
}

type DraggableChartTypeProps = {
  type: ChartType
  label: string
  icon: LucideIcon
  onSelectChartType: (type: ChartType) => void
}

function DraggableChartType({
  type,
  label,
  icon: Icon,
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
      className={`chart-type-option stack center ${isDragging ? 'is-dragging' : ''}`}
      onClick={() => onSelectChartType(type)}
      {...listeners}
      {...attributes}
    >
      <Icon size={22} />
      <span>{label}</span>
    </WidgetButton>
  )
}

function ChartPicker({ onSelectChartType }: ChartPickerProps) {
  return (
    <div className="chart-type-picker auto-grid">
      {chartDefinitionList.map(({ type, label, icon }) => (
        <DraggableChartType
          type={type}
          label={label}
          icon={icon}
          onSelectChartType={onSelectChartType}
          key={type}
        />
      ))}
    </div>
  )
}

export default ChartPicker
