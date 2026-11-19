// Isolated test build; true WKWebView, DOM events rather than physical keyboard input.
final class LoomataE2EApplication: NSApplication {}
@MainActor func loomataE2E(_ host: LoomataHost) async {
 let output = ProcessInfo.processInfo.environment["LOOMATA_E2E_OUTPUT"]!
 try! String(ProcessInfo.processInfo.processIdentifier).write(toFile: output+"/native.pid",atomically:true,encoding:.utf8)
 var cases:[String]=[]
 func js(_ source:String) async throws -> Any? { guard let view=host.views["uiLab"] else { throw NSError(domain:"Missing workshop",code:1) };return try await view.evaluateJavaScript(source) }
 func until(_ name:String,_ condition:() async throws -> Bool) async throws {let end=Date().addingTimeInterval(75);while Date()<end {if try await condition(){return};try await Task.sleep(nanoseconds:200_000_000)};throw NSError(domain:"Timeout "+name,code:1)}
 func click(_ label:String) async throws { let literal=String(data:try JSONSerialization.data(withJSONObject:[label]),encoding:.utf8)!.dropFirst().dropLast(); _=try await js("(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===\(literal));b.focus();b.click();return true})()") }
 func fill(_ value:String) async throws { let literal=String(data:try JSONSerialization.data(withJSONObject:[value]),encoding:.utf8)!.dropFirst().dropLast();_=try await js("(()=>{const e=document.querySelector('input[aria-label=\"Valeur précise\"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,\(literal));e.dispatchEvent(new Event('input',{bubbles:true}));return true})()") }
 do {
  try await until("ready"){!host.busy && host.navigation.isEnabled && host.views["uiLab"] != nil}
  host.window.orderFrontRegardless()
  try await until("input"){try await js("!!document.querySelector('input[aria-label=\"Valeur précise\"]:not(:disabled)')") as? Bool == true}
  for width in [1280,1440] {
   host.window.setContentSize(NSSize(width:width,height:900))
   try await until("tree"){try await js("!!document.querySelector('[role=treegrid] [role=row]')") as? Bool == true}
   let initial=try await js("document.querySelector('input[aria-label=\"Valeur précise\"]').value") as! String
   try await fill("invalid color")
   try await until("invalid"){try await js("document.querySelector('input[aria-label=\"Valeur précise\"]').getAttribute('aria-invalid')==='true'") as? Bool == true}
   try await fill("#123456");try await click("Nouveau style de composant")
   try await click("Annuler")
   try await until("dialog"){try await js("!!document.querySelector('[role=dialog]')") as? Bool == true}
   try await until("dialog focus"){try await js("document.activeElement.textContent.trim()==='Conserver le brouillon'") as? Bool == true}
   try await click("Conserver le brouillon")
   try await until("preserved"){try await js("document.querySelector('input[aria-label=\"Valeur précise\"]').value==='#123456'") as? Bool == true}
   try await until("focus restored"){try await js("document.activeElement.textContent.trim()==='Annuler'") as? Bool == true}
   try await click("Annuler");try await until("dialog again"){try await js("!!document.querySelector('[role=dialog]')") as? Bool == true};try await click("Abandonner les réglages")
   try await until("closed"){try await js("!document.querySelector('[role=dialog]')") as? Bool == true}
   let final=try await js("document.querySelector('input[aria-label=\"Valeur précise\"]').value") as? String
   if final != initial {throw NSError(domain:"Abandon did not restore",code:1)}
   cases.append("WKWebView tree, invalid field, cancel and abandon at \(width)")
   if let view=host.views["uiLab"], let image=try? await view.takeSnapshot(configuration:nil),let tiff=image.tiffRepresentation,let bitmap=NSBitmapImageRep(data:tiff),let png=bitmap.representation(using:.png,properties:[:]) {try png.write(to:URL(fileURLWithPath:output+"/ui-\(width).png"))}
  }
  let report:[String:Any] = ["status":"passed","cases":cases,"driver":"AppKit/WKWebView DOM actions; no physical keyboard or VoiceOver"]
  try JSONSerialization.data(withJSONObject:report,options:[.prettyPrinted]).write(to:URL(fileURLWithPath:output+"/native.json"));exit(0)
 } catch {let report:[String:Any] = ["status":"failed","cases":cases,"error":error.localizedDescription];try! JSONSerialization.data(withJSONObject:report,options:[.prettyPrinted]).write(to:URL(fileURLWithPath:output+"/native.json"));exit(1)}
}
