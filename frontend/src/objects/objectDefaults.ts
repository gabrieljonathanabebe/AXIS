import type { StrokeStyle } from '../shared/strokeStyle'
import type { TextStyle } from '../shared/textStyle'
import type { ObjectContainer, ObjectTitleAppearance } from './types'

// ===== CONSTANTS =============================================================
/** Default look of an object title, of charts and cards alike. */
export const TITLE_TEXT_STYLE: TextStyle = {
  color: { kind: 'token', token: 'text' },
  fontSize: 14,
  fontStyle: 'normal',
  fontWeight: 'medium',
}

/** Default container border; hidden until the user gives it a width. */
export const CONTAINER_BORDER: StrokeStyle = {
  color: { kind: 'token', token: 'border' },
  lineStyle: 'solid',
  opacity: 1,
  width: 0,
}

// ===== FUNCTIONS =============================================================
/** Creates the title every new object starts with; its text is empty. */
export function createDefaultTitle(): ObjectTitleAppearance {
  return {
    layout: { alignment: 'start' },
    text: '',
    textStyle: TITLE_TEXT_STYLE,
    visible: true,
  }
}

/** Creates the container every new object starts with. */
export function createDefaultContainer(): ObjectContainer {
  return {
    background: {
      color: { kind: 'custom', color: '#202226' },
      kind: 'solid',
      opacity: 1,
    },
    border: CONTAINER_BORDER,
    borderRadius: 24,
    layout: { padding: 4 },
  }
}
