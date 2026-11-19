import * as fs from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { nativeAppearanceTokens } from './generate-loomata-ui.mjs'

const run = promisify(execFile)
const kit = fileURLToPath(new URL('..', import.meta.url))
export async function buildLoomata({
  directory,
  source = resolve(kit, 'macos/Loomata.swift'),
  name = 'Loomata',
  launch,
  identifier = 'org.loomata.local.workspace',
}) {
  if (process.platform !== 'darwin') throw new Error('Loomata : macOS requis pour cette enveloppe.')
  const preferred =
    process.env.LOOMATA_SDK ?? (await run('/usr/bin/xcrun', ['--show-sdk-path'])).stdout.trim()
  const candidates = [await fs.realpath(preferred)]
  if (!process.env.LOOMATA_SDK) {
    for (const name of (await fs.readdir(dirname(preferred))).sort((a, b) =>
      b.localeCompare(a, undefined, { numeric: true }),
    )) {
      if (!/^MacOSX[0-9]+(?:\.[0-9]+)?\.sdk$/.test(name)) continue
      const path = await fs.realpath(resolve(dirname(preferred), name))
      if (!candidates.includes(path)) candidates.push(path)
    }
  }
  const bundle = resolve(directory, name + '.app')
  await fs.mkdir(resolve(bundle, 'Contents/MacOS'), { recursive: true })
  const binary = resolve(bundle, 'Contents/MacOS/Loomata')
  const attempts = []
  let sdk
  for (const candidate of candidates) {
    try {
      const { stderr } = await run(
        '/usr/bin/swiftc',
        [
          '-swift-version',
          '5',
          '-sdk',
          candidate,
          '-module-cache-path',
          resolve(directory, 'swift-cache'),
          source,
          '-o',
          binary,
        ],
        { timeout: 180000, maxBuffer: 4e6 },
      )
      attempts.push({ sdk: candidate, status: 'passed' })
      await fs.writeFile(resolve(directory, 'compile.log'), stderr)
      sdk = candidate
      break
    } catch (error) {
      attempts.push({ sdk: candidate, status: 'failed' })
      await fs.writeFile(
        resolve(directory, `compile-attempt-${attempts.length}.log`),
        error.stderr ?? error.message,
      )
      await fs.writeFile(
        resolve(directory, 'compile-attempts.json'),
        JSON.stringify(attempts, null, 2) + '\n',
      )
      // Retry only an Apple SDK/compiler mismatch, using SDKs already installed on this host.
      if (
        process.env.LOOMATA_SDK ||
        !/this SDK is not supported by the compiler|compiled module was created by a different version/.test(
          error.stderr ?? '',
        )
      )
        throw error
    }
  }
  await fs.writeFile(
    resolve(directory, 'compile-attempts.json'),
    JSON.stringify(attempts, null, 2) + '\n',
  )
  if (!sdk) throw new Error('Aucun SDK macOS installé ne correspond au compilateur Swift.')
  await fs.writeFile(
    resolve(bundle, 'Contents/Info.plist'),
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>Loomata</string>
<key>CFBundleIdentifier</key><string>${identifier}</string>
<key>CFBundleName</key><string>Loomata</string>
<key>CFBundleDisplayName</key><string>Loomata</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>NSAppTransportSecurity</key><dict><key>NSAllowsLocalNetworking</key><true/></dict>
</dict></plist>\n`,
  )
  if (launch) {
    await fs.mkdir(resolve(bundle, 'Contents/Resources'), { recursive: true })
    await fs.writeFile(
      resolve(bundle, 'Contents/Resources/launch.json'),
      JSON.stringify(launch, null, 2) + '\n',
    )
  }
  // Embed the validated tool authority: native colours never read project tokens or remote data.
  await fs.mkdir(resolve(bundle, 'Contents/Resources'), { recursive: true })
  await fs.writeFile(
    resolve(bundle, 'Contents/Resources/loomata-ui.tokens.json'),
    await nativeAppearanceTokens(kit),
  )
  // Local development identity only; no distribution/signing account is implied.
  await signBuiltBundle(bundle)
  return { bundle, binary, sdk }
}

// Remove only signing-incompatible metadata on this newly built artifact. Preserve quarantine.
export async function stripSigningMetadata(bundle) {
  for (const attribute of ['com.apple.FinderInfo', 'com.apple.ResourceFork'])
    await run('/usr/bin/xattr', ['-dr', attribute, bundle], { timeout: 120000, maxBuffer: 1048576 })
  // File Provider may add root FinderInfo while the recursive traversal is running.
  const rootAttributes = (await run('/usr/bin/xattr', [bundle])).stdout.split('\n')
  for (const attribute of ['com.apple.FinderInfo', 'com.apple.ResourceFork'])
    if (rootAttributes.includes(attribute)) await run('/usr/bin/xattr', ['-d', attribute, bundle])
}

export async function signBuiltBundle(bundle, deep = false) {
  await stripSigningMetadata(bundle)
  try {
    await run(
      '/usr/bin/codesign',
      ['--force', ...(deep ? ['--deep'] : []), '--sign', '-', bundle],
      { timeout: 120000 },
    )
  } catch (error) {
    if (
      !/resource fork, Finder information, or similar detritus not allowed/.test(error.stderr ?? '')
    )
      throw error
    // Some File Provider roots acquire metadata after the seal is written. Success still
    // requires independent strict verification below; never accept a missing/invalid seal.
    await fs.writeFile(
      resolve(bundle, '..', deep ? 'signature-deep-metadata.log' : 'signature-metadata.log'),
      error.stderr,
    )
  }
  await stripSigningMetadata(bundle)
  await run('/usr/bin/codesign', ['--verify', ...(deep ? ['--deep'] : []), '--strict', bundle], {
    timeout: 120000,
  })
}
