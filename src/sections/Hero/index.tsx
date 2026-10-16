import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import repere from '@/assets/figma/hero/repere.svg'
import seta from '@/assets/figma/hero/seta.svg'
import { useContact } from '@/lib/contact'
import { HeroArt } from './Art'
import styles from './Hero.module.scss'

export function Hero() {
  const { t } = useTranslation()
  const { openContact } = useContact()
  const reduce = useReducedMotion()
  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroArt />

      <div className={`container ${styles.content}`}>
        <motion.p className="eyebrow" {...enter(0.05)}>
          {t('hero.eyebrow')}
        </motion.p>
        <motion.h1 id="hero-title" className={styles.title} {...enter(0.12)}>
          <span>{t('hero.titleLead')}</span> <span className={styles.titleMuted}>{t('hero.titleMuted')}</span>
        </motion.h1>
        <motion.div className={styles.description} {...enter(0.22)}>
          <p>{t('hero.subtitle')}</p>
        </motion.div>
        <motion.div className={styles.action} {...enter(0.32)}>
          <button type="button" className={styles.cta} onClick={(e) => openContact(e.currentTarget)}>
            <span>{t('common.cta')}</span>
            <img src={seta} alt="" width={21} height={21} />
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
