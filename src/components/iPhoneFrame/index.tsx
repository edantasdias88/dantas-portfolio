import type { CSSProperties } from 'react'
import styles from './iPhoneFrame.module.scss'

interface IPhoneFrameProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  /** Maximum rendered width. The frame still shrinks to fit its container. */
  size?: CSSProperties['maxWidth']
  shadow?: boolean
}

export function iPhoneFrame({
  src,
  alt,
  width = 375,
  height = 812,
  className,
  size,
  shadow = true,
}: IPhoneFrameProps) {
  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(' ')}
      style={size === undefined ? undefined : { maxWidth: size }}
      data-shadow={shadow ? undefined : 'off'}
    >
      <div className={styles.chassis}>
        <span className={styles.sideButtons} aria-hidden="true" />
        <div className={styles.bezel}>
          <img className={styles.screen} src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  )
}
