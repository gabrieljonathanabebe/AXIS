import { ChartColumn, Database, SlidersHorizontal } from 'lucide-react'
import ChartPicker from './ChartPicker'
import FieldList from './FieldList'
import Panel from './ui/Panel'
import ChartInspector from './ChartInspector'
import IconButton from './ui/IconButton'
import type {
  Aggregation,
  ChartConfig,
  ChartEncoding,
  ChartType,
  DataField,
} from '../types/chart'
import type { ActiveSidePanel } from '../types/ui'

type SidePanelProps = {
  activeSidePanel: ActiveSidePanel
  chartConfig: ChartConfig
  fields: DataField[]
  selectedField: DataField | null
  onSelectField: (field: DataField) => void
  onSelectChartType: (type: ChartType) => void
  onSetActiveSidePanel: (panel: ActiveSidePanel) => void
  onSetAggregation: (aggregation: Aggregation) => void
  onSetEncodingField: (axis: keyof ChartEncoding, fieldName: string) => void
}

function SidePanel({
  activeSidePanel,
  chartConfig,
  fields,
  selectedField,
  onSelectField,
  onSelectChartType,
  onSetActiveSidePanel,
  onSetAggregation,
  onSetEncodingField,
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
        <ChartInspector
          chartConfig={chartConfig}
          fields={fields}
          onSelectChartType={onSelectChartType}
          onSetAggregation={onSetAggregation}
          onSetEncodingField={onSetEncodingField}
        />
      )}
    </Panel>
  )
}

export default SidePanel