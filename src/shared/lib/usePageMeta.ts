import { useEffect } from 'react'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://xabarchi.uz').replace(/\/$/, '')

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * SPA-side SEO: keeps document title, meta description, canonical and the
 * OG/Twitter tags in sync as the user navigates client-side. Crawlers read
 * the build-time baked <head> (see seo.config.ts); this keeps the tags
 * correct for JS-rendering bots and for links shared after navigation.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    const url = SITE_URL + window.location.pathname

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url)
    upsertCanonical(url)

    if (description) {
      upsertMeta('meta[name="description"]', 'name', 'description', description)
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
      upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    }
  }, [title, description])
}
