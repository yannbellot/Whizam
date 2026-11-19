import { chatErrorCodes } from '../agent-chat/errors.mjs'
import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { saveRequestSchema } from '../../src/design-system/editor/operations.ts'
import { parseBounded } from './parsing.mjs'
export const reservedPrefix = '/__design-system/editor/'
const uuid = z
  .string()
  .regex(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)
const stateBody = z.object({ requestId: uuid }).strict()
const emptyBody = z.object({}).strict()
function count(request, name) {
  return request.rawHeaders.filter(
    (_, index) => index % 2 === 0 && request.rawHeaders[index].toLowerCase() === name,
  ).length
}
async function body(request) {
  if (
    request.headers['content-encoding'] ||
    !/^application\/json(?:;\s*charset=utf-8)?$/i.test(request.headers['content-type'] ?? '')
  )
    throw new Error('unsupported-format')
  if (count(request, 'content-type') !== 1) throw new Error('schema-invalid')
  const declared = request.headers['content-length']
  if (declared !== undefined && (!/^\d+$/.test(declared) || Number(declared) > 65536))
    throw new Error('budget-exceeded')
  const bytes = await new Promise((resolve, reject) => {
    const chunks = []
    let length = 0,
      done = false
    const refuse = (error) => {
      if (done) return
      done = true
      reject(error)
    }
    request.on('data', (chunk) => {
      if (done) return
      length += chunk.length
      if (length > 65536) {
        refuse(new Error('budget-exceeded'))
        return
      }
      chunks.push(chunk)
    })
    request.once('end', () => {
      if (!done) {
        done = true
        // The upload budget ends with the body, before publication or snapshot work.
        request.setTimeout(0)
        resolve(Buffer.concat(chunks))
      }
    })
    request.once('error', refuse)
    request.once('aborted', () => refuse(new Error('schema-invalid')))
    request.setTimeout(5000, () => {
      refuse(new Error('budget-exceeded'))
      request.destroy()
    })
  })
  return parseBounded(new TextDecoder('utf-8', { fatal: true }).decode(bytes), {
    format: 'json',
    depth: 16,
    nodes: 20000,
  })
}
const message = 'Opération refusée. Le brouillon et les versions disponibles sont conservés.'
const invalid = (code, requestId) => ({
  status: 'invalid',
  ...(requestId ? { requestId } : {}),
  issues: [{ code, message }],
})
export function createEditorHTTP({
  store,
  origin,
  token,
  assistance,
  observation,
  exploration,
  variant,
  contextualStyle,
  assistant,
  planning,
  figma,
}) {
  const expected = new URL(origin)
  if (
    !['127.0.0.1', '[::1]'].includes(expected.hostname) ||
    expected.protocol !== 'http:' ||
    !/^[a-f0-9]{64}$/.test(token)
  )
    throw new Error('forbidden')
  const secret = Buffer.from(token)
  return async (
    request,
    response,
    next = () => {
      response.statusCode = 404
      response.end()
    },
  ) => {
    let api = false,
      requestId
    const json = (status, value) => {
      response.statusCode = status
      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.setHeader('Cache-Control', 'no-store')
      response.setHeader('X-Content-Type-Options', 'nosniff')
      if (status >= 400) response.setHeader('Connection', 'close')
      response.end(JSON.stringify(value))
    }
    try {
      const url = new URL(request.url, origin)
      api = url.pathname.startsWith(reservedPrefix)
      const pathname = decodeURIComponent(url.pathname)
      if (
        url.origin !== origin ||
        request.headers.host !== expected.host ||
        count(request, 'host') !== 1 ||
        Object.keys(request.headers).some(
          (key) => key === 'forwarded' || key.startsWith('x-forwarded-'),
        ) ||
        request.headers['sec-fetch-site'] === 'cross-site'
      )
        throw new Error('forbidden')
      if (
        pathname
          .split('/')
          .some(
            (part) =>
              part === '.design-editor.local' ||
              part === '.runtime.local' ||
              part === '.git' ||
              part === '.env' ||
              part.startsWith('.env.'),
          )
      )
        throw new Error('forbidden')
      if (!api && pathname.startsWith('/fonts/') && store.readFontAsset) {
        if (request.method !== 'GET' || url.search) throw new Error('forbidden')
        const asset = await store.readFontAsset(pathname)
        if (!asset) {
          response.statusCode = 404
          response.end()
          return
        }
        response.setHeader('Content-Type', asset.type)
        response.setHeader('X-Content-Type-Options', 'nosniff')
        response.setHeader('Cache-Control', 'no-store')
        response.end(asset.bytes)
        return
      }
      if (!api) {
        if (store.busy) {
          json(503, { error: { code: 'recovery-required', message } })
          return
        }
        response.setHeader('Content-Security-Policy', "frame-ancestors 'self'")
        if (pathname === '/' || pathname === '/ui-lab' || pathname.endsWith('.html'))
          response.setHeader('Cache-Control', 'no-store')
        next()
        return
      }
      if (request.method !== 'POST') throw new Error('method-not-allowed')
      if (
        url.search ||
        ![
          'save',
          'snapshot',
          'fonts/import',
          ...(observation ? ['version'] : []),
          'status',
          ...(exploration ? ['project/exploration'] : []),
          ...(variant ? ['project/variant'] : []),
          ...(contextualStyle ? ['project/visual-style'] : []),
          ...(assistant ? ['project/assistant'] : []),
          ...(planning ? ['project/planning'] : []),
          ...(figma ? ['project/figma'] : []),
          ...(assistance
            ? [
                'agent/status',
                'agent/connect',
                'agent/disconnect',
                'agent/analyze',
                'agent/answer',
                'agent/interpret',
              ]
            : []),
        ].some((name) => url.pathname === reservedPrefix + name)
      )
        throw new Error('forbidden')
      if (
        count(request, 'origin') !== 1 ||
        request.headers.origin !== origin ||
        count(request, 'x-design-editor-session') !== 1
      )
        throw new Error('forbidden')
      const supplied = Buffer.from(request.headers['x-design-editor-session'] ?? '')
      if (supplied.length !== secret.length || !timingSafeEqual(supplied, secret))
        throw new Error('forbidden')
      const input = await body(request)
      if (figma && url.pathname === reservedPrefix + 'project/figma') {
        try {
          json(200, await figma(input))
        } catch (error) {
          const known = [
            'figma-rate-limited',
            'figma-access-denied',
            'figma-response-budget',
            'figma-property-budget',
            'figma-file-budget',
            'figma-cache-budget',
            'figma-source-stale',
            'figma-connection-required',
            'figma-preview-unavailable',
            'figma-preview-budget',
            'figma-image-host-refused',
            'figma-image-format-refused',
            'import-instance-adaptation-required',
            'import-adjustment-shared',
            'import-structure-confirmation-required',
            'import-component-cycle',
            'import-functional-incompatible',
            'import-replacement-unverified',
            'import-scope-unverified',
            'import-dependencies-incomplete',
            'import-proposal-exists',
            'import-source-change-review-required',
            'import-page-plan-required',
            'import-node-unsupported',
            'import-paint-unsupported',
            'import-font-unsupported',
            'import-effects-unsupported',
            'import-layout-unsupported',
            'import-value-unsupported',
            'budget-exceeded',
          ]
          if (!known.includes(error.message)) throw error
          json(error.message === 'figma-rate-limited' ? 429 : 422, {
            error: { code: error.message },
          })
        }
        return
      }
      if (planning && url.pathname === reservedPrefix + 'project/planning') {
        json(200, await planning(input))
        return
      }
      if (assistant && url.pathname === reservedPrefix + 'project/assistant') {
        json(200, await assistant(input))
        return
      }
      if (variant && url.pathname === reservedPrefix + 'project/variant') {
        json(200, await variant(input))
        return
      }
      if (contextualStyle && url.pathname === reservedPrefix + 'project/visual-style') {
        json(200, await contextualStyle(input))
        return
      }
      if (exploration && url.pathname === reservedPrefix + 'project/exploration') {
        emptyBody.parse(input)
        json(200, await exploration())
        return
      }
      if (url.pathname === reservedPrefix + 'fonts/import') {
        const query = z
          .object({ id: z.string().regex(/^[a-z]{1,30}$/) })
          .strict()
          .parse(input)
        try {
          json(200, await store.importFont(query.id))
        } catch {
          json(503, {
            error: 'Import indisponible. Vérifiez la connexion ; le brouillon est conservé.',
          })
        }
        return
      }
      if (url.pathname.startsWith(reservedPrefix + 'agent/')) {
        try {
          json(
            200,
            await assistance.handle(url.pathname.slice((reservedPrefix + 'agent/').length), input),
          )
        } catch (error) {
          const known = [
            'agent-login-required',
            'agent-busy',
            'agent-timeout',
            'agent-budget-exceeded',
            'agent-input-budget',
            'agent-invalid-response',
            'agent-unavailable',
            'agent-confinement-unavailable',
            'stale-decision',
          ]
          json(error.message === 'stale-decision' ? 409 : 503, {
            kind: 'unavailable',
            code: known.includes(error.message) ? error.message : 'agent-unavailable',
          })
        }
        return
      }
      if (observation && url.pathname.endsWith('/version')) {
        emptyBody.parse(input)
        json(200, observation())
        return
      }
      if (url.pathname.endsWith('/snapshot')) {
        emptyBody.parse(input)
        json(200, await store.snapshot())
        return
      }
      if (url.pathname.endsWith('/status')) {
        const query = stateBody.parse(input)
        requestId = query.requestId
        json(200, await store.status(query.requestId))
        return
      }
      const parsed = saveRequestSchema.safeParse(input)
      if (!parsed.success) {
        if (input && uuid.safeParse(input.requestId).success) requestId = input.requestId
        throw new Error('schema-invalid')
      }
      requestId = parsed.data.requestId
      if (
        parsed.data.operations.some(
          (op) => !['set-component-token', 'restore', 'update-shared', 'assign'].includes(op.kind),
        )
      ) {
        json(422, {
          code: 'chat-creation-required',
          issues: [
            { code: 'chat-creation-required', message: 'Créez les tokens depuis le chat IA.' },
          ],
        })
        return
      }
      const result = await store.save(parsed.data)
      json(
        result.status === 'saved'
          ? 200
          : result.status === 'conflict' || result.status === 'recovery-required'
            ? 409
            : result.status === 'failed'
              ? 503
              : result.status === 'invalid'
                ? 422
                : 200,
        result,
      )
    } catch (error) {
      const known = [
        ...chatErrorCodes,
        'visual-target',
        'schema-invalid',
        'budget-exceeded',
        'unsupported-format',
        'method-not-allowed',
        'forbidden',
        'revision-conflict',
        'recovery-required',
        'service-unavailable',
        'style-exists',
        'unknown-reference',
        'incompatible-style',
        'incompatible-intention',
        'duplicate-id',
        'id-collision',
        'forbidden-cycle',
        'css-collision',
      ]
      let code = known.includes(error.message)
        ? error.message
        : error.name === 'ZodError' || error instanceof SyntaxError
          ? 'schema-invalid'
          : error.message.startsWith('invalid-') || error.message === 'non-canonical-value'
            ? 'invalid-value'
            : 'service-unavailable'
      const status =
        code === 'forbidden'
          ? 403
          : code === 'method-not-allowed'
            ? 405
            : code === 'budget-exceeded'
              ? 413
              : code === 'unsupported-format'
                ? 415
                : code === 'schema-invalid'
                  ? 400
                  : chatErrorCodes.includes(code) ||
                      code === 'visual-target' ||
                      code === 'revision-conflict' ||
                      code === 'recovery-required'
                    ? 409
                    : code === 'service-unavailable'
                      ? 503
                      : 422
      const value = !api
        ? { error: { code, message } }
        : requestId &&
            ['recovery-required', 'service-unavailable', 'revision-conflict'].includes(code)
          ? {
              status:
                code === 'recovery-required'
                  ? 'recovery-required'
                  : code === 'revision-conflict'
                    ? 'conflict'
                    : 'failed',
              requestId,
              issues: [{ code, message }],
            }
          : invalid(code, requestId)
      json(status, value)
    }
  }
}
