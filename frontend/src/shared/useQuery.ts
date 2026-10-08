import { useEffect, useEffectEvent, useState } from 'react'

// ===== TYPES =================================================================
type QueryOptions<TRequest, TResult> = {
  errorMessage: string
  keepPreviousResult?: boolean
  load: (request: TRequest) => Promise<TResult>
  request: TRequest | null
}

type QueryState<TResult> = {
  error: string | null
  key: string | null
  result: TResult | null
}

export type Query<TResult> = {
  error: string | null
  isLoading: boolean
  result: TResult | null
}

// ===== CONSTANTS =============================================================
const idleQuery: Query<never> = { error: null, isLoading: false, result: null }

// ===== HOOK ==================================================================
/** Loads `request` whenever its content changes; `null` loads nothing. */
export function useQuery<TRequest, TResult>({
  errorMessage,
  keepPreviousResult = false,
  load,
  request,
}: QueryOptions<TRequest, TResult>): Query<TResult> {
  const [state, setState] = useState<QueryState<TResult>>({
    error: null,
    key: null,
    result: null,
  })
  const key = request === null ? null : JSON.stringify(request)
  const loadRequest = useEffectEvent(() => load(request as TRequest))

  useEffect(() => {
    if (key === null) {
      return
    }
    let isActive = true
    loadRequest()
      .then((result) => {
        if (isActive) {
          setState({ error: null, key, result })
        }
      })
      .catch(() => {
        if (isActive) {
          setState({ error: errorMessage, key, result: null })
        }
      })
    return () => {
      isActive = false
    }
  }, [errorMessage, key])

  if (key === null) {
    return idleQuery
  }
  const isCurrent = state.key === key
  return {
    error: isCurrent ? state.error : null,
    isLoading: !isCurrent,
    result: isCurrent || keepPreviousResult ? state.result : null,
  }
}
