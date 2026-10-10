import AggregationWidget from './data/AggregationWidget'
import EncodingsWidget from './data/EncodingsWidget'

import type { ChartInspectorProps } from './types'

function DataInspectorTab({ actions, chart, fields }: ChartInspectorProps) {
  return (
    <div className="stack inspector-tab-content">
      <EncodingsWidget actions={actions} chart={chart} fields={fields} />
      <AggregationWidget actions={actions} chart={chart} />
    </div>
  )
}

export default DataInspectorTab
