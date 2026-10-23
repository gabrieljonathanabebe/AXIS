import { useDraggable } from '@dnd-kit/core'
import { Ellipsis } from 'lucide-react'

import WidgetButton from '../shared/ui/WidgetButton'
import { getGroupPickerOptions } from './objectDefinitions'

import type { DragPayload } from '../workspace/types'
import type { ObjectGroup, ObjectPickerOption } from './objectDefinitions'
import type { ObjectTemplate } from './types'

type ObjectPickerProps = {
  group: ObjectGroup
  showMore?: boolean
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

/** Lists the objects of one picker section, from the registry. */
function ObjectPicker({
  group,
  showMore = false,
  onAddObject,
}: ObjectPickerProps) {
  return (
    <div className="chart-type-picker auto-grid">
      {getGroupPickerOptions(group).map((option) => (
        <DraggableObjectOption
          key={option.label}
          option={option}
          onAddObject={onAddObject}
        />
      ))}
      {showMore ? (
        <WidgetButton
          aria-label="More visuals"
          title="More visuals coming soon"
          className="chart-type-option chart-type-more stack center"
          disabled
        >
          <Ellipsis size={20} />
          <span className="chart-type-option-label">More</span>
        </WidgetButton>
      ) : null}
    </div>
  )
}

export default ObjectPicker
