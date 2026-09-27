import type {
  ChartAggregationKey,
  ChartAppearanceSpec,
  ChartDataSpec,
  ChartEncoding,
  ChartInstance,
  ChartInteractionSpec,
  ChartLayout,
  ChartMarkKey,
  ChartSpec,
  ChartType,
  DataValue,
} from './chart'

// ===== STATE =================================================================
export type WorkspaceState = {
  charts: ChartInstance[]
  selectedChartId: string | null
  selection: DataSelection | null
}

// ===== ACTIONS ===============================================================
export type WorkspaceAction =
  | {
      type: 'chart/add'
      chart: ChartInstance
    }
  | {
      type: 'chart/duplicate'
      chartId: string
      newChartId: string
    }
  | {
      type: 'chart/remove'
      chartId: string
    }
  | {
      type: 'chart/select'
      chartId: string | null
    }
  | {
      type: 'chart/setType'
      chartId: string
      chartType: ChartType
      defaultSpec: ChartSpec
    }
  | {
      type: 'chart/updateAggregation'
      chartId: string
      patch: Partial<Pick<ChartDataSpec, ChartAggregationKey>>
    }
  | {
      type: 'chart/updateAppearance'
      chartId: string
      patch: Partial<ChartAppearanceSpec>
    }
  | {
      type: 'chart/updateEncoding'
      chartId: string
      patch: Partial<ChartEncoding>
    }
  | {
      type: 'chart/updateInteraction'
      chartId: string
      patch: Partial<ChartInteractionSpec>
    }
  | {
      type: 'chart/updateLayout'
      chartId: string
      patch: Partial<ChartLayout>
    }
  | {
      type: 'chart/updateMarkAppearance'
      chartId: string
      mark: ChartMarkKey
      patch: Partial<ChartAppearanceSpec[ChartMarkKey]>
    }
  | {
      type: 'selection/clear'
    }
  | {
      type: 'selection/set'
      selection: DataSelection
    }

// ===== SELECTION =============================================================
export type DataSelection = {
  sourceChartId: string
  field: string
  values: DataValue[]
}
