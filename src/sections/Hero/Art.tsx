import borda from '@/assets/figma/hero/borda-curva.svg'
import dantas from '@/assets/figma/hero/dantas.svg'
import dobra from '@/assets/figma/hero/dobra-seda.svg'
import luz from '@/assets/figma/hero/luz-quente.svg'
import reflexoVeu from '@/assets/figma/hero/reflexo-veu.svg'
import reflexo from '@/assets/figma/hero/reflexo.svg'
import sombra from '@/assets/figma/hero/sombra.svg'
import veu from '@/assets/figma/hero/veu.svg'
import styles from './Hero.module.scss'

/**
 * Composição de seda do Figma (13:236, frame 1936×1095).
 * Cada camada é posicionada em % do frame, incluindo a área extra dos filtros de desfoque,
 * e o conjunto escala para cobrir a viewport mantendo a proporção.
 */
const FRAME = { w: 1936, h: 1095 }

interface Layer {
  src: string
  /** caixa do nó: x, y, largura, altura */
  box: [number, number, number, number]
  /** expansão do filtro (inset negativo): topo, direita, base, esquerda — em % da caixa */
  bleed?: [number, number, number, number]
  className?: string
}

const LAYERS: Layer[] = [
  { src: luz, box: [836, 339, 1085, 410], bleed: [24.39, 9.22, 24.39, 9.22] },
  { src: sombra, box: [1323, 504, 751, 306], bleed: [30.07, 12.25, 30.07, 12.25] },
  { src: reflexo, box: [1212, -154, 938, 461], bleed: [21.69, 10.66, 21.69, 10.66], className: styles.drift3 },
  { src: dobra, box: [867, -4, 1067, 691], bleed: [0.72, 0.56, 1.59, 0.94], className: styles.drift1 },
  { src: borda, box: [867, 20, 1067, 691], bleed: [0.12, 0, 0.16, 0], className: styles.drift1 },
  { src: veu, box: [0, 24, 1933, 1087], bleed: [2.94, 1.66, 2.94, 1.66], className: styles.drift2 },
  { src: reflexoVeu, box: [861, 218, 1072, 579], bleed: [0.25, 0, 0.21, 0], className: styles.drift2 },
]

function place([x, y, w, h]: Layer['box'], [t, r, b, l]: NonNullable<Layer['bleed']> = [0, 0, 0, 0]) {
  const left = x - (w * l) / 100
  const top = y - (h * t) / 100
  const width = w * (1 + (l + r) / 100)
  const height = h * (1 + (t + b) / 100)
  return {
    left: `${(left / FRAME.w) * 100}%`,
    top: `${(top / FRAME.h) * 100}%`,
    width: `${(width / FRAME.w) * 100}%`,
    height: `${(height / FRAME.h) * 100}%`,
  }
}

export function HeroArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <div className={styles.frame}>
        <div className={styles.luminous} />
        <div className={styles.layers}>
          {LAYERS.map((layer) => (
            <img
              key={layer.src}
              src={layer.src}
              alt=""
              className={[styles.layer, layer.className].filter(Boolean).join(' ')}
              style={place(layer.box, layer.bleed)}
              draggable={false}
            />
          ))}
        </div>
        <div className={styles.reading} />
        <img src={dantas} alt="" className={styles.signature} style={place([226, 783, 1702, 460])} draggable={false} />
        <div className={styles.signatureFade} />
      </div>
    </div>
  )
}
