import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Loads data with `load(signal)` whenever `key` changes.
 * Returns { data, error, loading, reload, setData }.
 *
 * Results are stored together with the key they belong to, so "loading" is
 * simply "we don't have a result for the current key yet". Old requests are
 * cancelled with an AbortController when the key changes or the page unmounts.
 */
export function useFetch(load, key) {
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const [reloadCount, setReloadCount] = useState(0)
  const loadRef = useRef(load)
  const requestKey = `${key}#${reloadCount}`

  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    const controller = new AbortController()

    loadRef.current(controller.signal)
      .then((data) => setResult({ key: requestKey, data, error: null }))
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, data: null, error })
      })

    return () => controller.abort()
  }, [requestKey])

  const loading = result.key !== requestKey
  const reload = useCallback(() => setReloadCount((n) => n + 1), [])
  const setData = useCallback((update) => {
    setResult((prev) => ({ ...prev, data: typeof update === 'function' ? update(prev.data) : update }))
  }, [])

  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    reload,
    setData,
  }
}
