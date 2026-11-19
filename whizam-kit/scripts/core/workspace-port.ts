import { z } from 'zod'
import { applyDesign, designSnapshot, undoDesign } from './workspace-design.ts'
import { WorkspaceStore } from './workspace.ts'
import {
  identitySchema,
  revisionSchema,
  workspaceSchema,
} from '../../src/core/workspace-contract.ts'
const tree = { treeId: identitySchema }
const schemas = {
  'workspace.designSnapshot': z.strictObject(tree),
  'workspace.designApply': z.strictObject({ ...tree, operation: z.unknown() }),
  'workspace.designUndo': z.strictObject({
    ...tree,
    operationId: identitySchema,
    revision: revisionSchema,
  }),
  'workspace.bootstrap': z.strictObject({ model: workspaceSchema }),
  'workspace.initialize': z.strictObject({ model: workspaceSchema }),
  'workspace.reconstruct': z.strictObject({}),
  'workspace.preview': z.strictObject({}),
  'workspace.conflicts': z.strictObject(tree),
  'workspace.snapshot': z.strictObject({}),
  'workspace.recover': z.strictObject({}),
  'workspace.open': z.strictObject({ kind: z.enum(['draft', 'workItem']) }),
  'workspace.select': z.strictObject({ treeId: identitySchema.nullable() }),
  'workspace.apply': z.strictObject({ ...tree, operation: z.unknown() }),
  'workspace.undo': z.strictObject({
    ...tree,
    operationId: identitySchema,
    revision: revisionSchema,
  }),
  'workspace.check': z.strictObject({
    ...tree,
    operationId: identitySchema,
    revision: revisionSchema,
    result: z.enum(['checking', 'passed', 'failed']),
  }),
  'workspace.commit': z.strictObject({ ...tree, revision: revisionSchema }),
  'workspace.integrate': z.strictObject({
    ...tree,
    revision: revisionSchema,
    proofRevision: revisionSchema,
    visible: z.boolean(),
    critical: z.boolean(),
    mode: z.enum(['automatic', 'human', 'e2e']),
    humanApproved: z.boolean(),
    e2ePassed: z.boolean(),
  }),
} as const
export const workspaceCapabilities = Object.fromEntries(
  Object.keys(schemas).map((key) => [key, true]),
)
/** Trusted local host only: attestations and Git capabilities must never be exposed to agent output. */
export async function workspacePort(operation: string, root: string, options: unknown) {
  if (!Object.hasOwn(schemas, operation)) throw new Error('workspace-operation-unknown')
  const payload = schemas[operation as keyof typeof schemas].parse(options ?? {})
  const store = new WorkspaceStore(root)
  switch (operation) {
    case 'workspace.designSnapshot':
      return designSnapshot(store, (payload as { treeId: string }).treeId)
    case 'workspace.designApply': {
      const p = payload as { treeId: string; operation: unknown }
      return applyDesign(store, p.treeId, p.operation)
    }
    case 'workspace.designUndo': {
      const p = payload as { treeId: string; operationId: string; revision: string }
      return undoDesign(store, p.treeId, p.operationId, p.revision)
    }
    case 'workspace.bootstrap':
      return store.bootstrap((payload as { model: z.infer<typeof workspaceSchema> }).model)
    case 'workspace.initialize':
      return store.initialize((payload as z.infer<(typeof schemas)['workspace.initialize']>).model)
    case 'workspace.reconstruct':
      return store.reconstruct()
    case 'workspace.preview':
      return store.preview()
    case 'workspace.conflicts':
      return store.conflicts((payload as { treeId: string }).treeId)
    case 'workspace.snapshot':
      return store.snapshot()
    case 'workspace.recover':
      return store.recover()
    case 'workspace.open':
      return {
        treeId: await store.openTree((payload as z.infer<(typeof schemas)['workspace.open']>).kind),
      }
    case 'workspace.select':
      return store.select((payload as z.infer<(typeof schemas)['workspace.select']>).treeId)
    case 'workspace.apply': {
      const p = payload as z.infer<(typeof schemas)['workspace.apply']>
      return store.apply(p.treeId, p.operation)
    }
    case 'workspace.undo': {
      const p = payload as z.infer<(typeof schemas)['workspace.undo']>
      return store.undo(p.treeId, p.operationId, p.revision)
    }
    case 'workspace.check': {
      const p = payload as z.infer<(typeof schemas)['workspace.check']>
      await store.check(p.treeId, p.operationId, p.revision, p.result)
      return store.snapshot()
    }
    case 'workspace.commit': {
      const p = payload as z.infer<(typeof schemas)['workspace.commit']>
      return { head: await store.commit(p.treeId, p.revision), integrated: false }
    }
    case 'workspace.integrate': {
      const p = payload as z.infer<(typeof schemas)['workspace.integrate']>
      return store.integrate(p.treeId, p)
    }
  }
}
