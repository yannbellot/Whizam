import { test } from 'node:test'
import { request } from 'node:http'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile, stat, rm, symlink, link } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseEnv } from 'node:util'
import { startConfiguration, parseFields } from '../scripts/configure-secrets.mjs'
const fields = parseFields(['SMTP_USER:email', 'SMTP_PASSWORD:password'])
async function fixture(t, initial = 'OTHER=keep\nSMTP_PASSWORD=old\n', options = {}) {
  const root = await mkdtemp(join(tmpdir(), 'loomata-private-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const path = join(root, '.env.local')
  if (initial !== null) await writeFile(path, initial)
  const session = await startConfiguration({ root, fields, ...options })
  t.after(() => session.close())
  const origin = new URL(session.url).origin
  const post = (values = {}, overrides = {}) =>
    fetch(session.url, {
      method: 'POST',
      headers: { origin, 'content-type': 'application/x-www-form-urlencoded', ...overrides },
      body: new URLSearchParams({
        SMTP_USER: 'fiction@example.test',
        SMTP_PASSWORD: 'fake$#"\\value',
        action: 'save',
        ...values,
      }),
    })
  return { root, path, session, origin, post }
}
test('enregistrement privé : conservation, caractères littéraux et absence de reflet', async (t) => {
  const f = await fixture(t)
  const page = await fetch(f.session.url)
  assert.equal(page.status, 200)
  assert.match(await page.text(), /type="password"/)
  assert.equal(page.headers.get('cache-control'), 'no-store')
  assert.equal(page.headers.get('referrer-policy'), 'same-origin')
  assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/)
  const result = await f.post()
  assert.equal(result.status, 200)
  const text = await result.text()
  assert.ok(!text.includes('fake$') && !text.includes('fiction@'))
  const saved = await readFile(f.path, 'utf8')
  assert.match(saved, /^OTHER=keep\n/)
  assert.equal(parseEnv(saved).SMTP_PASSWORD, 'fake$#"\\value')
  assert.equal((await stat(f.path)).mode & 0o777, 0o600)
})
test('refuse origine, hôte, capacité, méthode et type étrangers', async (t) => {
  const f = await fixture(t)
  assert.equal((await f.post({}, { origin: 'https://foreign.test' })).status, 403)
  assert.equal((await f.post({}, { origin: 'null' })).status, 403)
  const foreignHost = await new Promise((yes, no) => {
    const req = request(f.session.url, { headers: { host: 'foreign.test' } }, (res) => {
      res.resume()
      yes(res.statusCode)
    })
    req.on('error', no)
    req.end()
  })
  assert.equal(foreignHost, 403)
  assert.equal((await f.post({}, { 'sec-fetch-site': 'cross-site' })).status, 403)
  assert.equal((await f.post({}, { 'content-type': 'application/json' })).status, 403)
  assert.equal((await fetch(f.origin + '/wrong')).status, 404)
  assert.equal((await fetch(f.session.url, { method: 'PUT' })).status, 405)
  assert.equal(await readFile(f.path, 'utf8'), 'OTHER=keep\nSMTP_PASSWORD=old\n')
})
test('refuse injections, doublons de formulaire, champs inconnus et dépassement', async (t) => {
  const f = await fixture(t)
  for (const value of ["bad'quote", 'bad\nline', 'bad\0nul', 'x'.repeat(4097), ''])
    assert.equal((await f.post({ SMTP_PASSWORD: value })).status, 400)
  assert.equal((await f.post({ EXTRA: 'value' })).status, 400)
  const result = await fetch(f.session.url, {
    method: 'POST',
    headers: { origin: f.origin, 'content-type': 'application/x-www-form-urlencoded' },
    body: 'action=save&action=cancel',
  })
  assert.equal(result.status, 400)
  assert.equal((await f.post({ SMTP_PASSWORD: 'x'.repeat(70000) })).status, 413)
  assert.equal(await readFile(f.path, 'utf8'), 'OTHER=keep\nSMTP_PASSWORD=old\n')
})
test('annulation et expiration préservent le fichier', async (t) => {
  const f = await fixture(t)
  assert.equal((await f.post({ action: 'cancel' })).status, 200)
  assert.equal(await readFile(f.path, 'utf8'), 'OTHER=keep\nSMTP_PASSWORD=old\n')
  const expired = await fixture(t, null, { ttl: 20 })
  await new Promise((yes) => setTimeout(yes, 60))
  await assert.rejects(fetch(expired.session.url))
  await assert.rejects(readFile(expired.path), { code: 'ENOENT' })
})
test('refuse une configuration modifiée depuis l’ouverture', async (t) => {
  const f = await fixture(t)
  await writeFile(f.path, 'OTHER=changed\n')
  assert.equal((await f.post()).status, 409)
  assert.equal(await readFile(f.path, 'utf8'), 'OTHER=changed\n')
})
test('refuse doublons et valeurs multilignes existantes sans altération', async (t) => {
  for (const initial of ['SMTP_USER=a\nSMTP_USER=b\n', "OTHER='line1\nline2'\n"]) {
    const f = await fixture(t, initial)
    assert.equal((await f.post()).status, 400)
    assert.equal(await readFile(f.path, 'utf8'), initial)
  }
})
test('crée un fichier absent et refuse symlinks/hardlinks', async (t) => {
  const f = await fixture(t, null)
  assert.equal((await f.post()).status, 200)
  assert.equal(parseEnv(await readFile(f.path, 'utf8')).SMTP_USER, 'fiction@example.test')
  await rm(f.path)
  const target = join(f.root, 'target')
  await writeFile(target, 'OTHER=keep\n')
  await symlink(target, f.path)
  await assert.rejects(startConfiguration({ root: f.root, fields }))
  await rm(f.path)
  await link(target, f.path)
  await assert.rejects(startConfiguration({ root: f.root, fields }))
  assert.equal(await readFile(target, 'utf8'), 'OTHER=keep\n')
})
test('déclarations fermées : aucun nom public ni argument secret', () => {
  for (const args of [
    [],
    ['VITE_KEY:password'],
    ['PUBLIC_KEY:password'],
    ['KEY:plain'],
    ['KEY:password', 'KEY:email'],
    ['../file:password'],
  ])
    assert.throws(() => parseFields(args))
})

test('GitHub fallback uses an isolated private file and keeps the application environment intact', async (t) => {
  const f = await fixture(t, 'APP=preserved\n')
  const fields = parseFields(['GH_TOKEN:password'])
  const session = await startConfiguration({ root: f.root, fields, target: 'github' })
  t.after(() => session.close())
  const html = await (await fetch(session.url)).text()
  assert.match(html, /\.github-token\.local/)
  const response = await fetch(session.url, {
    method: 'POST',
    headers: {
      origin: new URL(session.url).origin,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ action: 'save', GH_TOKEN: 'synthetic-token-only' }),
  })
  assert.equal(response.status, 200)
  assert.doesNotMatch(await response.text(), /synthetic-token-only/)
  assert.equal(await readFile(f.path, 'utf8'), 'APP=preserved\n')
  assert.equal(
    parseEnv(await readFile(join(f.root, '.github-token.local'), 'utf8')).GH_TOKEN,
    'synthetic-token-only',
  )
  assert.equal((await stat(join(f.root, '.github-token.local'))).mode & 0o777, 0o600)
  await assert.rejects(startConfiguration({ root: f.root, fields, target: '../outside' }))
  await assert.rejects(
    startConfiguration({ root: f.root, fields: parseFields(['OTHER:password']), target: 'github' }),
  )
})
