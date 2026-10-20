import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import repere from '@/assets/figma/hero/repere.svg'
import { ArrowRight } from '@/components/Icons'
import { useContact } from '@/lib/contact'
import { markHeroReady } from '@/lib/initialLoad'
import { HeroArt } from './Art'
import styles from './Hero.module.scss'

export function Hero() {
  const { t } = useTranslation()
  const { openContact } = useContact()
  const reduce = useReducedMotion()

  useEffect(() => {
    let cancelled = false
    const section = document.getElementById('inicio')
    const images = Array.from(section?.querySelectorAll('img') ?? [])
    const imageReadiness = images.map((image) => {
      const decode = () => {
        try {
          return image.decode?.().catch(() => undefined) ?? Promise.resolve()
        } catch {
          return Promise.resolve()
        }
      }
      if (image.complete) return decode()

      return new Promise<void>((resolve) => {
        let settled = false
        const settle = () => {
          if (settled) return
          settled = true
          void decode().finally(resolve)
        }
        image.addEventListener('load', settle, { once: true })
        image.addEventListener('error', settle, { once: true })
      })
    })
    const fontsReady = document.fonts?.load
      ? Promise.all([
          document.fonts.load('400 16px Satoshi'),
          document.fonts.load('500 16px Satoshi'),
        ]).catch(() => undefined)
      : Promise.resolve()

    void Promise.all([fontsReady, ...imageReadiness]).then(() => {
      if (!cancelled) markHeroReady()
    })

    return () => {
      cancelled = true
    }
  }, [])

  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 40, scale: 0.985 } as const),
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <HeroArt />

      <div className={`container ${styles.content}`}>
        <motion.p className="eyebrow" {...enter(0.05)}>
          {t('hero.eyebrow')}
        </motion.p>
        <motion.h1 id="hero-title" className={styles.title} {...enter(0.16)}>
          <span>{t('hero.titleLead')}</span> <span className={styles.titleMuted}>{t('hero.titleMuted')}</span>
        </motion.h1>
        <motion.div className={styles.description} {...enter(0.27)}>
          <p>{t('hero.subtitle')}</p>
        </motion.div>
        <motion.div className={styles.action} {...enter(0.38)}>
          <button type="button" className={styles.cta} onClick={(e) => openContact(e.currentTarget)}>
            <span>{t('common.cta')}</span>
            <ArrowRight size={21} />
          </button>
        </motion.div>
      </div>

      <a href="#como-posso-ajudar" className={styles.scroll}>
        <img src={repere} alt="" width={11} height={97} className={styles.repere} />
        <span>{t('hero.scroll')}</span>
      </a>
    </section>
  )
}
