import { Database, SlidersHorizontal } from 'lucide-react'
import FieldList from './FieldList'
import Panel from './Panel'
import SettingsSummary from './SettingsSummary'
import type { ChartConfig, DataField } from '../types/chart'
import type { ActiveSidePanel } from '../types/ui'

type SidePanelProps = {
  activeSidePanel: ActiveSidePanel
  chartConfig: ChartConfig
  fields: DataField[]
  selectedField: DataField | null
  onSelectField: (field: DataField) => void
  onSetActiveSidePanel: (panel: ActiveSidePanel) => void
}

function SidePanel({
  activeSidePanel,
  chartConfig,
  fields,
  selectedField,
  onSelectField,
  onSetActiveSidePanel,
}: SidePanelProps) {
  const isDataPanel = activeSidePanel === 'data'
  const sidePanelTitle = isDataPanel ? 'Fields' : 'Chart'
  return (
    <Panel
      as="aside"
      eyebrow="Panel"
      title={sidePanelTitle}
      className="side-panel"
      actions={
        <>
          <button
            className={`control panel-action ${isDataPanel ? 'is-active' : ''}`}
            type="button"
            aria-label="Show data fields"
            onClick={() => onSetActiveSidePanel('data')}
          >
            <Database size={18} />
          </button>
          <button
            className={`control panel-action ${!isDataPanel ? 'is-active' : ''}`}
            type="button"
            aria-label="Show chart settings"
            onClick={() => onSetActiveSidePanel('settings')}
          >
            <SlidersHorizontal size={18} />
          </button>
        </>
      }
    >
      {isDataPanel ? (
        <FieldList
          fields={fields}
          selectedField={selectedField}
          onSelectField={onSelectField}
        />
      ) : (
        <SettingsSummary chartConfig={chartConfig} />
      )}
    </Panel>
  )
}

export default SidePanel