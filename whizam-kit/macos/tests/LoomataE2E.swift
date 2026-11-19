// Separate test build: actions use AppKit controls and real WKWebView documents/services.
final class LoomataE2EApplication: NSApplication {
    override func sendEvent(_ event: NSEvent) {
        if event.type == .keyDown || event.type == .keyUp { return }
        super.sendEvent(event)
    }
}
@MainActor func loomataE2E(_ host: LoomataHost) async {
    host.accountStateRequest = { _ in ["connected":false,"pendingLogin":true,"loginFailed":false] }
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
        try check(host.navigation.segmentCount == 3 && host.navigation.label(forSegment: 0) == "UI Lab" && host.navigation.label(forSegment: 1) == "Aperçu" && host.navigation.label(forSegment: 2) == "Codex", "Wrong header labels")
        try check(host.window.titleVisibility == .hidden, "Window title is still visible")
        try check(host.window.toolbar?.items.contains(where: { $0.view === host.navigation }) == true, "Navigation is not in the native header")
        if let stack = host.window.contentView as? NSStackView {
            try check(!stack.arrangedSubviews.contains(where: { $0 is NSStackView || $0 === host.navigation }), "Old project action row remains")
        }
        try check(NSApp.mainMenu?.items.first(where: { $0.submenu?.title == "Projet" })?.submenu?.items.contains(where: { $0.title == "Arrêter les services" }) == true, "Stop command missing from project menu")
        try await until("workspace", seconds: 240) { !host.busy && host.navigation.isEnabled }
        host.window.level = .floating
        host.window.orderFrontRegardless()
        try check(readOnly || host.context.stringValue.contains("application kit"), "Wrong source folder context")
        try await until("hydrated UI Lab") { try await js("uiLab", "!!document.querySelector('input[aria-label=\"Valeur précise\"]:not(:disabled)')") as? Bool == true }
        try check(try await js("uiLab", "!document.querySelector('h1') && !document.body.innerText.includes('Préparez vos réglages') && !document.body.innerText.includes('Rechercher un exemple') && document.querySelector('input[type=search]')?.getAttribute('aria-label') === 'Rechercher un exemple'") as? Bool == true, "Workshop chrome is not simplified accessibly")
        cases.append("navigation in native header, hidden title, no project button row, project menus retained, concise accessible workshop")
        try check(host.context.superview == nil && host.label.superview == nil, "Informational labels remain in the workspace")
        guard let account = NSApp.mainMenu?.items.first?.submenu?.items.first(where: { $0.title == "Connecter Codex" }) else { throw NSError(domain: "Missing account menu", code: 1) }
        var openedAccountURLs: [URL] = []
        let savedRole = host.activeRole
        host.accountRequest = { _ in
            Thread.sleep(forTimeInterval: 0.15)
            return ["url":"https://auth.openai.com/authorize?state=synthetic-native-test"]
        }
        host.openAccountURL = { url in openedAccountURLs.append(url); return true }
        NSApp.sendAction(account.action!, to: account.target, from: account)
        NSApp.sendAction(account.action!, to: account.target, from: account)
        try await until("direct native Codex browser login") { openedAccountURLs.count == 1 }
        try check(host.activeRole == savedRole && host.window.sheets.isEmpty && !host.accountConnecting, "Account login changed the workshop or showed an intermediate sheet")
        try check(try await js("uiLab", "document.querySelector('[data-codex-account]')?.open !== true") as? Bool == true, "Intermediate account dialog appeared")
        for invalid in ["http://auth.openai.com/authorize", "https://auth.openai.com.evil/", "https://user:password@auth.openai.com/", "https://auth.openai.com:444/", "file:///tmp/login", "https://auth.openai.com/#fragment"] {
            try check(codexAuthenticationURL(invalid) == nil, "Invalid authentication URL accepted")
        }
        host.accountRequest = { _ in
            Thread.sleep(forTimeInterval: 0.15)
            return ["url":"https://auth.openai.com/authorize?state=synthetic-stale"]
        }
        NSApp.sendAction(account.action!, to: account.target, from: account)
        let savedRoot = host.root
        host.root = savedRoot! + "/changed"
        try await until("stale account request ignored") { !host.accountConnecting }
        host.root = savedRoot
        try check(openedAccountURLs.count == 1, "Stale project login opened a browser")
        cases.append("Codex account menu opens the generated URL directly without intermediate UI, duplicate click or stale project; foreign URLs rejected; browser and provider simulated")
        var notices: [String] = []
        var disconnects = 0
        host.accountNotice = { notices.append($0) }
        host.accountAwaitingLogin = true
        host.accountStateRequest = { _ in ["connected":true,"pendingLogin":false,"loginFailed":false] }
        host.refreshCodexAccount()
        try await until("connected menu and notice") { account.title == "Déconnecter Codex" && notices == ["Codex est connecté."] }
        host.accountDisconnectRequest = { _ in disconnects += 1; return ["connected":false] }
        let cancelAccount = answer("Annuler")
        await cocoaAction { NSApp.sendAction(account.action!, to: account.target, from: account) }
        try await until("disconnect cancelled") { host.window.sheets.isEmpty && answered > 0 }
        cancelAccount.invalidate()
        try check(disconnects == 0 && host.accountConnected, "Cancel logged out the account")
        let confirmAccount = answer("Déconnecter")
        await cocoaAction { NSApp.sendAction(account.action!, to: account.target, from: account) }
        try await until("disconnected menu and notice") { account.title == "Connecter Codex" && notices.last == "Codex est déconnecté." }
        confirmAccount.invalidate()
        try check(disconnects == 1 && host.activeRole == savedRole, "Logout did not run exactly once or changed view")
        host.accountStateRequest = { _ in ["connected":false,"pendingLogin":false,"loginFailed":false] }
        host.accountNotice = nil
        cases.append("account menu follows confirmed state, login notice, cancelled disconnect preserves account, confirmed logout updates title and notice; simulated account")

        try check(try await js("uiLab", "Math.round(document.querySelector('nav[aria-label=\"Exemples et fondations\"]').getBoundingClientRect().width) === 260 && Math.round(document.querySelector('section[aria-label=\"Réglages du design system\"]').getBoundingClientRect().width) === 260") as? Bool == true, "Sidebar widths are not fixed to 260px")
        cases.append("both native workshop sidebars measure exactly 260px")
        if ProcessInfo.processInfo.environment["LOOMATA_T1_TEST"] == "1" {
            for size in [NSSize(width:1280,height:800),NSSize(width:1440,height:900)] {
                host.window.setContentSize(size)
                _ = try await js("uiLab", "[...document.querySelectorAll('button')].find(b=>b.textContent==='Pages').click();true")
                try await until("T1 real page") {try await js("uiLab", "document.querySelector('iframe[title=\"Page réelle du projet\"]')?.contentDocument?.querySelector('h1')?.textContent==='Agentic Design Lab'") as? Bool == true}
                try await until("first page occurrence binding") { try await js("uiLab", "!!document.querySelector('iframe')?.contentDocument?.querySelector('button[data-loomata-occurrence]')") as? Bool == true }
                let firstOccurrenceId = try await js("uiLab", "document.querySelector('iframe')?.contentDocument?.querySelector('button[data-loomata-node]')?.getAttribute('data-loomata-occurrence')") as? String
                try check(firstOccurrenceId != nil, "First occurrence identity missing")
                try await until("T1 selection ready") {try await js("uiLab", "[...document.querySelectorAll('nav[aria-label=\"Pages et occurrences\"] button')].some(b=>b.textContent==='Bouton T1'&&!b.disabled)") as? Bool == true}
                _ = try await js("uiLab", "document.querySelector('iframe').contentDocument.querySelector('button').click();true")
                try await until("T1 occurrence") {try await js("uiLab", "document.querySelector('[aria-label=\"Fil d’Ariane\"]')?.textContent==='Première page T1 / Bouton T1'") as? Bool == true}
                _ = try await js("uiLab", "document.querySelector('iframe').contentDocument.querySelector('button span').click();true")
                try await until("T1 subelement") {try await js("uiLab", "document.querySelector('[aria-label=\"Fil d’Ariane\"]')?.textContent==='Première page T1 / Bouton T1 / Libellé T1'") as? Bool == true}
                _ = try await js("uiLab", "[...document.querySelectorAll('button')].find(b=>b.textContent==='Seconde page T1').click();true")
                try await until("T1 second route") {try await js("uiLab", "document.querySelector('iframe')?.contentDocument?.querySelector('h1')?.textContent==='Seconde page T1'") as? Bool == true}
                try await until("second page occurrence binding") { try await js("uiLab", "!!document.querySelector('iframe')?.contentDocument?.querySelector('button[data-loomata-occurrence]')") as? Bool == true }
                let secondOccurrenceId = try await js("uiLab", "document.querySelector('iframe')?.contentDocument?.querySelector('button[data-loomata-node]')?.getAttribute('data-loomata-occurrence')") as? String
                try check(secondOccurrenceId != nil && secondOccurrenceId != firstOccurrenceId, "Two pages shared an occurrence identity")
                try check(try await js("uiLab", "document.documentElement.scrollWidth<=innerWidth") as? Bool == true,"T1 horizontal overflow")
                _ = try await js("uiLab", "[...document.querySelectorAll('button')].find(b=>b.textContent==='Actualiser les pages').focus();true")
                try check(try await js("uiLab", "document.activeElement?.textContent==='Actualiser les pages'") as? Bool == true,"T1 focus lost")
                try await shot("uiLab","t1-pages-\(Int(size.width))")
                _ = try await js("uiLab", "[...document.querySelectorAll('button')].find(b=>b.textContent==='Design System').click();true")
                _ = try await js("uiLab", "[...document.querySelectorAll('button')].find(b=>b.textContent==='Figma').click();true")
                try await until("T1 private Figma form") {try await js("uiLab", "!!document.querySelector('input[type=password][name=token]')") as? Bool == true}
                try check(try await js("uiLab", "(()=>{const d=document.querySelector('dialog[open]');if(!d)return false;const r=d.getBoundingClientRect();return Math.abs(r.x-24)<1&&Math.abs(r.y-24)<1&&Math.abs(r.width-innerWidth+48)<1&&Math.abs(r.height-innerHeight+48)<1})()") as? Bool == true,"Figma overlay margins")
                try await shot("uiLab","t1-figma-\(Int(size.width))")
                _ = try await js("uiLab", "[...document.querySelectorAll('dialog button')].find(b=>b.textContent==='Composants').click();true")
                try await until("Figma native catalog") {try await js("uiLab", "[...document.querySelectorAll('dialog button')].some(b=>b.getAttribute('aria-label')==='Native Action · COMPONENT')") as? Bool == true}
                _ = try await js("uiLab", "[...document.querySelectorAll('dialog button')].find(b=>b.getAttribute('aria-label')==='Native Action · COMPONENT').click();true")
                _ = try await js("uiLab", "(()=>{const e=[...document.querySelectorAll('dialog label')].find(l=>l.textContent.includes('Rôle fonctionnel')).querySelector('select');e.value='action';e.dispatchEvent(new Event('change',{bubbles:true}));return true})()")
                try await until("Figma prepare enabled") {try await js("uiLab", "[...document.querySelectorAll('dialog button')].some(b=>b.textContent==='Préparer l’import'&&!b.disabled)") as? Bool == true}
                _ = try await js("uiLab", "[...document.querySelectorAll('dialog button')].find(b=>b.textContent==='Préparer l’import').click();true")
                try await until("Figma provisional real control") {try await js("uiLab", "!!document.querySelector('[aria-label=\"Composant importé réel\"] button[data-import-node]')&&[...document.querySelectorAll('h2')].some(h=>h.textContent==='Import provisoire')") as? Bool == true}
                try await shot("uiLab","figma-import-\(Int(size.width))")
                _ = try await js("uiLab", "[...document.querySelectorAll('button')].find(b=>b.textContent==='Annuler l’import').click();true")
                try await until("Figma cancel targeted") {try await js("uiLab", "document.body.textContent.includes('Aucun composant importé.')") as? Bool == true}

                _ = try await js("uiLab", "[...document.querySelectorAll('button')].find(b=>b.textContent==='Design System').click();true")
                try await until("T1 return DS") {try await js("uiLab", "!!document.querySelector('input[aria-label=\"Valeur précise\"]:not(:disabled)')") as? Bool == true}
            }
            cases.append("T1 two real routes, occurrence/subelement selection and breadcrumbs, focus, widths 1280/1440, Figma 24px overlay, native provisional React component/cancellation and return to DS in WKWebView")
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
            cases.append("actual /application source UI Lab, Storybook and root preview are interactive in one native window; no save performed")
            try String(host.window.windowNumber).write(toFile: output + "/window-number", atomically: true, encoding: .utf8)
            report("passed")
            try await Task.sleep(nanoseconds: 8_000_000_000)
            exit(0)
        }

        cases.append("opening Loomata starts owned services and displays UI Lab for the application source kit")
        report("running")
        _ = try await js("uiLab", "window.__loomataDocumentIdentity='initial';true")
        await cocoaAction { host.start() }
        try await until("idempotent start") { !host.busy }
        try check(host.views["uiLab"] === initialView, "Duplicate start replaced the editor")
        cases.append("idempotent start reuses the same native editor document")
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
        cases.append("Storybook opens inside Loomata and does not render the unsaved draft")
        try select(2)
        try await until("actual preview") { try await js("preview", "document.querySelector('h1')?.textContent==='Agentic Design Lab'") as? Bool == true }
        try check(host.views["preview"]?.url?.path == "/", "Preview is not the actual project root")
        try check(try await js("preview", "document.querySelectorAll('meta[name=\"adl-design-editor-session\"]').length") as? Int == 0, "Preview received writer bootstrap")
        try await shot("preview", "preview-native")
        cases.append("project preview loads the real source home in the same window, without writer bootstrap")
        try select(0)
        try check(host.views["uiLab"] === initialView, "Tab return replaced editor")
        try check(try await value() == "#123456", "Tab navigation lost draft")
        try check(try await js("uiLab", "window.__loomataDocumentIdentity") as? String == "initial", "Editor reloaded")
        try check(host.views["storybook"] === bookView, "Reader document replaced")
        try await shot("uiLab", "draft-return-native")
        cases.append("UI Lab → Storybook → preview → UI Lab retains the exact editor, reader and draft")
        let previousAnswers = answered
        let reloadTimer = answer("Conserver le brouillon")
        host.views["uiLab"]!.reload()
        try await until("reload confirmation") { answered > previousAnswers }
        try await until("reload confirmation closed") { host.window.sheets.isEmpty }
        reloadTimer.invalidate()
        try check(try await value() == "#123456", "Reload cancellation lost draft")
        try check(try await js("uiLab", "window.__loomataDocumentIdentity") as? String == "initial", "Cancelled reload changed document")
        cases.append("native document reload asks before discarding the draft and preserves it on cancellation")

        let cancelTimer = answer("Conserver le brouillon")
        try await click("Annuler")
        try await until("cancel sheet dismissed") { host.window.sheets.isEmpty }
        cancelTimer.invalidate()
        try check(try await value() == "#123456", "Native cancel confirmation lost draft")
        let abandonTimer = answer("Abandonner")
        try await click("Annuler")
        try await until("draft discarded") { try await value() == baseline }
        abandonTimer.invalidate()
        cases.append("JavaScript draft confirmation is relayed to native sheet and preserves by default")
        try await fill("#234567"); try await click("Nouveau style de composant"); try await click("Enregistrer")
        try await until("save acknowledged") { try await js("uiLab", "document.body.textContent.includes('Enregistré dans les sources et relu avec succès.')") as? Bool == true }
        try select(1)
        try await until("reader update", seconds: 90) { try await bookColor() == "rgb(35, 69, 103)" }
        try await shot("storybook", "storybook-saved-native")
        try check(try await js("storybook", "document.querySelectorAll('meta[name=\"adl-design-editor-session\"]').length") as? Int == 0, "Storybook writer bootstrap")
        cases.append("real UI Lab save propagates to already-open integrated Storybook")
        let priorURL = bookView.url
        let refusals = host.navigationRefusals
        bookView.load(URLRequest(url: URL(string: "https://example.invalid/")!))
        try await until("external navigation refused") { host.navigationRefusals > refusals }
        try check(bookView.url == priorURL, "External navigation escaped local document")
        bookView.load(URLRequest(url: host.endpoints["uiLab"]!))
        try await until("cross-role navigation refused") { host.navigationRefusals > refusals + 1 }
        cases.append("remote and cross-service navigation are denied before leaving the local reader")
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
        cases.append("stop and close confirmations retain the workspace and draft when cancelled")
        let quitTimer = answer("Conserver l’espace de travail")
        await cocoaAction { NSApp.sendAction(#selector(NSApplication.terminate(_:)), to: NSApp, from: nil) }
        quitTimer.invalidate()
        try check(try await value() == "#345678", "Quit cancellation lost draft")
        cases.append("native Quit menu cancellation preserves the same unsaved workspace")

        let stopTimer = answer("Arrêter")
        await cocoaAction { host.stop() }
        stopTimer.invalidate()
        try await until("stopped", seconds: 90) { !host.busy && host.views.isEmpty }
        try check(!host.navigation.isEnabled, "Stopped navigation still enabled")
        await cocoaAction { host.start() }
        try await until("restarted", seconds: 180) { !host.busy && host.navigation.isEnabled }
        try await until("saved value after restart") { try await value() == "#234567" }
        try check(host.views["uiLab"] !== initialView, "Restart kept stale editor")
        cases.append("confirmed stop releases the views; restart creates a fresh editor with the saved value")
        try await shot("uiLab", "workspace-restarted-native")
        try String(host.window.windowNumber).write(toFile: output + "/window-number", atomically: true, encoding: .utf8)
        report("passed")
        try await Task.sleep(nanoseconds: 1_000_000_000)
        exit(0)
    } catch {
        if let diagnostic = try? await js("uiLab", "JSON.stringify({url:location.pathname,body:document.body.innerText.slice(0,12000),frames:[...document.querySelectorAll('iframe')].map(f=>({title:f.title,path:new URL(f.src).pathname,query:new URL(f.src).search,actualQuery:f.contentWindow?.location.search,ready:f.contentDocument?.readyState,body:f.contentDocument?.body?.innerText.slice(0,3000),errors:f.contentWindow?.__loomataLoadErrors,router:!!f.contentWindow?.__reactRouterContext,scripts:[...f.contentDocument.scripts].map(s=>s.src?new URL(s.src).pathname:'inline')})),inputs:[...document.querySelectorAll('input')].map(e=>({label:e.getAttribute('aria-label'),disabled:e.disabled})),errors:window.__loomataLoadErrors||[]})"), let text = diagnostic as? String {try? text.write(toFile:output+"/failure-dom.json",atomically:true,encoding:.utf8)}
        try? await shot("uiLab","failure-native")
        report("failed", String(describing: error) + "; busy=" + String(host.busy) + "; status=" + host.label.stringValue + "; sheets=" + String(host.window.sheets.count))
        exit(1)
    }
}
