import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

interface SeoRoute {
  path: string
  title: string
  description: string
  workName?: string
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]!)
}

function configuredOrigin(value: string) {
  if (!value.trim()) return null
  try {
    const url = new URL(value)
    const localHost = url.hostname === 'localhost'
      || url.hostname.endsWith('.localhost')
      || url.hostname.endsWith('.local')
      || url.hostname === '127.0.0.1'
      || url.hostname === '::1'
    if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password || localHost) return null
    return url.origin
  } catch {
    return null
  }
}

function setMeta(html: string, key: string, attribute: 'name' | 'property', content: string) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["'][^>]*\\/?\\s*>`, 'i')
  const tag = `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}

function setCanonical(html: string, url: string) {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`
  const pattern = /<link\s+rel=["']canonical["'][^>]*\/?\s*>/i
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}

function removeMeta(html: string, key: string, attribute: 'name' | 'property') {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.replace(new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["'][^>]*\\/?\\s*>`, 'i'), '')
}

function routeUrl(origin: string, basePath: string, route: string) {
  const routePath = route === '/' ? '' : `${route.replace(/^\/+|\/+$/g, '')}/`
  return new URL(`${basePath}${routePath}`, `${origin}/`).toString()
}

function jsonLd(entry: SeoRoute, homeUrl: string, canonicalUrl: string, locale: Record<string, any>) {
  const personId = `${homeUrl}#person`
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': personId,
      name: locale.meta.siteName,
      jobTitle: locale.meta.personJobTitle,
      url: homeUrl,
    },
    {
      '@type': 'WebSite',
      '@id': `${homeUrl}#website`,
      url: homeUrl,
      name: locale.meta.siteName,
      publisher: { '@id': personId },
      inLanguage: ['pt-BR', 'en'],
    },
  ]

  if (entry.workName) {
    graph.push({
      '@type': 'CreativeWork',
      name: entry.workName,
      description: entry.description,
      url: canonicalUrl,
      inLanguage: 'pt-BR',
      creator: { '@id': personId },
    })
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

function seoBuildPlugin(root: string, basePath: string, configuredSiteUrl: string): Plugin {
  return {
    name: 'portfolio-route-seo',
    apply: 'build',
    async closeBundle() {
      const publicOrigin = configuredOrigin(configuredSiteUrl)
      const distPath = path.resolve(root, 'dist')
      const template = await readFile(path.join(distPath, 'index.html'), 'utf8')
      const pt = JSON.parse(await readFile(path.resolve(root, 'src/locales/pt-BR/translation.json'), 'utf8'))
      const meta = pt.meta
      const projects = pt.projects.items
      const routes: SeoRoute[] = [
        { path: '/', title: meta.home.title, description: meta.home.description },
        { path: '/projetos', title: meta.projects.title, description: meta.projects.description },
        { path: '/sobre-mim', title: meta.about.title, description: meta.about.description },
        { path: '/contato', title: meta.contact.title, description: meta.contact.description },
        ...[
          ['caa', 'caa'],
          ['iruas', 'iruas'],
          ['dantasDs', 'dantas-ds'],
        ].map(([key, slug]) => {
          const project = projects[key]
          const titleText = project.title.replace(/\s+/g, ' ')
          return {
            path: `/case/${slug}`,
            title: `${project.name} — ${titleText}`,
            description: meta.cases[key],
            workName: `${project.name} — ${titleText}`,
          }
        }),
      ]

      const imageUrl = publicOrigin ? `${publicOrigin}${basePath}images/edilson-portrait.jpg` : ''
      const makeHtml = (entry: SeoRoute) => {
        let html = template
        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(entry.title)}</title>`)
        html = setMeta(html, 'description', 'name', entry.description)
        html = setMeta(html, 'og:type', 'property', 'website')
        html = setMeta(html, 'og:site_name', 'property', meta.siteName)
        html = setMeta(html, 'og:title', 'property', entry.title)
        html = setMeta(html, 'og:description', 'property', entry.description)
        html = setMeta(html, 'og:locale', 'property', 'pt_BR')
        html = setMeta(html, 'twitter:card', 'name', 'summary_large_image')
        html = setMeta(html, 'twitter:title', 'name', entry.title)
        html = setMeta(html, 'twitter:description', 'name', entry.description)

        if (publicOrigin) {
          const canonicalUrl = routeUrl(publicOrigin, basePath, entry.path)
          const homeUrl = routeUrl(publicOrigin, basePath, '/')
          html = setCanonical(html, canonicalUrl)
          html = setMeta(html, 'og:url', 'property', canonicalUrl)
          html = setMeta(html, 'og:image', 'property', imageUrl)
          html = setMeta(html, 'og:image:alt', 'property', meta.socialImageAlt)
          html = setMeta(html, 'og:image:type', 'property', 'image/jpeg')
          html = setMeta(html, 'og:image:width', 'property', '1155')
          html = setMeta(html, 'og:image:height', 'property', '1362')
          html = setMeta(html, 'twitter:image', 'name', imageUrl)
          html = setMeta(html, 'twitter:image:alt', 'name', meta.socialImageAlt)
          const script = `<script id="portfolio-seo-jsonld" type="application/ld+json">${jsonLd(entry, homeUrl, canonicalUrl, pt)}</script>`
          const scriptPattern = /<script id="portfolio-seo-jsonld"[^>]*>[\s\S]*?<\/script>/i
          html = scriptPattern.test(html) ? html.replace(scriptPattern, script) : html.replace('</head>', `  ${script}\n  </head>`)
        }

        return html
      }

      await writeFile(path.join(distPath, 'index.html'), makeHtml(routes[0]))
      for (const entry of routes.slice(1)) {
        const target = path.resolve(distPath, ...entry.path.slice(1).split('/'), 'index.html')
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, makeHtml(entry))
      }

      let notFoundHtml = setMeta(makeHtml({
        path: '/404',
        title: meta.notFound.title,
        description: meta.notFound.description,
      }), 'robots', 'name', 'noindex,follow')
      notFoundHtml = notFoundHtml.replace(/<link\s+rel=["']canonical["'][^>]*\/?\s*>/i, '')
      notFoundHtml = removeMeta(notFoundHtml, 'og:url', 'property')
      notFoundHtml = notFoundHtml.replace(/<script id="portfolio-seo-jsonld"[^>]*>[\s\S]*?<\/script>/i, '')
      await writeFile(path.join(distPath, '404.html'), notFoundHtml)

      const robotsPath = path.join(distPath, 'robots.txt')
      let robots = await readFile(robotsPath, 'utf8').catch(() => 'User-agent: *\nAllow: /\n')
      robots = robots.replace(/^Sitemap:\s*.*(?:\r?\n)?/gim, '').trimEnd()
      if (publicOrigin) {
        const sitemapUrl = `${publicOrigin}${basePath}sitemap.xml`
        robots = `${robots}\n\nSitemap: ${sitemapUrl}\n`
        const sitemap = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...routes.map((entry) => `  <url><loc>${escapeHtml(routeUrl(publicOrigin, basePath, entry.path))}</loc></url>`),
          '</urlset>',
          '',
        ].join('\n')
        await writeFile(path.join(distPath, 'sitemap.xml'), sitemap)
      }
      await writeFile(robotsPath, `${robots}\n`)

      if (!publicOrigin) {
        console.warn('[portfolio-seo] VITE_SITE_URL is unset or invalid; canonical URLs, absolute social URLs, JSON-LD and sitemap were omitted from this build.')
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root, 'VITE_')
  const base = env.VITE_BASE_PATH || '/dantas-portfolio/'
  const basePath = base.startsWith('/') ? base : `/${base}`
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`

  return {
    base: normalizedBase,
    plugins: [
      react(),
      seoBuildPlugin(root, normalizedBase, env.VITE_SITE_URL ?? ''),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    css: {
      preprocessorOptions: {
        scss: { loadPaths: [fileURLToPath(new URL('./src', import.meta.url))] },
      },
    },
  }
})
