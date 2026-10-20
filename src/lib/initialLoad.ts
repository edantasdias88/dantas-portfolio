type ReadyListener = () => void

let heroReady = false
const listeners = new Set<ReadyListener>()

export function markHeroReady() {
  if (heroReady) return
  heroReady = true
  listeners.forEach((listener) => listener())
  listeners.clear()
}

export function subscribeToHeroReady(listener: ReadyListener) {
  if (heroReady) {
    listener()
    return () => {}
  }

  listeners.add(listener)
  return () => listeners.delete(listener)
}
