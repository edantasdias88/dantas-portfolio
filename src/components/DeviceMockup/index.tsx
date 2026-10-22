import { useEffect, useId, useMemo, useState } from 'react'
import styles from './DeviceMockup.module.scss'

interface Props {
  src: string
  alt: string
  className?: string
}

/** Renders a local device SVG inline so its outer frame can follow the active site theme. */
export function DeviceMockup({ src, alt, className }: Props) {
  const id = useId().replaceAll(':', '')
  const [svg, setSvg] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    void fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load device mockup: ${response.status}`)
        return response.text()
      })
      .then(setSvg)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setSvg('')
      })

    return () => controller.abort()
  }, [src])

  const markup = useMemo(() => {
    if (!svg) return null

    const scoped = svg
      .replace(/\bid="([^"]+)"/g, `id="${id}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`)
      .replace(/((?:xlink:)?href)="#([^"]+)"/g, `$1="#${id}-$2"`)
      .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')

    return { __html: scoped }
  }, [id, svg])

  const wrapperClass = [styles.mockup, className].filter(Boolean).join(' ')
  const accessibility = alt ? { role: 'img' as const, 'aria-label': alt } : { 'aria-hidden': true as const }

  if (markup) return <div className={wrapperClass} {...accessibility} dangerouslySetInnerHTML={markup} />

  return (
    <div className={wrapperClass} data-inline="false" {...accessibility}>
      <img src={src} alt="" />
    </div>
  )
}
