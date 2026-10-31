import { createDefaultCardSpec } from '../cards/createCardInstance'
import { createDefaultChartSpec } from '../charts/createChartInstance'
import { createDashboardStyle } from './createDashboardStyle'
import { takeStyleColors } from './takeStyleColors'

import type { DashboardObject } from '../objects/types'
import type { WorkspaceAction, WorkspaceState } from '../workspace/types'
import type { DashboardStyle, StyleRecipe } from './types'

// ===== HELPERS ===============================================================
/**
 * Restyles one object: its container completely from the material, the
 * colors of its content from the defaults its kind gets in the style.
 * @param object Object on the canvas.
 * @param style Style to apply.
 * @returns Container action and appearance action of the object.
 */
function createObjectStyleActions(
  object: DashboardObject,
  style: DashboardStyle,
): WorkspaceAction[] {
  const containerAction: WorkspaceAction = {
    type: 'object/updateContainer',
    objectId: object.id,
    patch: style.container,
  }
  switch (object.kind) {
    case 'chart':
      return [
        containerAction,
        {
          type: 'chart/updateAppearance',
          chartId: object.id,
          patch: takeStyleColors(
            object.spec.appearance,
            createDefaultChartSpec(object.type, style).appearance,
          ),
        },
      ]
    case 'card':
      return [
        containerAction,
        {
          type: 'card/updateAppearance',
          cardId: object.id,
          patch: takeStyleColors(
            object.spec.appearance,
            createDefaultCardSpec(style).appearance,
          ),
        },
      ]
  }
}

// ===== FUNCTION ==============================================================
/**
 * Turns applying a style into workspace actions: the recipe and its canvas
 * on the dashboard, then container and colors of every object. Dispatched
 * as one batch, so one undo step reverts all of it.
 * @param state Current workspace.
 * @param recipe Recipe of the style to apply.
 * @returns Actions that write the real values of the style.
 */
export function createApplyStyleActions(
  state: WorkspaceState,
  recipe: StyleRecipe,
): WorkspaceAction[] {
  const style = createDashboardStyle(recipe)
  return [
    {
      type: 'dashboard/update',
      patch: { canvas: style.canvas, style: recipe },
    },
    ...state.objects.flatMap((object) => {
      return createObjectStyleActions(object, style)
    }),
  ]
}
