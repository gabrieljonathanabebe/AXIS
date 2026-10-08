import { LayoutDashboard, LayoutGrid } from 'lucide-react'

import ControlRow from '../../shared/ui/ControlRow'
import ScrubbableNumber from '../../shared/ui/ScrubbableNumber'
import TextInput from '../../shared/ui/TextInput'
import InspectorWidget from './InspectorWidget'

import type { DashboardInspectorProps } from './types'

function DashboardInspector({
  dashboard,
  onRenameDashboard,
  onSetDashboardLayout,
}: DashboardInspectorProps) {
  return (
    <div className="stack inspector-tab-content">
      <InspectorWidget title="Dashboard" icon={<LayoutDashboard size={16} />}>
        <ControlRow label="Name">
          <TextInput
            label="Dashboard name"
            value={dashboard.name}
            placeholder="Untitled dashboard"
            onValueChange={onRenameDashboard}
          />
        </ControlRow>
      </InspectorWidget>
      <InspectorWidget title="Layout" icon={<LayoutGrid size={16} />}>
        <ControlRow label="Gap">
          <ScrubbableNumber
            label="Chart gap"
            min={0}
            max={48}
            step={2}
            value={dashboard.layout.gap}
            onValueChange={(gap) => {
              onSetDashboardLayout('gap', gap)
            }}
          />
        </ControlRow>
      </InspectorWidget>
    </div>
  )
}

export default DashboardInspector
