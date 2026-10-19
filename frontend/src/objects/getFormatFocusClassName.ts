import type { ObjectFormatElement } from './types'

/**
 * Mirrors the format focus on an HTML element of an object's content.
 * @param element Element that gets the class, e.g. the title.
 * @param formattedElement Element in the popover, or null when it is closed.
 * @returns Glow while the element is formatted, dimmed for other elements;
 *   nothing while the object as a whole is formatted.
 */
export function getFormatFocusClassName(
  element: ObjectFormatElement,
  formattedElement: ObjectFormatElement | null,
): string {
  if (!formattedElement || formattedElement === 'container') {
    return ''
  }
  return formattedElement === element ? 'is-formatted' : 'is-dimmed'
}
