import { useState } from 'react'

import AppearanceInspectorTab from './AppearanceInspectorTab'
import DataInspectorTab from './DataInspectorTab'
import InspectorTabs from './InspectorTabs'
import InteractionInspectorTab from './InteractionInspectorTab'

import type { InspectorTab } from './InspectorTabs'
import type { ChartInspectorProps } from './types'

function ChartInspector({
  chart,
  fields,
  onSetAggregation,
  onSetAppearance,
  onSetInteraction,
  onSetChartAppearance,
  onSetEncodingField,
}: ChartInspectorProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>('data')
  return (
    <InspectorTabs
      value={activeTab}
      onValueChange={setActiveTab}
      panels={{
        data: (
          <DataInspectorTab
            chart={chart}
            fields={fields}
            onSetAggregation={onSetAggregation}
            onSetEncodingField={onSetEncodingField}
          />
        ),
        appearance: (
          <AppearanceInspectorTab
            chart={chart}
            onSetAppearance={onSetAppearance}
            onSetChartAppearance={onSetChartAppearance}
          />
        ),
        interaction: (
          <InteractionInspectorTab
            chart={chart}
            onSetInteraction={onSetInteraction}
          />
        ),
      }}
    />
  )
}

export default ChartInspector
