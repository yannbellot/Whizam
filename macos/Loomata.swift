// Loomata workspace: the source launcher or the private bundled runtime invokes the same core.
import Cocoa
import WebKit

func serviceRequest(_ node: String, _ client: String, _ operation: String, _ root: String, options: [String: String]? = nil) throws -> [String: Any] {
    let process = Process()
    process.executableURL = URL(fileURLWithPath: node)
    process.arguments = [client, operation, root]
    if let options = options { process.arguments?.append(String(data: try JSONSerialization.data(withJSONObject: options), encoding: .utf8)!) }
    let pipe = Pipe()
    process.standardOutput = pipe
    let errors = Pipe()
    process.standardError = errors
    process.currentDirectoryURL = URL(fileURLWithPath: root)
    try process.run()
    let deadline = DispatchWorkItem { if process.isRunning { process.terminate() } }
    DispatchQueue.global().asyncAfter(deadline: .now() + 600, execute: deadline)
    defer { deadline.cancel() }
    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    process.waitUntilExit()
    guard process.terminationStatus == 0,
          let value = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
        let message = String(data: errors.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8)?.trimmingCharacters(in: .whitespacesAndNewlines) ?? "Service indisponible."
        throw NSError(domain: "LoomataService", code: 1, userInfo: [NSLocalizedDescriptionKey: String(message.prefix(700))])
    }
    return value
}
func codexAuthenticationURL(_ text: String) -> URL? {
    guard let url = URL(string: text), url.scheme == "https", url.user == nil, url.password == nil,
          url.fragment == nil, url.port == nil || url.port == 443,
          ["auth.openai.com", "auth0.openai.com", "chatgpt.com"].contains(url.host ?? "") else { return nil }
    return url
}
let arguments: [String] = {
    let supplied = CommandLine.arguments
    if supplied.count == 1, let resources = Bundle.main.resourceURL,
       let data = try? Data(contentsOf: resources.appendingPathComponent("launch.json")),
       let config = try? JSONSerialization.jsonObject(with: data) as? [String:String], config["portable"] == "1" {
        let payload = resources.appendingPathComponent("payload")
        let base = ProcessInfo.processInfo.environment["LOOMATA_STATE_DIRECTORY"] ?? FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0].appendingPathComponent("Loomata").path
        let process = Process(); process.executableURL = payload.appendingPathComponent(".runtime.local/node/bin/node")
        process.arguments = [payload.appendingPathComponent("scripts/bootstrap-bundle.mjs").path, base]
        process.environment = ["PATH":"/usr/bin:/bin:/usr/sbin:/sbin", "LANG":"en_US.UTF-8"]
        let pipe = Pipe(); process.standardOutput = pipe
        do {
            try process.run(); let bytes = pipe.fileHandleForReading.readDataToEndOfFile(); process.waitUntilExit()
            guard process.terminationStatus == 0, let result = try JSONSerialization.jsonObject(with: bytes) as? [String:String], let node = result["node"], let client = result["client"], let project = result["project"] else { throw NSError(domain:"Préparation de Loomata refusée", code:1) }
            return [supplied[0],node,client,project]
        } catch {
            let alert = NSAlert(); alert.messageText = "Loomata n’a pas pu préparer son espace local."
            alert.informativeText = "Les données existantes ont été conservées. Vérifiez l’accès au dossier Application Support et l’espace disque. Une installation interrompue ou d’une autre version demande un diagnostic avant reprise."
            alert.addButton(withTitle:"Fermer"); alert.runModal(); exit(1)
        }
    }
    guard supplied.count == 1,
          let url = Bundle.main.url(forResource: "launch", withExtension: "json"),
          let data = try? Data(contentsOf: url),
          let config = try? JSONSerialization.jsonObject(with: data) as? [String: String],
          let node = config["node"], let client = config["client"], let project = config["project"],
          [node, client, project].allSatisfy({ $0.hasPrefix("/") }) else { return supplied }
    return [supplied[0], node, client, project]
}()
guard arguments.count == 3 || arguments.count == 4 else {
    fputs("Usage: Loomata node-path local-service.mjs-path [project-directory]\n", stderr)
    exit(1)
}

