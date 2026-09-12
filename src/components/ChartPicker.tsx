import { ChartColumn, ChartLine, ChartScatter } from 'lucide-react'
import type { ChartType } from '../types/chart'
import WidgetButton from './ui/WidgetButton'

type ChartTypePickerProps = {
  onSelectChartType: (type: ChartType) => void
}

const chartTypes: { type: ChartType; label: string; icon: typeof ChartScatter }[] = [
  { type: 'scatter', label: 'Scatter', icon: ChartScatter },
  { type: 'line', label: 'Line', icon: ChartLine },
  { type: 'bar', label: 'Bar', icon: ChartColumn },
]

function ChartTypePicker({ onSelectChartType }: ChartTypePickerProps) {
  return (
    <div className="chart-type-picker">
      {chartTypes.map(({ type, label, icon: Icon }) => (
        <WidgetButton
          className="chart-type-option"
          key={type}
          onClick={() => onSelectChartType(type)}
        >
          <Icon size={22} />
          <span>{label}</span>
        </WidgetButton>
      ))}
    </div>
  )
}

export default ChartTypePicker