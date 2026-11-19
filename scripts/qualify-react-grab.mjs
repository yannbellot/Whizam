// Isolated qualification of the exact npm tarball. No vendor code enters tracked sources.
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
const run = promisify(execFile)
const kit = path.resolve(import.meta.dirname, '..')
const dir = path.join(kit, '.runtime.local/wysiwyg-qualification')
const tarball = path.join(dir, 'react-grab-0.2.0.tgz')
const expected =
  'ohhsfXD4qN0j6cMQd56aaVJBPDF3kUdviF/Od1Eak/rEIXQ3svQ4gjkwTfuTZwTBnxHRL16p9JqdlVQO5nUHqA=='
assert.equal(
  createHash('sha512')
    .update(await fs.readFile(tarball))
    .digest('base64'),
  expected,
)
const pkg = JSON.parse(await fs.readFile(path.join(dir, 'package/package.json')))
assert.equal(pkg.version, '0.2.0')
assert.ok(pkg.exports['./primitives'])
const license = await fs.readFile(path.join(dir, 'package/LICENSE'), 'utf8')
assert.match(license, /MIT License/)
const entry = `import {getElementAtPoint,getElementsAtPoint,getElementBounds} from ${JSON.stringify(path.join(dir, 'package/dist/primitives.js'))};
window.__q = async()=>{ const doc=document.querySelector('iframe').contentDocument; const button=doc.getElementById('probe');const f=document.querySelector('iframe').getBoundingClientRect(),b=button.getBoundingClientRect();const x=f.x+2+b.x+b.width/2,y=f.y+2+b.y+b.height/2; const found=getElementAtPoint(x,y,{filter:e=>e.id==='probe'});const all=getElementsAtPoint(x,y,{filter:e=>e.id==='probe'});const bounds=getElementBounds(button);return {found:found?.id??null,stack:all.map(e=>e.id),bounds, tick:Number(button.dataset.tick),injected:document.querySelectorAll('[data-react-grab]').length,bodyChildren:Array.from(document.body.children).map(e=>e.tagName),styleCount:document.querySelectorAll('style').length};};`
const bundled = await build({
  stdin: { contents: entry, resolveDir: kit, loader: 'js' },
  bundle: true,
  format: 'iife',
  platform: 'browser',
  minify: true,
  write: false,
  metafile: true,
  treeShaking: true,
})
const js = bundled.outputFiles[0].contents
await fs.writeFile(path.join(dir, 'probe.js'), js)
const report = {
  status: 'running',
  version: pkg.version,
  integrity: 'sha512-' + expected,
  dependencies: pkg.dependencies,
  bytes: js.byteLength,
  gzipBytes: gzipSync(js).byteLength,
  inputs: Object.keys(bundled.metafile.inputs),
  cases: [],
}
await fs.writeFile(
  path.join(dir, 'react-entry.jsx'),
  `import React from 'react';import{createRoot}from'react-dom/client';function Probe(){const [tick,setTick]=React.useState(0);React.useEffect(()=>{const id=setInterval(()=>setTick(x=>x+1),100);return()=>clearInterval(id)},[]);return <button id="probe" data-tick={tick} style={{width:180,height:50}}>React {tick}</button>}createRoot(document.getElementById('app')).render(<Probe/>);`,
)
const react = await build({
  entryPoints: [path.join(dir, 'react-entry.jsx')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  write: false,
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
})
const reactDev = await build({
  entryPoints: [path.join(dir, 'react-entry.jsx')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  write: false,
  minify: false,
  define: { 'process.env.NODE_ENV': '"development"' },
})
const requests = []
const server = createServer((req, res) => {
  requests.push(req.url)
  const mode = req.url.includes('development') ? '?development' : ''
  const pathname = req.url.split('?')[0]
  res.setHeader(
    'Content-Type',
    pathname === '/probe.js' || pathname === '/react.js' ? 'application/javascript' : 'text/html',
  )
  res.end(
    pathname === '/probe.js'
      ? js
      : pathname === '/react.js'
        ? (mode ? reactDev : react).outputFiles[0].contents
        : pathname === '/child'
          ? `<div id="app"></div><script src="/react.js${mode}"></script>`
          : `<iframe src="/child${mode}" style="position:absolute;left:90px;top:80px;width:500px;height:300px;border:2px solid black"></iframe><script src="/probe.js"></script>`,
  )
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const url = `http://127.0.0.1:${server.address().port}`
let browser
try {
  process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(kit, '.runtime.local/playwright')
  const { chromium, webkit } = await import('@playwright/test')
  for (const [name, engine] of [
    ['chromium', chromium],
    ['webkit', webkit],
  ])
    for (const mode of ['production', 'development']) {
      browser = await engine.launch({
        headless: true,
        ...(name === 'chromium' ? { channel: 'chromium' } : {}),
      })
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
      const external = []
      const errors = []
      page.on('request', (r) => {
        if (!r.url().startsWith(url)) external.push(r.url())
      })
      page.on('pageerror', (e) => errors.push(e.message))
      await page.goto(url + (mode === 'development' ? '/?development' : ''))
      await page.waitForFunction(() =>
        document.querySelector('iframe')?.contentDocument?.querySelector('#probe'),
      )
      const a = await page.evaluate(() => window.__q())
      await page.waitForFunction(
        (t) =>
          Number(
            document.querySelector('iframe').contentDocument.querySelector('#probe').dataset.tick,
          ) > t,
        a.tick,
      )
      const b = await page.evaluate(() => window.__q())
      assert.equal(a.found, 'probe')
      assert.deepEqual(a.bodyChildren, ['IFRAME', 'SCRIPT'])
      assert.equal(a.styleCount, 0)
      assert.equal(a.injected, 0)
      assert.ok(a.stack.includes('probe'))
      assert.ok(b.tick > a.tick)
      assert.equal(external.length, 0)
      assert.deepEqual(errors, [])
      report.cases.push({
        engine: name,
        mode,
        status: 'passed',
        first: a,
        last: b,
        externalRequests: external,
        errors,
      })
      await browser.close()
      browser = null
    }
  const sdk =
    process.env.LOOMATA_SDK ?? (await run('/usr/bin/xcrun', ['--show-sdk-path'])).stdout.trim()
  const swift = `import Cocoa\nimport WebKit\nlet app=NSApplication.shared\napp.setActivationPolicy(.accessory)\nlet window=NSWindow(contentRect:NSRect(x:80,y:80,width:1280,height:900),styleMask:[.titled],backing:.buffered,defer:false)\nlet web=WKWebView(frame:window.contentView!.bounds)\nwindow.contentView=web\nwindow.orderFront(nil)\nweb.load(URLRequest(url:URL(string:CommandLine.arguments[1])!))\nvar attempts=0\nvar firstTick:Int?=nil\nTimer.scheduledTimer(withTimeInterval:0.25,repeats:true){ timer in\nattempts += 1\nif attempts>120 { fputs("WKWebView qualification timed out\\n",stderr);exit(2) }\nweb.evaluateJavaScript("window.__q ? JSON.stringify(await window.__q()) : null"){ value,error in\nif error != nil {return}\nguard let text=value as? String,let data=text.data(using:.utf8),let row=(try? JSONSerialization.jsonObject(with:data)) as? [String:Any],let tick=row["tick"] as? Int else {return}\nif row["found"] as? String != "probe" {fputs(text,stderr);exit(3)}\nif let initial=firstTick,tick>initial {print(text);timer.invalidate();exit(0)}\nfirstTick=tick\n}\n}\napp.run()\n`
  // WK evaluateJavaScript is not an async function body; use Promise resolution via stored result.
  const native = swift
    .replace(
      'window.__q ? JSON.stringify(await window.__q()) : null',
      'window.__nativeResult || (window.__q && (window.__q().then(x=>window.__nativeResult=JSON.stringify(x)),null))',
    )
    .replace(
      'firstTick=tick',
      'firstTick=tick\nweb.evaluateJavaScript("window.__nativeResult=null",completionHandler:nil)',
    )
  await fs.writeFile(path.join(dir, 'main.swift'), native)
  await run(
    '/usr/bin/swiftc',
    [
      '-swift-version',
      '5',
      '-sdk',
      sdk,
      '-module-cache-path',
      path.join(kit, '.runtime.local/swift-e2e-cache'),
      path.join(dir, 'main.swift'),
      '-o',
      path.join(dir, 'probe-native'),
    ],
    { timeout: 180000 },
  )
  for (const mode of ['production', 'development']) {
    const nativeResult = await run(
      path.join(dir, 'probe-native'),
      [url + (mode === 'development' ? '/?development' : '')],
      { timeout: 45000 },
    )
    report.cases.push({
      engine: 'AppKit/WKWebView',
      mode,
      status: 'passed',
      result: JSON.parse(nativeResult.stdout.trim()),
    })
  }
  report.status = 'passed'
} catch (e) {
  report.status = 'failed'
  report.error = String(e.stack ?? e)
  process.exitCode = 1
} finally {
  await browser?.close()
  await new Promise((r) => server.close(r))
  report.requests = requests
  await fs.writeFile(path.join(dir, 'qualification.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
}
