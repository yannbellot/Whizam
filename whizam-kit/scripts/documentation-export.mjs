import * as fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { build } from './documentation.mjs'

export function publicationUrl(value) {
  const url = new URL(value)
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !url.pathname.endsWith('/')
  )
    throw new Error('Expected an HTTPS site URL ending in / without credentials, query or fragment')
  return url
}

export function exportHtml(html, route, siteUrl) {
  const base = new URL(route, siteUrl)
  const resolve = (value) => {
    if (!value || value.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return value
    return value.startsWith('/') ? new URL(value.slice(1), siteUrl).href : new URL(value, base).href
  }
  html = html.replace(/\b(href|src)="([^"]*)"/g, (_, attr, value) => `${attr}="${resolve(value)}"`)
  html = html.replaceAll(
    'data-whizam-language',
    `data-whizam-language data-whizam-base="${siteUrl.pathname}"`,
  )
  html = html.replace(/content="0;url=([^"]*)"/g, (_, value) => `content="0;url=${resolve(value)}"`)
  // Zensical's search configuration must also work on GitHub's fallback 404 URL.
  return html.replace(
    /(<script id="__config" type="application\/json">)(.*?)(<\/script>)/gs,
    (_, start, json, end) => {
      const config = JSON.parse(json)
      for (const key of ['base', 'search'])
        if (typeof config[key] === 'string') config[key] = resolve(config[key])
      return start + JSON.stringify(config) + end
    },
  )
}

export async function exportSite(source, destination, siteUrl) {
  await fs.mkdir(destination) // Never merge with or overwrite an existing directory.
  async function walk(directory, relative = '') {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const route = path.posix.join(relative, entry.name)
      const input = path.join(directory, entry.name)
      const output = path.join(destination, route)
      if (entry.isSymbolicLink()) throw new Error('Publication symlink refused')
      if (entry.isDirectory()) {
        await fs.mkdir(output)
        await walk(input, route)
      } else if (entry.isFile()) {
        if (entry.name.endsWith('.html'))
          await fs.writeFile(output, exportHtml(await fs.readFile(input, 'utf8'), route, siteUrl))
        else await fs.copyFile(input, output)
      } else throw new Error('Unsupported publication entry')
    }
  }
  await walk(source)
  await fs.writeFile(path.join(destination, '.nojekyll'), '')
}

async function main() {
  const siteUrl = publicationUrl(process.argv[2])
  const root = fileURLToPath(new URL('..', import.meta.url))
  const manifest = await build(root)
  const base = path.join(root, '.runtime.local/documentation')
  const destination = path.join(base, 'export-' + randomUUID())
  await exportSite(path.join(base, manifest.site), destination, siteUrl)
  await fs.writeFile(
    path.join(base, 'export.json'),
    JSON.stringify({ site: path.relative(root, destination), url: siteUrl.href }, null, 2) + '\n',
  )
  console.log('Documentation exported: ' + destination)
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
