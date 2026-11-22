import { Fragment } from 'react'

import {
  chartDefinitionList,
  getChartDefinition,
} from '@/charts/chartDefinitions'
import { getCompatibleFields } from '@/charts/getCompatibleFields'
import { getEffectiveCategoryOrder } from '@/charts/getEffectiveCategoryOrder'
import { getEffectiveTimeGrain } from '@/charts/getEffectiveTimeGrain'
import { TIME_GRAIN_OPTIONS } from '@/shared/format/valueFormats'
import Group from '@/shared/ui/Group'
import Row from '@/shared/ui/Row'
import SelectControl from '@/shared/ui/SelectControl'
import {
  fromLimitChoice,
  fromSortChoice,
  getLimitOptions,
  SORT_OPTIONS,
  toLimitChoice,
  toSortChoice,
} from './categoryOrderOptions'

import type { ChartFormatProps } from '@/charts/types'
import type { TimeGrain } from '@/shared/format/valueFormats'
import type { OptionItem } from '@/shared/ui/OptionsMenu'

type EncodingsWidgetProps = Pick<
  ChartFormatProps,
  'actions' | 'chart' | 'fields'
>

/** Choice in the grain row; auto takes the native grain of the field. */
type GrainChoice = TimeGrain | 'auto'

/**
 * Chart type and encoded fields of a chart; a date field on X gets a grain
 * row right below it, categories on X get sort and show rows.
 */
function EncodingsWidget({ actions, chart, fields }: EncodingsWidgetProps) {
  const definition = getChartDefinition(chart.type)
  const { encoding: activeEncoding, timeGrain } = chart.spec.data
  const chartTypeOptions = chartDefinitionList.map(({ label, type }) => ({
    label,
    value: type,
  }))
  const autoGrain = getEffectiveTimeGrain(
    { ...chart.spec.data, timeGrain: null },
    fields,
  )
  const autoLabel = TIME_GRAIN_OPTIONS.find(
    (option) => option.value === autoGrain,
  )?.label
  const grainOptions: OptionItem<GrainChoice>[] = [
    { label: `Auto · ${autoLabel}`, shortLabel: 'Auto', value: 'auto' },
    ...TIME_GRAIN_OPTIONS,
  ]
  const categoryOrder = getEffectiveCategoryOrder(chart.spec.data, fields)
  return (
    <Group>
      <Row label="Chart">
        <SelectControl
          label="Chart type"
          options={chartTypeOptions}
          value={chart.type}
          onChange={actions.setChartType}
        />
      </Row>
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
          <Fragment key={encoding.key}>
            <Row label={encoding.label}>
              <SelectControl
                label={`${encoding.label} field`}
                options={options}
                value={activeEncoding[encoding.key] ?? ''}
                placeholder="Select field"
                onChange={(fieldName) => {
                  actions.setEncodingField(encoding.key, fieldName)
                }}
              />
            </Row>
            {encoding.key === 'x' && autoGrain && (
              <Row label="Grain">
                <SelectControl
                  label="Time grain"
                  options={grainOptions}
                  value={timeGrain ?? 'auto'}
                  onChange={(choice) => {
                    actions.setTimeGrain(choice === 'auto' ? null : choice)
                  }}
                />
              </Row>
            )}
            {encoding.key === 'x' && categoryOrder && (
              <>
                <Row label="Sort">
                  <SelectControl
                    label="Sort categories"
                    options={SORT_OPTIONS}
                    value={toSortChoice(categoryOrder.sort)}
                    onChange={(choice) => {
                      actions.setCategoryOrder({ sort: fromSortChoice(choice) })
                    }}
                  />
                </Row>
                <Row label="Show">
                  <SelectControl
                    label="Show categories"
                    options={getLimitOptions(categoryOrder.limit)}
                    value={toLimitChoice(categoryOrder.limit)}
                    onChange={(choice) => {
                      actions.setCategoryOrder({
                        limit: fromLimitChoice(choice),
                      })
                    }}
                  />
                </Row>
              </>
            )}
          </Fragment>
        )
      })}
    </Group>
  )
}

export default EncodingsWidget
