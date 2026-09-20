import { ChartColumn, ChartLine, ChartScatter } from 'lucide-react'
import type { ChartType } from '../../types/chart'
import { useDraggable } from '@dnd-kit/core'
import WidgetButton from '../ui/WidgetButton'

type ChartPickerProps = {
  onSelectChartType: (type: ChartType) => void
}

const chartTypes: {
  type: ChartType
  label: string
  icon: typeof ChartScatter
}[] = [
  { type: 'scatter', label: 'Scatter', icon: ChartScatter },
  { type: 'line', label: 'Line', icon: ChartLine },
  { type: 'bar', label: 'Bar', icon: ChartColumn },
]

type DraggableChartTypeProps = {
  type: ChartType
  label: string
  icon: typeof ChartScatter
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
      {chartTypes.map(({ type, label, icon }) => (
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
