// Instrumented AppKit/WKWebView test of the actual fourth view. No provider response is simulated.
@MainActor func loomataChatE2E(_ host: LoomataHost) async {
 let output=ProcessInfo.processInfo.environment["LOOMATA_E2E_OUTPUT"]!
 try! String(ProcessInfo.processInfo.processIdentifier).write(toFile:output+"/native.pid",atomically:true,encoding:.utf8)
 var cases:[String]=[]
 func report(_ status:String,_ error:String?=nil){var value:[String:Any]=["status":status,"cases":cases,"driver":"Real AppKit/WKWebView and shared chat service; no simulated provider turn"];if let error=error{value["error"]=error};try! JSONSerialization.data(withJSONObject:value,options:[.prettyPrinted,.sortedKeys]).write(to:URL(fileURLWithPath:output+"/native.json"))}
 func check(_ pass:Bool,_ text:String)throws{if !pass{throw NSError(domain:text,code:1)}}
 func until(_ text:String,_ test:() async throws->Bool)async throws{let deadline=Date().addingTimeInterval(90);var attempts=0;while Date()<deadline{attempts += 1;if attempts==50,let view=host.views["uiLab"],let text=try? await view.evaluateJavaScript("document.body.innerText") as? String {try? text.write(toFile:output+"/workshop-diagnostic.txt",atomically:true,encoding:.utf8)};if try await test(){return};try await Task.sleep(nanoseconds:200_000_000)};throw NSError(domain:"Timeout: "+text,code:1)}
 func js(_ role:String,_ code:String)async throws->Any?{guard let view=host.views[role]else{throw NSError(domain:"Missing view "+role,code:1)};return try await view.evaluateJavaScript(code)}
 func select(_ index:Int){let item=NSMenuItem();item.tag=index;host.selectFromMenu(item)}
 do{
  try await until("workspace") {host.window != nil && !host.busy && host.navigation.isEnabled}
  host.window.level = .floating;host.window.orderFrontRegardless()
  try await until("workshop hydrated") {try await js("uiLab","!!document.querySelector('input[aria-label=\"Valeur précise\"]:not(:disabled)')") as? Bool == true}
  let workshop=host.views["uiLab"]!
  _ = try await js("uiLab","window.__loomataChatMarker='retained';true")
  select(3)
  try await until("actual assistant page") {!host.busy && host.views["assistant"] != nil}
  try await until("assistant hydrated") {try await js("assistant","document.querySelector('h1')?.textContent==='Assistance Loomata'") as? Bool == true}
  try check(host.endpoints["assistant"]?.path.hasPrefix("/assistant/")==true,"Assistant endpoint is not owned")
  try check(host.endpoints["assistant"]?.port != host.endpoints["uiLab"]?.port,"Assistant shares writer origin")
  try check(try await js("assistant","!document.querySelector('meta[name=\"adl-design-editor-session\"]')&&!!document.querySelector('meta[name=\"loomata-chat-session\"]')") as? Bool == true,"Wrong assistant capability")
  cases.append("Assistance is a real fourth native view on its own capability-bound local origin, without DS writer bootstrap")
  let assistant=host.views["assistant"]!
  if ProcessInfo.processInfo.environment["LOOMATA_E2E_EXPECT_CONNECTED"] == "1" {
   try await until("managed account in native chat") {try await js("assistant","document.body.innerText.includes('Compte connecté')") as? Bool == true}
   cases.append("personally authorized real Codex connection is confirmed inside the native assistant")
   func literal(_ text:String)->String{let data=try! JSONSerialization.data(withJSONObject:[text]);return String(data:data,encoding:.utf8)!.dropFirst().dropLast().description}
   func send(_ text:String)async throws{
    try await until("native composer enabled") {try await js("assistant","!!document.querySelector('textarea[name=\"message\"]:not(:disabled)')") as? Bool == true}
    _ = try await js("assistant","(()=>{const e=document.querySelector('textarea[name=\"message\"]');e.value=\(literal(text));e.dispatchEvent(new Event('input',{bubbles:true}));[...document.querySelectorAll('button')].find(b=>b.textContent==='Envoyer le message').click();return true})()")
   }
   let file=ProcessInfo.processInfo.environment["LOOMATA_E2E_CHAT_FILE"]!
   let marker=ProcessInfo.processInfo.environment["LOOMATA_E2E_CHAT_MARKER"]!
   try await send("Lis le fichier "+file+" dans mon projet par une demande structurée Loomata, puis réponds avec son contenu exact. Aucune écriture ni outil natif.")
   try await until("real model reads native project witness") {try await js("assistant","document.body.innerText.includes(\(literal(marker))) && !!document.querySelector('textarea[name=\"message\"]:not(:disabled)')") as? Bool == true}
   cases.append("real Codex exchange started from WKWebView reads a random project witness through the bounded broker")
   let approved=ProcessInfo.processInfo.environment["LOOMATA_E2E_CHAT_APPROVED"]!
   try await send("Propose de remplacer tout le contenu de "+file+" par exactement "+approved+". Utilise action write et attends mon accord, sans autre opération.")
   try await until("native approval card") {try await js("assistant","[...document.querySelectorAll('button')].some(b=>b.textContent==='Autoriser cette modification'&&!b.disabled)") as? Bool == true}
   _ = try await js("assistant","[...document.querySelectorAll('button')].find(b=>b.textContent==='Autoriser cette modification').click();true")
   try await until("native approved action completes") {try await js("assistant","!!document.querySelector('textarea[name=\"message\"]:not(:disabled)') && ![...document.querySelectorAll('h3')].some(e=>e.textContent==='Autoriser une modification ?')") as? Bool == true}
   cases.append("real model write proposal is approved from the native fourth view; parent runner verifies the saved witness")
  }
  let image=try await assistant.takeSnapshot(configuration:nil)
  if let tiff=image.tiffRepresentation,let bitmap=NSBitmapImageRep(data:tiff),let png=bitmap.representation(using:.png,properties:[:]){try png.write(to:URL(fileURLWithPath:output+"/assistant-native.png"))}
  select(0)
  try check(host.views["uiLab"]===workshop,"Chat tab replaced workshop")
  try check(try await js("uiLab","window.__loomataChatMarker") as? String == "retained","Chat navigation reloaded workshop")
  select(3)
  try check(host.views["assistant"]===assistant,"Tab return replaced assistant")
  cases.append("switching between workshop and assistant retains both real web documents")
  host.start()
  try await until("idempotent start") {!host.busy}
  try check(host.views["assistant"]===assistant && host.views["uiLab"]===workshop,"Idempotent start replaced live assistant")
  cases.append("idempotent tool startup preserves the fourth view and its session")
  host.reloadView()
  try await until("explicit assistant reload") {guard !host.busy && !assistant.isLoading else {return false};return try await js("assistant","document.querySelector('h1')?.textContent==='Assistance Loomata'") as? Bool == true}
  try check(host.views["assistant"]===assistant,"Reload replaced stable assistant view")
  cases.append("explicit assistant reload reacquires the service endpoint and restores its page without replaying a message")
  let old=assistant.url,refusals=host.navigationRefusals
  assistant.load(URLRequest(url:URL(string:"https://example.invalid/")!))
  try await until("foreign navigation refused") {host.navigationRefusals>refusals}
  try check(assistant.url==old,"Remote navigation escaped assistant")
  cases.append("assistant refuses arbitrary external navigation; official login remains a distinct user-activated browser flow")
  report("passed");exit(0)
 }catch{if let view=host.views["uiLab"],let text=try? await view.evaluateJavaScript("JSON.stringify({text:document.body.innerText,errors:window.__loomataLoadErrors})") as? String{try? text.write(toFile:output+"/failure-document.json",atomically:true,encoding:.utf8)};report("failed",String(describing:error));exit(1)}
}
