import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import HomePage from '@/pages/Home'
import NotFoundPage from '@/pages/NotFound'
import { Layout } from './Layout'

const ProjectsPage = lazy(() => import('@/pages/Projects'))
const AboutPage = lazy(() => import('@/pages/About'))
const ContactPage = lazy(() => import('@/pages/Contact'))
const CaseStudyPage = lazy(() => import('@/pages/CaseStudy'))

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'projetos', element: <ProjectsPage /> },
        { path: 'sobre-mim', element: <AboutPage /> },
        { path: 'contato', element: <ContactPage /> },
        { path: 'case/:slug', element: <CaseStudyPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
