import { useState } from 'react'

import AppearanceInspectorTab from './inspector/AppearanceInspectorTab'
import DataInspectorTab from './inspector/DataInspectorTab'
import InspectorTabs from './inspector/InspectorTabs'
import InteractionInspectorTab from './inspector/InteractionInspectorTab'

import type { InspectorTab } from './inspector/InspectorTabs'
import type { ChartInspectorProps } from './inspector/types'

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
