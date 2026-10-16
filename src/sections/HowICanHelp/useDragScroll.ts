import { useEffect, type RefObject } from 'react'

/** Arraste com mouse em um contêiner de overflow horizontal nativo (toque e trackpad continuam nativos). */
export function useDragScroll(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let startX = 0
    let startScroll = 0
    let dragging = false
    let lastX = 0
    let lastT = 0
    let velocity = 0
    let raf = 0

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if ((e.target as HTMLElement).closest('a, button, input, textarea, select')) return
      cancelAnimationFrame(raf)
      dragging = true
      startX = lastX = e.clientX
      lastT = performance.now()
      startScroll = el.scrollLeft
      velocity = 0
      el.setPointerCapture(e.pointerId)
      el.dataset.dragging = 'true'
    }

    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const dt = Math.max(now - lastT, 1)
      velocity = (e.clientX - lastX) / dt
      lastX = e.clientX
      lastT = now
      el.scrollLeft = startScroll - (e.clientX - startX)
    }

    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      delete el.dataset.dragging
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      // Inércia curta para um arraste natural.
      let v = velocity * 16
      const step = () => {
        v *= 0.92
        if (Math.abs(v) < 0.5) return
        el.scrollLeft -= v
        raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [ref, enabled])
}
