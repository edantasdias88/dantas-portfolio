import portrait from '@/assets/images/edilson-portrait.webp'
import styles from './Portrait.module.scss'

/**
 * Retrato do autor. Para substituir pela fotografia real, defina `PORTRAIT`
 * apontando para o arquivo importado (ex.: import photo from '@/assets/images/edilson.jpg').
 */
const PORTRAIT: { src: string; width: number; height: number } | null = { src: portrait, width: 628, height: 740 }

export function Portrait({ alt, className }: { alt: string; className?: string }) {
  return (
    <div className={[styles.frame, className].filter(Boolean).join(' ')}>
      {PORTRAIT ? (
        <img src={PORTRAIT.src} width={PORTRAIT.width} height={PORTRAIT.height} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={alt}>
          <span aria-hidden="true">ED</span>
        </div>
      )}
    </div>
  )
}
