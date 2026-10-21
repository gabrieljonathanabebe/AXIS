import { chartDefinitionList, getChartDefinition } from '../chartDefinitions'
import { getCompatibleFields } from '../getCompatibleFields'
import ControlRow from '../../shared/ui/ControlRow'
import SelectControl from '../../shared/ui/SelectControl'
import FormatWidget from '../../shared/ui/FormatWidget'

import type { ChartFormatProps } from '../types'

type EncodingsWidgetProps = Pick<
  ChartFormatProps,
  'actions' | 'chart' | 'fields'
>

function EncodingsWidget({ actions, chart, fields }: EncodingsWidgetProps) {
  const definition = getChartDefinition(chart.type)
  const { encoding: activeEncoding } = chart.spec.data
  const chartTypeOptions = chartDefinitionList.map(({ label, type }) => ({
    label,
    value: type,
  }))
  return (
    <FormatWidget title="Encodings">
      <ControlRow label="Chart">
        <SelectControl
          label="Chart type"
          options={chartTypeOptions}
          value={chart.type}
          onChange={actions.setChartType}
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
                actions.setEncodingField(encoding.key, fieldName)
              }}
            />
          </ControlRow>
        )
      })}
    </FormatWidget>
  )
}

export default EncodingsWidget
