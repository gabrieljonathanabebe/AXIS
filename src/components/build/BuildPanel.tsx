import { Blocks, ChartColumn, Columns3, FolderOpen, Plus } from 'lucide-react'
import Button from '../ui/Button'
import ChartPicker from './ChartPicker'
import CollapsibleSection from '../ui/CollapsibleSection'
import DatasetCard from './DatasetCard'
import { DEMO_DATASET_ID } from '../../api/datasets'
import FieldList from './FieldList'
import Panel from '../ui/Panel'
import type { ChartType, Dataset } from '../../types/chart'
import type { DatasetSummary } from '../../api/datasets'

type BuildPanelProps = {
  activeDatasetSummary: DatasetSummary | null
  dataset: Dataset
  isCollapsed: boolean
  datasetError: string | null
  isLoading: boolean
  onSelectChartType: (type: ChartType) => void
  onToggleCollapse: () => void
  onUploadFile: (file: File) => Promise<void>
}

function BuildPanel({
  activeDatasetSummary,
  dataset,
  isCollapsed,
  datasetError,
  isLoading,
  onSelectChartType,
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
      isEmbedded
      isScrollable
      onToggleCollapse={onToggleCollapse}
    >
      <div className="build-panel-content">
        <CollapsibleSection
          title="Visuals"
          icon={<ChartColumn size={14} />}
          variant="plain"
        >
          <ChartPicker onSelectChartType={onSelectChartType} />
        </CollapsibleSection>

        <CollapsibleSection
          title="Dataset"
          icon={<FolderOpen size={14} />}
          variant="plain"
        >
          <div className="stack">
            <DatasetCard
              fieldCount={dataset.fields.length}
              isDemo={
                !activeDatasetSummary ||
                activeDatasetSummary.id === DEMO_DATASET_ID
              }
              isLoading={isLoading}
              name={activeDatasetSummary?.name ?? 'No dataset'}
              rowCount={activeDatasetSummary?.row_count ?? dataset.rows.length}
              onUploadFile={onUploadFile}
            />
            {datasetError ? (
              <span className="panel-error">{datasetError}</span>
            ) : null}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Fields"
          icon={<Columns3 size={14} />}
          variant="plain"
        >
          <div className="stack">
            <FieldList fields={dataset.fields} />
            <Button
              className="calculated-field-button full-width"
              title="Calculated fields coming soon"
              disabled
            >
              <Plus size={14} />
              Calculated field
            </Button>
          </div>
        </CollapsibleSection>
      </div>
    </Panel>
  )
}

export default BuildPanel
