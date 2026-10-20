import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import help1 from '@/assets/figma/icons/help-1.svg'
import help2 from '@/assets/figma/icons/help-2.svg'
import help3 from '@/assets/figma/icons/help-3.svg'
import help4 from '@/assets/figma/icons/help-4.svg'
import help5 from '@/assets/figma/icons/help-5.svg'
import help6 from '@/assets/figma/icons/help-6.svg'
import help7 from '@/assets/figma/icons/help-7.svg'
import help8 from '@/assets/figma/icons/help-8.svg'
import { Reveal } from '@/components/Reveal'
import { useMediaQuery } from '@/lib/hooks'
import { DragCursor } from './DragCursor'
import { useDragScroll } from './useDragScroll'
import styles from './HowICanHelp.module.scss'

const ICONS = [help1, help2, help3, help4, help5, help6, help7, help8]

export function HowICanHelp() {
  const { t } = useTranslation()
  const items = t('help.items', { returnObjects: true })
  const track = useRef<HTMLUListElement>(null)
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [active, setActive] = useState(0)
  const [scrollable, setScrollable] = useState(false)

  useDragScroll(track, finePointer)

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    setScrollable(el.scrollWidth - el.clientWidth > 4)
    const cards = Array.from(el.children) as HTMLElement[]
    const maxScroll = el.scrollWidth - el.clientWidth
    if (el.scrollLeft >= maxScroll - 4) {
      setActive(cards.length - 1)
      return
    }
    const start = el.scrollLeft + parseFloat(getComputedStyle(el).paddingLeft)
    let nearest = 0
    let best = Infinity
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft - start)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setActive(nearest)
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', measure)
    }
  }, [measure])

  const goTo = (index: number) => {
    const el = track.current
    const card = el?.children[index] as HTMLElement | undefined
    if (!el || !card) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: card.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="como-posso-ajudar" className={`section ${styles.section}`} aria-labelledby="help-title">
      <div className={`container ${styles.head}`}>
        <Reveal>
          <p className="eyebrow">{t('help.eyebrow')}</p>
        </Reveal>
        <Reveal delay={0.05} className={styles.titleReveal}>
          <h2 id="help-title" className={`section-heading ${styles.title}`}>
            {t('help.title')}
          </h2>
        </Reveal>
      </div>

      <div className={`container ${styles.viewport}`}>
        <ul ref={track} className={styles.track} data-drag={finePointer && scrollable}>
          {items.map((item, i) => (
            <Reveal key={item.title} as="li" delay={i * 0.06} y={20} className={styles.card}>
              <span
                className={styles.icon}
                aria-hidden="true"
                style={{
                  maskImage: `url("${ICONS[i]}")`,
                  WebkitMaskImage: `url("${ICONS[i]}")`,
                }}
              />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        {finePointer && scrollable && <DragCursor area={track} label={t('help.drag')} />}
      </div>

      {scrollable && !finePointer && (
        <div className={`container ${styles.dots}`} role="group" aria-label={t('a11y.carouselDots')}>
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              className={styles.dot}
              aria-current={i === active ? 'true' : undefined}
              aria-label={t('a11y.goToCard', { index: i + 1 })}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
