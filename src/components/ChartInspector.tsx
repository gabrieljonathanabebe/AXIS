import {
  chartDefinitionList,
  getChartDefinition,
} from '../chart/chartDefinitions'
import DropdownField from './ui/DropdownField'
import { getCompatibleFields } from '../chart/getCompatibleFields'
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

  const activeDefinition = chartConfig.type
    ? getChartDefinition(chartConfig.type)
    : undefined

  const activeAggregationOptions = aggregationOptions.filter((option) => {
    return activeDefinition?.supportedAggregations.includes(option.value)
  })
  return (
    <div className="stack">
      <div className="chart-type-control cluster">
        {chartDefinitionList.map(({ label, type, icon: Icon }) => (
          <IconButton
            isActive={chartConfig.type === type}
            label={label}
            onClick={() => onSelectChartType(type)}
            key={type}
          >
            <Icon size={18} />
          </IconButton>
        ))}
      </div>
      {activeDefinition ? (
        <>
          <div className="settings-divider" />
          {activeDefinition.encodings.map((encoding) => {
            const compatibleFields = getCompatibleFields(
              activeDefinition.type,
              encoding.key,
              fields,
            )
            const compatibleFieldOptions = compatibleFields.map((field) => ({
              label: field.name,
              value: field.name,
            }))
            return (
              <DropdownField
                label={encoding.label}
                options={compatibleFieldOptions}
                value={chartConfig.encoding[encoding.key]?.name ?? ''}
                placeholder="Select field"
                onChange={(fieldName) => {
                  onSetEncodingField(encoding.key, fieldName)
                }}
                key={encoding.key}
              />
            )
          })}
          <DropdownField
            label="Aggregation"
            options={activeAggregationOptions}
            value={chartConfig.aggregate ?? activeDefinition.defaultAggregation}
            onChange={onSetAggregation}
          />
        </>
      ) : null}
    </div>
  )
}

export default ChartInspector