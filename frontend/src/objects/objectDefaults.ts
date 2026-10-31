import { createColorValue } from '../shared/colorValue'

import type { DashboardStyle } from '../dashboardStyle/types'
import type { ObjectContainer, ObjectTitleAppearance } from './types'

// ===== FUNCTIONS =============================================================
/**
 * Creates the title every new object starts with; its text is empty and
 * its color comes from the style.
 * @param style Current dashboard style.
 * @returns Visible empty title.
 */
export function createDefaultTitle(
  style: DashboardStyle,
): ObjectTitleAppearance {
  return {
    layout: { alignment: 'start' },
    text: '',
    textStyle: {
      color: createColorValue(style.colors.text),
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: 'medium',
    },
    visible: true,
  }
}

/**
 * Creates the container every new object starts with: background, border
 * and effects from the material of the style, radius and padding fixed.
 * @param style Current dashboard style.
 * @returns Container of a new object.
 */
export function createDefaultContainer(style: DashboardStyle): ObjectContainer {
  return {
    ...style.container,
    borderRadius: 24,
    layout: { padding: 4 },
  }
}
