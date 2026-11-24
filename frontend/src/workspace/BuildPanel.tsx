import { Blocks, Columns3, FolderOpen, Plus, Waypoints } from 'lucide-react'

import AggregationGroup from '@/charts/data/AggregationGroup'
import EncodingsGroup from '@/charts/data/EncodingsGroup'
import { DEMO_DATASET_ID } from '@/datasets/datasetsApi'
import DatasetTile from '@/datasets/DatasetTile'
import FieldList from '@/datasets/FieldList'
import { objectGroups } from '@/objects/objectDefinitions'
import ObjectPicker from '@/objects/ObjectPicker'
import Panel from '@/shared/ui/containers/Panel'
import Group from '@/shared/ui/groups/Group'
import Button from '@/shared/ui/primitives/Button'

import type { ChartActions, ChartInstance } from '@/charts/types'
import type { DatasetSummary } from '@/datasets/datasetsApi'
import type {
  Dataset,
  DatasetProfile,
  SemanticRoleOverrides,
} from '@/datasets/types'
import type { ObjectTemplate } from '@/objects/types'

type BuildPanelProps = {
  activeDatasetSummary: DatasetSummary | null
  chart: ChartInstance | null
  chartActions: ChartActions
  dataset: Dataset
  datasetName: string
  isCollapsed: boolean
  datasetError: string | null
  isLoading: boolean
  onAddObject: (template: ObjectTemplate) => void
  onToggleCollapse: () => void
  onUploadFile: (file: File) => Promise<void>
  profile: DatasetProfile | null
  semanticRoleOverrides: SemanticRoleOverrides
}

function BuildPanel({
  activeDatasetSummary,
  chart,
  chartActions,
  dataset,
  datasetError,
  datasetName,
  isCollapsed,
  isLoading,
  onAddObject,
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
        {objectGroups.map(({ group, icon: Icon, title }) => (
          <Group
            collapsible
            key={group}
            title={title}
            icon={<Icon size={14} />}
          >
            <ObjectPicker
              group={group}
              showMore={group === 'charts'}
              onAddObject={onAddObject}
            />
          </Group>
        ))}

        <Group collapsible title="Dataset" icon={<FolderOpen size={14} />}>
          <div className="stack">
            <DatasetTile
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
        </Group>

        <Group collapsible title="Fields" icon={<Columns3 size={14} />}>
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
        </Group>
        {chart ? (
          <Group collapsible title="Chart data" icon={<Waypoints size={14} />}>
            <div className="stack">
              <EncodingsGroup
                actions={chartActions}
                chart={chart}
                fields={dataset.fields}
              />
              <AggregationGroup
                actions={chartActions}
                chart={chart}
                fields={dataset.fields}
              />
            </div>
          </Group>
        ) : null}
      </div>
    </Panel>
  )
}

export default BuildPanel
