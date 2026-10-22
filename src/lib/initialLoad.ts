type ReadyListener = () => void

let initialContentReady = false
const listeners = new Set<ReadyListener>()

export function markInitialContentReady() {
  if (initialContentReady) return
  initialContentReady = true
  listeners.forEach((listener) => listener())
  listeners.clear()
}

export function subscribeToInitialContentReady(listener: ReadyListener) {
  if (initialContentReady) {
    listener()
    return () => {}
  }

  listeners.add(listener)
  return () => listeners.delete(listener)
}
