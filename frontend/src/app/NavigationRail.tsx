import { ChartNoAxesCombined, Database } from 'lucide-react'

import IconButton from '../shared/ui/IconButton'

import type { LucideIcon } from 'lucide-react'
import type { WorkspaceView } from '../types/ui'

// ===== TYPES =================================================================
type NavigationRailProps = {
  activeWorkspace: WorkspaceView
  onWorkspaceChange: (workspace: WorkspaceView) => void
}

type NavigationRailItem = {
  icon: LucideIcon
  label: string
  value: WorkspaceView
}

// ===== CONSTANTS =============================================================
const navigationRailItems: NavigationRailItem[] = [
  { icon: ChartNoAxesCombined, label: 'Visualize', value: 'visualize' },
  { icon: Database, label: 'Data', value: 'data' },
]

// ===== COMPONENT =============================================================
function NavigationRail({
  activeWorkspace,
  onWorkspaceChange,
}: NavigationRailProps) {
  return (
    <nav className="navigation-rail glass glass-thin" aria-label="Workspaces">
      {navigationRailItems.map(({ icon: Icon, label, value }) => {
        const isActive = value === activeWorkspace

        return (
          <IconButton
            isActive={isActive}
            label={label}
            variant="ghost"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onWorkspaceChange(value)}
            key={value}
          >
            <Icon size={18} aria-hidden="true" />
          </IconButton>
        )
      })}
    </nav>
  )
}

export default NavigationRail
