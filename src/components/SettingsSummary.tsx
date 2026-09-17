import type { Aggregation, ChartConfig } from '../types/chart'
import DropdownField from './ui/DropdownField'

type SettingsSummaryProps = {
  chartConfig: ChartConfig
  onSetAggregation: (aggregation: Aggregation) => void
}

const aggregationOptions = [
  { label: 'None', value: 'none' },
  { label: 'Sum', value: 'sum' },
  { label: 'Mean', value: 'mean' },
  { label: 'Median', value: 'median' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Count', value: 'count' },
] satisfies { label: string; value: Aggregation }[]

function SettingsSummary({
  chartConfig,
  onSetAggregation,
}: SettingsSummaryProps) {
  return (
    <div className="stack">
      <div className="spread">
        <span>Chart Type</span>
        <strong className="text-strong">{chartConfig.type ?? 'empty'}</strong>
      </div>

      <div className="spread">
        <span>X</span>
        <strong className="text-strong">
          {chartConfig.encoding.x?.name ?? 'empty'}
        </strong>
      </div>

      <div className="spread">
        <span>Y</span>
        <strong className="text-strong">
          {chartConfig.encoding.y?.name ?? 'empty'}
        </strong>
      </div>
      <div className="spread">
        <span>Aggregation</span>
        <strong className="text-strong">
          {chartConfig.aggregate ?? 'none'}
        </strong>
      </div>
      <DropdownField
        label="Aggregation"
        options={aggregationOptions}
        value={chartConfig.aggregate ?? 'none'}
        onChange={onSetAggregation}
      />
    </div>
  )
}

export default SettingsSummary
