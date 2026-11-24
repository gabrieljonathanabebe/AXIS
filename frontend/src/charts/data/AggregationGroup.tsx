import {
  getAggregationOptions,
  GROUP_AGGREGATIONS,
} from '@/charts/aggregations'
import {
  getChartDefinition,
  hasAggregatedColor,
} from '@/charts/chartDefinitions'
import {
  getEffectiveAggregation,
  isCountOnly,
} from '@/charts/getEffectiveAggregation'
import Group from '@/shared/ui/Group'
import Row from '@/shared/ui/Row'
import SelectControl from '@/shared/ui/SelectControl'

import type { ChartFormatProps } from '@/charts/types'

// ===== PROPS =================================================================
type AggregationGroupProps = Pick<
  ChartFormatProps,
  'actions' | 'chart' | 'fields'
>

// ===== GLOBAL CONSTANTS ======================================================
const groupAggregationOptions = getAggregationOptions(GROUP_AGGREGATIONS)

const aggregationOptions = getAggregationOptions([
  'none',
  ...GROUP_AGGREGATIONS,
])

// ===== COMPONENT =============================================================
function AggregationGroup({ actions, chart, fields }: AggregationGroupProps) {
  // ===== LOCAL CONSTANTS ======
  const definition = getChartDefinition(chart.type)
  const activeOptions = aggregationOptions.filter((option) => {
    return definition.supportedAggregations.includes(option.value)
  })
  const activeColorOptions = groupAggregationOptions.filter((option) => {
    return definition.supportedAggregations.includes(option.value)
  })
  const isCountForced = isCountOnly(chart.spec.data, fields)
  const showColorAggregation = hasAggregatedColor(
    chart.type,
    chart.spec.data.encoding,
  )
  // ===== RETURN ======
  return (
    <Group>
      <Row label="Value function">
        <SelectControl
          disabled={isCountForced}
          label="Value aggregation"
          options={activeOptions}
          value={getEffectiveAggregation(chart.spec.data, fields)}
          onChange={(aggregation) => {
            actions.setAggregation('aggregation', aggregation)
          }}
        />
      </Row>
      {showColorAggregation && (
        <Row label="Color function">
          <SelectControl
            label="Color aggregation"
            options={activeColorOptions}
            value={chart.spec.data.colorAggregation}
            onChange={(aggregation) => {
              actions.setAggregation('colorAggregation', aggregation)
            }}
          />
        </Row>
      )}
    </Group>
  )
}

export default AggregationGroup
