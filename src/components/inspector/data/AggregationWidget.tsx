import { Sigma } from 'lucide-react'

import { getChartDefinition } from '../../../chart/chartDefinitions'
import ControlRow from '../../ui/ControlRow'
import SelectControl from '../../ui/SelectControl'
import InspectorWidget from '../InspectorWidget'

import type { Aggregation, GroupAggregation } from '../../../types/chart'
import type { ChartInspectorProps } from '../types'

// ===== PROPS =================================================================
type AggregationWidgetProps = Pick<
  ChartInspectorProps,
  'chart' | 'onSetAggregation'
>

// ===== GLOBAL CONSTANTS ======================================================
const groupAggregationOptions = [
  { label: 'Sum', value: 'sum' },
  { label: 'Mean', value: 'mean' },
  { label: 'Median', value: 'median' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Count', value: 'count' },
] satisfies { label: string; value: GroupAggregation }[]

const aggregationOptions = [
  { label: 'None', value: 'none' },
  ...groupAggregationOptions,
] satisfies { label: string; value: Aggregation }[]

// ===== COMPONENT =============================================================
function AggregationWidget({
  chart,
  onSetAggregation,
}: AggregationWidgetProps) {
  // ===== LOCAL CONSTANTS ======
  const definition = getChartDefinition(chart.type)
  const activeOptions = aggregationOptions.filter((option) => {
    return definition.supportedAggregations.includes(option.value)
  })
  const activeColorOptions = groupAggregationOptions.filter((option) => {
    return definition.supportedAggregations.includes(option.value)
  })
  const showColorAggregation =
    chart.type === 'bar' && Boolean(chart.spec.data.encoding.color)
  // ===== RETURN ======
  return (
    <InspectorWidget title="Aggregation" icon={<Sigma size={16} />}>
      <ControlRow label="Value function">
        <SelectControl
          label="Value aggregation"
          options={activeOptions}
          value={chart.spec.data.aggregation}
          onChange={(aggregation) => {
            onSetAggregation('aggregation', aggregation)
          }}
        />
      </ControlRow>
      {showColorAggregation && (
        <ControlRow label="Color function">
          <SelectControl
            label="Color aggregation"
            options={activeColorOptions}
            value={chart.spec.data.colorAggregation}
            onChange={(aggregation) => {
              onSetAggregation('colorAggregation', aggregation)
            }}
          />
        </ControlRow>
      )}
    </InspectorWidget>
  )
}

export default AggregationWidget
