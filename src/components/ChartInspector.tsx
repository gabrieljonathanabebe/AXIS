import { ChartColumn, ChartLine, ChartScatter } from 'lucide-react'
import DropdownField from './ui/DropdownField'
import IconButton from './ui/IconButton'
import type {
  Aggregation,
  ChartConfig,
  ChartEncoding,
  ChartType,
  DataField,
} from '../types/chart'

type ChartInspectorProps = {
  chartConfig: ChartConfig
  fields: DataField[]
  onSelectChartType: (type: ChartType) => void
  onSetAggregation: (aggregation: Aggregation) => void
  onSetEncodingField: (axis: keyof ChartEncoding, fieldName: string) => void
}

const chartTypeOptions = [
  { label: 'Scatter', value: 'scatter', icon: ChartScatter },
  { label: 'Line', value: 'line', icon: ChartLine },
  { label: 'Bar', value: 'bar', icon: ChartColumn },
] satisfies { label: string; value: ChartType; icon: typeof ChartScatter }[]

const aggregationOptions = [
  { label: 'None', value: 'none' },
  { label: 'Sum', value: 'sum' },
  { label: 'Mean', value: 'mean' },
  { label: 'Median', value: 'median' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Count', value: 'count' },
] satisfies { label: string; value: Aggregation }[]

function ChartInspector({
  chartConfig,
  fields,
  onSelectChartType,
  onSetAggregation,
  onSetEncodingField,
}: ChartInspectorProps) {
  const fieldOptions = fields.map((field) => ({
    label: field.name,
    value: field.name,
  }))
  return (
    <div className="stack">
      <div className="chart-type-control cluster">
        {chartTypeOptions.map(({ label, value, icon: Icon }) => (
          <IconButton
            isActive={chartConfig.type === value}
            label={label}
            onClick={() => onSelectChartType(value)}
            key={value}
          >
            <Icon size={18} />
          </IconButton>
        ))}
      </div>
      <div className="settings-divider" />
      <DropdownField
        label='X Axis'
        options={fieldOptions}
        value={chartConfig.encoding.x?.name ?? ''}
        placeholder="Select field"
        onChange={(fieldName) => onSetEncodingField('x', fieldName)}
      />
      <DropdownField
        label="Y Axis"
        options={fieldOptions}
        value={chartConfig.encoding.y?.name ?? ''}
        placeholder="Select field"
        onChange={(fieldName) => onSetEncodingField('y', fieldName)}
      />
      <DropdownField
        label="Aggregation"
        options={aggregationOptions}
        value={chartConfig.aggregate ?? 'none'}
        onChange={onSetAggregation}
      />
    </div>
  )
}

export default ChartInspector