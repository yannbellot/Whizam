// Test-only driver inserted into a separate build of Prototype.swift.
// Physical input is outside this internal driver's scope. Ignore stray keys
// delivered to the test app while its programmatic actions are running.
final class E2EApplication: NSApplication {
    override func sendEvent(_ event: NSEvent) {
        if event.type == .keyDown || event.type == .keyUp { return }
        super.sendEvent(event)
    }
}
var prototypeE2EPanel: NSOpenPanel?
@MainActor func prototypeE2E(_ host: Host) async {
    let env = ProcessInfo.processInfo.environment
    let root = env["CORE_E2E_ROOT"]!, output = env["CORE_E2E_OUTPUT"]!
    try! String(ProcessInfo.processInfo.processIdentifier).write(toFile:output + "/native.pid",atomically:true,encoding:.utf8)
    var cases: [String] = []
    func report(_ status: String, _ error: String? = nil) {
        var result: [String: Any] = ["status": status, "cases": cases, "driver": "AppKit control actions and WKWebView DOM; real services"]
        if let error = error { result["error"] = error }
        try! JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted,.sortedKeys]).write(to: URL(fileURLWithPath: output + "/native.json"), options: .atomic)
    }
    func check(_ value: Bool, _ message: String) throws {
        if !value { throw NSError(domain:"NativeE2E",code:1,userInfo:[NSLocalizedDescriptionKey:message]) }
    }
    func buttons(_ view: NSView) -> [NSButton] {
        if let button = view as? NSButton { return [button] }
        return view.subviews.flatMap { buttons($0) }
    }
    func tap(_ title: String) throws {
        guard let b = buttons(host.window.contentView!).first(where: {$0.title == title}) else {
            throw NSError(domain:"NativeE2E",code:2,userInfo:[NSLocalizedDescriptionKey:"Native button missing: " + title])
        }
        b.performClick(nil)
    }
    func until(_ label: String, seconds: Double = 45, _ predicate: () async throws -> Bool) async throws {
        fputs("NativeE2E waiting: \(label)\n",stderr)
        let end = Date().addingTimeInterval(seconds)
        while Date() < end {
            if try await predicate() { fputs("NativeE2E passed: \(label)\n",stderr); return }
            try await Task.sleep(nanoseconds:150_000_000)
        }
        throw NSError(domain:"NativeE2E",code:3,userInfo:[NSLocalizedDescriptionKey:"Timeout: " + label])
    }
    func js(_ source: String) async throws -> Any? { try await host.view.evaluateJavaScript(source) }
    func literal(_ text: String) -> String { String(data:try! JSONSerialization.data(withJSONObject:[text]),encoding:.utf8)! + "[0]" }
    func clickWeb(_ title: String) async throws {
        try await until("web action ready: " + title) {
            try await js("[...document.querySelectorAll('button')].some(b=>b.textContent.trim()===\(literal(title))&&!b.disabled)") as? Bool == true
        }
        let result = try await js("(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===\(literal(title)));if(!b||b.disabled)return false;b.click();return true})()")
        try check(result as? Bool == true,"Web button unavailable: " + title)
    }
    func value() async throws -> String { try await js("document.querySelector('input[aria-label=\"Valeur précise\"]')?.value||''") as? String ?? "" }
    func fill(_ value: String) async throws {
        _ = try await js("(()=>{const e=document.querySelector('input[aria-label=\"Valeur précise\"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,\(literal(value)));e.dispatchEvent(new Event('input',{bubbles:true}));})()")
    }
    func color() async throws -> String {
        try await js("(()=>{const d=document.querySelector('iframe')?.contentDocument;const b=d&&[...d.querySelectorAll('button')].find(b=>b.textContent.trim()==='Enregistrer le projet');return b?getComputedStyle(b).backgroundColor:''})()") as? String ?? ""
    }
    // A synchronous AppKit modal must run from a Cocoa event, not inside a Swift
    // actor job that blocks the dialog's asynchronous XPC completion on main.
    func cocoaAction(_ action: @escaping @MainActor () throws -> Void) async throws {
        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            let timer = Timer(timeInterval:0.05,repeats:false) { _ in
                MainActor.assumeIsolated {
                    do { try action(); continuation.resume() }
                    catch { continuation.resume(throwing:error) }
                }
            }
            RunLoop.main.add(timer,forMode:.default)
        }
    }
    func cancelPicker() throws {
        prototypeE2EPanel = nil
        var handled = false, attempts = 0
        let timer = Timer(timeInterval:0.25,repeats:true) { timer in
            MainActor.assumeIsolated {
                attempts += 1
                if attempts > 30 { timer.invalidate(); NSApp.abortModal(); return }
                guard let panel = prototypeE2EPanel, panel.isVisible else { return }
                handled = true; timer.invalidate(); panel.cancel(nil)
            }
        }
        RunLoop.main.add(timer,forMode:.modalPanel)
        defer { timer.invalidate() }
        try tap("Ouvrir un dossier")
        try check(handled,"Open panel was not driven")
    }
    func cancelDraft(_ title: String = "Abandonner") async throws {
        var handled = false
        let timer = Timer(timeInterval:0.1,repeats:true) { timer in
            MainActor.assumeIsolated {
                guard let content = host.window.sheets.first?.contentView,
                      let b = buttons(content).first(where:{$0.title == title}) else { return }
                handled = true; timer.invalidate(); b.performClick(nil)
            }
        }
        RunLoop.main.add(timer,forMode:.common)
        defer { timer.invalidate() }
        try await clickWeb("Annuler")
        try await until("real JavaScript confirmation sheet") { handled }
    }
    func close(_ title: String) throws {
        var handled = false, attempts = 0
        let timer = Timer(timeInterval:0.25,repeats:true) { timer in
            MainActor.assumeIsolated {
                attempts += 1
                if attempts > 30 { timer.invalidate(); NSApp.abortModal(); return }
                guard let content = NSApp.modalWindow?.contentView,
                      let b = buttons(content).first(where:{$0.title == title}) else { return }
                handled = true; timer.invalidate(); b.performClick(nil)
            }
        }
        RunLoop.main.add(timer,forMode:.modalPanel)
        defer { timer.invalidate() }
        host.window.performClose(nil)
        try check(handled,"Close alert was not driven")
    }
    do {
        try await until("window") { host.window != nil }
        host.view.configuration.userContentController.addUserScript(WKUserScript(source:"window.__nativeE2EErrors=[];addEventListener('error',e=>window.__nativeE2EErrors.push(e.message));addEventListener('unhandledrejection',e=>window.__nativeE2EErrors.push(String(e.reason)))",injectionTime:.atDocumentStart,forMainFrameOnly:false))
        // A visible WKWebView is required: macOS suspends rendering when the
        // automation window is covered by the developer's foreground app.
        host.window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        host.window.level = .floating
        host.window.orderFrontRegardless()
        if env["CORE_E2E_MODE"] != "invalid" {
            try await until("unoccluded test window") { host.window.occlusionState.contains(.visible) }
        }
        if env["CORE_E2E_MODE"] == "panel" {
            try tap("Démarrer")
            try check(host.label.stringValue == "Choisir d’abord un dossier.","Unselected start")
            try await cocoaAction { try cancelPicker() }
            try check(host.root == nil && !host.busy,"Open panel cancel")
            cases.append("native toolbar, missing selection and real open-panel cancel")
            report("panel-checked"); exit(0)
        }
        if env["CORE_E2E_MODE"] == "invalid" {
            try await until("refusal") { !host.busy }
            try check(host.label.stringValue.contains("refusée"),"Invalid project accepted")
            cases.append("native direct-open refuses incompatible directory")
            report("invalid-checked"); exit(0)
        }
        try check(host.root == root,"Direct-open project selection")
        try tap("Démarrer"); try tap("Démarrer")
        try await until("start",seconds:180) { !host.busy }
        try check(host.label.stringValue == "État : ready","Start: " + host.label.stringValue)
        fputs("NativeE2E window visible: \(host.window.isVisible), occluded: \(!host.window.occlusionState.contains(.visible))\n",stderr)
        try await until("hydration",seconds:45) { try await js("!!document.querySelector('input[aria-label=\"Valeur précise\"]:not(:disabled)')") as? Bool == true }
        let baseline = try await value(), initial = try await color()
        try check(!baseline.isEmpty && !initial.isEmpty,"Initial preview missing")
        cases.append("native start and duplicate click; WKWebView hydrated"); report("running")
        try await until("Storybook loaded before edits",seconds:180) { FileManager.default.fileExists(atPath:output + "/storybook-ready") }
        try await fill("#123456")
        try await clickWeb("Nouveau style de composant")
        try await until("draft") { try await color() == "rgb(18, 52, 86)" }
        try await cancelDraft("Conserver le brouillon")
        try check(try await value() == "#123456","JavaScript confirmation cancellation lost draft")
        try await cancelDraft()
        try await until("cancel draft") { let v = try await value(), c = try await color(); return v == baseline && c == initial }
        cases.append("WKWebView draft preview and cancellation via real native confirmation sheet"); report("running")
        try await fill("#234567"); try await clickWeb("Nouveau style de composant")
        try await until("save enabled") { try await js("[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Enregistrer'&&!b.disabled)") as? Bool == true }
        try await clickWeb("Enregistrer")
        try await until("durable save",seconds:60) { try await js("document.body.textContent.includes('Enregistré dans les sources et relu avec succès.')") as? Bool == true }
        cases.append("WKWebView save confirmed after durable reread"); report("running")
        try await until("live Storybook propagation",seconds:90) { FileManager.default.fileExists(atPath:output + "/storybook-checked") }
        let image = try await host.view.takeSnapshot(configuration:nil)
        if let tiff = image.tiffRepresentation, let bitmap = NSBitmapImageRep(data:tiff), let png = bitmap.representation(using:.png,properties:[:]) { try png.write(to:URL(fileURLWithPath:output + "/workshop.png")) }
        try tap("Arrêter les services")
        try await until("stop",seconds:90) { !host.busy }
        try check(host.label.stringValue == "État : stopped","Native stop failed")
        try tap("Démarrer")
        try await until("restart",seconds:180) { !host.busy }
        try await until("WKWebView navigation after restart",seconds:90) { !host.view.isLoading && host.view.url?.path == "/ui-lab" }
        var lastSavedState = ""
        try await until("saved value",seconds:90) {
            let v = try await value(), c = try await color()
            let page = try await js("JSON.stringify({ready:document.readyState,visibility:document.visibilityState,errors:window.__nativeE2EErrors||[]})") as? String ?? "unknown"
            let state = "value: \(v); color: \(c); page: \(page); occluded: \(!host.window.occlusionState.contains(.visible))"
            if state != lastSavedState { fputs("NativeE2E restart \(state)\n",stderr); lastSavedState = state }
            return v == "#234567" && c == "rgb(35, 69, 103)"
        }
        cases.append("native stop/restart preserves recorded value"); report("running")
        try await fill("#345678"); try await clickWeb("Nouveau style de composant")
        try await until("unsaved preview") { try await color() == "rgb(52, 86, 120)" }
        try await cocoaAction { try close("Conserver la fenêtre") }
        try check(host.window.isVisible,"Close cancellation hid window")
        try check(try await value() == "#345678","Close cancellation lost draft")
        cases.append("native NSAlert cancellation preserves window and draft"); report("running")
        try await cancelDraft()
        try await until("clear draft") { try await value() == "#234567" }
        report("closing")
        NotificationCenter.default.addObserver(forName:NSWindow.willCloseNotification,object:host.window,queue:.main) { _ in
            MainActor.assumeIsolated {
                cases.append("native final close notification"); report("window-closed")
            }
        }
        try await cocoaAction { try close("Fermer") }
    } catch {
        if let body = try? await js("document.body.innerText") as? String {
            try? body.write(toFile:output + "/failure-body.txt",atomically:true,encoding:.utf8)
        }
        if let frame = try? await js("(()=>{const f=document.querySelector('iframe');return f?f.src+'\\n'+f.contentDocument?.body?.innerText:'no iframe'})()") as? String {
            try? frame.write(toFile:output + "/failure-frame.txt",atomically:true,encoding:.utf8)
        }
        let diagnostics = "url: \(host.view?.url?.absoluteString ?? "nil"), value: \((try? await value()) ?? "unavailable"), color: \((try? await color()) ?? "unavailable"), native: \(host.label.stringValue)"
        fputs(diagnostics + "\n",stderr)
        report("failed",error.localizedDescription + "; " + diagnostics)
        fputs("NativeE2E: \(error.localizedDescription)\n",stderr)
        exit(1)
    }
}
