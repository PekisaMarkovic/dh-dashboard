/**
 * How many api requests are waiting for an answer right now.
 * A small store outside of redux, so the api client can use it without a component.
 * The GlobalLoader shows a loader while the number is above 0.
 */
let pending = 0
const listeners = new Set<() => void>()

const notify = () => listeners.forEach((listener) => listener())

export const startRequest = () => {
  pending += 1
  notify()
}

// never goes below 0, a request that ended twice must not hide the loader of another one
export const endRequest = () => {
  pending = Math.max(0, pending - 1)
  notify()
}

export const subscribeToRequests = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const getPendingRequests = () => pending
