import { ChartColumn, Database, SlidersHorizontal } from 'lucide-react'
import ChartPicker from './ChartPicker'
import DatasetUpload from './DatasetUpload'
import FieldList from './FieldList'
import Panel from './ui/Panel'
import ChartInspector from './ChartInspector'
import IconButton from './ui/IconButton'
import type { ActiveSidePanel } from '../types/ui'
import type {
  Aggregation,
  ChartAppearance,
  ChartConfig,
  ChartEncoding,
  ChartType,
  DataField,
} from '../types/chart'
import type { DatasetSummary } from '../api/datasets'

type SidePanelProps = {
  activeDatasetSummary: DatasetSummary | null
  activeSidePanel: ActiveSidePanel
  chartConfig: ChartConfig
  fields: DataField[]
  isUploading: boolean
  selectedField: DataField | null
  uploadError: string | null
  onSelectField: (field: DataField) => void
  onSelectChartType: (type: ChartType) => void
  onSetActiveSidePanel: (panel: ActiveSidePanel) => void
  onSetAggregation: (aggregation: Aggregation) => void
  onSetAppearance: <TKey extends keyof ChartAppearance>(
    key: TKey,
    value: ChartAppearance[TKey],
  ) => void
  onSetChartAppearance: <
    TChartKey extends 'scatter' | 'line' | 'bar',
    TOptionKey extends keyof ChartAppearance[TChartKey],
  >(
    chartKey: TChartKey,
    optionKey: TOptionKey,
    value: ChartAppearance[TChartKey][TOptionKey],
  ) => void
  onSetEncodingField: (axis: keyof ChartEncoding, fieldName: string) => void
  onUploadFile: (file: File) => Promise<void>
}

function SidePanel({
  activeDatasetSummary,
  activeSidePanel,
  chartConfig,
  fields,
  isUploading,
  selectedField,
  onSelectField,
  onSelectChartType,
  onSetActiveSidePanel,
  onSetAggregation,
  onSetAppearance,
  onSetChartAppearance,
  onSetEncodingField,
  onUploadFile,
  uploadError,
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
        <div className="side-panel-body">
          <DatasetUpload
            isUploading={isUploading}
            onUploadFile={onUploadFile}
          />
          {uploadError ? (
            <span className="panel-error">{uploadError}</span>
          ) : null}
          {activeDatasetSummary ? (
            <span className="dataset-summary">
              {activeDatasetSummary.name} · {activeDatasetSummary.row_count}{' '}
              rows
            </span>
          ) : null}
          <div className="side-panel-scroll">
            <FieldList
              fields={fields}
              selectedField={selectedField}
              onSelectField={onSelectField}
            />
          </div>
        </div>
      ) : activeSidePanel === 'charts' ? (
        <div className="side-panel-scroll">
          <ChartPicker onSelectChartType={onSelectChartType} />
        </div>
      ) : (
        <div className="side-panel-scroll">
          <ChartInspector
            chartConfig={chartConfig}
            fields={fields}
            onSetAggregation={onSetAggregation}
            onSetAppearance={onSetAppearance}
            onSetChartAppearance={onSetChartAppearance}
            onSetEncodingField={onSetEncodingField}
          />
        </div>
      )}
    </Panel>
  )
}

export default SidePanel
