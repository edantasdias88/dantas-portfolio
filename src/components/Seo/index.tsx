import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { site } from '@/data/site'

interface SeoProps {
  title: string
  description: string
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

/** Atualiza título, descrição, Open Graph e canonical por rota. */
export function Seo({ title, description }: SeoProps) {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', document.documentElement.lang.replace('-', '_'))
    if (site.url) {
      const url = new URL(pathname, site.url).toString()
      setMeta('meta[property="og:url"]', 'property', 'og:url', url)
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = url
    }
  }, [title, description, pathname])
  return null
}
