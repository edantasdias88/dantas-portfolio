import { useEffect, useRef, type RefObject } from 'react'
import styles from './HowICanHelp.module.scss'

/** Cursor em pill que acompanha o ponteiro suavemente, apenas dentro da área de arraste. */
export function DragCursor({ area, label }: { area: RefObject<HTMLElement | null>; label: string }) {
  const cursor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = area.current
    const node = cursor.current
    if (!el || !node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let raf = 0
    let visible = false

    const render = () => {
      const k = reduce ? 1 : 0.2
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      node.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
      if (visible || Math.abs(target.x - pos.x) > 0.1) raf = requestAnimationFrame(render)
    }

    const isInteractive = (t: EventTarget | null) => (t as HTMLElement | null)?.closest?.('a, button') !== null

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      target.x = pos.x = e.clientX
      target.y = pos.y = e.clientY
      visible = true
      node.dataset.visible = 'true'
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(render)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      target.x = e.clientX
      target.y = e.clientY
      node.dataset.visible = String(!isInteractive(e.target))
    }
    const onLeave = () => {
      visible = false
      node.dataset.visible = 'false'
    }
    const onDown = () => (node.dataset.pressed = 'true')
    const onUp = () => (node.dataset.pressed = 'false')

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [area])

  return (
    <div ref={cursor} className={styles.cursor} aria-hidden="true" data-visible="false">
      ‹ {label} ›
    </div>
  )
}
