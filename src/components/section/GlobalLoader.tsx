import { useEffect, useState, useSyncExternalStore } from 'react'
import { getPendingRequests, subscribeToRequests } from '@/src/state/api-loading'

// a request that answers fast should not make the screen flicker
const BAR_DELAY_MS = 150

/**
 * Tells the user that something is loading, for every request to the api:
 * a thin moving bar at the top of the page (after a blink, so fast requests do not flicker).
 */
const GlobalLoader = () => {
  const isLoading = useSyncExternalStore(subscribeToRequests, getPendingRequests) > 0
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowBar(false)

      return
    }

    const barTimer = window.setTimeout(() => setShowBar(true), BAR_DELAY_MS)

    return () => window.clearTimeout(barTimer)
  }, [isLoading])

  if (!showBar) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[1200] h-1 overflow-hidden bg-green/20" role="progressbar" aria-busy="true">
      <div className="global-loader-bar" />
    </div>
  )
}

export default GlobalLoader
