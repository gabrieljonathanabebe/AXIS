import { FileSpreadsheet, UploadCloud } from 'lucide-react'
import { useRef } from 'react'

import { formatCompactNumber } from '@/shared/format/formatNumber'
import IconButton from '@/shared/ui/primitives/IconButton'
import Tile from '@/shared/ui/tiles/Tile'

import type { ChangeEvent, DragEvent } from 'react'

type DatasetTileProps = {
  fieldCount: number
  isDemo: boolean
  isLoading: boolean
  name: string
  rowCount: number
  onUploadFile: (file: File) => Promise<void>
}

function DatasetTile({
  fieldCount,
  isDemo,
  isLoading,
  name,
  rowCount,
  onUploadFile,
}: DatasetTileProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const uploadLabel = isDemo ? 'Upload CSV' : 'Replace dataset'

  async function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    await onUploadFile(file)
    event.target.value = ''
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>): Promise<void> {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) {
      return
    }
    await onUploadFile(file)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault()
  }

  return (
    <Tile
      className="dataset-tile cluster"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <span className="dataset-tile-icon">
        <FileSpreadsheet size={16} />
      </span>

      <span className="dataset-tile-text stack">
        <strong className="dataset-tile-name" title={name}>
          {name}
        </strong>
        <span className="dataset-tile-meta">
          {isLoading
            ? 'Loading...'
            : `${formatCompactNumber(rowCount)} rows · ${fieldCount} fields`}
        </span>
      </span>

      <IconButton
        label={uploadLabel}
        size="sm"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud size={14} />
      </IconButton>

      <input
        ref={inputRef}
        accept=".csv,text/csv"
        disabled={isLoading}
        hidden
        type="file"
        onChange={handleInputChange}
      />
    </Tile>
  )
}

export default DatasetTile