// The bundle embeds the validated tool DTCG authority, never the project's palette.
enum WorkspaceColors {
    static let tokens: [String: Any] = {
        guard let url = Bundle.main.url(forResource: "loomata-ui.tokens", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let value = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return [:] }
        return value
    }()
    static func color(_ role: String, fallback: NSColor) -> NSColor {
        NSColor(name: nil) { appearance in
            let dark = appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
            let key = (dark ? "dark-" : "") + role
            guard let decisions = tokens["decision"] as? [String: [String: Any]],
                  let reference = decisions[key]?["$value"] as? String,
                  reference.hasPrefix("{primitive."), reference.hasSuffix("}"),
                  let primitives = tokens["primitive"] as? [String: [String: Any]],
                  let token = primitives[String(reference.dropFirst(11).dropLast())],
                  token["$type"] as? String == "color",
                  let value = token["$value"] as? [String: Any],
                  value["colorSpace"] as? String == "srgb",
                  let components = value["components"] as? [Double], components.count == 3,
                  components.allSatisfy({ $0.isFinite && (0...1).contains($0) }),
                  let alpha = value["alpha"] as? Double, alpha == 1 else { return fallback }
            return NSColor(srgbRed: components[0], green: components[1], blue: components[2], alpha: alpha)
        }
    }
}
final class WorkspaceNavigation: NSSegmentedControl {
    func applyPalette() {
        selectedSegmentBezelColor = WorkspaceColors.color("selection", fallback: .selectedControlColor)
    }
    override func viewDidChangeEffectiveAppearance() {
        super.viewDidChangeEffectiveAppearance()
        applyPalette()
    }
}

final class LoomataHost: NSObject, NSApplicationDelegate, NSToolbarDelegate, WKNavigationDelegate, WKUIDelegate, NSWindowDelegate {
    var window: NSWindow!
    var root: String?
    var busy = false
    var views: [String: WKWebView] = [:]
    var endpoints: [String: URL] = [:]
    var navigationRefusals = 0
    var closedByWindow = false
    var servicePids: [Int] = []
    let roles = ["uiLab", "storybook", "preview", "assistant"]
    let headerRoles = ["uiLab", "preview", "assistant"]
    var activeRole = "uiLab"
    let context = NSTextField(labelWithString: "Aucun dossier ouvert")
    let label = NSTextField(labelWithString: "Choisir un dossier préparé pour ouvrir l’espace de travail.")
    let navigation = WorkspaceNavigation(labels: ["UI Lab", "Aperçu", "Codex"], trackingMode: .selectOne, target: nil, action: nil)
    let content = NSView()

