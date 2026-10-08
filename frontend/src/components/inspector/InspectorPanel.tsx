import { SlidersHorizontal } from 'lucide-react'

import ChartInspector from './ChartInspector'
import DashboardInspector from './DashboardInspector'
import Panel from '../../shared/ui/Panel'
import type { ChartInstance } from '../../types/chart'
import type { ChartInspectorProps, DashboardInspectorProps } from './types'

type InspectorPanelProps = Omit<ChartInspectorProps, 'chart'> &
  DashboardInspectorProps & {
    chart: ChartInstance | null
    isCollapsed: boolean
    onToggleCollapse: () => void
  }

function InspectorPanel({
  chart,
  dashboard,
  fields,
  isCollapsed,
  onRenameDashboard,
  onSetAggregation,
  onSetAppearance,
  onSetInteraction,
  onSetChartAppearance,
  onSetChartType,
  onSetContainer,
  onSetDashboardLayout,
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
      isEmbedded
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
        <DashboardInspector
          dashboard={dashboard}
          onRenameDashboard={onRenameDashboard}
          onSetDashboardLayout={onSetDashboardLayout}
        />
      )}
    </Panel>
  )
}

export default InspectorPanel
