import { Blocks, ChartColumn, Columns3, FolderOpen, Plus } from 'lucide-react'

import Button from '../shared/ui/Button'
import ChartPicker from '../charts/ChartPicker'
import CollapsibleSection from '../shared/ui/CollapsibleSection'
import DatasetCard from '../datasets/DatasetCard'
import { DEMO_DATASET_ID } from '../datasets/datasetsApi'
import FieldList from '../datasets/FieldList'
import Panel from '../shared/ui/Panel'
import type { ChartType } from '../charts/types'
import type {
  Dataset,
  DatasetProfile,
  SemanticRoleOverrides,
} from '../datasets/types'

import type { DatasetSummary } from '../datasets/datasetsApi'

type BuildPanelProps = {
  activeDatasetSummary: DatasetSummary | null
  dataset: Dataset
  datasetName: string
  isCollapsed: boolean
  datasetError: string | null
  isLoading: boolean
  onSelectChartType: (type: ChartType) => void
  onToggleCollapse: () => void
  onUploadFile: (file: File) => Promise<void>
  profile: DatasetProfile | null
  semanticRoleOverrides: SemanticRoleOverrides
}

function BuildPanel({
  activeDatasetSummary,
  dataset,
  datasetError,
  datasetName,
  isCollapsed,
  isLoading,
  onSelectChartType,
  onToggleCollapse,
  onUploadFile,
  profile,
  semanticRoleOverrides,
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
              name={datasetName}
              rowCount={activeDatasetSummary?.row_count ?? 0}
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
            <FieldList
              fields={dataset.fields}
              profileFields={profile?.fields ?? []}
              semanticRoleOverrides={semanticRoleOverrides}
            />
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
