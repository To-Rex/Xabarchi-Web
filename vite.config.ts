import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'
import {
  ROUTES,
  SITE_URL,
  OG_IMAGE,
  buildRobotsTxt,
  buildSitemapXml,
  hreflangLinks,
  type SeoRoute,
} from './seo.config.ts'

const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const escJson = (o: object) => JSON.stringify(o).replace(/</g, '\\u003c')

/** The per-route <head> block injected between the <!--seo:start/end--> markers. */
function seoBlock(route: SeoRoute): string {
  const url = `${SITE_URL}${route.path === '/' ? '/' : route.path}`
  const graph = { '@context': 'https://schema.org', '@graph': route.schema }
  return [
    `<title>${escAttr(route.title)}</title>`,
    `<meta name="description" content="${escAttr(route.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="Xabarchi" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="uz_UZ" />`,
    `<meta property="og:locale:alternate" content="ru_RU" />`,
    `<meta property="og:locale:alternate" content="en_US" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escAttr(route.title)}" />`,
    `<meta property="og:description" content="${escAttr(route.description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    hreflangLinks(route.path),
    `<script type="application/ld+json">${escJson(graph)}</script>`,
  ].join('\n    ')
}

/**
 * SEO pre-render: after the SPA is built, bake a static per-route <head>
 * (title, description, canonical, OG/Twitter, JSON-LD) into a copy of
 * index.html for every marketing route, and emit robots.txt + sitemap.xml.
 * Non-JS crawlers and social scrapers get correct metadata; the SPA still
 * hydrates identically. Build-only — dev is untouched.
 */
function seoPrerender(): Plugin {
  let outDir = 'dist'
  const MARKER = /<!--seo:start-->[\s\S]*?<!--seo:end-->/
  return {
    name: 'xabarchi-seo-prerender',
    apply: 'build',
    configResolved(cfg) {
      outDir = path.resolve(cfg.root, cfg.build.outDir)
    },
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html')
      if (!fs.existsSync(indexPath)) return
      const base = fs.readFileSync(indexPath, 'utf8')

      for (const route of ROUTES) {
        const html = base.replace(MARKER, `<!--seo:start-->\n    ${seoBlock(route)}\n    <!--seo:end-->`)
        if (route.path === '/') {
          fs.writeFileSync(indexPath, html)
        } else {
          const dir = path.join(outDir, route.path.replace(/^\//, ''))
          fs.mkdirSync(dir, { recursive: true })
          fs.writeFileSync(path.join(dir, 'index.html'), html)
        }
      }

      const lastmod = new Date().toISOString().slice(0, 10)
      fs.writeFileSync(path.join(outDir, 'robots.txt'), buildRobotsTxt())
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemapXml(lastmod))
      // eslint-disable-next-line no-console
      console.log(`\n  seo: baked ${ROUTES.length} routes + robots.txt + sitemap.xml (${SITE_URL})\n`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // SITE_URL (seo.config) defaults to https://xabarchi.uz; override with a real
  // VITE_SITE_URL environment variable (not just a .env entry) if the domain changes.
  return {
    plugins: [react(), tailwindcss(), seoPrerender()],
    server: {
      host: true,
      port: Number(env.PORT) || 5173,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Stable vendor chunks: heavy libs cache independently of app code
          advancedChunks: {
            groups: [
              { name: 'charts', test: /node_modules[\\/](recharts|d3-|victory-vendor)/ },
              { name: 'motion', test: /node_modules[\\/](motion|framer-motion)/ },
              { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
