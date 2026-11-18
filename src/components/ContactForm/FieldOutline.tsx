import { useLayoutEffect, useRef, useState } from 'react'
import styles from './ContactForm.module.scss'

/** Follows the control's real dimensions, including textarea height. */
export function FieldOutline() {
  const ref = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const control = ref.current?.parentElement
    if (!control) return
    const measure = () => setSize({ width: control.clientWidth, height: control.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(control)
    return () => observer.disconnect()
  }, [])

  return (
    <svg ref={ref} className={styles.outline} aria-hidden="true" focusable="false">
      {size.width > 1.5 && size.height > 1.5 && (
        <rect x={0.75} y={0.75} width={size.width - 1.5} height={size.height - 1.5} rx={11.25}
          pathLength={1} fill="none" />
      )}
    </svg>
  )
}
