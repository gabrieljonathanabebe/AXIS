import { FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'

import DataTable from './DataTable'
import EmptyState from '../ui/EmptyState'
import Panel from '../ui/Panel'
import SegmentedControl from '../ui/SegmentedControl'

import type { Dataset } from '../../types/chart'
import type { DataView } from '../../types/ui'
import type { OptionItem } from '../ui/OptionsMenu'

// ===== TYPES =================================================================
type DataPanelProps = {
  dataset: Dataset
  datasetName: string
}

type DataViewPlaceholder = {
  description: string
  title: string
}

// ===== CONSTANTS =============================================================
const dataViewOptions: OptionItem<DataView>[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Fields', value: 'fields' },
  { label: 'Table', value: 'table' },
]

const dataViewPlaceholders: Record<
  Exclude<DataView, 'table'>,
  DataViewPlaceholder
> = {
  fields: {
    description: 'Detailed profiles for each field will appear here.',
    title: 'Field profiles',
  },
  overview: {
    description: 'A compact summary of the dataset will appear here.',
    title: 'Dataset overview',
  },
}

// ===== COMPONENT =============================================================
function DataPanel({ dataset, datasetName }: DataPanelProps) {
  const [dataView, setDataView] = useState<DataView>('table')

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
      {dataView === 'table' ? (
        <DataTable dataset={dataset} />
      ) : (
        <EmptyState {...dataViewPlaceholders[dataView]} />
      )}
    </Panel>
  )
}

export default DataPanel
