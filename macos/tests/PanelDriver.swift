// Test-only AX driver: presses the actual remote save-panel button in the owned app.
import Cocoa
import ApplicationServices
let pid = pid_t(CommandLine.arguments[1])!
guard AXIsProcessTrusted() else { fputs("Accessibility access unavailable for panel test driver\n", stderr); exit(2) }
func value(_ element: AXUIElement, _ key: String) -> AnyObject? {
    var result: CFTypeRef?
    return AXUIElementCopyAttributeValue(element, key as CFString, &result) == .success ? result : nil
}
func press(_ element: AXUIElement, _ depth: Int) -> Bool {
    guard depth < 24 else { return false }
    if value(element, kAXRoleAttribute as String) as? String == "AXWebArea" { return false }
    if value(element, kAXRoleAttribute as String) as? String == "AXButton",
       value(element, kAXTitleAttribute as String) as? String == "Créer le projet" {
        return AXUIElementPerformAction(element, kAXPressAction as CFString) == .success
    }
    return (value(element, kAXChildrenAttribute as String) as? [AXUIElement] ?? []).contains { press($0, depth + 1) }
}
let application = AXUIElementCreateApplication(pid)
for _ in 0..<40 {
    if press(application, 0) { print("Actual save-panel create button pressed"); exit(0) }
    Thread.sleep(forTimeInterval: 0.25)
}
fputs("Owned native save-panel create button unavailable\n", stderr)
exit(1)
