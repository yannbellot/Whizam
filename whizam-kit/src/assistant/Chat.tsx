import { useEffect, useRef, useState } from 'react'
import { Button } from '../design-system/components/Button/Button'
import { Field } from '../design-system/components/Field'
import { Notice, Panel } from '../design-system/components/Notice'
import styles from './Chat.module.css'
import controlStyles from '../design-system/components/controls.module.css'
import appStyles from '../App.module.css'

type Message = { id: string; role: 'user' | 'assistant' | 'system'; text: string }
type Conversation = {
  id: string
  title: string
  status: string
  entityId?: string | null
  canContinue: boolean
  messages: Message[]
}
type Approval = {
  id: string
  conversation: string
  file: string
  reason: string
  before: string | null
  after: string
  expiresAt: number
}
type WorkspaceView = {
  selected: string | null
  trees: {
    id: string
    kind: string
    revision: string
    coverage: string
    operations: { id: string; state: string }[]
    entities: { id: string; label: string; kind: string }[]
  }[]
}
type Snapshot = {
  workspace?: WorkspaceView | null
  project: string
  connected: boolean
  installing: boolean
  loginUrl: string | null
  error: string | null
  conversations: Conversation[]
  approvals: Approval[]
}
const descriptions: Record<string, string> = {
  'workspace-select-draft': 'Sélectionnez un brouillon ou un chantier avant de modifier le projet.',
  'workspace-draft-committed-create-new':
    'Ce brouillon est enregistré dans Git. Ouvrez un nouveau brouillon pour poursuivre.',
  'workspace-revision-conflict':
    'Le projet a changé depuis la proposition. Demandez une proposition actualisée.',
  'chat-login-required': 'Connectez votre compte Codex pour commencer.',
  'chat-account-changed':
    'Cette conversation appartient à une autre connexion. Elle reste consultable ; créez une nouvelle conversation pour ce compte.',
  'chat-provider-install-failed':
    'La préparation de Codex a échoué. Vérifiez la connexion réseau puis réessayez.',
  'chat-approval-obsolete':
    'Cette autorisation est déjà résolue ou périmée. Aucune nouvelle action exécutée.',
  'chat-file-changed':
    'Le fichier a changé depuis la proposition. Demandez une nouvelle proposition avant de valider.',
  'chat-project-changed': 'Le dossier a changé. Rouvrez explicitement le projet dans Loomata.',
  'chat-other-project-busy':
    'Une opération est en cours dans un autre projet. Terminez-la ou interrompez-la avant de continuer.',
  'chat-message-duplicate':
    'Cet envoi est déjà enregistré. Consultez la conversation ; il ne sera pas répété.',
  'chat-writer-protected':
    'Cette source relève de l’atelier ou de l’outillage. Utilisez UI Lab pour modifier le design system.',
}
export default function Chat({
  requestCommand,
  contextEntityId,
  embedded = false,
}: {
  requestCommand?: (operation: string, payload: Record<string, unknown>) => Promise<unknown>
  contextEntityId?: string
  embedded?: boolean
} = {}) {
  const [state, setState] = useState<Snapshot | null>(null)
  const [entityId, setEntityId] = useState(contextEntityId ?? '')
  const [selected, setSelected] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const [connectionError, setConnectionError] = useState(false)
  const mounted = useRef(true)
  const request = useRef<{ text: string; id: string } | null>(null)
  const token = document.querySelector<HTMLMetaElement>(
    'meta[name="loomata-chat-session"]',
  )?.content
  async function command(operation: string, payload: Record<string, unknown> = {}) {
    if (requestCommand) return requestCommand(operation, payload)
    const response = await fetch(location.pathname + '/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ operation, payload }),
      signal: AbortSignal.timeout(300000),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'chat-operation-failed')
    return data
  }
  async function refresh() {
    const snapshot = (await command('snapshot')) as Snapshot
    if (mounted.current) {
      setState(snapshot)
      setConnectionError(false)
    }
  }
  async function action(operation: string, payload: Record<string, unknown> = {}) {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const result = await command(operation, payload)
      if (operation === 'new') setSelected(result.conversation)
      await refresh()
      return result
    } catch (e) {
      setError(
        e instanceof Error
          ? descriptions[e.message] ||
              'L’opération n’a pas été confirmée. Réessayez après avoir vérifié la connexion et les autorisations.'
          : 'Opération non confirmée.',
      )
      return null
    } finally {
      setBusy(false)
    }
  }
  useEffect(() => {
    mounted.current = true
    void command(embedded ? 'snapshot' : 'status')
      .then(refresh)
      .catch(() => {
        if (mounted.current)
          setError(
            'La préparation de l’assistance n’a pas été confirmée. Utilisez Vérifier / Réessayer.',
          )
      })
      .finally(() => {
        if (mounted.current) setBusy(false)
      })
    let stopped = false
    const poll = async () => {
      try {
        await refresh()
      } catch {
        if (mounted.current) setConnectionError(true)
      }
      if (!stopped) timer = window.setTimeout(poll, 700)
    }
    let timer = window.setTimeout(poll, 700)
    return () => {
      mounted.current = false
      stopped = true
      clearTimeout(timer)
    }
    // One capability-bound session per mounted page; polling never sends a message.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const conversations = state?.conversations.filter(
    (c) => !contextEntityId || c.entityId === contextEntityId,
  )
  const conversation = conversations?.find((c) => c.id === selected) ?? conversations?.at(-1)
  const running =
    conversation && ['running', 'sending', 'awaitingApproval'].includes(conversation.status)
  const ConnectionContainer = contextEntityId ? 'details' : Panel
  const ConversationContainer = contextEntityId ? 'div' : Panel
  return (
    <section
      aria-label={contextEntityId ? 'Micro-chat de la sélection' : 'Agents IA'}
      className={embedded ? undefined : appStyles.page}
    >
      <div className={styles.page}>
        {contextEntityId ? (
          <h3>Codex · sélection</h3>
        ) : (
          <h1>{embedded ? 'Agents IA' : 'Assistance Loomata'}</h1>
        )}
        {!contextEntityId && (
          <p>
            Projet : <strong>{state?.project || 'Chargement…'}</strong>
          </p>
        )}
        <ConnectionContainer>
          {contextEntityId ? (
            <summary>
              Codex · {state?.connected ? 'Compte connecté' : 'Connexion à vérifier'}
            </summary>
          ) : (
            <h2>Connexion</h2>
          )}
          <p>
            Codex ·{' '}
            {state?.installing
              ? 'Préparation de Codex…'
              : state?.connected
                ? 'Compte connecté'
                : 'Compte non connecté'}
          </p>
          <div className={styles.actions}>
            {!state?.connected ? (
              <Button disabled={busy} onClick={() => void action('connect')}>
                Connecter Codex
              </Button>
            ) : (
              <Button disabled={busy || !!running} onClick={() => void action('disconnect')}>
                Déconnecter Codex
              </Button>
            )}
            <Button disabled={busy} onClick={() => void action('status')}>
              Vérifier / Réessayer
            </Button>
          </div>
          {state?.loginUrl && (
            <p>
              <a href={state.loginUrl} target="_blank" rel="noreferrer noopener">
                Ouvrir la connexion officielle dans le navigateur
              </a>{' '}
              <Button disabled={busy} onClick={() => void action('cancelLogin')}>
                Annuler la connexion
              </Button>
            </p>
          )}
          {!embedded && <p>Claude Code : indisponible dans cette première version.</p>}
        </ConnectionContainer>
        {error && <Notice tone="error">{error}</Notice>}
        {connectionError && !error && (
          <Notice tone="error">
            Lecture de l’assistance momentanément indisponible. Les échanges sont conservés ; aucun
            message n’est renvoyé automatiquement.
          </Notice>
        )}
        {state?.error && !error && (
          <Notice tone="error">
            L’assistance demande une vérification. Utilisez Vérifier / Réessayer ; les échanges sont
            conservés.
          </Notice>
        )}
        {state?.workspace && !contextEntityId && (
          <Panel>
            <h2>État de travail</h2>
            {embedded && (
              <p>
                {state.workspace.selected
                  ? state.workspace.trees.find((t) => t.id === state.workspace?.selected)?.kind ===
                    'workItem'
                    ? 'Chantier isolé affiché'
                    : 'Brouillon isolé affiché'
                  : 'Version principale affichée'}
              </p>
            )}
            {!embedded && (
              <label className={controlStyles.field}>
                Version affichée
                <select
                  className={controlStyles.input}
                  aria-label="Version affichée"
                  value={state.workspace.selected ?? ''}
                  disabled={busy || !!running}
                  onChange={(e) => {
                    setEntityId('')
                    void action('workspaceSelect', { treeId: e.target.value || null })
                  }}
                >
                  <option value="">Version principale</option>
                  {state.workspace.trees.map((tree) => (
                    <option key={tree.id} value={tree.id}>
                      {tree.kind === 'draft' ? 'Brouillon instantané' : 'Chantier'} ·{' '}
                      {tree.id.slice(0, 8)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <p role="status">
              {state.workspace.trees.find((tree) => tree.id === state.workspace?.selected)
                ?.coverage === 'partial'
                ? 'Certaines conséquences restent à examiner.'
                : 'Les représentations partagent la version sélectionnée.'}
            </p>
            <ul>
              {state.workspace.trees
                .find((tree) => tree.id === state.workspace?.selected)
                ?.operations.map((op) => (
                  <li key={op.id}>
                    {op.state === 'validated'
                      ? 'Contrôles réussis'
                      : op.state === 'checking'
                        ? 'En vérification'
                        : 'Appliqué, à vérifier'}
                  </li>
                ))}
            </ul>
          </Panel>
        )}
        <ConversationContainer>
          {!contextEntityId && <h2>Conversations</h2>}
          {state?.workspace && !contextEntityId && (
            <label className={controlStyles.field}>
              Élément de la conversation
              <select
                className={controlStyles.input}
                aria-label="Élément de la conversation"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
              >
                <option value="">Conversation générale</option>
                {state.workspace.trees
                  .find((tree) => tree.id === state.workspace?.selected)
                  ?.entities.map((entity) => (
                    <option key={entity.id} value={entity.id}>
                      {entity.label} · {entity.kind}
                    </option>
                  ))}
              </select>
            </label>
          )}
          {(!contextEntityId || !conversation) && (
            <Button
              disabled={busy || !state?.connected || !!running}
              onClick={() => void action('new', entityId ? { entityId } : {})}
            >
              {contextEntityId ? 'Commencer cet échange' : 'Nouvelle conversation'}
            </Button>
          )}
          {!contextEntityId && (
            <ul>
              {conversations?.map((c) => (
                <li key={c.id}>
                  <Button
                    aria-pressed={conversation?.id === c.id}
                    onClick={() => setSelected(c.id)}
                  >
                    {c.title}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {conversation && !conversation.canContinue && (
            <Notice>
              Historique consultable. Reconnectez le compte d’origine pour continuer cette
              conversation.
            </Notice>
          )}
          <section aria-label="Messages de la conversation">
            {conversation?.messages.map((m) => (
              <article key={m.id}>
                <strong>
                  {m.role === 'user'
                    ? 'Vous'
                    : m.role === 'assistant'
                      ? 'Codex'
                      : 'État de l’action'}
                </strong>
                <div className={styles.text}>{m.text}</div>
              </article>
            ))}
          </section>
          <p role="status" aria-live="polite">
            {conversation?.status === 'awaitingApproval'
              ? 'Votre décision est attendue avant de modifier un fichier.'
              : running
                ? 'Codex travaille…'
                : conversation?.status === 'interrupted'
                  ? 'Échange interrompu. Aucun message ni accord rejoué.'
                  : conversation?.status === 'failed'
                    ? 'Échange non terminé. Vous pouvez reprendre par un nouveau message.'
                    : 'Prêt pour votre message.'}
          </p>
          {state?.approvals
            .filter((a) => a.conversation === conversation?.id)
            .map((a) => (
              <Panel key={a.id}>
                <h3>Autoriser une modification ?</h3>
                <p>
                  <strong>{a.file}</strong> · {a.reason}
                </p>
                <details>
                  <summary>Contenu actuel</summary>
                  <pre className={styles.text}>{a.before ?? 'Nouveau fichier'}</pre>
                </details>
                <details open>
                  <summary>Contenu proposé</summary>
                  <pre className={styles.text}>{a.after}</pre>
                </details>
                <p>
                  {state?.workspace
                    ? 'La modification rejoindra le brouillon sélectionné. La version principale sera conservée.'
                    : 'La modification sera enregistrée dans ce seul fichier du projet.'}{' '}
                  Cette décision expire au bout de deux minutes.
                </p>
                <div className={styles.actions}>
                  <Button
                    disabled={busy}
                    onClick={() => void action('approve', { id: a.id, decision: 'deny' })}
                  >
                    Refuser la modification
                  </Button>
                  <Button
                    disabled={busy}
                    onClick={() => void action('approve', { id: a.id, decision: 'approve' })}
                  >
                    Autoriser cette modification
                  </Button>
                </div>
              </Panel>
            ))}
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const form = event.currentTarget
              const text = String(new FormData(form).get('message') || '')
              if (!text.trim() || busy) return
              if (request.current?.text !== text)
                request.current = { text, id: crypto.randomUUID() }
              const requestId = request.current.id
              void (async () => {
                let id = conversation?.id
                if (!id) {
                  const created = await action('new', entityId ? { entityId } : {})
                  id = created?.conversation
                }
                if (!id) return
                const sent = await action('send', { conversation: id, text, requestId })
                if (sent) {
                  form.reset()
                  request.current = null
                }
              })()
            }}
          >
            <Field
              name="message"
              label="Message à Codex"
              multiline
              maxLength={16000}
              disabled={
                busy ||
                !state?.connected ||
                !!running ||
                (!!conversation && !conversation.canContinue)
              }
              hint="Décrivez l’objectif. Les modifications de fichiers vous seront proposées avant enregistrement."
            />
            <div className={styles.actions}>
              <Button
                type="submit"
                disabled={
                  busy ||
                  !state?.connected ||
                  !!running ||
                  (!!conversation && !conversation.canContinue)
                }
              >
                Envoyer le message
              </Button>
              <Button disabled={busy || !running} onClick={() => void action('interrupt')}>
                Interrompre
              </Button>
            </div>
          </form>
        </ConversationContainer>
      </div>
    </section>
  )
}
