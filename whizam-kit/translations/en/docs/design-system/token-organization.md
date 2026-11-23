# Token organization

The [design system policy](policy.md) is the current authority: primitives, component tokens and page-local tokens. DTCG JSON carries values/references, the YAML registry components/examples, and YAML recipes contextual CSS expressions.

Sharing a value creates no common intent. Explicitly retarget usages for a global change. Document local tokens by page without exposing them as design system API; a different component appearance requires a variant.
