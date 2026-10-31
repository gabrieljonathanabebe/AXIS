import type { DashboardStyle } from '../../dashboardStyle/types'

/**
 * What a chart draws with besides its spec: the dashboard style for brush,
 * dimming and tooltip, and the app accent that marks the element in the
 * format popover.
 */
export type ChartTheme = {
  formatFocus: string
  style: DashboardStyle
}
