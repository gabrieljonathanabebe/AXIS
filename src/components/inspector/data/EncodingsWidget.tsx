import { Database } from 'lucide-react'

import { getChartDefinition } from '../../../chart/chartDefinitions'
import { getCompatibleFields } from '../../../chart/getCompatibleFields'
import ControlRow from '../../ui/ControlRow'
import SelectControl from '../../ui/SelectControl'
import InspectorWidget from '../InspectorWidget'

import type { ChartInspectorProps } from '../types'

type EncodingsWidgetProps = Pick<
  ChartInspectorProps,
  'chart' | 'fields' | 'onSetEncodingField'
>

function EncodingsWidget({
  chart,
  fields,
  onSetEncodingField,
}: EncodingsWidgetProps) {
  const definition = getChartDefinition(chart.type)
  const { encoding: activeEncoding } = chart.spec.data
  return (
    <InspectorWidget title="Encodings" icon={<Database size={16} />}>
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
              value={activeEncoding[encoding.key]?.name ?? ''}
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
