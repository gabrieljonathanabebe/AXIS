import { Ban } from 'lucide-react'

import DropSlot from '../workspace/DropSlot'
import { getSemanticCompatibility } from './chartDefinitions'

import type { DataField } from '../datasets/types'
import type { ChartDefinition, EncodingDefinition } from './chartDefinitions'
import type { ChartEncoding } from './types'

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
  return (
    <DropSlot
      ariaLabel={`Drop ${field.name} to set ${encoding.label}`}
      className={`is-${compatibility} ${currentFieldName ? 'is-filled' : ''}`}
      hint={compatibility === 'recommended' ? 'Recommended' : undefined}
      icon={isInvalid ? <Ban size={14} /> : null}
      id={`chart:${chartId}:encoding:${encoding.key}`}
      isDisabled={isInvalid}
      label={encoding.label}
      target={{ chartId, encodingKey: encoding.key, kind: 'encoding' }}
      valueText={valueText}
    />
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
