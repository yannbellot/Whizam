// Shared by the documentation portal and the Storybook Docs iframe.
;(() => {
  const selector = [
    '.md-typeset :is(h1,h2,h3,h4,h5,h6) > a.headerlink',
    '.sbdocs-content :is(h1,h2,h3,h4,h5,h6):not(.docs-story *) > .sb-unstyled > span > a[aria-label="Copy heading URL to address bar"]',
  ].join(',')
  const note = document.createElement('div')
  note.className = 'whizam-heading-feedback'
  note.setAttribute('role', 'status')
  note.setAttribute('aria-live', 'polite')
  note.setAttribute('aria-atomic', 'true')
  note.hidden = true
  document.body.append(note)
  let timeout,
    request = 0
  const dismiss = () => {
    clearTimeout(timeout)
    note.hidden = true
    note.textContent = ''
  }
  const announce = (link, success, current) => {
    if (current !== request || !link.isConnected) return
    const language =
      document.documentElement.dataset.whizamDocumentationLanguage || document.documentElement.lang
    note.textContent =
      language === 'en'
        ? success
          ? 'Link copied'
          : 'Unable to copy link'
        : success
          ? 'Lien copié'
          : 'Copie du lien impossible'
    note.dataset.state = success ? 'success' : 'error'
    note.hidden = false
    note.style.left = '0px'
    const anchor = link.getBoundingClientRect(),
      box = note.getBoundingClientRect()
    note.style.left =
      Math.max(
        8,
        Math.min(anchor.left + anchor.width / 2 - box.width / 2, innerWidth - box.width - 8),
      ) + 'px'
    note.style.top = Math.max(0, anchor.top - box.height - 8) + 'px'
    timeout = setTimeout(dismiss, 2000)
  }
  document.addEventListener(
    'click',
    async (event) => {
      if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return
      const link = event.target instanceof Element ? event.target.closest(selector) : null
      if (!link) return
      const current = ++request
      dismiss()
      const url = new URL(link.href)
      if (link.closest('.sbdocs-content')) {
        // Share the manager Docs route rather than an embedded iframe URL.
        try {
          if (
            parent !== window &&
            parent.document.querySelector('#storybook-preview-iframe')?.contentWindow === window
          ) {
            const manager = new URL(parent.location.href)
            manager.hash = url.hash
            url.href = manager.href
          }
        } catch {
          /* Standalone/cross-origin iframe: keep its own native URL. */
        }
      }
      let success = false
      try {
        await navigator.clipboard.writeText(url.href)
        success = true
      } catch {
        /* Never announce success when clipboard access is refused. */
      }
      // Leave native navigation untouched and position the note after its scroll.
      requestAnimationFrame(() => requestAnimationFrame(() => announce(link, success, current)))
    },
    true,
  )
  window.addEventListener('scroll', dismiss, true)
  window.addEventListener('resize', dismiss)
  window.addEventListener('pagehide', () => {
    request++
    dismiss()
  })
})()
