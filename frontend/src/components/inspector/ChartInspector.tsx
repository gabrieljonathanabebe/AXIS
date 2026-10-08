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
  onSetChartType,
  onSetContainer,
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
            onSetChartType={onSetChartType}
            onSetEncodingField={onSetEncodingField}
          />
        ),
        appearance: (
          <AppearanceInspectorTab
            chart={chart}
            fields={fields}
            onSetAppearance={onSetAppearance}
            onSetChartAppearance={onSetChartAppearance}
            onSetContainer={onSetContainer}
          />
        ),
        interaction: (
          <InteractionInspectorTab
            chart={chart}
            fields={fields}
            onSetInteraction={onSetInteraction}
          />
        ),
      }}
    />
  )
}

export default ChartInspector
