import { useEffect, useRef, useState } from 'react'

import { postAiCommand } from '../api/aiCommands'

import type { AiChartContext } from '../api/aiCommands'
import type { CevynActionError, CevynActionResult } from '../types/actions'
import type { ChartInstance, Dataset } from '../types/chart'

// ===== TYPES =================================================================
type UseAskCevynParams = {
  charts: ChartInstance[]
  dataset: Dataset
  runActions: (input: unknown) => CevynActionResult
}

export type AskCevynState = {
  messages: string[]
  status: 'error' | 'idle' | 'info' | 'loading' | 'success'
}

// ===== CONSTANTS =============================================================
const INITIAL_STATE: AskCevynState = { messages: [], status: 'idle' }

// ===== HELPERS ===============================================================
function toChartContext(chart: ChartInstance): AiChartContext {
  const { title } = chart.spec.appearance
  return {
    aggregation: chart.spec.data.aggregation,
    encoding: chart.spec.data.encoding,
    id: chart.id,
    title: title.enabled ? title.text : undefined,
    type: chart.type,
  }
}

function formatActionError({ index, message }: CevynActionError): string {
  return index === undefined ? message : `Action ${index + 1}: ${message}`
}

// ===== FUNCTION ==============================================================
export function useAskCevyn({
  charts,
  dataset,
  runActions,
}: UseAskCevynParams) {
  const [askCevynState, setAskCevynState] =
    useState<AskCevynState>(INITIAL_STATE)
  const runActionsRef = useRef(runActions)

  // Latest runActions, so a late AI response applies to the current workspace.
  useEffect(() => {
    runActionsRef.current = runActions
  })
  async function askCevyn(prompt: string): Promise<void> {
    setAskCevynState({ messages: [], status: 'loading' })
    try {
      const result = await postAiCommand({
        charts: charts.map(toChartContext),
        fields: dataset.fields,
        prompt,
      })
      const aiMessages = result.message ? [result.message] : []
      if (result.actions === null) {
        setAskCevynState({ messages: aiMessages, status: 'info' })
        return
      }
      const actionResult = runActionsRef.current(result.actions)
      setAskCevynState(
        actionResult.ok
          ? { messages: aiMessages, status: 'success' }
          : {
              messages: actionResult.errors.map(formatActionError),
              status: 'error',
            },
      )
    } catch (error) {
      setAskCevynState({
        messages: [error instanceof Error ? error.message : String(error)],
        status: 'error',
      })
    }
  }

  return { askCevyn, askCevynState }
}
