import { PrimitiveCatalog } from './PrimitiveCatalog'
import { TokenCatalog } from './TokenCatalog'
import { TokenRules } from './TokenRules'
export default { id: 'design-system', title: '01 — Foundations', component: PrimitiveCatalog }
export const Primitives = {}
export const Tokens = { render: () => <TokenCatalog /> }
export const Rules = { render: () => <TokenRules /> }
