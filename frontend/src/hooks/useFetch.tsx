import { useCallback, useEffect, useState } from 'react'

export function useFetch<T = unknown, TErr extends string | Error = Error>(
  fetcher: (signal?: AbortSignal) => Promise<T>,
  abortSignal?: AbortSignal
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<TErr | null>(null)

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {
        const promise = new Promise<T>((resolve, reject) => {
          const canceller = () => {
            reject(new Error('Fetch aborted'))
          }

          signal?.addEventListener('abort', canceller)

          fetcher(signal).then(resolve).catch(reject)

          signal?.removeEventListener('abort', canceller)
        })
        const result = await promise
        setData(result)
      } catch (err) {
        setError(err as TErr)
      } finally {
        setLoading(false)
      }
    },
    [fetcher]
  )

  const refetch = useCallback(
    async (signal?: AbortSignal) => {
      if (loading) return
      setData(null)
      return await fetchData(signal)
    },
    [loading, fetchData]
  )

  useEffect(() => {
    const controller = new AbortController()

    if (abortSignal?.aborted) {
      controller.abort()
    }

    const onAbort = () => controller.abort()
    abortSignal?.addEventListener('abort', onAbort)

    fetchData(controller.signal)

    return () => {
      controller.abort()
      abortSignal?.removeEventListener('abort', onAbort)
    }
  }, [fetchData, abortSignal])

  return { data: data as T, loading, error, refetch }
}
