import { Ban } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'

import { getSemanticCompatibility } from './chartDefinitions'

import type { ChartDefinition, EncodingDefinition } from './chartDefinitions'
import type { ChartEncoding } from './types'
import type { DataField } from '../datasets/types'
import type { DropTarget } from '../workspace/types'

type EncodingDropSlotsProps = {
  chartId: string
  definition: ChartDefinition
  encoding: ChartEncoding
  field: DataField
}

type EncodingDropSlotProps = {
  chartId: string
  currentFieldName: string | undefined
  definition: ChartDefinition
  encoding: EncodingDefinition
  field: DataField
}

function EncodingDropSlot({
  chartId,
  currentFieldName,
  definition,
  encoding,
  field,
}: EncodingDropSlotProps) {
  const compatibility = getSemanticCompatibility(
    definition,
    encoding.key,
    field.semantic_role,
  )
  const isInvalid = compatibility === 'invalid'
  const valueText = isInvalid
    ? 'Not compatible'
    : currentFieldName
      ? `Replaces ${currentFieldName}`
      : 'Drop here'
  const target: DropTarget = {
    chartId,
    encodingKey: encoding.key,
    kind: 'encoding',
  }
  const { isOver, setNodeRef } = useDroppable({
    data: { target },
    disabled: isInvalid,
    id: `chart:${chartId}:encoding:${encoding.key}`,
  })
  return (
    <div
      aria-disabled={isInvalid}
      aria-label={`Drop ${field.name} to set ${encoding.label}`}
      className={`encoding-drop-slot is-${compatibility} ${
        currentFieldName ? 'is-filled' : ''
      } ${isOver ? 'is-over' : ''}`}
      ref={setNodeRef}
    >
      <span className="encoding-drop-slot-header">
        <span className="encoding-drop-slot-label">{encoding.label}</span>
        {compatibility === 'recommended' ? (
          <span className="encoding-drop-slot-hint">Recommended</span>
        ) : null}
      </span>
      <span className="encoding-drop-slot-value">
        {isInvalid ? <Ban size={14} /> : null}
        {valueText}
      </span>
    </div>
  )
}

/** One drop target per encoding of the chart while a field is dragged. */
function EncodingDropSlots({
  chartId,
  definition,
  encoding,
  field,
}: EncodingDropSlotsProps) {
  return (
    <div className="encoding-drop-slots">
      {definition.encodings.map((encodingDefinition) => (
        <EncodingDropSlot
          chartId={chartId}
          currentFieldName={encoding[encodingDefinition.key]}
          definition={definition}
          encoding={encodingDefinition}
          field={field}
          key={encodingDefinition.key}
        />
      ))}
    </div>
  )
}

export default EncodingDropSlots
