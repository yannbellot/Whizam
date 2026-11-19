import { primitiveFamily, primitiveName } from '../src/design-system/editor/naming.ts'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  bindingId,
  styleId,
  styleKey,
  normalizeValue,
  stateOrder,
  validateCatalog,
} from '../src/design-system/editor/contract.ts'
import {
  validateEditorAuthorities,
  validateModel,
  validateRequest,
  validateSheet,
  requireSchema,
} from '../scripts/validate-editor-contract.mjs'

const context = await validateEditorAuthorities()
const provenance = {
  kind: 'designer-edit',
  status: 'proposed',
  reason: 'Jeu synthétique de contrat.',
}
const style = {
  type: 'color',
  intention: 'actions.primary',
  role: 'surface',
  state: 'default',
  reference: 'primitive.color.hex-112233',
}
style.id = styleId(style)
const binding = {
  target: 'button',
  variant: 'default',
  part: 'root',
  property: 'background',
  state: 'default',
  style: style.id,
  baseReference: style.reference,
  reference: style.id,
}
binding.id = bindingId(binding)
const model = {
  schemaVersion: 4,
  primitives: [
    { id: style.reference, family: 'color', type: 'color', value: '#112233', provenance },
  ],
  styles: [style],
  bindings: [binding],
}
const change = (fn) => {
  const copy = structuredClone(model)
  fn(copy)
  return copy
}
const reject = (name, fn, code) =>
  test(name, () => assert.throws(() => validateModel(change(fn), context), code))

test('catalogue complet : les 17 catégories, 152 intentions et homonymes sont distincts', () => {
  assert.equal(context.catalog.categories.length, 17)
  const totals = [16, 7, 9, 9, 7, 10, 9, 9, 7, 8, 9, 10, 9, 9, 13, 8, 3]
  assert.deepEqual(
    context.catalog.categories.map((item) => item.intentions.length),
    totals,
  )
  assert.notEqual(styleKey(style), styleKey({ ...style, intention: 'neutral-hierarchy.primary' }))
  assert.notEqual(styleKey(style), styleKey({ ...style, state: 'hover' }))
  const ids = [
    'neutral-hierarchy',
    'actions',
    'information-result',
    'importance-priority',
    'brand-identity',
    'promotion-editorial',
    'trust-verification',
    'privacy-sensitivity',
    'access-rights',
    'availability-capacity',
    'business-progress',
    'time-relevance',
    'attribution-collaboration',
    'change-comparison',
    'data-value-trend',
    'data-roles',
    'categorical-distinction',
  ]
  assert.deepEqual(
    context.catalog.categories.map((category) => category.id),
    ids,
  )
})
test('modèle futur valide ; le style reste attribué sous exception', () => {
  validateModel(model, context)
  const sample = change((model) => {
    model.bindings[0].reference = style.reference
    model.bindings[0].provenance = provenance
  })
  validateModel(sample, context)
  assert.equal(sample.bindings[0].style, style.id)
})
reject(
  'référence absente',
  (model) => {
    model.styles[0].reference = 'primitive.color.absent'
  },
  /unknown-reference/,
)
reject(
  'type incompatible',
  (model) => {
    model.primitives[0].type = 'dimension'
    model.primitives[0].value = '1px'
  },
  /type-mismatch/,
)
reject(
  'cycle sémantique',
  (model) => {
    model.styles[0].reference = style.id
  },
  /forbidden-cycle/,
)
reject(
  'doublon d’identité même avec un autre identifiant',
  (model) => {
    model.styles.push({ ...style, id: `${style.id}.duplicate` })
  },
  /duplicate-style-identity/,
)
reject(
  'doublon d’identifiant',
  (model) => {
    model.bindings.push({ ...binding })
  },
  /duplicate-id/,
)
reject(
  'collision de variables malgré identifiants différents',
  (model) => {
    model.styles.push(
      { ...style, id: 'semantic.color.x-y.z', intention: 'actions.secondary' },
      { ...style, id: 'semantic.color.x.y-z', intention: 'actions.destructive' },
    )
  },
  /css-collision/,
)
reject(
  'intention inconnue',
  (model) => {
    model.styles[0].intention = 'actions.custom'
    model.styles[0].id = styleId(model.styles[0])
  },
  /incompatible-intention/,
)
reject(
  'intention incompatible',
  (model) => {
    model.styles[0].type = 'dimension'
    model.styles[0].role = 'spacing'
    model.styles[0].id = styleId(model.styles[0])
  },
  /incompatible-intention/,
)
reject(
  'identifiant non déterministe',
  (model) => {
    model.styles[0].id += '.extra'
  },
  /invalid-style-id/,
)
reject(
  'propriété non préparée',
  (model) => {
    model.bindings[0].property = 'iconColor'
  },
  /unprepared-target/,
)
reject(
  'variante inexistante',
  (model) => {
    model.bindings[0].variant = 'destructive'
  },
  /unprepared-target/,
)
reject(
  'état inexistant',
  (model) => {
    model.bindings[0].state = 'error'
  },
  /unprepared-target/,
)
reject(
  'attribution compatible en type mais pas en rôle',
  (model) => {
    model.bindings[0].property = 'foreground'
    model.bindings[0].id = bindingId(model.bindings[0])
  },
  /incompatible-style/,
)
reject(
  'portée d’état différente',
  (model) => {
    model.bindings[0].state = 'hover'
    model.bindings[0].id = bindingId(model.bindings[0])
  },
  /incompatible-style/,
)
reject(
  'exception sans attribution d’origine',
  (model) => {
    delete model.bindings[0].style
    model.bindings[0].reference = style.reference
    model.bindings[0].provenance = provenance
  },
  /schema-invalid/,
)
reject(
  'exception référence absente',
  (model) => {
    model.bindings[0].reference = 'primitive.color.missing'
    model.bindings[0].provenance = provenance
  },
  /unknown-reference/,
)
reject(
  'exception de type incompatible',
  (model) => {
    model.primitives.push({
      id: 'primitive.stroke.px-1',
      family: 'stroke',
      type: 'dimension',
      value: '1px',
      provenance,
    })
    model.bindings[0].reference = 'primitive.stroke.px-1'
    model.bindings[0].provenance = provenance
  },
  /type-mismatch/,
)
reject(
  'couleur injectée',
  (model) => {
    model.primitives[0].value = 'url(https://example.invalid)'
  },
  /non-canonical-value/,
)
reject(
  'primitive inutilisée invalide',
  (model) => {
    model.primitives.push({
      ...model.primitives[0],
      id: 'primitive.color.unused',
      value: 'var(--x)',
    })
  },
  /non-canonical-value/,
)
reject(
  'provenance ne prétend pas à une acceptation',
  (model) => {
    model.primitives[0].provenance.status = 'accepted'
  },
  /schema-invalid/,
)

