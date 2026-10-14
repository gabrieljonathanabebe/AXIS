import { Ellipsis } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'

import WidgetButton from '../shared/ui/WidgetButton'
import { objectPickerOptions } from './objectDefinitions'

import type { DragPayload } from '../workspace/types'
import type { ObjectPickerOption } from './objectDefinitions'
import type { ObjectTemplate } from './types'

type ObjectPickerProps = {
  onAddObject: (template: ObjectTemplate) => void
}

type ObjectOptionContentProps = {
  option: ObjectPickerOption
}

type DraggableObjectOptionProps = {
  option: ObjectPickerOption
  onAddObject: (template: ObjectTemplate) => void
}

/** Icon and label of a picker option, also shown while it is dragged. */
export function ObjectOptionContent({ option }: ObjectOptionContentProps) {
  const { icon: Icon, label } = option
  return (
    <>
      <Icon size={20} />
      <span className="chart-type-option-label">{label}</span>
    </>
  )
}

/** Adds its object on click or when dropped on the canvas. */
function DraggableObjectOption({
  option,
  onAddObject,
}: DraggableObjectOptionProps) {
  const payload: DragPayload = { kind: 'object-option', option }
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    data: { payload },
    id: `object-option:${option.label}`,
  })

  return (
    <WidgetButton
      ref={setNodeRef}
      aria-label={option.addLabel}
      title={option.addLabel}
      className={`chart-type-option stack center ${isDragging ? 'is-dragging' : ''}`}
      onClick={() => onAddObject(option.template)}
      {...listeners}
      {...attributes}
    >
      <ObjectOptionContent option={option} />
    </WidgetButton>
  )
}

/** Lists everything that can be added to the canvas, from the registry. */
function ObjectPicker({ onAddObject }: ObjectPickerProps) {
  return (
    <div className="chart-type-picker auto-grid">
      {objectPickerOptions.map((option) => (
        <DraggableObjectOption
          key={option.label}
          option={option}
          onAddObject={onAddObject}
        />
      ))}
      <WidgetButton
        aria-label="More visuals"
        title="More visuals coming soon"
        className="chart-type-option chart-type-more stack center"
        disabled
      >
        <Ellipsis size={20} />
        <span className="chart-type-option-label">More</span>
      </WidgetButton>
    </div>
  )
}

export default ObjectPicker
