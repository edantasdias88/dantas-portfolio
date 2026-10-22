import styles from './Portrait.module.scss'

const PORTRAIT = {
  src: `${import.meta.env.BASE_URL}images/edilson-portrait.jpg`,
  width: 1155,
  height: 1362,
}

export function Portrait({ alt, className }: { alt: string; className?: string }) {
  return (
    <div className={[styles.frame, className].filter(Boolean).join(' ')}>
      <img src={PORTRAIT.src} width={PORTRAIT.width} height={PORTRAIT.height} alt={alt} loading="lazy" decoding="async" />
    </div>
  )
}
