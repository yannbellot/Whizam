import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { workspaceFigmaFile } from '../scripts/core/workspace-figma-file.ts'
import { readFigmaPreview } from '../scripts/core/figma-preview.ts'
import { fixture } from './helpers/workspace.mjs'
const fileKey = 'SyntheticFigmaFile123'
const raw = {
  name: 'Synthetic',
  version: '1',
  document: {
    id: '0:0',
    name: 'Document',
    type: 'DOCUMENT',
    children: [
      {
        id: '1:0',
        name: 'Page',
        type: 'CANVAS',
        children: [{ id: '2:0', name: 'Action', type: 'COMPONENT' }],
      },
    ],
  },
}
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><path d="M0 0H120V40Z" fill="#123456"/></svg>'
test('private file cache and credentials remain separate from product state and survive a failed refresh', async (t) => {
  const f = await fixture(t),
    root = f.store.treeRoot(f.treeId)
  const before = await f.store.snapshot()
  const call = (input, fetcher = async () => Response.json(raw)) =>
    workspaceFigmaFile(root, f.root, input, fetcher)
  assert.deepEqual(await call({ kind: 'file-status' }), { connected: false, cached: null })
  const read = await call({ kind: 'file-browse', fileKey, token: 'synthetic-figma-token-123456' })
  assert.equal(read.cached.file.nodes.length, 3)
  assert.ok(!JSON.stringify(read).includes('synthetic-figma-token'))
  assert.deepEqual(await f.store.snapshot(), before)
  await assert.rejects(
    call({ kind: 'file-browse', fileKey }, async () => new Response('', { status: 429 })),
    /rate-limited/,
  )
  assert.equal((await call({ kind: 'file-status' })).cached.file.version, '1')
  await assert.rejects(
    call({ kind: 'file-preview', fileKey, nodeId: '2:0', version: 'old' }),
    /source-stale/,
  )
  let calls = 0
  const render = async (url, options) => {
    calls++
    if (url.hostname === 'api.figma.com') {
      assert.equal(url.searchParams.get('format'), 'svg')
      assert.equal(url.searchParams.get('svg_outline_text'), 'true')
      return Response.json({ images: { '2:0': 'https://s3-alpha-sig.figma.com/test.svg' } })
    }
    assert.equal(options.headers, undefined)
    return new Response(svg)
  }
  const image = await call({ kind: 'file-preview', fileKey, nodeId: '2:0', version: '1' }, render)
  assert.ok(image.image.startsWith('data:image/svg+xml;base64,'))
  await call({ kind: 'file-preview', fileKey, nodeId: '2:0', version: '1' }, render)
  assert.equal(calls, 2)
  const auth = await fs.stat(path.join(f.root, '.runtime.local/figma/connection.json'))
  assert.equal(auth.mode & 0o777, 0o600)
})
test('render download refuses an untrusted destination, active SVG content and redirects without forwarding credentials', async () => {
  await assert.rejects(
    readFigmaPreview('synthetic', fileKey, '2:0', '1', async () =>
      Response.json({ images: { '2:0': 'http://127.0.0.1/private' } }),
    ),
    /host-refused/,
  )
  let calls = 0
  await assert.rejects(
    readFigmaPreview('synthetic', fileKey, '2:0', '1', async (url, opts) => {
      assert.equal(opts.redirect, 'error')
      if (++calls === 1)
        return Response.json({ images: { '2:0': 'https://s3-alpha-sig.figma.com/asset' } })
      assert.equal(opts.headers, undefined)
      return new Response('<svg onload="attack()"></svg>')
    }),
    /format-refused/,
  )
})

test('SVG image context rejects active or external references and accepts local paint servers', async () => {
  const load = (body) =>
    readFigmaPreview('synthetic', fileKey, '2:0', '1', async (url) =>
      url.hostname === 'api.figma.com'
        ? Response.json({ images: { '2:0': 'https://s3-alpha-sig.figma.com/render.svg' } })
        : new Response(body),
    )
  for (const body of [
    '<svg><script>alert(1)</script></svg>',
    '<svg><foreignObject><div/></foreignObject></svg>',
    '<!DOCTYPE svg><svg/>',
    '<svg><image href="https://evil.invalid/a"/></svg>',
    '<svg><path style="fill:url(https://evil.invalid/a)"/></svg>',
    '<svg><style>@import "https://evil.invalid/a";</style></svg>',
  ])
    await assert.rejects(load(body), /format-refused/)
  assert.ok(
    (
      await load(
        '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a"/></defs><path style="fill:url(\'#a\')"/></svg>',
      )
    ).startsWith('data:image/svg+xml;base64,'),
  )
})
