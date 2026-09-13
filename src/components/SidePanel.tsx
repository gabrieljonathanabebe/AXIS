import { ChartColumn, Database, SlidersHorizontal } from 'lucide-react'
import ChartPicker from './ChartPicker'
import FieldList from './FieldList'
import Panel from './ui/Panel'
import SettingsSummary from './SettingsSummary'
import IconButton from './ui/IconButton'
import type { ChartConfig, ChartType, DataField } from '../types/chart'
import type { ActiveSidePanel } from '../types/ui'

type SidePanelProps = {
  activeSidePanel: ActiveSidePanel
  chartConfig: ChartConfig
  fields: DataField[]
  selectedField: DataField | null
  onSelectField: (field: DataField) => void
  onSelectChartType: (type: ChartType) => void
  onSetActiveSidePanel: (panel: ActiveSidePanel) => void
}

function SidePanel({
  activeSidePanel,
  chartConfig,
  fields,
  selectedField,
  onSelectField,
  onSelectChartType,
  onSetActiveSidePanel,
}: SidePanelProps) {
  const panelTitle =
    activeSidePanel === 'fields'
      ? 'Fields'
      : activeSidePanel === 'charts'
        ? 'Charts'
        : 'Settings'
  return (
    <Panel
      as="aside"
      eyebrow="Panel"
      title={panelTitle}
      className="side-panel"
      actions={
        <>
          <IconButton
            isActive={activeSidePanel === 'fields'}
            label="Show fields"
            onClick={() => onSetActiveSidePanel('fields')}
          >
            <Database size={18} />
          </IconButton>

          <IconButton
            isActive={activeSidePanel === 'charts'}
            label="Show chart types"
            onClick={() => onSetActiveSidePanel('charts')}
          >
            <ChartColumn size={18} />
          </IconButton>

          <IconButton
            isActive={activeSidePanel === 'settings'}
            label="Show settings"
            onClick={() => onSetActiveSidePanel('settings')}
          >
            <SlidersHorizontal size={18} />
          </IconButton>
        </>
      }
    >
      {activeSidePanel === 'fields' ? (
        <FieldList
          fields={fields}
          selectedField={selectedField}
          onSelectField={onSelectField}
        />
      ) : activeSidePanel === 'charts' ? (
        <ChartPicker onSelectChartType={onSelectChartType} />
      ) : (
        <SettingsSummary chartConfig={chartConfig} />
      )}
    </Panel>
  )
}

export default SidePanel