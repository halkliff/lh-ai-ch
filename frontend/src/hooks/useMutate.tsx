import { useCallback, useState } from 'react'

export interface UseMutateProps<
  T = unknown,
  TErr extends string | Error = Error,
  TVars = void
> {
  mutator: (arg: TVars) => Promise<T>
  onSuccess?: (data: T) => void
  onError?: (error: TErr) => void
  throwError?: boolean
}

export function useMutate<
  T = unknown,
  TErr extends string | Error = Error,
  TVars = void
>(props: UseMutateProps<T, TErr, TVars>) {
  const { mutator, onSuccess, onError, throwError } = props
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<TErr | null>(null)

  const isIdle = !pending && !error && !success

  const mutate = useCallback(
    async (arg: TVars) => {
      if (!isIdle) return null as unknown as T
      setPending(true)
      setError(null)
      try {
        const data = await mutator(arg)
        setPending(false)
        if (onSuccess) {
          onSuccess(data)
        }
        setSuccess(true)
        return data
      } catch (err) {
        setPending(false)
        setError(err as TErr)
        if (onError) {
          onError(err as TErr)
        }
        setSuccess(false)
        if (throwError) {
          throw err
        }
        return null as unknown as T
      }
    },
    [mutator, onSuccess, onError, throwError, isIdle]
  )

  const reset = useCallback(() => {
    setError(null)
    setPending(false)
    setSuccess(false)
  }, [])

  return { mutate, pending, error, isIdle, reset }
}
