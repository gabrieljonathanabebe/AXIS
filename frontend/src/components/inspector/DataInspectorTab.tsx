import AggregationWidget from './data/AggregationWidget'
import EncodingsWidget from './data/EncodingsWidget'

import type { ChartInspectorProps } from './types'

type DataInspectorTabProps = Pick<
  ChartInspectorProps,
  | 'chart'
  | 'fields'
  | 'onSetAggregation'
  | 'onSetChartType'
  | 'onSetEncodingField'
>

function DataInspectorTab({
  chart,
  fields,
  onSetAggregation,
  onSetChartType,
  onSetEncodingField,
}: DataInspectorTabProps) {
  return (
    <div className="stack inspector-tab-content">
      <EncodingsWidget
        chart={chart}
        fields={fields}
        onSetChartType={onSetChartType}
        onSetEncodingField={onSetEncodingField}
      />
      <AggregationWidget chart={chart} onSetAggregation={onSetAggregation} />
    </div>
  )
}

export default DataInspectorTab
