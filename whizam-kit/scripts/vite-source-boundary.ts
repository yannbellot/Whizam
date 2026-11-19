import { fileURLToPath } from 'node:url'
import { normalizePath, type ServerOptions } from 'vite'

/** Scope private-path rules to this source root, including when its ancestors are private. */
export function sourceServer(directory: URL): ServerOptions {
  const root = normalizePath(fileURLToPath(directory)).replace(/\/$/, '')
  const globRoot = root.replace(/([*?[\]{}()!+@])/g, '\\$1')
  const privateDirectories = [
    '.design-editor.local',
    '.runtime.local',
    '.design-sync.local',
    '.design-sync-recovery-*.local',
  ]
  return {
    watch: { ignored: privateDirectories.map((name) => `${globRoot}/**/${name}/**`) },
    fs: {
      strict: true,
      allow: [root],
      deny: [
        ...privateDirectories.map((name) => `${globRoot}/**/${name}/**`),
        `${globRoot}/**/.design-sync-manifest.local`,
        `${globRoot}/**/.env`,
        `${globRoot}/**/.env.*`,
        `${globRoot}/**/.git`,
        `${globRoot}/**/.git/**`,
        `${globRoot}/**/*.{crt,pem}`,
      ],
    },
  }
}
