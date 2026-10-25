import ControlRow from '../../shared/ui/ControlRow'
import FormatWidget from '../../shared/ui/FormatWidget'
import SelectControl from '../../shared/ui/SelectControl'
import { getAggregationOptions, GROUP_AGGREGATIONS } from '../aggregations'
import { getChartDefinition, hasAggregatedColor } from '../chartDefinitions'
import {
  getEffectiveAggregation,
  isCountOnly,
} from '../getEffectiveAggregation'

import type { ChartFormatProps } from '../types'

// ===== PROPS =================================================================
type AggregationWidgetProps = Pick<
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
function AggregationWidget({ actions, chart, fields }: AggregationWidgetProps) {
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
    <FormatWidget>
      <ControlRow label="Value function">
        <SelectControl
          disabled={isCountForced}
          label="Value aggregation"
          options={activeOptions}
          value={getEffectiveAggregation(chart.spec.data, fields)}
          onChange={(aggregation) => {
            actions.setAggregation('aggregation', aggregation)
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
              actions.setAggregation('colorAggregation', aggregation)
            }}
          />
        </ControlRow>
      )}
    </FormatWidget>
  )
}

export default AggregationWidget
