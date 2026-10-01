import { Calendar, CaseUpper, Hash, IdCard } from 'lucide-react'

import type { SemanticType } from '../../types/chart'

type DataTypeIconProps = {
  type: SemanticType
  size?: number
}

function DataTypeIcon({ type, size = 15 }: DataTypeIconProps) {
  if (type === 'temporal') {
    return <Calendar size={size} />
  }

  if (type === 'numeric') {
    return <Hash size={size} />
  }

  if (type === 'identifier') {
    return <IdCard size={size} />
  }

  return <CaseUpper size={size} />
}

export default DataTypeIcon
