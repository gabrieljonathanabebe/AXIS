import { UploadCloud } from 'lucide-react'
import type { ChangeEvent, DragEvent } from 'react'

type DatasetUploadProps = {
  isUploading?: boolean
  onUploadFile: (file: File) => Promise<void>
}

function DatasetUpload({
  isUploading = false,
  onUploadFile,
}: DatasetUploadProps) {
  async function handleFile(file: File): Promise<void> {
    await onUploadFile(file)
  }

  async function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    await handleFile(file)
    event.target.value = ''
  }

  async function handleDrop(event: DragEvent<HTMLLabelElement>): Promise<void> {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) {
      return
    }
    await handleFile(file)
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>): void {
    event.preventDefault()
  }
  return (
    <label
      className="dataset-upload widget is-interactive center stack"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <UploadCloud size={24} />
      <strong>{isUploading ? 'Uploading...' : 'Upload CSV'}</strong>
      <span>Drop a file here or click to choose.</span>
      <input
        accept=".csv,text/csv"
        disabled={isUploading}
        type="file"
        onChange={handleInputChange}
      />
    </label>
  )
}

export default DatasetUpload
