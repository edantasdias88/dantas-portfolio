import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { site } from '@/data/site'

interface SeoProps {
  title: string
  description: string
  workName?: string
  noIndex?: boolean
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function removeMeta(selector: string) {
  document.head.querySelector(selector)?.remove()
}

function getPublicOrigin(value: string): string | null {
  try {
    const url = new URL(value)
    const localHost = url.hostname === 'localhost'
      || url.hostname.endsWith('.localhost')
      || url.hostname.endsWith('.local')
      || url.hostname === '127.0.0.1'
      || url.hostname === '::1'
    if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password || localHost) {
      return null
    }
    return url.origin
  } catch {
    return null
  }
}

function canonicalFor(pathname: string, origin: string) {
  const basePath = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  const routePath = pathname.replace(/^\/+|\/+$/g, '')
  return new URL(`${basePath}${routePath ? `${routePath}/` : ''}`, `${origin}/`).toString()
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = url
}

function setStructuredData(input: {
  homeUrl: string
  canonicalUrl: string
  siteName: string
  jobTitle: string
  language: string
  workName?: string
  description: string
}) {
  const personId = `${input.homeUrl}#person`
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': personId,
      name: input.siteName,
      jobTitle: input.jobTitle,
      url: input.homeUrl,
    },
    {
      '@type': 'WebSite',
      '@id': `${input.homeUrl}#website`,
      url: input.homeUrl,
      name: input.siteName,
      publisher: { '@id': personId },
      inLanguage: ['pt-BR', 'en'],
    },
  ]

  if (input.workName) {
    graph.push({
      '@type': 'CreativeWork',
      name: input.workName,
      description: input.description,
      url: input.canonicalUrl,
      inLanguage: input.language,
      creator: { '@id': personId },
    })
  }

  let script = document.head.querySelector<HTMLScriptElement>('#portfolio-seo-jsonld')
  if (!script) {
    script = document.createElement('script')
    script.id = 'portfolio-seo-jsonld'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

/** Keeps route metadata unique and adds absolute URLs only when a public HTTPS origin is configured. */
export function Seo({ title, description, workName, noIndex = false }: SeoProps) {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const language = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'pt-BR'
    const locale = language === 'en' ? 'en_US' : 'pt_BR'
    const origin = getPublicOrigin(site.url)

    document.title = title
    document.documentElement.lang = language
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', t('meta.siteName'))
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', locale)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    if (noIndex) {
      setMeta('meta[name="robots"]', 'name', 'robots', 'noindex,follow')
      removeMeta('meta[property="og:url"]')
      removeMeta('meta[property="og:image"]')
      removeMeta('meta[property="og:image:alt"]')
      removeMeta('meta[property="og:image:type"]')
      removeMeta('meta[property="og:image:width"]')
      removeMeta('meta[property="og:image:height"]')
      removeMeta('meta[name="twitter:image"]')
      removeMeta('meta[name="twitter:image:alt"]')
      document.head.querySelector('link[rel="canonical"]')?.remove()
      document.head.querySelector('#portfolio-seo-jsonld')?.remove()
      return
    }

    removeMeta('meta[name="robots"]')

    if (!origin) {
      removeMeta('meta[property="og:url"]')
      removeMeta('meta[property="og:image"]')
      removeMeta('meta[property="og:image:alt"]')
      removeMeta('meta[property="og:image:type"]')
      removeMeta('meta[property="og:image:width"]')
      removeMeta('meta[property="og:image:height"]')
      removeMeta('meta[name="twitter:image"]')
      removeMeta('meta[name="twitter:image:alt"]')
      document.head.querySelector('link[rel="canonical"]')?.remove()
      document.head.querySelector('#portfolio-seo-jsonld')?.remove()
      return
    }

    const canonicalUrl = canonicalFor(pathname, origin)
    const homeUrl = canonicalFor('/', origin)
    const basePath = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
    const imageUrl = new URL(`${basePath}images/edilson-portrait.jpg`, `${origin}/`).toString()

    setCanonical(canonicalUrl)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', t('meta.socialImageAlt'))
    setMeta('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/jpeg')
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1155')
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '1362')
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', t('meta.socialImageAlt'))
    setStructuredData({
      homeUrl,
      canonicalUrl,
      siteName: t('meta.siteName'),
      jobTitle: t('meta.personJobTitle'),
      language,
      workName,
      description,
    })
  }, [title, description, pathname, workName, i18n.resolvedLanguage, t])

  return null
}