    func applicationDidFinishLaunching(_ notification: Notification) {
        installMenu()
        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 1280, height: 860), styleMask: [.titled, .closable, .resizable, .miniaturizable], backing: .buffered, defer: false)
        window.title = "Loomata"
        window.backgroundColor = WorkspaceColors.color("main", fallback: .windowBackgroundColor)
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.toolbarStyle = .unified
        let toolbar = NSToolbar(identifier: "WorkspaceNavigation")
        toolbar.delegate = self
        toolbar.allowsUserCustomization = false
        toolbar.displayMode = .iconOnly
        window.toolbar = toolbar
        window.minSize = NSSize(width: 860, height: 640)
        window.isReleasedWhenClosed = false
        window.delegate = self
        let stack = NSStackView()
        stack.orientation = .vertical
        stack.alignment = .leading
        stack.spacing = 10
        stack.edgeInsets = NSEdgeInsets(top: 12, left: 12, bottom: 12, right: 12)
        context.font = .boldSystemFont(ofSize: NSFont.systemFontSize)
        context.lineBreakMode = .byTruncatingMiddle
        navigation.applyPalette()
        navigation.target = self
        navigation.action = #selector(changeView)
        navigation.selectedSegment = 0
        navigation.isEnabled = false
        label.lineBreakMode = .byWordWrapping
        label.maximumNumberOfLines = 3
        content.translatesAutoresizingMaskIntoConstraints = false
        stack.addArrangedSubview(content)
        window.contentView = stack
        NSLayoutConstraint.activate([
            content.widthAnchor.constraint(equalTo: stack.widthAnchor, constant: -24),
            content.heightAnchor.constraint(greaterThanOrEqualToConstant: 460),
        ])
        window.center()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        if arguments.count == 4 {
            let recent = URL(fileURLWithPath: arguments[2]).deletingLastPathComponent().deletingLastPathComponent().appendingPathComponent(".runtime.local/loomata-context/last-project.json")
            if let data = try? Data(contentsOf: recent), let saved = try? JSONSerialization.jsonObject(with: data) as? [String: String], let directory = saved["root"], directory.hasPrefix("/") { root = directory } else { root = arguments[3] }
            updateContext()
            perform("runtime.start")
        }
    }
    func toolbarAllowedItemIdentifiers(_ toolbar: NSToolbar) -> [NSToolbarItem.Identifier] {
        [.flexibleSpace, NSToolbarItem.Identifier("WorkspaceViews")]
    }
    func toolbarDefaultItemIdentifiers(_ toolbar: NSToolbar) -> [NSToolbarItem.Identifier] {
        [.flexibleSpace, NSToolbarItem.Identifier("WorkspaceViews"), .flexibleSpace]
    }
    func toolbar(_ toolbar: NSToolbar, itemForItemIdentifier identifier: NSToolbarItem.Identifier, willBeInsertedIntoToolbar flag: Bool) -> NSToolbarItem? {
        guard identifier.rawValue == "WorkspaceViews" else { return nil }
        let item = NSToolbarItem(itemIdentifier: identifier)
        item.label = "Vues de l’espace de travail"
        item.view = navigation
        return item
    }
    func installMenu() {
        let bar = NSMenu()
        let appItem = NSMenuItem()
        bar.addItem(appItem)
        let appMenu = NSMenu(title: "Loomata")
        appMenu.addItem(withTitle: "À propos de Loomata", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
        let account = appMenu.addItem(withTitle: "Connecter Codex", action: #selector(openCodexAccount), keyEquivalent: ",")
        account.target = self
        codexAccountItem = account
        appMenu.addItem(.separator())
        appMenu.addItem(withTitle: "Quitter Loomata", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appItem.submenu = appMenu
        let fileItem = NSMenuItem()
        bar.addItem(fileItem)
        let fileMenu = NSMenu(title: "Projet")
        for (title, selector, key) in [("Nouveau projet…", #selector(create), "n"), ("Ouvrir un projet…", #selector(choose), "o"), ("Préparer / Réessayer", #selector(prepare), ""), ("Démarrer", #selector(start), ""), ("Arrêter les services", #selector(stop), "")] {
            let item = fileMenu.addItem(withTitle: title, action: selector, keyEquivalent: key)
            item.target = self
        }
        for (title, selector) in [("Exporter les sources du projet…", #selector(exportProject)), ("Exporter les sources de Loomata…", #selector(exportTool))] {
            let item = fileMenu.addItem(withTitle: title, action: selector, keyEquivalent: "")
            item.target = self
        }
        fileItem.submenu = fileMenu
        let editItem = NSMenuItem()
        bar.addItem(editItem)
        let edit = NSMenu(title: "Édition")
        for (title, selector, key) in [("Annuler", Selector(("undo:")), "z"), ("Couper", #selector(NSText.cut(_:)), "x"), ("Copier", #selector(NSText.copy(_:)), "c"), ("Coller", #selector(NSText.paste(_:)), "v"), ("Tout sélectionner", #selector(NSText.selectAll(_:)), "a")] {
            edit.addItem(withTitle: title, action: selector, keyEquivalent: key)
        }
        editItem.submenu = edit
        let viewItem = NSMenuItem()
        bar.addItem(viewItem)
        let viewMenu = NSMenu(title: "Présentation")
        for (index, title) in ["UI Lab", "Storybook", "Aperçu", "Codex"].enumerated() {
            let item = viewMenu.addItem(withTitle: title, action: #selector(selectFromMenu(_:)), keyEquivalent: String(index + 1))
            item.target = self
            item.tag = index
        }
        viewMenu.addItem(.separator())
        let home = viewMenu.addItem(withTitle: "Accueil de la vue", action: #selector(homeView), keyEquivalent: "h")
        home.keyEquivalentModifierMask = [.command, .shift]
        home.target = self
        let reload = viewMenu.addItem(withTitle: "Actualiser la vue", action: #selector(reloadView), keyEquivalent: "r")
        reload.target = self
        viewItem.submenu = viewMenu
        NSApp.mainMenu = bar
    }
    var codexAccountItem: NSMenuItem?
    var accountConnected = false
    var accountAwaitingLogin = false
    var accountRefreshing = false
    var accountEpoch = 0
    var accountTimer: Timer?
    var accountNotice: ((String) -> Void)?
    var accountStateRequest: (String) throws -> [String: Any] = { try serviceRequest(arguments[1], arguments[2], "ai.account", $0) }
    var accountDisconnectRequest: (String) throws -> [String: Any] = { try serviceRequest(arguments[1], arguments[2], "ai.disconnect", $0) }
    func setAccountConnected(_ connected: Bool) {
        accountConnected = connected
        codexAccountItem?.title = connected ? "Déconnecter Codex" : "Connecter Codex"
    }
    func showAccountNotice(_ text: String) {
        if let notice = accountNotice { notice(text); return }
        let alert = NSAlert()
        alert.messageText = text
        alert.addButton(withTitle: "OK")
        alert.beginSheetModal(for: window)
    }
    func refreshCodexAccount() {
        guard !accountRefreshing, !accountConnecting, let directory = root else { return }
        accountRefreshing = true
        let request = accountStateRequest, epoch = accountEpoch
        DispatchQueue.global().async {
            let result = try? request(directory)
            DispatchQueue.main.async {
                self.accountRefreshing = false
                guard self.root == directory, self.accountEpoch == epoch,
                      let result = result, let connected = result["connected"] as? Bool else { return }
                self.setAccountConnected(connected)
                if self.accountAwaitingLogin && result["pendingLogin"] as? Bool == false {
                    self.accountAwaitingLogin = false
                    if connected && result["loginFailed"] as? Bool == false { self.showAccountNotice("Codex est connecté.") }
                    else { self.showAccountNotice("La connexion Codex n’a pas été confirmée.") }
                }
            }
        }
    }
    func disconnectCodexAccount() {
        guard !accountConnecting, let directory = root else { return }
        let alert = NSAlert()
        alert.messageText = "Déconnecter Codex ?"
        alert.informativeText = "Les échanges en cours seront interrompus. Le projet et ses réglages seront conservés."
        alert.addButton(withTitle: "Annuler")
        alert.addButton(withTitle: "Déconnecter")
        alert.beginSheetModal(for: window) { response in
            guard response == .alertSecondButtonReturn, self.root == directory, !self.accountConnecting else { return }
            self.accountConnecting = true
            self.accountEpoch += 1
            let request = self.accountDisconnectRequest
            DispatchQueue.global().async {
                do {
                    let result = try request(directory)
                    guard result["connected"] as? Bool == false else { throw NSError(domain: "Loomata", code: 1) }
                    DispatchQueue.main.async {
                        self.accountConnecting = false
                        guard self.root == directory else { return }
                        self.accountAwaitingLogin = false
                        self.setAccountConnected(false)
                        self.showAccountNotice("Codex est déconnecté.")
                    }
                } catch {
                    DispatchQueue.main.async {
                        self.accountConnecting = false
                        if self.root == directory { self.showAccountNotice("La déconnexion Codex n’a pas été confirmée. Réessayez.") }
                    }
                }
            }
        }
    }
    var accountConnecting = false
    var accountRequest: (String) throws -> [String: Any] = { directory in
        try serviceRequest(arguments[1], arguments[2], "ai.connect", directory)
    }
    var openAccountURL: (URL) -> Bool = { NSWorkspace.shared.open($0) }
    @objc func openCodexAccount() {
        guard !busy, !accountConnecting, let directory = root else { return }
        if accountConnected { disconnectCodexAccount(); return }
        accountEpoch += 1
        accountConnecting = true
        let request = accountRequest
        DispatchQueue.global().async {
            do {
                let result = try request(directory)
                guard let text = result["url"] as? String, let url = codexAuthenticationURL(text) else {
                    throw NSError(domain: "Loomata", code: 1, userInfo: [NSLocalizedDescriptionKey: "Lien de connexion Codex indisponible ou invalide."])
                }
                DispatchQueue.main.async {
                    self.accountConnecting = false
                    guard self.root == directory else { return }
                    self.accountAwaitingLogin = true
                    if !self.openAccountURL(url) {
                        self.accountAwaitingLogin = false
                        self.showFailure(NSError(domain: "Loomata", code: 1, userInfo: [NSLocalizedDescriptionKey: "Le navigateur habituel n’a pas pu ouvrir la connexion Codex."]))
                    }
                }
            } catch {
                DispatchQueue.main.async {
                    self.accountConnecting = false
                    if self.root == directory { self.showFailure(error) }
                }
            }
        }
    }
    func updateContext() {
        context.stringValue = root.map { "Dossier actif : \(URL(fileURLWithPath: $0).lastPathComponent)" } ?? "Aucun dossier ouvert"
        context.toolTip = root
    }
    func confirm(_ title: String, action: String) -> Bool {
        let alert = NSAlert()
        alert.messageText = title
        alert.informativeText = "Les vues vont être fermées. Les réglages non enregistrés peuvent être perdus ; cette action ne les sauvegarde pas."
        alert.addButton(withTitle: "Conserver l’espace de travail")
        alert.addButton(withTitle: action)
        return alert.runModal() == .alertSecondButtonReturn
    }
    func clearViews() {
        for view in views.values { view.stopLoading(); view.removeFromSuperview() }
        views.removeAll()
        endpoints.removeAll()
        navigation.isEnabled = false
    }
    func localURL(_ text: String) -> URL? {
        guard let url = URL(string: text), let port = url.port,
              url.scheme == "http", url.host == "127.0.0.1", (1024...65535).contains(port),
              url.user == nil, url.password == nil, url.fragment == nil else { return nil }
        return url
    }
    func configureWorkspace(_ object: [String: Any]) throws -> Bool {
        guard object["phase"] as? String == "ready",
              let workspace = object["workspace"] as? [String: String],
              let uiText = workspace["uiLab"], let ui = localURL(uiText), ui.path == "/ui-lab", ui.query == nil,
              let bookText = workspace["storybook"], let book = localURL(bookText), book.path == "/", book.query == nil,
              let previewText = workspace["preview"], let preview = localURL(previewText), preview.path == "/", preview.query == nil,
              ui.port != book.port, ui.port == preview.port else {
            throw NSError(domain: "LoomataNavigation", code: 1)
        }
        // Idempotent start does not replace a live document and cannot erase a draft.
        let next = ["uiLab": ui, "storybook": book, "preview": preview]
        let nextPids = object["pids"] as? [Int] ?? []
        if next != endpoints.filter({ $0.key != "assistant" }) || nextPids != servicePids {
            if !views.isEmpty && !confirm("Réouvrir les outils après redémarrage ?", action: "Réouvrir") { return false }
            clearViews()
            endpoints = next
            servicePids = nextPids
        }
        navigation.isEnabled = true
        if accountTimer == nil {
            accountTimer = Timer.scheduledTimer(withTimeInterval: 2, repeats: true) { [weak self] _ in self?.refreshCodexAccount() }
        }
        refreshCodexAccount()
        showView(activeRole)
        return true
    }
    func showView(_ role: String) {
        activeRole = role
        navigation.selectedSegment = headerRoles.firstIndex(of: role) ?? -1
        if role == "assistant" && endpoints[role] == nil { openAssistant(); return }
        guard let url = endpoints[role] else { return }
        if views[role] == nil {
            let configuration = WKWebViewConfiguration()
            if role == "uiLab" {
                // Development module URLs and bootstrap sessions must not outlive this workshop.
                // Persisted project data and account state belong to the local service, not WebKit.
                configuration.websiteDataStore = .nonPersistent()
                configuration.userContentController.addUserScript(WKUserScript(source: "window.__loomataNativeHost = true", injectionTime: .atDocumentStart, forMainFrameOnly: true))
            }
            configuration.userContentController.addUserScript(WKUserScript(source: "window.__loomataLoadErrors=[];addEventListener('error',e=>{if(window.__loomataLoadErrors.length<4)window.__loomataLoadErrors.push(String(e.message).slice(0,300))});addEventListener('unhandledrejection',e=>{if(window.__loomataLoadErrors.length<4)window.__loomataLoadErrors.push(String(e.reason).slice(0,300))})", injectionTime: .atDocumentStart, forMainFrameOnly: true))
            let view = WKWebView(frame: .zero, configuration: configuration)
            if role == "uiLab" { view.underPageBackgroundColor = WorkspaceColors.color("main", fallback: .windowBackgroundColor) }
            view.translatesAutoresizingMaskIntoConstraints = false
            view.navigationDelegate = self
            view.uiDelegate = self
            content.addSubview(view)
            NSLayoutConstraint.activate([
                view.leadingAnchor.constraint(equalTo: content.leadingAnchor), view.trailingAnchor.constraint(equalTo: content.trailingAnchor),
                view.topAnchor.constraint(equalTo: content.topAnchor), view.bottomAnchor.constraint(equalTo: content.bottomAnchor),
            ])
            views[role] = view
            view.load(URLRequest(url: url, cachePolicy: role == "uiLab" ? .reloadIgnoringLocalCacheData : .useProtocolCachePolicy))
        }
        for (id, view) in views { view.isHidden = id != role }
        if let view = views[role] { window.makeFirstResponder(view) }
    }
    func openAssistant(reload: Bool = false) {
        guard !busy, let directory = root else { return }
        busy = true
        label.stringValue = "Ouverture de l’assistance…"
        DispatchQueue.global().async {
            do {
                let object = try serviceRequest(arguments[1], arguments[2], "ai.open", directory)
                guard let text = object["url"] as? String, let url = self.localURL(text), url.path.hasPrefix("/assistant/"), url.query == nil else { throw NSError(domain: "Adresse d’assistance invalide", code: 1) }
                DispatchQueue.main.async {
                    self.busy = false
                    if self.endpoints["assistant"] != url {
                        self.views["assistant"]?.removeFromSuperview()
                        self.views.removeValue(forKey: "assistant")
                    } else if reload { self.views["assistant"]?.reload() }
                    self.endpoints["assistant"] = url
                    self.showView("assistant")
                    self.label.stringValue = ""
                }
            } catch { DispatchQueue.main.async { self.busy = false; self.showFailure(error) } }
        }
    }
    func interruptAssistant(_ directory: String) throws {
        if endpoints["assistant"] != nil { _ = try serviceRequest(arguments[1], arguments[2], "ai.interrupt", directory) }
    }
    @objc func selectFromMenu(_ sender: NSMenuItem) {
        guard !busy, !endpoints.isEmpty else { return }
        guard roles.indices.contains(sender.tag) else { return }
        chooseView(roles[sender.tag])
    }
    @objc func changeView() {
        guard !busy, headerRoles.indices.contains(navigation.selectedSegment) else { return }
        chooseView(headerRoles[navigation.selectedSegment])
    }
    func chooseView(_ role: String) {
        if activeRole == "assistant" && role != "assistant" {
            activeRole = role
            perform("runtime.start")
        } else { showView(role) }
    }
    @objc func homeView() {
        guard !busy else { return }
        let role = activeRole
        if let url = endpoints[role] { views[role]?.load(URLRequest(url: url, cachePolicy: role == "uiLab" ? .reloadIgnoringLocalCacheData : .useProtocolCachePolicy)) }
    }
    @objc func reloadView() {
        guard !busy else { return }
        if activeRole == "assistant" { openAssistant(reload: true); return }
        if activeRole == "uiLab" { views[activeRole]?.reloadFromOrigin() }
        else { views[activeRole]?.reload() }
    }
    @objc func exportProject() { exportArchive("project.export") }
    @objc func exportTool() { exportArchive("tool.export") }
    func exportArchive(_ operation: String) {
        guard !busy, let directory = root else { return }
        let picker = NSSavePanel()
        picker.title = "Exporter les sources enregistrées"
        picker.prompt = "Exporter"
        picker.message = "Le ZIP exclut brouillons, identifiants, historique IA, Git, dépendances et données de base. Enregistrez votre travail avant d’exporter. Choisissez une nouvelle destination hors du projet."
        picker.nameFieldStringValue = operation == "tool.export" ? "Loomata-sources.zip" : "Projet-sources.zip"
        guard picker.runModal() == .OK, let destination = picker.url else { return }
        busy = true; label.stringValue = "Export des sources…"
        DispatchQueue.global().async {
            do {
                _ = try serviceRequest(arguments[1], arguments[2], operation, directory, options: ["destination":destination.path])
                DispatchQueue.main.async { self.busy = false; self.label.stringValue = "Export enregistré : " + destination.lastPathComponent; NSWorkspace.shared.activateFileViewerSelecting([destination]) }
            } catch { DispatchQueue.main.async { self.busy = false; self.showFailure(error) } }
        }
    }
    @objc func create() {
        guard !busy else { return }
        let picker = NSSavePanel()
        picker.title = "Créer un projet Loomata"
        picker.message = "Choisissez un nouveau dossier, hors de l’installation. Les sources et les outils seront préparés pour ce projet ; aucune fonction métier n’est encore définie."
        picker.nameFieldLabel = "Nom du projet :"
        picker.nameFieldStringValue = "Mon projet"
        picker.prompt = "Créer le projet"
        picker.canCreateDirectories = true
        guard picker.runModal() == .OK, let url = picker.url else { return }
        createProject(at: url)
    }
    func createProject(at url: URL) {
        guard !busy else { return }
        if !views.isEmpty && !confirm("Créer et ouvrir un autre projet ?", action: "Créer et ouvrir") { return }
        busy = true
        label.stringValue = "Création du dossier du projet…"
        let source = URL(fileURLWithPath: arguments[2]).deletingLastPathComponent().deletingLastPathComponent().path
        DispatchQueue.global().async {
            do {
                let value = try serviceRequest(arguments[1], arguments[2], "project.create", source, options: ["destination": url.path, "name": url.lastPathComponent])
                guard let directory = value["root"] as? String else { throw NSError(domain: "Projet non créé", code: 1) }
                self.transition(to: directory, preparing: true)
            } catch { DispatchQueue.main.async { self.busy = false; self.showFailure(error) } }
        }
    }
    @objc func choose() {
        guard !busy else { return }
        let picker = NSOpenPanel()
        picker.title = "Ouvrir un projet Loomata"
        picker.message = "Ouvrir et démarrer les outils d’un dossier de confiance. Son code local sera exécuté."
        picker.canChooseFiles = false
        picker.canChooseDirectories = true
        picker.allowsMultipleSelection = false
        guard picker.runModal() == .OK, let url = picker.url else { return }
        openProject(at: url)
    }
    func openProject(at url: URL) {
        guard !busy else { return }
        busy = true
        label.stringValue = "Vérification du projet…"
        DispatchQueue.global().async {
            do {
                let value = try serviceRequest(arguments[1], arguments[2], "project.inspect", url.path)
                guard let directory = value["root"] as? String else { throw NSError(domain: "Dossier incompatible", code: 1) }
                DispatchQueue.main.async {
                    if directory == self.root { self.busy = false; self.perform("runtime.start"); return }
                    if !self.views.isEmpty && !self.confirm("Changer de projet et arrêter ses services ?", action: "Changer de projet") { self.busy = false; self.label.stringValue = "Changement annulé ; projet et brouillons conservés."; return }
                    DispatchQueue.global().async { self.transition(to: directory, preparing: false) }
                }
            } catch { DispatchQueue.main.async { self.busy = false; self.showFailure(error) } }
        }
    }
    // Called off the main thread. Stop only the currently selected supervisor before adoption.
    func transition(to directory: String, preparing: Bool) {
        let previous = DispatchQueue.main.sync { (self.root, !self.endpoints.isEmpty) }
        do {
            if previous.1, let root = previous.0 { try self.interruptAssistant(root); _ = try serviceRequest(arguments[1], arguments[2], "runtime.stop", root) }
            DispatchQueue.main.async {
                self.clearViews()
                self.servicePids = []
                self.root = directory
                self.updateContext()
                self.busy = false
                self.perform(preparing ? "project.prepare" : "runtime.start")
            }
        } catch { DispatchQueue.main.async { self.busy = false; self.showFailure(error) } }
    }
    @objc func prepare() {
        guard !busy else { return }
        if !views.isEmpty && !confirm("Arrêter et préparer le projet ?", action: "Préparer") { return }
        guard let directory = root else { label.stringValue = "Choisir d’abord un projet."; return }
        busy = true
        DispatchQueue.global().async {
            do {
                _ = try serviceRequest(arguments[1], arguments[2], "project.open", directory)
                _ = try serviceRequest(arguments[1], arguments[2], "runtime.stop", directory)
                DispatchQueue.main.async { self.clearViews(); self.busy = false; self.perform("project.prepare") }
            } catch { DispatchQueue.main.async { self.busy = false; self.showFailure(error) } }
        }
    }
    func perform(_ operation: String) {
        guard !busy else { return }
        guard let directory = root else { label.stringValue = "Choisir d’abord un dossier."; return }
        busy = true
        navigation.isEnabled = false
        label.stringValue = operation == "runtime.stop" ? "Arrêt en cours…" : operation == "project.prepare" ? "Préparation du projet… Les dépendances peuvent prendre quelques minutes." : "Ouverture en cours…"
        DispatchQueue.main.asyncAfter(deadline: .now() + 12) {
            if self.busy && operation == "runtime.start" {
                self.label.stringValue = "Ouverture en cours. Une autorisation macOS peut être nécessaire pour ce dossier."
            }
        }
        DispatchQueue.global().async {
            do {
                if operation == "runtime.stop" { try self.interruptAssistant(directory) }
                if operation == "runtime.start" || operation == "project.prepare" { _ = try serviceRequest(arguments[1], arguments[2], "project.open", directory) }
                if operation == "project.prepare" { _ = try serviceRequest(arguments[1], arguments[2], operation, directory) }
                let object = try serviceRequest(arguments[1], arguments[2], operation == "project.prepare" ? "runtime.start" : operation, directory)
                DispatchQueue.main.async {
                    self.busy = false
                    do {
                        if operation != "runtime.stop", try !self.configureWorkspace(object) {
                            self.navigation.isEnabled = !self.endpoints.isEmpty
                            self.label.stringValue = "Réouverture annulée ; les vues précédentes sont conservées."
                            return
                        }
                        if operation == "runtime.stop" { self.clearViews() }
                        self.navigation.isEnabled = !self.endpoints.isEmpty
                        self.label.stringValue = operation == "runtime.stop" ? "Services arrêtés." : "Services démarrés."
                    } catch { self.showFailure(error) }
                }
            } catch { DispatchQueue.main.async { self.busy = false; self.showFailure(error) } }
        }
    }
    func showFailure(_ error: Error) {
        navigation.isEnabled = !endpoints.isEmpty
        label.stringValue = "Opération refusée : " + error.localizedDescription
        let alert = NSAlert()
        alert.messageText = "L’opération n’a pas abouti"
        alert.informativeText = error.localizedDescription
        alert.addButton(withTitle: "Fermer")
        alert.beginSheetModal(for: window)
    }
    @objc func start() { perform("runtime.start") }
    @objc func stop() {
        guard !busy else { return }
        if !views.isEmpty && !confirm("Arrêter les services ?", action: "Arrêter") { return }
        perform("runtime.stop")
    }
    func allowClose() -> Bool {
        guard !busy else { label.stringValue = "Attendre la fin de l’opération avant de fermer."; return false }
        let alert = NSAlert()
        alert.messageText = "Fermer Loomata ?"
        alert.informativeText = "Les réglages non enregistrés peuvent être perdus. Fermer ne sauvegarde rien ; les services locaux restent actifs jusqu’à leur arrêt explicite."
        alert.addButton(withTitle: "Conserver l’espace de travail")
        alert.addButton(withTitle: "Fermer")
        guard alert.runModal() == .alertSecondButtonReturn else { return false }
        do { if let directory = root { try interruptAssistant(directory) }; return true }
        catch { showFailure(error); return false }
    }
    func windowShouldClose(_ sender: NSWindow) -> Bool { closedByWindow = allowClose(); return closedByWindow }
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply { (closedByWindow || allowClose()) ? .terminateNow : .terminateCancel }
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let origin = frame.securityOrigin
        guard let ui = endpoints["uiLab"], views["uiLab"] === webView,
              origin.protocol == ui.scheme, origin.host == ui.host, origin.port == ui.port else { completionHandler(false); return }
        let alert = NSAlert()
        alert.messageText = message
        alert.addButton(withTitle: "Conserver le brouillon")
        alert.addButton(withTitle: "Abandonner")
        alert.beginSheetModal(for: window) { response in completionHandler(response == .alertSecondButtonReturn) }
    }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if (views["assistant"] === webView || views["uiLab"] === webView), action.navigationType == .linkActivated,
           let url = action.request.url, url.scheme == "https", url.user == nil, url.password == nil,
           ["auth.openai.com", "auth0.openai.com", "chatgpt.com"].contains(url.host ?? "") {
            NSWorkspace.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        guard let role = views.first(where: { $0.value === webView })?.key,
              let expected = endpoints[role], let url = action.request.url,
              url.scheme == expected.scheme, url.host == expected.host, url.port == expected.port,
              url.user == nil, url.password == nil, action.targetFrame != nil else {
            navigationRefusals += 1
            decisionHandler(.cancel)
            return
        }
        if role == "uiLab", action.targetFrame?.isMainFrame == true, webView.url != nil {
            webView.evaluateJavaScript("document.querySelector('[data-loomata-dirty=\"true\"]') !== null") { result, _ in
                if result as? Bool == true {
                    let alert = NSAlert()
                    alert.messageText = "Recharger l’atelier ?"
                    alert.informativeText = "Un brouillon est en cours. Recharger l’atelier abandonnera les réglages non enregistrés."
                    alert.addButton(withTitle: "Conserver le brouillon")
                    alert.addButton(withTitle: "Recharger")
                    alert.beginSheetModal(for: self.window) { response in decisionHandler(response == .alertSecondButtonReturn ? .allow : .cancel) }
                } else { decisionHandler(.allow) }
            }
        } else { decisionHandler(.allow) }
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Local diagnostics only; never receives commands or write capabilities from a page.
        guard views["uiLab"] === webView else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 8) {
            webView.evaluateJavaScript("JSON.stringify({ready:document.readyState,interactive:!!document.querySelector('input[aria-label=\"Valeur précise\"]:not(:disabled)'),scripts:document.scripts.length,errors:window.__loomataLoadErrors||[]})") { result, _ in
                if let result = result as? String { fputs("Loomata UI Lab: \(result)\n", stderr) }
            }
        }
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        if (error as NSError).code != NSURLErrorCancelled { showFailure(error) }
    }
}
let app = NSApplication.shared
app.setActivationPolicy(.regular)
let host = LoomataHost()
app.delegate = host
app.run()
