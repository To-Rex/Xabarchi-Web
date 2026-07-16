import { useCallback, useEffect, useRef, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Minimal data-fetching hook over the mock repositories.
 * Mirrors the shape of a real query library so swapping one in later is trivial.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const fnRef = useRef(fn)
  fnRef.current = fn
  const runIdRef = useRef(0)

  const run = useCallback(async () => {
    const runId = ++runIdRef.current
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fnRef.current()
      if (runId === runIdRef.current) setState({ data, loading: false, error: null })
    } catch (error) {
      if (runId === runIdRef.current) setState((prev) => ({ ...prev, loading: false, error: error as Error }))
    }
  }, [])

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, refetch: run }
}
