var loomataProjectPanel: NSSavePanel?
var loomataProjectDestination: URL?
// Separate test build: actions use AppKit controls and real WKWebView documents/services.
final class LoomataE2EApplication: NSApplication {
    override func sendEvent(_ event: NSEvent) {
        if event.type == .keyDown || event.type == .keyUp { return }
        super.sendEvent(event)
    }
}
@MainActor func loomataE2E(_ host: LoomataHost) async {
    let output = ProcessInfo.processInfo.environment["LOOMATA_E2E_OUTPUT"]!
    try! String(ProcessInfo.processInfo.processIdentifier).write(toFile: output + "/native.pid", atomically: true, encoding: .utf8)
    let readOnly = ProcessInfo.processInfo.environment["LOOMATA_E2E_READONLY"] == "1"
    var cases: [String] = []
    var answered = 0
    func check(_ pass: Bool, _ message: String) throws {
        if !pass { throw NSError(domain: message, code: 1) }
    }
    func report(_ status: String, _ error: String? = nil) {
        var value: [String: Any] = ["status": status, "cases": cases, "driver": "Native AppKit actions and real WKWebView; no physical clicks"]
        if let error = error { value["error"] = error }
        try! JSONSerialization.data(withJSONObject: value, options: [.prettyPrinted, .sortedKeys]).write(to: URL(fileURLWithPath: output + "/native.json"))
    }
    func until(_ name: String, seconds: Double = 75, _ condition: () async throws -> Bool) async throws {
        let end = Date().addingTimeInterval(seconds)
        while Date() < end {
            if try await condition() { return }
            try await Task.sleep(nanoseconds: 200_000_000)
        }
        throw NSError(domain: "Timed out: " + name, code: 1)
    }
    func js(_ role: String, _ source: String) async throws -> Any? {
        guard let view = host.views[role] else { throw NSError(domain: "Missing view: " + role, code: 1) }
        return try await view.evaluateJavaScript(source)
    }
    func literal(_ text: String) -> String { String(data: try! JSONSerialization.data(withJSONObject: [text]), encoding: .utf8)!.dropFirst().dropLast().description }
    func select(_ index: Int) throws {
        try check(host.navigation.isEnabled, "Navigation disabled")
        guard let menu = NSApp.mainMenu?.items.first(where: { $0.submenu?.title == "Présentation" })?.submenu,
              let item = menu.item(at: index), let action = item.action else { throw NSError(domain: "Missing view menu", code: 1) }
        try check(NSApp.sendAction(action, to: item.target, from: item), "View menu action missing")
    }
    func fill(_ text: String) async throws {
        _ = try await js("uiLab", "(()=>{const e=document.querySelector('input[aria-label=\"Valeur précise\"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,\(literal(text)));e.dispatchEvent(new Event('input',{bubbles:true}));return true})()")
    }
    func click(_ title: String) async throws {
        try await until("web button " + title) { try await js("uiLab", "[...document.querySelectorAll('button')].some(b=>b.textContent.trim()===\(literal(title))&&!b.disabled)") as? Bool == true }
        _ = try await js("uiLab", "[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===\(literal(title))).click()")
    }
    func value() async throws -> String { try await js("uiLab", "document.querySelector('input[aria-label=\"Valeur précise\"]')?.value||''") as? String ?? "" }
    func bookColor() async throws -> String { try await js("storybook", "(()=>{const d=document.querySelector('#storybook-preview-iframe')?.contentDocument;const b=d&&[...d.querySelectorAll('button')].find(b=>b.textContent.trim()==='Enregistrer le projet');return b?getComputedStyle(b).backgroundColor:''})()") as? String ?? "" }
    func buttons(_ root: NSView) -> [NSButton] { (root as? NSButton).map { [$0] } ?? root.subviews.flatMap { buttons($0) } }
    func answer(_ title: String) -> Timer {
        let timer = Timer(timeInterval: 0.1, repeats: true) { timer in
            MainActor.assumeIsolated {
                let content = host.window.sheets.first?.contentView ?? NSApp.modalWindow?.contentView
                if let content = content, let button = buttons(content).first(where: { $0.title == title }) { timer.invalidate(); answered += 1; button.performClick(nil) }
            }
        }
        RunLoop.main.add(timer, forMode: .common)
        RunLoop.main.add(timer, forMode: .modalPanel)
        return timer
    }
    func cocoaAction(_ action: @escaping @MainActor () -> Void) async {
        await withCheckedContinuation { continuation in
            let timer = Timer(timeInterval: 0.05, repeats: false) { _ in
                MainActor.assumeIsolated { action(); continuation.resume() }
            }
            RunLoop.main.add(timer, forMode: .default)
        }
    }
    func shot(_ role: String, _ name: String) async throws {
        guard let view = host.views[role] else { return }
        let image = try await view.takeSnapshot(configuration: nil)
        if let tiff = image.tiffRepresentation, let bitmap = NSBitmapImageRep(data: tiff), let png = bitmap.representation(using: .png, properties: [:]) { try png.write(to: URL(fileURLWithPath: output + "/" + name + ".png")) }
    }
    do {
        try await until("window") { host.window != nil }
        host.window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        host.window.orderFrontRegardless()
        try check(host.window.title == "Loomata", "Wrong product identity")
        try await until("workspace", seconds: 240) { !host.busy && host.navigation.isEnabled }
        host.window.level = .floating
        host.window.orderFrontRegardless()
        let resume = ProcessInfo.processInfo.environment["LOOMATA_E2E_RESUME"] == "1"
        try check(resume || readOnly || host.context.stringValue.contains("application kit"), "Wrong source folder context")
        try await until("hydrated UI Lab") { try await js("uiLab", "!!document.querySelector('input[aria-label=\"Valeur précise\"]:not(:disabled)')") as? Bool == true }
        if resume {
            try check(host.root == ProcessInfo.processInfo.environment["LOOMATA_E2E_PROJECT"], "Relaunch did not restore selected project")
            try await until("saved value after app relaunch") { try await value() == "#456789" }
            try select(2)
            try await until("resumed preview") { try await js("preview", "document.querySelector('h1')?.textContent==='Atlas C with spaces'") as? Bool == true }
            cases.append("same native bundle relaunch restores last selected project and its saved DS without rebuilding or recreating it")
            report("passed")
            exit(0)
        }
        let initialView = host.views["uiLab"]!
        let baseline = try await value()
        if readOnly {
            try await shot("uiLab", "source-ui-lab")
            try select(1)
            let sourceBook = host.endpoints["storybook"]!
            host.views["storybook"]!.load(URLRequest(url: URL(string: sourceBook.absoluteString + "?path=/story/components-button--default")!))
            try await until("source Storybook") { try await !bookColor().isEmpty }
            try await shot("storybook", "source-storybook")
            try select(2)
            try await until("source preview") { try await js("preview", "document.querySelector('h1')?.textContent==='Agentic Design Lab'") as? Bool == true }
            try await shot("preview", "source-preview")
            try select(0)
            try check(try await value() == baseline, "Read-only return lost editor state")
            cases.append("actual /application source UI Lab, Storybook and root preview are interactive in one native window; no save performed"); report("running")
            try String(host.window.windowNumber).write(toFile: output + "/window-number", atomically: true, encoding: .utf8)
            report("passed")
            try await Task.sleep(nanoseconds: 8_000_000_000)
            exit(0)
        }

        cases.append("opening Loomata starts owned services and displays UI Lab for the application source kit"); report("running")
        report("running")
        _ = try await js("uiLab", "window.__loomataDocumentIdentity='initial';true")
        await cocoaAction { host.start() }
        try await until("idempotent start") { !host.busy }
        try check(host.views["uiLab"] === initialView, "Duplicate start replaced the editor")
        cases.append("idempotent start reuses the same native editor document"); report("running")
        try await fill("#123456"); try await click("Nouveau style de composant")
        try await until("draft ready") { try await value() == "#123456" }
        try select(1)
        try await until("Storybook manager") { try await js("storybook", "document.body?.innerText.includes('Foundations')||document.body?.innerText.includes('Storybook')") as? Bool == true }
        let bookView = host.views["storybook"]!
        let book = host.endpoints["storybook"]!
        bookView.load(URLRequest(url: URL(string: book.absoluteString + "?path=/story/components-button--default")!))
        try await until("Storybook button") { try await !bookColor().isEmpty }
        let initialBookColor = try await bookColor()
        try check(initialBookColor != "rgb(18, 52, 86)", "Unsaved draft leaked into reader")
        try await shot("storybook", "storybook-native")
        cases.append("Storybook opens inside Loomata and does not render the unsaved draft"); report("running")
        try select(2)
        try await until("actual preview") { try await js("preview", "document.querySelector('h1')?.textContent==='Agentic Design Lab'") as? Bool == true }
        try check(host.views["preview"]?.url?.path == "/", "Preview is not the actual project root")
        try check(try await js("preview", "document.querySelectorAll('meta[name=\"adl-design-editor-session\"]').length") as? Int == 0, "Preview received writer bootstrap")
        try await shot("preview", "preview-native")
        cases.append("project preview loads the real source home in the same window, without writer bootstrap"); report("running")
        try select(0)
        try check(host.views["uiLab"] === initialView, "Tab return replaced editor")
        try check(try await value() == "#123456", "Tab navigation lost draft")
        try check(try await js("uiLab", "window.__loomataDocumentIdentity") as? String == "initial", "Editor reloaded")
        try check(host.views["storybook"] === bookView, "Reader document replaced")
        try await shot("uiLab", "draft-return-native")
        cases.append("UI Lab → Storybook → preview → UI Lab retains the exact editor, reader and draft"); report("running")
        let previousAnswers = answered
        let reloadTimer = answer("Conserver le brouillon")
        host.views["uiLab"]!.reload()
        try await until("reload confirmation") { answered > previousAnswers }
        try await until("reload confirmation closed") { host.window.sheets.isEmpty }
        reloadTimer.invalidate()
        try check(try await value() == "#123456", "Reload cancellation lost draft")
        try check(try await js("uiLab", "window.__loomataDocumentIdentity") as? String == "initial", "Cancelled reload changed document")
        cases.append("native document reload asks before discarding the draft and preserves it on cancellation"); report("running")

        let cancelTimer = answer("Conserver le brouillon")
        try await click("Annuler")
        try await until("cancel sheet dismissed") { host.window.sheets.isEmpty }
        cancelTimer.invalidate()
        try check(try await value() == "#123456", "Native cancel confirmation lost draft")
        let abandonTimer = answer("Abandonner")
        try await click("Annuler")
        try await until("draft discarded") { try await value() == baseline }
        abandonTimer.invalidate()
        cases.append("JavaScript draft confirmation is relayed to native sheet and preserves by default"); report("running")
        try await fill("#234567"); try await click("Nouveau style de composant"); try await click("Enregistrer")
        try await until("save acknowledged") { try await js("uiLab", "document.body.textContent.includes('Enregistré dans les sources et relu avec succès.')") as? Bool == true }
        try select(1)
        try await until("reader update", seconds: 90) { try await bookColor() == "rgb(35, 69, 103)" }
        try await shot("storybook", "storybook-saved-native")
        try check(try await js("storybook", "document.querySelectorAll('meta[name=\"adl-design-editor-session\"]').length") as? Int == 0, "Storybook writer bootstrap")
        cases.append("real UI Lab save propagates to already-open integrated Storybook"); report("running")
        let priorURL = bookView.url
        let refusals = host.navigationRefusals
        bookView.load(URLRequest(url: URL(string: "https://example.invalid/")!))
        try await until("external navigation refused") { host.navigationRefusals > refusals }
        try check(bookView.url == priorURL, "External navigation escaped local document")
        bookView.load(URLRequest(url: host.endpoints["uiLab"]!))
        try await until("cross-role navigation refused") { host.navigationRefusals > refusals + 1 }
        cases.append("remote and cross-service navigation are denied before leaving the local reader"); report("running")
        try select(0)
        try await fill("#345678"); try await click("Nouveau style de composant")
        let keepTimer = answer("Conserver l’espace de travail")
        await cocoaAction { host.stop() }
        keepTimer.invalidate()
        try check(!host.busy && !host.views.isEmpty, "Cancelled stop changed workspace")
        try check(try await value() == "#345678", "Cancelled stop lost draft")
        let closeTimer = answer("Conserver l’espace de travail")
        await cocoaAction { host.window.performClose(nil) }
        closeTimer.invalidate()
        let valueAfterClose = try await value()
        try check(host.window.isVisible && valueAfterClose == "#345678", "Close cancellation lost workspace")
        cases.append("stop and close confirmations retain the workspace and draft when cancelled"); report("running")
        let quitTimer = answer("Conserver l’espace de travail")
        await cocoaAction { NSApp.sendAction(#selector(NSApplication.terminate(_:)), to: NSApp, from: nil) }
        quitTimer.invalidate()
        try check(try await value() == "#345678", "Quit cancellation lost draft")
        cases.append("native Quit menu cancellation preserves the same unsaved workspace"); report("running")

        let stopTimer = answer("Arrêter")
        await cocoaAction { host.stop() }
        stopTimer.invalidate()
        try await until("stopped", seconds: 90) { !host.busy && host.views.isEmpty }
        try check(!host.navigation.isEnabled, "Stopped navigation still enabled")
        await cocoaAction { host.start() }
        try await until("restarted", seconds: 180) { !host.busy && host.navigation.isEnabled }
        try await until("saved value after restart") { try await value() == "#234567" }
        try check(host.views["uiLab"] !== initialView, "Restart kept stale editor")
        cases.append("confirmed stop releases the views; restart creates a fresh editor with the saved value"); report("running")
        try await shot("uiLab", "workspace-restarted-native")

        let originalRoot = host.root!
        let projectURL = URL(fileURLWithPath: output).appendingPathComponent("Atlas C with spaces")
        func panel(_ accept: Bool) -> Timer {
            var ticks = 0
            let timer = Timer(timeInterval: 0.2, repeats: true) { timer in
                MainActor.assumeIsolated {
                    guard let picker = loomataProjectPanel, picker.isVisible else { return }
                    ticks += 1
                    if !accept { picker.cancel(nil); timer.invalidate(); return }
                    if ticks == 10 {
                        try! Data("ready".utf8).write(to: URL(fileURLWithPath: output + "/save-panel.ready"))
                        timer.invalidate()
                    }
                }
            }
            RunLoop.main.add(timer, forMode: .modalPanel)
            return timer
        }
        let cancelPanel = panel(false)
        await cocoaAction { host.create() }
        cancelPanel.invalidate()
        try check(host.root == originalRoot && host.views["uiLab"] != nil, "Cancelled new project changed context")
        cases.append("real native save-panel cancellation preserves current project"); report("running")
        loomataProjectPanel = nil
        loomataProjectDestination = projectURL
        let chooseDestination = panel(true)
        let creationAnswer = answer("Créer et ouvrir")
        await cocoaAction { host.create() }
        chooseDestination.invalidate()
        try await until("new project created and started", seconds: 300) {
            if !host.busy && host.label.stringValue.hasPrefix("Opération refusée") { throw NSError(domain: host.label.stringValue, code: 1) }
            return !host.busy && host.root == projectURL.path && host.navigation.isEnabled
        }
        creationAnswer.invalidate()
        try await until("new project UI Lab hydrated") { try await value() == "#234567" }
        let projectView = host.views["uiLab"]!
        let originalStatus = try serviceRequest(arguments[1], arguments[2], "runtime.status", originalRoot)
        try check(originalStatus["phase"] as? String == "stopped", "Old project services not stopped")
        cases.append("real native destination chooser creates, prepares and starts a separate project; previous owned services stop"); report("running")
        report("running")
        try select(2)
        try await until("neutral project preview") { try await js("preview", "document.querySelector('h1')?.textContent==='Atlas C with spaces'") as? Bool == true }
        try check(try await js("preview", "document.querySelector('a[href=\"/projects\"]')===null && !document.querySelector('meta[name=\"adl-design-editor-session\"]')") as? Bool == true, "Preview presents demo or writer bootstrap")
        try await shot("preview", "project-preview")
        cases.append("new project preview shows its identity and pending scope, without business demo or writer capability"); report("running")
        try select(1)
        let projectBook = host.views["storybook"]!
        projectBook.load(URLRequest(url: URL(string: host.endpoints["storybook"]!.absoluteString + "?path=/story/components-button--default")!))
        try await until("new project Storybook") { try await !bookColor().isEmpty }
        try select(0)
        try await fill("#456789"); try await click("Nouveau style de composant"); try await click("Enregistrer")
        try await until("new project save acknowledged") { try await js("uiLab", "document.body.textContent.includes('Enregistré dans les sources et relu avec succès.')") as? Bool == true }
        try select(1)
        try await until("new project reader propagation", seconds: 90) { try await bookColor() == "rgb(69, 103, 137)" }
        try await shot("storybook", "project-storybook")
        try select(0)
        try check(host.views["uiLab"] === projectView, "Created project navigation lost document")
        cases.append("new project UI Lab save updates its own already-open Storybook"); report("running")
        let collisionAnswer = answer("Créer et ouvrir")
        await cocoaAction { host.createProject(at: projectURL) }
        try await until("collision refusal") { !host.busy && host.label.stringValue.contains("existe déjà") }
        collisionAnswer.invalidate()
        try check(host.root == projectURL.path && host.views["uiLab"] === projectView, "Existing target changed workspace")
        cases.append("existing destination is refused without replacing user files or current workspace"); report("running")
        try await fill("#567890"); try await click("Nouveau style de composant")
        let invalidURL = URL(fileURLWithPath: output).appendingPathComponent("incompatible")
        try FileManager.default.createDirectory(at: invalidURL, withIntermediateDirectories: true)
        try Data("{}".utf8).write(to: invalidURL.appendingPathComponent("package.json"))
        await cocoaAction { host.openProject(at: invalidURL) }
        try await until("invalid folder refused") { !host.busy }
        try check(host.root == projectURL.path && host.views["uiLab"] === projectView, "Invalid open replaced workspace")
        try check(try await value() == "#567890", "Invalid open lost draft")
        cases.append("opening an incompatible folder preserves project, writer and draft"); report("running")
        let preserveProject = answer("Conserver l’espace de travail")
        await cocoaAction { host.openProject(at: URL(fileURLWithPath: originalRoot)) }
        try await until("project switch cancelled") { !host.busy }
        preserveProject.invalidate()
        try check(host.root == projectURL.path && host.views["uiLab"] === projectView, "Cancelled project switch changed document")
        try check(try await value() == "#567890", "Cancelled project switch lost draft")
        cases.append("project switch confirmation preserves current draft by default"); report("running")
        let switchAnswer = answer("Changer de projet")
        await cocoaAction { host.openProject(at: URL(fileURLWithPath: originalRoot)) }
        try await until("original project reopened", seconds: 240) { !host.busy && host.root == originalRoot && host.navigation.isEnabled }
        switchAnswer.invalidate()
        try await until("original project saved value unchanged") { try await value() == "#234567" }
        try check(try serviceRequest(arguments[1], arguments[2], "runtime.status", projectURL.path)["phase"] as? String == "stopped", "New project service leaked after switch")
        cases.append("confirmed switch stops only prior project services and original DS is unchanged"); report("running")
        let returnAnswer = answer("Changer de projet")
        await cocoaAction { host.openProject(at: projectURL) }
        try await until("created project reopened", seconds: 240) { !host.busy && host.root == projectURL.path && host.navigation.isEnabled }
        returnAnswer.invalidate()
        try await until("saved project value after reopening") { try await value() == "#456789" }
        cases.append("existing created project reopens with saved DS after its services restart"); report("running")
        let generatorURL = projectURL.appendingPathComponent("scripts/generate-tokens.mjs")
        let generator = try Data(contentsOf: generatorURL)
        try Data("throw new Error('synthetic preparation failure')".utf8).write(to: generatorURL)
        let prepareAnswer = answer("Préparer")
        await cocoaAction { host.prepare() }
        try await until("preparation failure", seconds: 180) { !host.busy && host.label.stringValue.contains("Préparation échouée") }
        prepareAnswer.invalidate()
        try check(host.root == projectURL.path && host.views.isEmpty, "Failed preparation lost project identity or kept stopped views")
        try generator.write(to: generatorURL)
        await cocoaAction { host.prepare() }
        try await until("preparation retry started project", seconds: 240) { !host.busy && host.navigation.isEnabled }
        try await until("saved value after preparation retry") { try await value() == "#456789" }
        try await shot("uiLab", "project-retry")
        cases.append("failed preparation retains project; explicit native retry succeeds without recreating or losing saved sources"); report("running")
        report("running")

        try String(host.window.windowNumber).write(toFile: output + "/window-number", atomically: true, encoding: .utf8)
        report("passed")
        try await Task.sleep(nanoseconds: 1_000_000_000)
        exit(0)
    } catch {
        if let diagnostic = try? await js("uiLab", "JSON.stringify({text:document.body?.innerText,ready:document.readyState,errors:window.__loomataLoadErrors||[]})") as? String {
            try? diagnostic.write(toFile: output + "/failure-document.json", atomically: true, encoding: .utf8)
        }
        try? await shot("uiLab", "failure-ui-lab")
        report("failed", String(describing: error)); exit(1)
    }
}
