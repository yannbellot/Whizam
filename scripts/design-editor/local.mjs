import { statSync } from 'node:fs'
import { randomBytes, createHash } from 'node:crypto'
export function localEditorEnvironment(root, host, port) {
  if (
    !['127.0.0.1', '::1'].includes(host) ||
    !/^\d+$/.test(String(port)) ||
    Number(port) < 1 ||
    Number(port) > 65535
  )
    throw new Error('Design editor requires an exact HTTP loopback host and port')
  const stat = statSync(root)
  return {
    ADL_DESIGN_EDITOR_ROOT: createHash('sha256')
      .update(JSON.stringify({ dev: stat.dev, ino: stat.ino }))
      .digest('hex'),
    ADL_DESIGN_EDITOR_SESSION: randomBytes(32).toString('hex'),
    ADL_DESIGN_EDITOR_ORIGIN: `http://${host === '::1' ? '[::1]' : host}:${port}`,
  }
}
