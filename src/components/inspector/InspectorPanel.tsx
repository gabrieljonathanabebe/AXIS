import { SlidersHorizontal } from 'lucide-react'

import ChartInspector from './ChartInspector'
import Panel from '../ui/Panel'
import type { ChartInstance } from '../../types/chart'
import type { ChartInspectorProps } from './types'

type InspectorPanelProps = Omit<ChartInspectorProps, 'chart'> & {
  chart: ChartInstance | null
  isCollapsed: boolean
  onToggleCollapse: () => void
}

function InspectorPanel({
  chart,
  fields,
  isCollapsed,
  onSetAggregation,
  onSetAppearance,
  onSetInteraction,
  onSetChartAppearance,
  onSetChartType,
  onSetContainer,
  onSetEncodingField,
  onToggleCollapse,
}: InspectorPanelProps) {
  return (
    <Panel
      as="aside"
      icon={<SlidersHorizontal size={18} />}
      title="Inspector"
      className="inspector-panel"
      isCollapsed={isCollapsed}
      isScrollable
      side="end"
      onToggleCollapse={onToggleCollapse}
    >
      {chart ? (
        <ChartInspector
          chart={chart}
          fields={fields}
          onSetAggregation={onSetAggregation}
          onSetAppearance={onSetAppearance}
          onSetInteraction={onSetInteraction}
          onSetChartAppearance={onSetChartAppearance}
          onSetChartType={onSetChartType}
          onSetContainer={onSetContainer}
          onSetEncodingField={onSetEncodingField}
        />
      ) : (
        <span className="inspector-empty">Select a chart to inspect it.</span>
      )}
    </Panel>
  )
}

export default InspectorPanel
