import { test, expect } from 'vitest'
import { snapshot } from '../fixtures/legacy-editor-snapshot'
import { readRequest } from '../../src/design-system/editor/protocol'
import { validateEditorRequest } from '../../src/design-system/editor/contract'
const target = 'component.button.default.root.background.default'
const id = 'semantic.color.action.recovery.background.default'
test('preview protocol accepts a created style only after its creation operation', () => {
  const operations = [
    { kind: 'create-style', target, intention: 'actions.recovery', value: '#abc' },
    { kind: 'assign', target, style: id },
  ] as const
  const request = {
    version: 1,
    generation: snapshot.generation,
    storyId: 'components-button--default',
    renderId: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
    sequence: 1,
    bindingId: target,
    compare: false,
    operations,
    changes: { local: { [target]: { kind: 'style', style: id } }, shared: {} },
  }
  expect(() => readRequest(snapshot, request, request.storyId, request.renderId)).not.toThrow()
  expect(() =>
    readRequest(
      snapshot,
      { ...request, operations: [...operations].reverse() },
      request.storyId,
      request.renderId,
    ),
  ).toThrow()
  expect(() =>
    validateEditorRequest(
      {
        protocolVersion: 4,
        requestId: crypto.randomUUID(),
        baseRevision: 'a'.repeat(64),
        operations: [...operations],
      },
      snapshot.model,
      snapshot.catalog,
      snapshot.contract,
    ),
  ).not.toThrow()
})
