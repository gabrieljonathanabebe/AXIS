import { Waypoints } from 'lucide-react'

import {
  chartDefinitionList,
  getChartDefinition,
} from '../../../chart/chartDefinitions'
import { getCompatibleFields } from '../../../chart/getCompatibleFields'
import ControlRow from '../../ui/ControlRow'
import SelectControl from '../../ui/SelectControl'
import InspectorWidget from '../InspectorWidget'

import type { ChartInspectorProps } from '../types'

type EncodingsWidgetProps = Pick<
  ChartInspectorProps,
  'chart' | 'fields' | 'onSetChartType' | 'onSetEncodingField'
>

function EncodingsWidget({
  chart,
  fields,
  onSetChartType,
  onSetEncodingField,
}: EncodingsWidgetProps) {
  const definition = getChartDefinition(chart.type)
  const { encoding: activeEncoding } = chart.spec.data
  const chartTypeOptions = chartDefinitionList.map(({ label, type }) => ({
    label,
    value: type,
  }))
  return (
    <InspectorWidget title="Encodings" icon={<Waypoints size={16} />}>
      <ControlRow label="Chart">
        <SelectControl
          label="Chart type"
          options={chartTypeOptions}
          value={chart.type}
          onChange={onSetChartType}
        />
      </ControlRow>
      {definition.encodings.map((encoding) => {
        const compatibleFields = getCompatibleFields(
          definition.type,
          encoding.key,
          fields,
        )
        const options = [
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
              options={options}
              value={activeEncoding[encoding.key] ?? ''}
              placeholder="Select field"
              onChange={(fieldName) => {
                onSetEncodingField(encoding.key, fieldName)
              }}
            />
          </ControlRow>
        )
      })}
    </InspectorWidget>
  )
}

export default EncodingsWidget
