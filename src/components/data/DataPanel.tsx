import { FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'

import DatasetProfileView from './DatasetProfileView'
import DataTable from './DataTable'
import EmptyState from '../ui/EmptyState'
import Panel from '../ui/Panel'
import SegmentedControl from '../ui/SegmentedControl'

import type {
  Dataset,
  DatasetProfile,
  SemanticRole,
  SemanticRoleOverrides,
} from '../../types/chart'
import type { DataView } from '../../types/ui'
import type { OptionItem } from '../ui/OptionsMenu'

// ===== TYPES =================================================================
type DataPanelProps = {
  dataset: Dataset
  datasetName: string
  error: string | null
  isLoading: boolean
  profile: DatasetProfile | null
  semanticRoleOverrides: SemanticRoleOverrides
  onSemanticRoleChange: (fieldName: string, role: SemanticRole) => void
}

type DataViewPlaceholder = {
  description: string
  title: string
}

// ===== CONSTANTS =============================================================
const dataViewOptions: OptionItem<DataView>[] = [
  { label: 'Profile', value: 'profile' },
  { label: 'Table', value: 'table' },
]

// ===== HELPERS ===============================================================
function getProfileStatus(
  isLoading: boolean,
  error: string | null,
): DataViewPlaceholder {
  if (isLoading) {
    return { description: 'Profiling the dataset…', title: 'Loading profile' }
  }
  return {
    description: error ?? 'No profile is available for this dataset.',
    title: 'Profile unavailable',
  }
}

// ===== COMPONENT =============================================================
function DataPanel({
  dataset,
  datasetName,
  error,
  isLoading,
  profile,
  semanticRoleOverrides,
  onSemanticRoleChange,
}: DataPanelProps) {
  const [dataView, setDataView] = useState<DataView>('profile')
  function renderDataView() {
    if (dataView === 'table') {
      return (
        <DataTable
          dataset={dataset}
          profile={profile}
          semanticRoleOverrides={semanticRoleOverrides}
        />
      )
    }
    if (!profile) {
      return <EmptyState {...getProfileStatus(isLoading, error)} />
    }
    return (
      <DatasetProfileView
        profile={profile}
        semanticRoleOverrides={semanticRoleOverrides}
        onSemanticRoleChange={onSemanticRoleChange}
      />
    )
  }

  return (
    <Panel
      className="data-panel"
      icon={<FileSpreadsheet size={18} />}
      isFilled
      title={datasetName}
      actions={
        <SegmentedControl
          className="data-panel-views"
          label="Data view"
          options={dataViewOptions}
          value={dataView}
          onValueChange={setDataView}
        />
      }
    >
      {renderDataView()}
    </Panel>
  )
}

export default DataPanel
