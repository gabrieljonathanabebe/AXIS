import type { CardFormatElement } from './types'
import type { ObjectFormatElement } from '../objects/types'

const cardFormatElements: readonly ObjectFormatElement[] = [
  'container',
  'selectionLabel',
  'title',
  'value',
] satisfies CardFormatElement[]

/**
 * Tells whether a format element belongs to cards.
 * @param element Element of a format target, or null when none is open.
 * @returns True for container, title, value and selection label.
 */
export function isCardFormatElement(
  element: ObjectFormatElement | null,
): element is CardFormatElement {
  return element !== null && cardFormatElements.includes(element)
}
