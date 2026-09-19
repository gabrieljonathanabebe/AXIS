import { Database, Sigma } from 'lucide-react'

import { getChartDefinition } from '../../chart/chartDefinitions'
import { getCompatibleFields } from '../../chart/getCompatibleFields'
import ControlRow from '../ui/ControlRow'
import SelectControl from '../ui/SelectControl'
import InspectorWidget from './InspectorWidget'

import type { Aggregation } from '../../types/chart'
import type { ChartInspectorProps } from './types'

type DataInspectorTabProps = Pick<
  ChartInspectorProps,
  'chart' | 'fields' | 'onSetAggregation' | 'onSetEncodingField'
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

function DataInspectorTab({
  chart,
  fields,
  onSetAggregation,
  onSetEncodingField,
}: DataInspectorTabProps) {
  const definition = getChartDefinition(chart.type)
  const { data } = chart.spec
  const activeAggregationOptions = aggregationOptions.filter((option) => {
    return definition.supportedAggregations.includes(option.value)
  })

  return (
    <div className="stack inspector-tab-content">
      <InspectorWidget title="Encodings" icon={<Database size={16} />}>
        {definition.encodings.map((encoding) => {
          const compatibleFields = getCompatibleFields(
            definition.type,
            encoding.key,
            fields,
          )
          const compatibleFieldOptions = [
            ...(encoding.required
              ? []
              : [
                  {
                    label: 'None',
                    value: '',
                  },
                ]),
            ...compatibleFields.map((field) => ({
              label: field.name,
              value: field.name,
            })),
          ]

          return (
            <ControlRow key={encoding.key} label={encoding.label}>
              <SelectControl
                label={`${encoding.label} field`}
                options={compatibleFieldOptions}
                value={data.encoding[encoding.key]?.name ?? ''}
                placeholder="Select field"
                onChange={(fieldName) => {
                  onSetEncodingField(encoding.key, fieldName)
                }}
              />
            </ControlRow>
          )
        })}
      </InspectorWidget>

      <InspectorWidget title="Aggregation" icon={<Sigma size={16} />}>
        <ControlRow label="Function">
          <SelectControl
            label="Aggregation"
            options={activeAggregationOptions}
            value={data.aggregation ?? definition.defaultAggregation}
            onChange={onSetAggregation}
          />
        </ControlRow>
      </InspectorWidget>
    </div>
  )
}

export default DataInspectorTab
