import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { buildLoomata } from './build-loomata.mjs'
const run = promisify(execFile),
  kit = path.resolve(import.meta.dirname, '..'),
  base = path.resolve(kit, '../.local/delivery-tests')
if (!process.argv[2])
  throw new Error('Usage: node scripts/test-deliveries.mjs <packaged delivery directory>')
await fs.mkdir(base, { recursive: true })
const out = await fs.mkdtemp(path.join(base, 'qualification-'))
const payload = path.resolve(process.argv[2], 'Loomata.app/Contents/Resources/payload')
const harness = `
@MainActor func qualify(_ host:LoomataHost) async {
 let out=ProcessInfo.processInfo.environment["LOOMATA_E2E_OUTPUT"]!
 do {
  host.window?.level = .floating; host.window?.orderFrontRegardless()
  let deadline=Date().addingTimeInterval(120)
  while Date()<deadline {
   if !host.busy, let view=host.views["uiLab"], (try? await view.evaluateJavaScript("!!document.querySelector('input[aria-label=\\"Valeur précise\\"]:not(:disabled)')")) as? Bool == true {break}
   try await Task.sleep(nanoseconds:300_000_000)
  }
  if let view=host.views["uiLab"], let diagnostic=try? await view.evaluateJavaScript("JSON.stringify({text:document.body.innerText,errors:window.__loomataLoadErrors,frame:document.querySelector('iframe')?.contentDocument?.body?.innerText,frameErrors:document.querySelector('iframe')?.contentWindow?.__loomataLoadErrors})") as? String {try? diagnostic.write(toFile:out+"/document.json",atomically:true,encoding:.utf8)}
  guard let root=host.root, let view=host.views["uiLab"], (try? await view.evaluateJavaScript("!!document.querySelector('input[aria-label=\\"Valeur précise\\"]:not(:disabled)')")) as? Bool == true else {throw NSError(domain:"Workspace not ready: "+host.label.stringValue,code:1)}
  for op in ["project.export","tool.export"] {
   let driver=Process();driver.executableURL=URL(fileURLWithPath:out+"/panel-driver");driver.arguments=[String(ProcessInfo.processInfo.processIdentifier)];try driver.run()
   host.exportArchive(op)
   driver.waitUntilExit();guard driver.terminationStatus==0 else {throw NSError(domain:"Actual export panel not pressed",code:1)}
   while host.busy {try await Task.sleep(nanoseconds:200_000_000)}
   guard FileManager.default.fileExists(atPath:out+"/"+op+".zip") else {throw NSError(domain:host.label.stringValue,code:1)}
  }
  let result:[String:Any] = ["status":"passed","root":root,"node":arguments[1],"cases":["portable bundle bootstraps outside Resources with PATH containing no global Node/npm","real WKWebView workspace hydrates with embedded runtime","native export actions use the actual NSSavePanel and AX button, common core, and verified project/tool ZIPs"]]
  try JSONSerialization.data(withJSONObject:result,options:.prettyPrinted).write(to:URL(fileURLWithPath:out+"/native.json"));exit(0)
 } catch {try? String(describing:error).write(toFile:out+"/error.txt",atomically:true,encoding:.utf8);exit(1)}
}
`
let source = await fs.readFile(path.join(kit, 'macos/Loomata.swift'), 'utf8')
source = source
  .replace(
    'picker.nameFieldStringValue = operation == "tool.export" ? "Loomata-sources.zip" : "Projet-sources.zip"',
    'picker.directoryURL = URL(fileURLWithPath: ProcessInfo.processInfo.environment["LOOMATA_E2E_OUTPUT"]!); picker.nameFieldStringValue = operation + ".zip"',
  )
  .replace('let app = NSApplication.shared', harness + '\nlet app = NSApplication.shared')
  .replace(
    'app.run()',
    'DispatchQueue.main.async { Task { @MainActor in await qualify(host) } }\napp.run()',
  )
await fs.writeFile(path.join(out, 'main.swift'), source)
const { bundle, sdk } = await buildLoomata({
  directory: out,
  source: path.join(out, 'main.swift'),
  launch: { portable: '1' },
  identifier: 'org.loomata.delivery-test',
})
const driver = (await fs.readFile(path.join(kit, 'macos/tests/PanelDriver.swift'), 'utf8')).replace(
  '== "Créer le projet"',
  '== "Exporter"',
)
await fs.writeFile(path.join(out, 'PanelDriver.swift'), driver)
await run(
  '/usr/bin/swiftc',
  [
    '-swift-version',
    '5',
    '-sdk',
    sdk,
    '-module-cache-path',
    path.join(out, 'swift-cache'),
    path.join(out, 'PanelDriver.swift'),
    '-o',
    path.join(out, 'panel-driver'),
  ],
  { timeout: 120000 },
)
await run('/bin/cp', ['-cR', payload, path.join(bundle, 'Contents/Resources/payload')], {
  timeout: 180000,
})
const moved = path.join(out, 'Moved Loomata.app')
await fs.rename(bundle, moved)
const env = {
  PATH: '/usr/bin:/bin:/usr/sbin:/sbin',
  LANG: 'en_US.UTF-8',
  LOOMATA_STATE_DIRECTORY: path.join(out, 'private-state'),
  LOOMATA_E2E_OUTPUT: out,
}
const stderr = await fs.open(path.join(out, 'stderr.log'), 'w')
const child = spawn(path.join(moved, 'Contents/MacOS/Loomata'), [], {
  env,
  stdio: ['ignore', 'ignore', stderr.fd],
})
await stderr.close()
const status = await new Promise((r, j) => {
  let timer = setTimeout(() => {
    child.kill('SIGTERM')
    j(new Error('timeout'))
  }, 240000)
  child.on('exit', (c) => {
    clearTimeout(timer)
    r(c)
  })
})
let result
try {
  if (status !== 0)
    throw new Error(
      await fs
        .readFile(path.join(out, 'error.txt'), 'utf8')
        .catch(() => fs.readFile(path.join(out, 'stderr.log'), 'utf8')),
    )
  result = JSON.parse(await fs.readFile(path.join(out, 'native.json')))
  for (const name of ['project.export', 'tool.export']) {
    await run('/usr/bin/unzip', ['-t', path.join(out, name + '.zip')], { timeout: 60000 })
    const list = (await run('/usr/bin/unzip', ['-Z1', path.join(out, name + '.zip')])).stdout
    if (/(?:^|\/)\.runtime\.local\//m.test(list) || list.includes('node_modules/'))
      throw new Error('Private data in export')
  }
  console.log(JSON.stringify({ status: 'passed', out, ...result }))
} finally {
  const installation = path.join(out, 'private-state/installation-v1')
  await run(
    path.join(installation, '.runtime.local/node/bin/node'),
    [path.join(installation, 'scripts/local-service.mjs'), 'runtime.stop', installation],
    { env, timeout: 30000 },
  ).catch(() => {})
  await fs.writeFile(
    path.join(base, 'last-qualification.json'),
    JSON.stringify({ out, status: result?.status ?? 'failed' }, null, 2),
  )
}
