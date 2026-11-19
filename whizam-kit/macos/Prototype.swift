// CORE-01 feasibility harness. Not the packaged or sandboxed macOS product.
import Cocoa
import WebKit

func request(_ node: String, _ client: String, _ operation: String, _ root: String) throws -> Data {
    let process = Process()
    process.executableURL = URL(fileURLWithPath: node)
    process.arguments = [client, operation, root]
    let output = Pipe()
    process.standardOutput = output
    process.standardError = FileHandle.standardError
    try process.run()
    let data = output.fileHandleForReading.readDataToEndOfFile()
    process.waitUntilExit()
    if process.terminationStatus != 0 { throw NSError(domain: "LocalService", code: Int(process.terminationStatus)) }
    return data
}
let arguments = CommandLine.arguments
if arguments.count == 5 && arguments[1] == "--probe" {
    do { FileHandle.standardOutput.write(try request(arguments[2], arguments[3], "runtime.status", arguments[4])) }
    catch { fputs("Common service unavailable\n", stderr); exit(1) }
    exit(0)
}
guard arguments.count == 3 || arguments.count == 4 else {
    fputs("Usage: Prototype node-path local-service.mjs-path [project-directory]\n", stderr); exit(1)
}
final class Host: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate, NSWindowDelegate {
    var window: NSWindow!
    var view: WKWebView!
    var allowedOrigin: String?
    var root: String?
    var busy = false
    let label = NSTextField(labelWithString: "Choisir un dossier UI Lab déjà préparé.")
    func applicationDidFinishLaunching(_ notification: Notification) {
        window = NSWindow(contentRect: NSRect(x: 0,y: 0,width: 1200,height: 800),styleMask:[.titled,.closable,.resizable],backing:.buffered,defer:false)
        window.isReleasedWhenClosed = false
        window.delegate = self
        window.title = arguments.count == 4 ? "UI Lab — copie de test CORE-01" : "UI Lab — prototype du cœur commun"
        let stack = NSStackView(); stack.orientation = .vertical; stack.alignment = .leading
        let row = NSStackView()
        for (title, selector) in [("Ouvrir un dossier", #selector(choose)),("Démarrer",#selector(start)),("Arrêter les services",#selector(stop))] {
            row.addArrangedSubview(NSButton(title:title,target:self,action:selector))
        }
        stack.addArrangedSubview(row); stack.addArrangedSubview(label)
        installWebView(in: stack); window.contentView = stack
        window.center(); window.makeKeyAndOrderFront(nil); NSApp.activate(ignoringOtherApps:true)
        if arguments.count == 4 {
            root = arguments[3]
            perform("runtime.start")
        }
    }
    func installWebView(in stack: NSStackView) {
        let configuration = view?.configuration ?? WKWebViewConfiguration()
        if let previous = view {
            previous.stopLoading()
            stack.removeArrangedSubview(previous)
            previous.removeFromSuperview()
        }
        view = WKWebView(frame:.zero,configuration:configuration)
        view.navigationDelegate = self; view.uiDelegate = self
        stack.addArrangedSubview(view)
        view.widthAnchor.constraint(greaterThanOrEqualToConstant:800).isActive = true
        view.heightAnchor.constraint(greaterThanOrEqualToConstant:600).isActive = true
    }
    func windowShouldClose(_ sender: NSWindow) -> Bool {
        if busy {
            label.stringValue = "Attendre la fin de l’opération avant de fermer."
            return false
        }
        let alert = NSAlert()
        alert.messageText = "Fermer le prototype ?"
        alert.informativeText = "Les réglages non enregistrés peuvent être perdus. Fermer ne sauvegarde rien et laisse les services locaux actifs."
        alert.addButton(withTitle: "Conserver la fenêtre")
        alert.addButton(withTitle: "Fermer")
        return alert.runModal() == .alertSecondButtonReturn
    }
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }
    @objc func choose() {
        guard !busy else { return }
        let picker = NSOpenPanel(); picker.canChooseFiles = false; picker.canChooseDirectories = true; picker.allowsMultipleSelection = false
        guard picker.runModal() == .OK, let url = picker.url else { return }
        // Selection alone neither starts a service nor writes project sources.
        root = url.path; label.stringValue = "Dossier sélectionné : \(url.lastPathComponent)"
    }
    func perform(_ operation: String) {
        guard !busy else { return }
        guard let directory = root else { label.stringValue = "Choisir d’abord un dossier."; return }
        busy = true
        label.stringValue = "Opération en cours…"
        DispatchQueue.global().async {
            do {
                let data = try request(arguments[1],arguments[2],operation,directory)
                let object = try JSONSerialization.jsonObject(with:data) as? [String:Any]
                DispatchQueue.main.async {
                    self.busy = false
                    self.label.stringValue = "État : \(object?["phase"] ?? "inconnu")"
                    if operation == "runtime.start", let text = object?["uiURL"] as? String, let url = URL(string:text), url.scheme == "http", url.host == "127.0.0.1", let port = url.port {
                        self.allowedOrigin = "http://127.0.0.1:\(port)"
                        // Retire the old Vite document and its reconnecting HMR client
                        // before loading the newly started writer's session.
                        if let stack = self.window.contentView as? NSStackView { self.installWebView(in:stack) }
                        self.view.load(URLRequest(url:url))
                    }
                }
            } catch { DispatchQueue.main.async { self.busy = false; self.label.stringValue = "Opération refusée ou service indisponible ; consulter le journal local." } }
        }
    }
    @objc func start() { perform("runtime.start") }
    @objc func stop() { perform("runtime.stop") }
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let origin = frame.securityOrigin
        guard allowedOrigin == "\(origin.protocol)://\(origin.host):\(origin.port)" else { completionHandler(false); return }
        let alert = NSAlert()
        alert.messageText = message
        alert.addButton(withTitle: "Conserver le brouillon")
        alert.addButton(withTitle: "Abandonner")
        alert.beginSheetModal(for: window) { response in completionHandler(response == .alertSecondButtonReturn) }
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        fputs("CORE-01: local document loaded in WKWebView\n", stderr)
    }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy)->Void) {
        guard let url = action.request.url, let port = url.port, url.scheme == "http", url.host == "127.0.0.1", allowedOrigin == "http://127.0.0.1:\(port)" else { decisionHandler(.cancel); return }
        decisionHandler(.allow)
    }
}
let app = NSApplication.shared
app.setActivationPolicy(.regular)
let host = Host(); app.delegate = host
app.run()
