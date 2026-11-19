import { test, expect } from 'vitest'
import { categoryTree, includesCategory } from '../../src/design-system/editor/category-tree'
test('hierarchy counts descendants once and separates a parent from similarly named siblings', () => {
  const tree = categoryTree([
    { path: 'Semantic tokens / color / action', entries: [1, 2] },
    { path: 'Semantic tokens / color / content', entries: [3] },
    { path: 'Component tokens / Button', entries: [4] },
  ])
  expect(tree[0].count).toBe(3)
  expect(tree[0].children[0].children.map((n) => n.label)).toEqual(['action', 'content'])
  expect(tree[1].children[0].label).toBe('Button')
  expect(includesCategory('Semantic tokens / color', 'Semantic tokens / color / action')).toBe(true)
  expect(includesCategory('Semantic tokens / color', 'Semantic tokens / colorful')).toBe(false)
  expect(includesCategory('', 'Component tokens / Button')).toBe(true)
})