test('normalisation exacte : couleur, unités distinctes et aucune approximation', () => {
  const properties = context.contract.properties
  assert.equal(normalizeValue(properties.background, '#AbC', []), '#aabbcc')
  assert.equal(normalizeValue(properties.background, '#1234', []), '#11223344')
  assert.equal(normalizeValue(properties.background, '#112233FF', []), '#112233')
  assert.equal(normalizeValue(properties.paddingBlock, '01.500000rem', []), '1.5rem')
  assert.notEqual(
    normalizeValue(properties.paddingBlock, '1rem', []),
    normalizeValue(properties.paddingBlock, '16px', []),
  )
  assert.equal(normalizeValue(properties.fontWeight, 650, []), 650)
  assert.equal(normalizeValue(properties.lineHeight, 1.5, []), 1.5)
  assert.equal(
    normalizeValue(
      properties.fontFamily,
      context.contract.fontFamilies[0],
      context.contract.fontFamilies,
    ),
    context.contract.fontFamilies[0],
  )
  for (const [property, value] of [
    ['background', '#12345'],
    ['paddingBlock', '-1px'],
    ['paddingBlock', 'calc(1px)'],
    ['paddingBlock', '1%'],
    ['paddingBlock', '0.0000001px'],
    ['fontWeight', 1001],
    ['lineHeight', Infinity],
    ['fontFamily', 'url(font)'],
  ])
    assert.throws(() => normalizeValue(properties[property], value, context.contract.fontFamilies))
})
test('matrice fermée : 5 composants et fondations ; SelectField sans état erreur', () => {
  assert.deepEqual(
    context.contract.targets.map((target) => target.component),
    ['Button', 'Field', 'SelectField', 'Notice', 'Panel', 'Foundations'],
  )
  assert.equal(
    context.contract.targets
      .find((target) => target.id === 'select-field')
      .states.includes('error'),
    false,
  )
  assert.deepEqual(
    stateOrder('button', ['hover', 'disabled', 'loading', 'focus-visible'], context.contract),
    ['default', 'disabled', 'loading', 'focus-visible'],
  )
  assert.deepEqual(stateOrder('field', ['disabled', 'error', 'focus-visible'], context.contract), [
    'default',
    'disabled',
    'error',
    'focus-visible',
  ])
})
for (const [name, mutate, code] of [
  [
    'chemin sortant',
    (data) => {
      data.targets[0].sheet = '../escape.yaml'
    },
    /invalid-sheet-path/,
  ],
  [
    'lien déclaré vers une fiche arbitraire',
    (data) => {
      data.targets[0].sheet = 'src/link/evil.yaml'
    },
    /invalid-sheet-path/,
  ],
  [
    'bornes inversées',
    (data) => {
      data.properties.fontSize.min = 200
      data.properties.fontSize.max = 100
    },
    /invalid-domain/,
  ],
  [
    'cellule dupliquée',
    (data) => {
      data.targets[0].cells.push(data.targets[0].cells[0])
    },
    /duplicate-cell/,
  ],
  [
    'cellule inconnue',
    (data) => {
      data.targets[0].cells[0].properties.push('invented')
    },
    /invalid-matrix/,
  ],
])
  test(name, () => {
    const copy = structuredClone(context.contract)
    mutate(copy)
    assert.throws(() => validateCatalog(context.catalog, copy), code)
  })

