import { useTranslation } from 'react-i18next'
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
