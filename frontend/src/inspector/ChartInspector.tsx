import { useState } from 'react'

import AppearanceInspectorTab from './AppearanceInspectorTab'
import DataInspectorTab from './DataInspectorTab'
import InspectorTabs from './InspectorTabs'
import InteractionInspectorTab from './InteractionInspectorTab'

import type { InspectorTab } from './InspectorTabs'
import type { ChartInspectorProps } from './types'

function ChartInspector(props: ChartInspectorProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>('data')
  return (
    <InspectorTabs
      value={activeTab}
      onValueChange={setActiveTab}
      panels={{
        data: <DataInspectorTab {...props} />,
        appearance: <AppearanceInspectorTab {...props} />,
        interaction: <InteractionInspectorTab {...props} />,
      }}
    />
  )
}

export default ChartInspector