test('catalogue : doublons, catégorie retirée, modèle et compatibilité interdits', () => {
  for (const mutate of [
    (data) => data.categories.pop(),
    (data) => {
      data.categories[0].intentions.push(data.categories[0].intentions[0])
    },
    (data) => {
      data.categories[0].identifierTemplate = 'custom'
    },
    (data) => {
      data.categories[0].compatibility.push('dimension:invention')
    },
  ]) {
    const copy = structuredClone(context.catalog)
    mutate(copy)
    assert.throws(() => {
      requireSchema(context.validators['semantic-catalog'], copy)
      validateCatalog(copy, context.contract)
    })
  }
})
const request = {
  protocolVersion: 4,
  requestId: '12345678-1234-4123-8123-123456789abc',
  baseRevision: 'a'.repeat(64),
  operations: [{ kind: 'set-component-token', target: binding.id, value: '#fff' }],
}
test('protocole fermé : cinq opérations, pas de chemin ou commande client', () => {
  for (const operation of [
    request.operations[0],
    { kind: 'assign', target: binding.id, style: style.id },
    { kind: 'create-and-assign', target: binding.id, intention: 'actions.primary', value: '#fff' },
    { kind: 'update-shared', style: style.id, value: '#fff' },
    { kind: 'restore', target: binding.id },
  ])
    requireSchema(context.validators['editor-request'], { ...request, operations: [operation] })
  for (const mutate of [
    (data) => {
      data.operations[0].path = '../secret'
    },
    (data) => {
      data.operations[0].kind = 'exec'
    },
    (data) => {
      data.command = 'touch bad'
    },
    (data) => {
      data.baseRevision = 'bad'
    },
    (data) => {
      data.operations = []
    },
    (data) => {
      data.operations = Array(101).fill(data.operations[0])
    },
    (data) => {
      data.operations[0].target = '../secret'
    },
  ]) {
    const copy = structuredClone(request)
    mutate(copy)
    assert.throws(() => requireSchema(context.validators['editor-request'], copy), /schema-invalid/)
  }
})

test('fiche adjacente : appartenance de chaque token à sa cible', () => {
  assert.throws(
    () =>
      validateSheet({ schemaVersion: 4, target: 'button', bindings: [binding] }, context, model),
    /incomplete-sheet/,
  )
  assert.throws(
    () => validateSheet({ schemaVersion: 4, target: 'field', bindings: [binding] }, context, model),
    /sheet-target-mismatch/,
  )
})
test('une exception demeure inchangée après évolution partagée et rejoint la valeur courante au rétablissement', () => {
  const sample = structuredClone(model)
  sample.bindings[0].reference = style.reference
  sample.bindings[0].provenance = provenance
  sample.primitives.push({
    id: 'primitive.color.hex-445566',
    family: 'color',
    type: 'color',
    value: '#445566',
    provenance,
  })
  sample.styles[0].reference = 'primitive.color.hex-445566'
  validateModel(sample, context)
  assert.equal(sample.bindings[0].reference, style.reference)
  assert.equal(sample.bindings[0].style, style.id)
  sample.bindings[0].reference = sample.bindings[0].style
  delete sample.bindings[0].provenance
  validateModel(sample, context)
  assert.equal(
    sample.styles.find((item) => item.id === sample.bindings[0].style).reference,
    'primitive.color.hex-445566',
  )
})
test('une valeur partagée respecte les contraintes explicites de son consommateur', () => {
  const original = context.contract.properties.ringWidth.min
  context.contract.properties.ringWidth.min = 1
  const dimensionStyle = {
    type: 'dimension',
    intention: 'neutral-hierarchy.neutral',
    role: 'border-width',
    state: 'focus-visible',
    reference: 'primitive.stroke.px-0',
  }
  dimensionStyle.id = styleId(dimensionStyle)
  const ring = {
    target: 'button',
    variant: 'default',
    part: 'root',
    property: 'ringWidth',
    state: 'focus-visible',
    style: dimensionStyle.id,
    baseReference: dimensionStyle.reference,
    reference: dimensionStyle.id,
  }
  ring.id = bindingId(ring)
  assert.throws(
    () =>
      validateModel(
        {
          schemaVersion: 4,
          primitives: [
            {
              id: dimensionStyle.reference,
              family: 'stroke',
              type: 'dimension',
              value: '0px',
              provenance,
            },
          ],
          styles: [dimensionStyle],
          bindings: [ring],
        },
        {
          ...context,
          catalog: {
            ...context.catalog,
            semanticEligibility: [
              ...context.catalog.semanticEligibility,
              {
                intention: dimensionStyle.intention,
                role: dimensionStyle.role,
                definition: 'Rôle synthétique explicite pour éprouver les bornes du consommateur.',
              },
            ],
          },
        },
      ),
    /value-out-of-range/,
  )
  context.contract.properties.ringWidth.min = original
})

