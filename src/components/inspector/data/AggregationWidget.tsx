import { Sigma } from 'lucide-react'

import { getChartDefinition } from '../../../chart/chartDefinitions'
import ControlRow from '../../ui/ControlRow'
import SelectControl from '../../ui/SelectControl'
import InspectorWidget from '../InspectorWidget'

import type { Aggregation } from '../../../types/chart'
import type { ChartInspectorProps } from '../types'

type AggregationWidgetProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetAggregation'
>

const aggregationOptions = [
  { label: 'None', value: 'none' },
  { label: 'Sum', value: 'sum' },
  { label: 'Mean', value: 'mean' },
  { label: 'Median', value: 'median' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Count', value: 'count' },
] satisfies { label: string; value: Aggregation }[]

function AggregationWidget({
  chart,
  onSetAggregation,
}: AggregationWidgetProps) {
  const definition = getChartDefinition(chart.type)
  const activeOptions = aggregationOptions.filter((option) => {
    return definition.supportedAggregations.includes(option.value)
  })
  return (
    <InspectorWidget title="Aggregation" icon={<Sigma size={16} />}>
      <ControlRow label="Function">
        <SelectControl
          label="Aggregation"
          options={activeOptions}
          value={chart.spec.data.aggregation ?? definition.defaultAggregation}
          onChange={onSetAggregation}
        />
      </ControlRow>
    </InspectorWidget>
  )
}

export default AggregationWidget
