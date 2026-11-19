import { build } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { withEditorRead } from './editor-reader.mjs'
export async function buildChatUI(output) {
  const tool = fileURLToPath(new URL('..', import.meta.url))
  await withEditorRead(tool, () =>
    build({
      configFile: false,
      root: resolve(tool, 'src/assistant'),
      base: '/',
      publicDir: false,
      logLevel: 'silent',
      esbuild: { jsx: 'automatic' },
      build: {
        outDir: output,
        emptyOutDir: false,
        rollupOptions: { input: resolve(tool, 'src/assistant/index.html') },
      },
    }),
  )
}
