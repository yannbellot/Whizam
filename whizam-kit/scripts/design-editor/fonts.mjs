import * as fs from 'node:fs/promises'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import catalog from '../../src/design-system/authority/google-fonts.catalog.json' with { type: 'json' }
import { readSafe, checkParents, syncDir } from './files.mjs'
export const fontCatalog = catalog
export const fontDirectory = (font) =>
  `public/fonts/${font.id}-${font.files[0].sha256.slice(0, 16)}`
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const sample = 'ÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸàâæçéèêëîïôœùûüÿ'
// Read Unicode cmap tables of the pinned TrueType resource, never trust a subset label.
export function coversFrench(bytes) {
  try {
    const count = bytes.readUInt16BE(4)
    let cmap
    for (let i = 0; i < count; i++) {
      const at = 12 + i * 16
      if (bytes.toString('ascii', at, at + 4) === 'cmap') cmap = bytes.readUInt32BE(at + 8)
    }
    if (!cmap) return false
    const offsets = []
    for (let i = 0; i < bytes.readUInt16BE(cmap + 2); i++)
      offsets.push(cmap + bytes.readUInt32BE(cmap + 8 + i * 8))
    return [...sample].every((char) =>
      offsets.some((at) => {
        const code = char.codePointAt(0),
          format = bytes.readUInt16BE(at)
        if (format === 12) {
          for (let i = 0; i < bytes.readUInt32BE(at + 12); i++) {
            const group = at + 16 + i * 12,
              start = bytes.readUInt32BE(group),
              end = bytes.readUInt32BE(group + 4)
            if (code >= start && code <= end)
              return bytes.readUInt32BE(group + 8) + code - start !== 0
          }
        }
        if (format === 4) {
          const n = bytes.readUInt16BE(at + 6) / 2
          for (let i = 0; i < n; i++) {
            const end = bytes.readUInt16BE(at + 14 + 2 * i),
              start = bytes.readUInt16BE(at + 16 + 2 * n + 2 * i)
            if (code < start || code > end) continue
            const delta = bytes.readInt16BE(at + 16 + 4 * n + 2 * i),
              pos = at + 16 + 6 * n + 2 * i,
              range = bytes.readUInt16BE(pos)
            const glyph = range ? bytes.readUInt16BE(pos + range + 2 * (code - start)) : code
            return glyph !== 0 && ((glyph + delta) & 65535) !== 0
          }
        }
        return false
      }),
    )
  } catch {
    return false
  }
}
export async function installedFont(root, font) {
  try {
    for (const file of font.files) {
      const { bytes } = await readSafe(root, `${fontDirectory(font)}/${file.name}`)
      if (bytes.length !== file.bytes || hash(bytes) !== file.sha256) return false
      if (file.name === 'font.ttf' && !coversFrench(bytes)) return false
    }
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}
async function download(file) {
  const url = new URL(file.url)
  if (
    url.origin !== 'https://raw.githubusercontent.com' ||
    !url.pathname.startsWith(`/google/fonts/${catalog.revision}/`) ||
    file.bytes > 4 * 1024 * 1024
  )
    throw new Error('forbidden')
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20000) })
  if (!response.ok || !response.body) throw new Error('font-download-failed')
  const chunks = []
  let size = 0
  for await (const chunk of response.body) {
    size += chunk.length
    if (size > file.bytes) {
      await response.body.cancel().catch(() => {})
      throw new Error('budget-exceeded')
    }
    chunks.push(chunk)
  }
  const bytes = Buffer.concat(chunks)
  if (
    size !== file.bytes ||
    hash(bytes) !== file.sha256 ||
    (file.name === 'font.ttf' && !coversFrench(bytes))
  )
    throw new Error('font-integrity-failed')
  return bytes
}
export async function importFont(root, id, fetchFile = download) {
  const font = catalog.families.find((item) => item.id === id)
  if (!font) throw new Error('forbidden')
  if (await installedFont(root, font)) return { id, installed: true }
  // Immutable resources are committed before any token can reference them. An unused
  // installed resource is harmless and retained on cancel; no second mutable registry.
  await checkParents(root, 'public/placeholder')
  await fs.mkdir(path.join(root, 'public/fonts'), { recursive: true })
  await checkParents(root, 'public/fonts/placeholder')
  const stage = path.join(root, 'public/fonts', `.import-${randomUUID()}`)
  await fs.mkdir(stage)
  try {
    for (const file of font.files) {
      const bytes = await fetchFile(file)
      if (
        bytes.length !== file.bytes ||
        hash(bytes) !== file.sha256 ||
        (file.name === 'font.ttf' && !coversFrench(bytes))
      )
        throw new Error('font-integrity-failed')
      const handle = await fs.open(path.join(stage, file.name), 'wx')
      try {
        await handle.writeFile(bytes)
        await handle.sync()
      } finally {
        await handle.close()
      }
    }
    await syncDir(stage)
    await fs.rename(stage, path.join(root, fontDirectory(font)))
    await syncDir(path.join(root, 'public/fonts'))
  } finally {
    await fs.rm(stage, { recursive: true, force: true })
  }
  return { id, installed: true }
}
export async function validateFontResources(root, model) {
  const values = new Map([
    ...model.primitives.map((p) => [p.id, p.value]),
    ...model.styles.map((s) => [s.id, { reference: s.reference }]),
  ])
  function resolve(ref) {
    const v = values.get(ref)
    return v && typeof v === 'object' ? resolve(v.reference) : v
  }
  for (const binding of model.bindings.filter((b) => b.property === 'fontFamily')) {
    const font = catalog.families.find((f) => f.stack === resolve(binding.reference))
    if (!font) continue
    if (!(await installedFont(root, font))) throw new Error('invalid-value')
    const weights = model.bindings.filter(
      (b) =>
        b.target === binding.target &&
        b.variant === binding.variant &&
        b.part === binding.part &&
        b.property === 'fontWeight',
    )
    if (
      weights.some(
        (b) =>
          Number(resolve(b.reference)) < font.minWeight ||
          Number(resolve(b.reference)) > font.maxWeight,
      )
    )
      throw new Error('invalid-value')
  }
}

export async function readFontAsset(root, pathname) {
  for (const font of catalog.families) {
    for (const file of font.files) {
      if (pathname === '/' + fontDirectory(font).replace('public/', '') + '/' + file.name) {
        if (!(await installedFont(root, font))) return null
        return {
          bytes: (await readSafe(root, `${fontDirectory(font)}/${file.name}`)).bytes,
          type: file.name === 'font.ttf' ? 'font/ttf' : 'text/plain; charset=utf-8',
        }
      }
    }
  }
  return null
}
