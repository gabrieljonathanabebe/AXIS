import { initialWorkspaceState, workspaceReducer } from './workspaceReducer'

import type {
  WorkspaceAction,
  WorkspaceHistoryAction,
  WorkspaceHistoryState,
  WorkspaceSnapshot,
  WorkspaceState,
} from './types'

// ===== CONSTANTS =============================================================
const COALESCE_WINDOW_MS = 500
const HISTORY_LIMIT = 100

export const initialWorkspaceHistory: WorkspaceHistoryState = {
  future: [],
  lastCoalesceKey: null,
  lastTimestamp: 0,
  past: [],
  present: initialWorkspaceState,
}

// ===== HELPERS ===============================================================
/** Everything that changes the dashboard is undoable; selecting is not. */
function isUndoableAction(action: WorkspaceAction): boolean {
  return (
    action.type !== 'object/select' && !action.type.startsWith('selection/')
  )
}

/**
 * Groups quick edits of the same value into one undo step.
 * @param action Action that was just applied.
 * @returns Type, target and patch keys, or null for actions never grouped.
 */
function getCoalesceKey(action: WorkspaceAction): string | null {
  switch (action.type) {
    case 'card/updateAppearance':
    case 'card/updateData':
      return [
        action.type,
        action.cardId,
        ...Object.keys(action.patch).sort(),
      ].join(':')
    case 'chart/updateAggregation':
    case 'chart/updateAppearance':
    case 'chart/updateEncoding':
    case 'chart/updateInteraction':
      return [
        action.type,
        action.chartId,
        ...Object.keys(action.patch).sort(),
      ].join(':')
    case 'chart/updateMarkAppearance':
      return [
        action.type,
        action.chartId,
        action.mark,
        ...Object.keys(action.patch).sort(),
      ].join(':')
    case 'dashboard/update':
    case 'dashboard/updateLayout':
      return [action.type, ...Object.keys(action.patch).sort()].join(':')
    case 'object/updateContainer':
    case 'object/updateLayout':
      return [
        action.type,
        action.objectId,
        ...Object.keys(action.patch).sort(),
      ].join(':')
    default:
      return null
  }
}

/** Keeps the undoable part of the workspace. */
function createSnapshot(state: WorkspaceState): WorkspaceSnapshot {
  return {
    dashboard: state.dashboard,
    objects: state.objects,
    selectedObjectId: state.selectedObjectId,
  }
}

/**
 * Restores a snapshot; the data selection stays while its source exists.
 * @param state Current workspace.
 * @param snapshot Undoable part to restore.
 * @returns The workspace with the snapshot applied.
 */
function restoreSnapshot(
  state: WorkspaceState,
  snapshot: WorkspaceSnapshot,
): WorkspaceState {
  const selectionSourceExists = snapshot.objects.some((object) => {
    return object.id === state.selection?.sourceChartId
  })
  return {
    ...state,
    dashboard: snapshot.dashboard,
    objects: snapshot.objects,
    selectedObjectId: snapshot.selectedObjectId,
    selection: selectionSourceExists ? state.selection : null,
  }
}

function applyAction(
  history: WorkspaceHistoryState,
  action: WorkspaceAction,
  timestamp: number,
): WorkspaceHistoryState {
  const present = workspaceReducer(history.present, action)
  if (present === history.present) {
    return history
  }
  if (!isUndoableAction(action)) {
    return { ...history, present }
  }
  const coalesceKey = getCoalesceKey(action)
  const shouldCoalesce =
    coalesceKey !== null &&
    coalesceKey === history.lastCoalesceKey &&
    timestamp - history.lastTimestamp < COALESCE_WINDOW_MS
  return {
    future: [],
    lastCoalesceKey: coalesceKey,
    lastTimestamp: timestamp,
    past: shouldCoalesce
      ? history.past
      : [...history.past, createSnapshot(history.present)].slice(
          -HISTORY_LIMIT,
        ),
    present,
  }
}

function applyBatch(
  history: WorkspaceHistoryState,
  actions: WorkspaceAction[],
  timestamp: number,
): WorkspaceHistoryState {
  const present = actions.reduce(workspaceReducer, history.present)
  if (present === history.present) {
    return history
  }
  return {
    future: [],
    lastCoalesceKey: null,
    lastTimestamp: timestamp,
    past: [...history.past, createSnapshot(history.present)].slice(
      -HISTORY_LIMIT,
    ),
    present,
  }
}

function undo(history: WorkspaceHistoryState): WorkspaceHistoryState {
  const previous = history.past.at(-1)
  if (!previous) {
    return history
  }
  return {
    future: [createSnapshot(history.present), ...history.future],
    lastCoalesceKey: null,
    lastTimestamp: 0,
    past: history.past.slice(0, -1),
    present: restoreSnapshot(history.present, previous),
  }
}

function redo(history: WorkspaceHistoryState): WorkspaceHistoryState {
  const next = history.future[0]
  if (!next) {
    return history
  }
  return {
    future: history.future.slice(1),
    lastCoalesceKey: null,
    lastTimestamp: 0,
    past: [...history.past, createSnapshot(history.present)],
    present: restoreSnapshot(history.present, next),
  }
}

// ===== REDUCER ===============================================================
export function workspaceHistoryReducer(
  history: WorkspaceHistoryState,
  action: WorkspaceHistoryAction,
): WorkspaceHistoryState {
  switch (action.type) {
    case 'history/apply':
      return applyAction(history, action.action, action.timestamp)
    case 'history/applyBatch':
      return applyBatch(history, action.actions, action.timestamp)
    case 'history/redo':
      return redo(history)
    case 'history/undo':
      return undo(history)
  }
}
