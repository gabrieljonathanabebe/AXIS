import { SlidersHorizontal } from 'lucide-react'

import Panel from '../shared/ui/Panel'
import ChartInspector from './ChartInspector'
import DashboardInspector from './DashboardInspector'

import type { ChartInstance } from '../charts/types'
import type { DataField } from '../datasets/types'
import type { DashboardInspectorProps } from './types'

type InspectorPanelProps = DashboardInspectorProps & {
  chart: ChartInstance | null
  fields: DataField[]
  isCollapsed: boolean
  onToggleCollapse: () => void
}

function InspectorPanel({
  actions,
  chart,
  dashboard,
  fields,
  isCollapsed,
  onRenameDashboard,
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
        <ChartInspector actions={actions} chart={chart} fields={fields} />
      ) : (
        <DashboardInspector
          actions={actions}
          dashboard={dashboard}
          onRenameDashboard={onRenameDashboard}
        />
      )}
    </Panel>
  )
}

export default InspectorPanel
