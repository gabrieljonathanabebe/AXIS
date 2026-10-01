import { FileSpreadsheet, UploadCloud } from 'lucide-react'
import { useRef } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import IconButton from '../ui/IconButton'
import Widget from '../ui/Widget'

type DatasetCardProps = {
  fieldCount: number
  isDemo: boolean
  isUploading: boolean
  name: string
  rowCount: number
  onUploadFile: (file: File) => Promise<void>
}

const rowCountFormat = new Intl.NumberFormat('en', { notation: 'compact' })

function DatasetCard({
  fieldCount,
  isDemo,
  isUploading,
  name,
  rowCount,
  onUploadFile,
}: DatasetCardProps) {
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
    <Widget
      className="dataset-card cluster"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <span className="dataset-card-icon">
        <FileSpreadsheet size={16} />
      </span>

      <span className="dataset-card-text stack">
        <strong className="dataset-card-name" title={name}>
          {name}
        </strong>
        <span className="dataset-card-meta">
          {isUploading
            ? 'Uploading...'
            : `${rowCountFormat.format(rowCount)} rows · ${fieldCount} fields`}
        </span>
      </span>

      <IconButton
        label={uploadLabel}
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud size={14} />
      </IconButton>

      <input
        ref={inputRef}
        accept=".csv,text/csv"
        disabled={isUploading}
        hidden
        type="file"
        onChange={handleInputChange}
      />
    </Widget>
  )
}

export default DatasetCard
