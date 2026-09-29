import { Blocks, ChartColumn, Database } from 'lucide-react'
import ChartPicker from './ChartPicker'
import CollapsibleSection from '../ui/CollapsibleSection'
import DatasetUpload from './DatasetUpload'
import FieldList from './FieldList'
import Panel from '../ui/Panel'
import type { ChartType, DataField } from '../../types/chart'
import type { DatasetSummary } from '../../api/datasets'

type BuildPanelProps = {
  activeDatasetSummary: DatasetSummary | null
  fields: DataField[]
  isCollapsed: boolean
  isUploading: boolean
  selectedField: DataField | null
  uploadError: string | null
  onSelectChartType: (type: ChartType) => void
  onSelectField: (field: DataField) => void
  onToggleCollapse: () => void
  onUploadFile: (file: File) => Promise<void>
}

function BuildPanel({
  activeDatasetSummary,
  fields,
  isCollapsed,
  isUploading,
  selectedField,
  uploadError,
  onSelectChartType,
  onSelectField,
  onToggleCollapse,
  onUploadFile,
}: BuildPanelProps) {
  return (
    <Panel
      as="aside"
      icon={<Blocks size={18} />}
      title="Build"
      className="build-panel"
      isCollapsed={isCollapsed}
      isScrollable
      onToggleCollapse={onToggleCollapse}
    >
      <div className="build-panel-content">
        <DatasetUpload isUploading={isUploading} onUploadFile={onUploadFile} />
        {uploadError ? (
          <span className="panel-error">{uploadError}</span>
        ) : null}

        {activeDatasetSummary ? (
          <span className="dataset-summary">
            {activeDatasetSummary.name} · {activeDatasetSummary.row_count} rows
          </span>
        ) : null}
        <CollapsibleSection title="Fields" icon={<Database size={18} />}>
          <FieldList
            fields={fields}
            selectedField={selectedField}
            onSelectField={onSelectField}
          />
        </CollapsibleSection>
        <CollapsibleSection title="Visuals" icon={<ChartColumn size={18} />}>
          <ChartPicker onSelectChartType={onSelectChartType} />
        </CollapsibleSection>
      </div>
    </Panel>
  )
}

export default BuildPanel
