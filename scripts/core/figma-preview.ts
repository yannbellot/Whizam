/** Render only server-observed nodes. Never accept a fetch URL from the browser or send the token to image storage. */
export async function readFigmaPreview(
  token: string,
  fileKey: string,
  nodeId: string,
  version: string,
  request: typeof fetch = fetch,
) {
  const url = new URL(`https://api.figma.com/v1/images/${fileKey}`)
  url.searchParams.set('ids', nodeId)
  url.searchParams.set('version', version)
  url.searchParams.set('format', 'svg')
  url.searchParams.set('svg_outline_text', 'true')
  const response = await request(url, {
    headers: { 'X-Figma-Token': token },
    redirect: 'error',
    signal: AbortSignal.timeout(30000),
  })
  if (response.status === 429) throw new Error('figma-rate-limited')
  if (!response.ok) throw new Error('figma-preview-unavailable')
  const apiBytes = await bounded(response, 65536)
  const address = JSON.parse(apiBytes.toString('utf8')).images?.[nodeId]
  if (typeof address !== 'string') throw new Error('figma-preview-unavailable')
  const image = new URL(address)
  if (
    image.protocol !== 'https:' ||
    image.username ||
    image.password ||
    image.port ||
    !(
      image.hostname === 's3-alpha-sig.figma.com' ||
      image.hostname === 'figma-alpha-api.s3.us-west-2.amazonaws.com' ||
      image.hostname === 's3-alpha.figma.com'
    )
  )
    throw new Error('figma-image-host-refused')
  const downloaded = await request(image, {
    redirect: 'error',
    credentials: 'omit',
    signal: AbortSignal.timeout(30000),
  })
  if (!downloaded.ok) throw new Error('figma-preview-unavailable')
  const bytes = await bounded(downloaded, 8 * 1024 * 1024)
  const svg = bytes.toString('utf8')
  // Never insert external markup into the DOM. SVG is displayed only in an isolated img context.
  // Refuse active content, entities and external references even in that inert context.
  if (
    !/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(svg) ||
    /<!DOCTYPE|<!ENTITY|<\s*(?:[\w-]+:)?(?:script|foreignObject|iframe|object|embed)\b|\son[\w-]+\s*=/i.test(
      svg,
    ) ||
    /(?:href|src)\s*=\s*["'](?!#|data:image\/(?:png|jpeg|webp);base64,)/i.test(svg) ||
    /@import|<\?xml-stylesheet/i.test(svg) ||
    [...svg.matchAll(/url\(([^)]*)\)/gi)].some(
      (match) =>
        !match[1]
          .trim()
          .replace(/^["']|["']$/g, '')
          .startsWith('#'),
    )
  )
    throw new Error('figma-image-format-refused')
  return 'data:image/svg+xml;base64,' + bytes.toString('base64')
}
async function bounded(response: Response, limit: number) {
  if (!response.body) throw new Error('figma-preview-unavailable')
  const reader = response.body.getReader(),
    chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const next = await reader.read()
      if (next.done) break
      size += next.value.byteLength
      if (size > limit) throw new Error('figma-preview-budget')
      chunks.push(next.value)
    }
  } finally {
    await reader.cancel()
  }
  return Buffer.concat(chunks)
}
