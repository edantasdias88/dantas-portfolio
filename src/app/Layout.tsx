import { motion, useReducedMotion } from 'motion/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function Layout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isNotFound = useMatches().some((match) => match.id === 'not-found')
  const reduce = useReducedMotion()

  return (
    <>
      {!isNotFound && (
        <a href="#main" className="skip-link">
          {t('a11y.skipToContent')}
        </a>
      )}
      {!isNotFound && <Header />}
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
          <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      {!isNotFound && <Footer />}
      <ScrollRestoration />
    </>
  )
}
