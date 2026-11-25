import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { constants } from 'node:fs'
import { open, rename, unlink } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

export function parseFields(args) {
  if (!args.length || args.length > 12)
    throw new Error('Champs requis : NOM:password ou NOM:email (12 maximum).')
  const fields = args.map((arg) => {
    const match = /^([A-Z][A-Z0-9_]{0,79}):(password|email)$/.exec(arg)
    if (!match || /^(VITE_|PUBLIC_)/.test(match[1])) throw new Error('Champ privé invalide.')
    return { key: match[1], type: match[2] }
  })
  if (new Set(fields.map((f) => f.key)).size !== fields.length) throw new Error('Champ dupliqué.')
  return fields
}

async function snapshot(path) {
  try {
    const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
    try {
      const stat = await handle.stat()
      if (!stat.isFile() || stat.nlink !== 1 || stat.size > 128 * 1024)
        throw new Error('Configuration non prise en charge.')
      return { text: await handle.readFile('utf8'), ino: stat.ino, dev: stat.dev }
    } finally {
      await handle.close()
    }
  } catch (error) {
    if (error.code === 'ENOENT') return { text: null }
    throw error
  }
}

// Refus conservateur des environnements multilignes : ne jamais réécrire une
// valeur qui pourrait appartenir à une autre affectation.
function updateEnv(source, fields, values) {
  const lines = (source ?? '').split(/\r?\n/)
  for (const line of lines) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    if (
      !/^\s*(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=\s*(?:'[^']*'\s*(?:#.*)?|"(?:[^"\\]|\\.)*"\s*(?:#.*)?|[^'"\r\n]*?)\s*$/.test(
        line,
      ) ||
      /\\\s*$/.test(line)
    ) {
      throw new Error('Configuration complexe : utiliser le repli fichier.')
    }
  }
  for (const { key } of fields) {
    const assignment = `${key}='${values[key]}'`
    const pattern = new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`)
    const indexes = lines.flatMap((line, i) => (pattern.test(line) ? [i] : []))
    if (indexes.length > 1) throw new Error('Configuration ambiguë : utiliser le repli fichier.')
    if (indexes.length) lines[indexes[0]] = assignment
    else lines.push(assignment)
  }
  return lines.join('\n').replace(/\n*$/, '\n')
}

export async function startConfiguration({
  root,
  fields,
  ttl = 20 * 60 * 1000,
  target = 'application',
}) {
  fields = parseFields(fields.map((f) => `${f.key}:${f.type}`))
  if (!['application', 'github'].includes(target)) throw new Error('Cible privée invalide.')
  if (
    target === 'github' &&
    (fields.length !== 1 || fields[0].key !== 'GH_TOKEN' || fields[0].type !== 'password')
  )
    throw new Error('Champ GitHub invalide.')
  const filename = target === 'github' ? '.github-token.local' : '.env.local'
  const heading = target === 'github' ? 'Connexion à GitHub' : 'Configuration privée'
  const path = resolve(root, filename)
  const initial = await snapshot(path)
  const token = randomBytes(32).toString('hex')
  let origin,
    busy = false,
    finished = false
  let timer
  const stop = () => {
    clearTimeout(timer)
    server.close()
    server.closeIdleConnections()
  }
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Security-Policy':
      "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    'Referrer-Policy': 'same-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  }
  const server = createServer(async (req, res) => {
    const reply = (status, body) => {
      res.writeHead(status, headers)
      res.end(body)
    }
    if (req.headers.host !== new URL(origin).host || req.headers['sec-fetch-site'] === 'cross-site')
      return reply(403, 'Accès refusé.')
    if (req.url !== `/${token}`) return reply(404, 'Introuvable.')
    if (finished) return reply(410, 'Session terminée.')
    if (req.method === 'GET') {
      return reply(
        200,
        `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${heading}</title><style>body{font:18px system-ui;max-width:640px;margin:48px auto;padding:24px;color:#172032;background:#f8fafc}label{display:block;margin:24px 0}input{display:block;box-sizing:border-box;width:100%;padding:12px;margin-top:8px;font:inherit}button{padding:12px 20px;font:inherit;margin:8px 8px 8px 0}input:focus-visible,button:focus-visible{outline:3px solid #315bcb;outline-offset:3px}</style><main><h1>${heading}</h1><p>Ces valeurs restent sur cet ordinateur, dans ${filename}. Elles ne sont pas envoyées à l’assistant. Le mot de passe est masqué et aucune valeur existante n’est affichée.</p><p>Session valable 20 minutes. Aucun test de connexion ni envoi réel n’est effectué.</p><form method="post" autocomplete="off">${fields.map(({ key, type }) => `<label>${target === 'github' ? 'Jeton d’accès GitHub' : escapeHtml(key)}<input name="${key}" type="${type}" required maxlength="4096" autocomplete="${type === 'password' ? 'new-password' : 'off'}" spellcheck="false"></label>`).join('')}<p>Les apostrophes et retours à la ligne ne sont pas pris en charge.</p><button name="action" value="save">Enregistrer</button><button name="action" value="cancel" formnovalidate>Annuler</button></form></main></html>`,
      )
    }
    if (req.method !== 'POST') return reply(405, 'Méthode refusée.')
    if (
      req.headers.origin !== origin ||
      req.headers['content-type'] !== 'application/x-www-form-urlencoded'
    )
      return reply(403, 'Accès refusé.')
    if (busy) return reply(409, 'Enregistrement en cours.')
    busy = true
    let temp
    try {
      const chunks = []
      let bytes = 0
      for await (const chunk of req) {
        bytes += chunk.length
        if (bytes > 64 * 1024) {
          reply(413, 'Saisie trop volumineuse.')
          return
        }
        chunks.push(chunk)
      }
      if (finished) return reply(410, 'Session expirée.')
      const data = new URLSearchParams(Buffer.concat(chunks).toString('utf8'))
      const allowed = new Set(['action', ...fields.map((f) => f.key)])
      if ([...data.keys()].some((key) => !allowed.has(key) || data.getAll(key).length !== 1))
        return reply(400, 'Champs invalides.')
      if (data.get('action') === 'cancel') {
        finished = true
        reply(
          200,
          '<h1>Configuration annulée</h1><p>Aucune valeur enregistrée. Vous pouvez fermer cet onglet.</p>',
        )
        stop()
        return
      }
      if (data.get('action') !== 'save') return reply(400, 'Action invalide.')
      const values = Object.fromEntries(
        fields.map(({ key, type }) => {
          const value = data.get(key)
          if (
            !value ||
            value.length > 4096 ||
            /['\r\n\0]/.test(value) ||
            (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          )
            throw new Error('Saisie invalide.')
          return [key, value]
        }),
      )
      const updated = updateEnv(initial.text, fields, values)
      const current = await snapshot(path)
      if (JSON.stringify(current) !== JSON.stringify(initial))
        return reply(
          409,
          'Configuration modifiée ailleurs. Fermez cet onglet et relancez la saisie.',
        )
      temp = resolve(root, `.secrets-${randomBytes(16).toString('hex')}.local`)
      const file = await open(temp, 'wx', 0o600)
      try {
        await file.writeFile(updated)
        await file.sync()
      } finally {
        await file.close()
      }
      // Second contrôle avant remplacement ; aucune fusion silencieuse.
      if (JSON.stringify(await snapshot(path)) !== JSON.stringify(initial))
        return reply(409, 'Configuration modifiée ailleurs. Relancez la saisie.')
      if (finished) return reply(410, 'Session expirée.')
      await rename(temp, path)
      temp = undefined
      finished = true
      reply(
        200,
        '<h1>Configuration enregistrée</h1><p>Vous pouvez fermer cet onglet et demander à l’assistant de poursuivre. Aucun envoi réel effectué.</p>',
      )
      stop()
    } catch {
      reply(
        400,
        'Enregistrement impossible. Vérifiez la saisie ou utilisez le repli fichier ; aucune valeur affichée. Revenez au formulaire pour réessayer.',
      )
    } finally {
      if (temp) await unlink(temp).catch(() => {})
      busy = false
    }
  })
  server.requestTimeout = 30_000
  server.headersTimeout = 15_000
  await new Promise((yes, no) => {
    server.once('error', no)
    server.listen(0, '127.0.0.1', yes)
  })
  origin = `http://127.0.0.1:${server.address().port}`
  timer = setTimeout(() => {
    finished = true
    stop()
  }, ttl)
  return { url: `${origin}/${token}`, close: stop }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
    const args = process.argv.slice(2)
    const github = args[0] === '--github'
    const session = await startConfiguration({
      root,
      target: github ? 'github' : 'application',
      fields: parseFields(github ? args.slice(1) : args),
    })
    console.log(`Saisie privée locale (20 minutes) : ${session.url}`)
    for (const signal of ['SIGINT', 'SIGTERM'])
      process.once(signal, () => {
        session.close()
      })
  } catch {
    console.error(
      'Configuration privée indisponible. Vérifier les noms des champs et utiliser le repli fichier si nécessaire.',
    )
    process.exitCode = 1
  }
}
