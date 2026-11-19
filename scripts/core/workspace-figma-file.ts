import path from 'node:path'
import { z } from 'zod'
import { readSafe, privateDir, durableReplace } from '../design-editor/files.mjs'
import { figmaFileSchema, figmaDependencies } from '../../src/core/figma-file.ts'
import { figmaNodeIdSchema } from '../../src/core/figma-reference.ts'
import { readFigmaFile } from './figma-file-client.ts'
import { readFigmaPreview } from './figma-preview.ts'

const fileKey = z.string().regex(/^[A-Za-z0-9]{10,100}$/)
const command = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('file-status') }),
  z.strictObject({
    kind: z.literal('file-browse'),
    fileKey,
    token: z
      .string()
      .min(20)
      .max(1000)
      .regex(/^[!-~]+$/)
      .optional(),
  }),
  z.strictObject({
    kind: z.literal('file-preview'),
    fileKey,
    nodeId: figmaNodeIdSchema,
    version: z.string().min(1).max(200),
  }),
])
const cachePath = '.runtime.local/figma/file.json'
const cacheSchema = z.strictObject({ readAt: z.string(), file: figmaFileSchema })

/** Private source cache, separate from the bounded, versioned workspace. Never activates an import. */
export async function workspaceFigmaFile(
  root: string,
  commonRoot: string,
  value: unknown,
  request: typeof fetch = fetch,
) {
  const input = command.parse(value)
  const authPath = '.runtime.local/figma/connection.json'
  const auth = async () => {
    try {
      return z
        .strictObject({
          token: z
            .string()
            .min(20)
            .max(1000)
            .regex(/^[!-~]+$/),
        })
        .parse(JSON.parse((await readSafe(commonRoot, authPath, 4096)).bytes.toString('utf8')))
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw e
    }
  }
  const cached = async () => {
    try {
      return cacheSchema.parse(
        JSON.parse((await readSafe(root, cachePath, 32 * 1024 * 1024)).bytes.toString('utf8')),
      )
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw e
    }
  }
  if (input.kind === 'file-status') return { connected: !!(await auth()), cached: await cached() }
  if (input.kind === 'file-browse') {
    const token = input.token ?? (await auth())?.token
    if (!token) throw new Error('figma-connection-required')
    const file = await readFigmaFile(token, input.fileKey, request)
    const cache = cacheSchema.parse({ readAt: new Date().toISOString(), file })
    const bytes = Buffer.from(JSON.stringify(cache))
    if (bytes.length > 32 * 1024 * 1024) throw new Error('figma-cache-budget')
    // A successful read precedes credential persistence. No credentials enter the returned projection.
    if (input.token) {
      await privateDir(path.join(commonRoot, '.runtime.local'))
      await privateDir(path.join(commonRoot, '.runtime.local/figma'))
      await durableReplace(commonRoot, authPath, Buffer.from(JSON.stringify({ token })))
    }
    await privateDir(path.join(root, '.runtime.local'))
    await privateDir(path.join(root, '.runtime.local/figma'))
    await durableReplace(root, cachePath, bytes)
    return { connected: true, cached: cache }
  }
  const cache = await cached()
  if (
    !cache ||
    cache.file.fileKey !== input.fileKey ||
    cache.file.version !== input.version ||
    !cache.file.nodes.some((n) => n.id === input.nodeId)
  )
    throw new Error('figma-source-stale')
  const cacheKey = (await import('node:crypto'))
    .createHash('sha256')
    .update(JSON.stringify([input.fileKey, input.version, input.nodeId, 'svg-outlines-v1']))
    .digest('hex')
  const imagePath = `.runtime.local/figma/preview-${cacheKey}.json`
  try {
    const result = JSON.parse(
      (await readSafe(root, imagePath, 12 * 1024 * 1024)).bytes.toString('utf8'),
    )
    return z
      .strictObject({
        image: z
          .string()
          .startsWith('data:image/svg+xml;base64,')
          .max(12 * 1024 * 1024),
      })
      .parse(result)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
  }
  const token = (await auth())?.token
  if (!token) throw new Error('figma-connection-required')
  const image = await readFigmaPreview(token, input.fileKey, input.nodeId, input.version, request)
  await durableReplace(root, imagePath, Buffer.from(JSON.stringify({ image })))
  return { image, dependencies: figmaDependencies(cache.file, input.nodeId) }
}
