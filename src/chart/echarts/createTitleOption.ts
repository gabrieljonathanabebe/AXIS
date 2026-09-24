import type { TitleComponentOption } from 'echarts'

import type {
  ChartEncoding,
  ChartTitleAppearance,
  ChartType,
} from '../../types/chart'
import type { ChartTheme } from './chartTheme'

// ===== TYPES =================================================================
type CreateTitleOptionParams = {
  appearance: ChartTitleAppearance
  chartType: ChartType
  encoding: ChartEncoding
  theme: ChartTheme
}

// ===== HELPER ================================================================
function getDefaultChartTitle(
  chartType: ChartType,
  encoding: ChartEncoding,
): string {
  const xFieldName = encoding.x?.name
  const yFieldName = encoding.y?.name

  if (!xFieldName && !yFieldName) {
    return 'Untitled Chart'
  }

  const xLabel = xFieldName ?? 'Category'
  const yLabel = yFieldName ?? 'Value'

  if (chartType === 'scatter') {
    return `${yLabel} vs. ${xLabel}`
  }
  return `${yLabel} by ${xLabel}`
}

// ===== FUNCTION ==============================================================
export function createTitleOption({
  appearance,
  chartType,
  encoding,
  theme,
}: CreateTitleOptionParams): TitleComponentOption {
  return {
    left: appearance.alignment,
    show: appearance.enabled,
    text: appearance.text.trim() || getDefaultChartTitle(chartType, encoding),
    textStyle: {
      color: theme.axis,
      fontSize: 16,
      fontWeight: 600,
    },
    top: 16,
  }
}
