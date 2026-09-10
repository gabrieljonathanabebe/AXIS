import { Calendar, Hash, Tags } from 'lucide-react'
import type { DataType } from '../types/chart'

type DataTypeIconProps = {
  type: DataType
  size?: number
}

function DataTypeIcon({ type, size = 15 }: DataTypeIconProps) {
  if (type === 'date') {
    return <Calendar size={size} />
  }

  if (type === 'number') {
    return <Hash size={size} />
  }

  return <Tags size={size} />
}

export default DataTypeIcon