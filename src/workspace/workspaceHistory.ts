import { initialWorkspaceState, workspaceReducer } from './workspaceReducer'
import type {
  WorkspaceAction,
  WorkspaceHistoryAction,
  WorkspaceHistoryState,
  WorkspaceSnapshot,
  WorkspaceState,
} from '../types/workspace'

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
function isUndoableAction(action: WorkspaceAction): boolean {
  return (
    action.type !== 'chart/select' &&
    (action.type.startsWith('chart/') || action.type.startsWith('dashboard/'))
  )
}

function getCoalesceKey(action: WorkspaceAction): string | null {
  switch (action.type) {
    case 'chart/updateAggregation':
    case 'chart/updateAppearance':
    case 'chart/updateContainer':
    case 'chart/updateEncoding':
    case 'chart/updateInteraction':
    case 'chart/updateLayout':
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
    default:
      return null
  }
}

function createSnapshot(state: WorkspaceState): WorkspaceSnapshot {
  return {
    charts: state.charts,
    dashboard: state.dashboard,
    selectedChartId: state.selectedChartId,
  }
}

function restoreSnapshot(
  state: WorkspaceState,
  snapshot: WorkspaceSnapshot,
): WorkspaceState {
  const selectionSourceExists = snapshot.charts.some((chart) => {
    return chart.id === state.selection?.sourceChartId
  })
  return {
    ...state,
    charts: snapshot.charts,
    dashboard: snapshot.dashboard,
    selectedChartId: snapshot.selectedChartId,
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
    case 'history/redo':
      return redo(history)
    case 'history/undo':
      return undo(history)
  }
}