test('réponse de succès impossible sans révision confirmée', () => {
  const validate = context.validators['editor-response']
  requireSchema(validate, {
    status: 'saved',
    requestId: request.requestId,
    revision: request.baseRevision,
  })
  for (const data of [
    { status: 'saved', requestId: request.requestId },
    {
      status: 'saved',
      requestId: request.requestId,
      revision: request.baseRevision,
      issues: [{ code: 'write-failed', message: 'Échec' }],
    },
    { status: 'conflict', requestId: request.requestId },
    { status: 'unknown', requestId: request.requestId, path: '/private/config' },
  ])
    assert.throws(() => requireSchema(validate, data), /schema-invalid/)
  requireSchema(validate, {
    status: 'invalid',
    issues: [{ code: 'schema-invalid', message: 'Enveloppe invalide.' }],
  })
})

test('requêtes : valeurs injectées et références incompatibles refusées avant toute opération', () => {
  validateRequest(request, context, model)
  for (const operation of [
    { kind: 'set-component-token', target: binding.id, value: 'url(file)' },
    { kind: 'assign', target: binding.id, style: 'semantic.color.missing' },
    { kind: 'restore', target: 'component.unknown.target' },
    { kind: 'create-and-assign', target: binding.id, intention: 'actions.primary', value: '#fff' },
    { kind: 'create-and-assign', target: binding.id, intention: 'actions.custom', value: '#fff' },
    { kind: 'update-shared', style: style.id, value: 'var(--x)' },
  ])
    assert.throws(() => validateRequest({ ...request, operations: [operation] }, context, model))
  validateRequest(
    {
      ...request,
      operations: [
        {
          kind: 'create-and-assign',
          target: binding.id,
          intention: 'actions.secondary',
          value: '#fff',
        },
      ],
    },
    context,
    model,
  )
  assert.throws(() => stateOrder('notice', ['hover'], context.contract), /unprepared-state/)
})

test('fiche complète : chaque cellule préparée est attribuée et validée', () => {
  const complete = { schemaVersion: 4, primitives: [], styles: [], bindings: [] }
  const values = {
    color: '#112233',
    dimension: '1rem',
    'font-weight': 650,
    'line-height': 1.5,
    'font-family': context.contract.fontFamilies[0],
  }
  for (const target of context.contract.targets)
    for (const variant of target.variants)
      for (const cell of target.cells)
        for (const property of cell.properties)
          for (const state of cell.states) {
            const definition = context.contract.properties[property]
            const value =
              property === 'maxWidth'
                ? '70rem'
                : property === 'fontSize'
                  ? '1rem'
                  : definition.role === 'border-width'
                    ? '3px'
                    : values[definition.type]
            let primitive = complete.primitives.find(
              (item) =>
                item.type === definition.type &&
                item.family === primitiveFamily(definition.type, definition.role) &&
                item.value === value,
            )
            if (!primitive) {
              primitive = {
                id: primitiveName(primitiveFamily(definition.type, definition.role), value),
                family: primitiveFamily(definition.type, definition.role),
                type: definition.type,
                value,
                provenance,
              }
              complete.primitives.push(primitive)
            }
            const style = {
              type: definition.type,
              intention: 'neutral-hierarchy.neutral',
              role: definition.role,
              state,
              reference: primitive.id,
            }
            style.id = styleId(style)
            const semantic = context.catalog.semanticEligibility.some(
              (rule) => rule.intention === style.intention && rule.role === style.role,
            )
            if (semantic && !complete.styles.some((item) => item.id === style.id))
              complete.styles.push(style)
            const prepared = {
              target: target.id,
              variant,
              part: cell.part,
              property,
              state,
              style: semantic ? style.id : null,
              baseReference: primitive.id,
              reference: semantic ? style.id : primitive.id,
            }
            prepared.id = bindingId(prepared)
            complete.bindings.push(prepared)
          }
  validateModel(complete, context)
  for (const target of context.contract.targets)
    validateSheet(
      {
        schemaVersion: 4,
        target: target.id,
        bindings: complete.bindings.filter((binding) => binding.target === target.id),
      },
      context,
      complete,
    )
})
