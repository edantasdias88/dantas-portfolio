import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Seo } from '@/components/Seo'
import { AboutPreview } from '@/sections/AboutPreview'
import { FAQ } from '@/sections/FAQ'
import { Hero } from '@/sections/Hero'
import { HowICanHelp } from '@/sections/HowICanHelp'
import { Process } from '@/sections/Process'
import { Projects } from '@/sections/Projects'
import { Services } from '@/sections/Services'
import { WorkingTogether } from '@/sections/WorkingTogether'

export default function HomePage() {
  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        '#inicio, #como-posso-ajudar, #servicos, #processo, #projetos, #como-e-trabalhar-comigo, #sobre, #perguntas-frequentes, #contato',
      ),
    )
    if (!sections.length) return

    const activeId = { current: location.hash.slice(1) }
    let frame = 0

    const updateUrl = () => {
      frame = 0
      const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
      const viewportBottom = window.innerHeight
      const visible: { id: string; height: number }[] = sections.map((section) => {
        const rect = section.getBoundingClientRect()
        return {
          id: section.id,
          height: Math.max(0, Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, headerBottom)),
        }
      })

      let next = visible.reduce((best, candidate) => (candidate.height > best.height ? candidate : best))
      const current = visible.find((section) => section.id === activeId.current)
      if (current && current.height > 0 && next.height - current.height < 24) next = current
      if (next.height <= 0 || next.id === activeId.current) return

      activeId.current = next.id
      const hash = next.id === 'inicio' ? '' : `#${next.id}`
      if (window.location.hash === hash) return

      const url = new URL(window.location.href)
      url.hash = hash
      window.history.replaceState(window.history.state, '', url)
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateUrl)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    sections.forEach((section) => resizeObserver.observe(section))
    scheduleUpdate()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [location.hash, location.pathname])

  return (
    <>
      <Seo title={t('meta.home.title')} description={t('meta.home.description')} />
      <Hero />
      <HowICanHelp />
      <Services />
      <Process />
      <Projects />
      <WorkingTogether />
      <AboutPreview />
      <FAQ />
    </>
  )
}
