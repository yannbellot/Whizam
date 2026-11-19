export type CategoryGroup = { path: string; entries: readonly unknown[] }
export type Branch = { path: string; label: string; count: number; children: Branch[] }
export function categoryTree(groups: CategoryGroup[]): Branch[] {
  const roots: Branch[] = []
  for (const group of groups) {
    let children = roots
    const parts = group.path.split(' / ')
    for (let index = 0; index < parts.length; index++) {
      const path = parts.slice(0, index + 1).join(' / ')
      let node = children.find((item) => item.path === path)
      if (!node) {
        node = { path, label: parts[index], count: 0, children: [] }
        children.push(node)
      }
      node.count += group.entries.length
      children = node.children
    }
  }
  return roots
}
export const includesCategory = (active: string, path: string) =>
  !active || path === active || path.startsWith(active + ' / ')
