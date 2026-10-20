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
    let pointerId: number | null = null

    const finishDrag = () => {
      delete el.dataset.dragging
      pointerId = null
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if (e.target instanceof Element && e.target.closest('a, button, input, textarea, select')) return
      cancelAnimationFrame(raf)
      dragging = true
      pointerId = e.pointerId
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
      if (!dragging || e.pointerId !== pointerId) return
      dragging = false
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      if (e.type === 'pointercancel' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finishDrag()
        return
      }
      // Limita a inércia para evitar saltos longos ao soltar o ponteiro.
      let v = Math.max(-1, Math.min(1, velocity)) * 16
      const step = () => {
        v *= 0.92
        if (Math.abs(v) < 0.5) {
          finishDrag()
          return
        }
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
      finishDrag()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [ref, enabled])
}
