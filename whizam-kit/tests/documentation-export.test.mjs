import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { publicationUrl, exportHtml, exportSite } from '../scripts/documentation-export.mjs'

test('publication URL rejects credentials, non HTTPS and ambiguous bases', () => {
  for (const url of [
    'http://example.org/',
    'https://a:b@example.org/',
    'https://example.org/docs',
    'https://example.org/?token=x',
    'https://example.org/#x',
  ])
    assert.throws(() => publicationUrl(url))
  assert.equal(publicationUrl('https://example.org/docs/').pathname, '/docs/')
})
test('nested links, language switches, fragments and external links retain their destination', () => {
  const html = exportHtml(
    '<a href="/en/docs/">EN</a><a href="../next/">next</a><a href="#skip">skip</a><a href="https://other.org/">external</a>',
    'fr/docs/index.html',
    publicationUrl('https://example.org/Whizam/'),
  )
  assert.match(html, /href="https:\/\/example.org\/Whizam\/en\/docs\/"/)
  assert.match(html, /href="https:\/\/example.org\/Whizam\/fr\/next\/"/)
  assert.match(html, /href="#skip"/)
  assert.match(html, /href="https:\/\/other.org\/"/)
})
test('404 assets and search retain the publication prefix on a missing nested path', () => {
  const html = exportHtml(
    '<script src="/assets/app.js"></script><script id="__config" type="application/json">{"base":"/","search":"/assets/search.js"}</script>',
    '404.html',
    publicationUrl('https://example.org/Whizam/'),
  )
  assert.match(html, /src="https:\/\/example.org\/Whizam\/assets\/app.js"/)
  assert.match(html, /"base":"https:\/\/example.org\/Whizam\/"/)
  assert.match(html, /"search":"https:\/\/example.org\/Whizam\/assets\/search.js"/)
})
test('export excludes surrounding private files and refuses symlinks and overwrite', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'whizam-export-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const source = path.join(root, 'site'),
    destination = path.join(root, 'export')
  await fs.mkdir(source)
  await fs.writeFile(path.join(root, 'private.local'), 'PRIVATE_SENTINEL')
  await fs.writeFile(path.join(source, 'index.html'), '<a href="/en/">EN</a>')
  await exportSite(source, destination, publicationUrl('https://example.org/Whizam/'))
  assert.deepEqual((await fs.readdir(destination)).sort(), ['.nojekyll', 'index.html'])
  await assert.rejects(
    exportSite(source, destination, publicationUrl('https://example.org/')),
    /EEXIST/,
  )
  await fs.symlink('../private.local', path.join(source, 'leak'))
  await assert.rejects(
    exportSite(source, path.join(root, 'refused'), publicationUrl('https://example.org/')),
    /symlink refused/,
  )
})

test('export gives the language selector its deployment prefix and fixes automatic redirects', () => {
  const html = exportHtml(
    '<select data-whizam-language></select><meta content="0;url=/en/">',
    'index.html',
    publicationUrl('https://example.org/Whizam/'),
  )
  assert.match(html, /data-whizam-base="\/Whizam\/"/)
  assert.match(html, /content="0;url=https:\/\/example.org\/Whizam\/en\/"/)
})
test('actual language control preserves deployment prefix, deep route, query and fragment', async () => {
  const { runInNewContext } = await import('node:vm')
  const script = await fs.readFile(
    new URL('../public/documentation/system-theme.js', import.meta.url),
    'utf8',
  )
  for (const [base, pathname, expected] of [
    ['/Whizam/', '/Whizam/', '/Whizam/en/'],
    ['/Whizam/', '/Whizam/fr/docs/guide/', '/Whizam/en/docs/guide/'],
    ['/', '/fr/docs/', '/en/docs/'],
  ]) {
    let change, result
    const select = {
      dataset: { whizamBase: base },
      value: 'en',
      options: [{ value: 'fr' }, { value: 'en' }],
      addEventListener: (_, cb) => {
        change = cb
      },
    }
    const matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
    const document = {
      body: { dataset: {} },
      documentElement: { style: {}, lang: 'fr' },
      querySelector: (s) => (s === '[data-whizam-language]' ? select : null),
      querySelectorAll: () => [],
      getElementById: () => null,
      addEventListener() {},
    }
    runInNewContext(script, {
      document,
      window: { matchMedia, addEventListener() {} },
      matchMedia,
      location: {
        pathname,
        search: '?q=test',
        hash: '#section',
        assign: (url) => {
          result = url
        },
      },
    })
    change()
    assert.equal(result, expected + '?q=test#section')
  }
})
