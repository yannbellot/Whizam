// Automatic consultation theme. Ignore legacy manual palettes without changing storage.
;(() => {
  const preference = window.matchMedia('(prefers-color-scheme: dark)')
  const applyTheme = () => {
    document.body.dataset.mdColorScheme = preference.matches ? 'slate' : 'default'
    document.documentElement.style.colorScheme = preference.matches ? 'dark' : 'light'
  }
  applyTheme()
  preference.addEventListener('change', applyTheme)
  window.addEventListener('pagehide', () => preference.removeEventListener('change', applyTheme))
  window.addEventListener('pageshow', () => {
    applyTheme()
    preference.addEventListener('change', applyTheme)
  })
})()

;(() => {
  const select = document.querySelector('[data-whizam-language]')
  select?.addEventListener('change', () => {
    const parts = location.pathname.split('/')
    if ([...select.options].some((option) => option.value === parts[1])) parts[1] = select.value
    else parts.splice(1, 0, select.value)
    location.assign(parts.join('/') + location.search + location.hash)
  })
  const drawer = document.getElementById('__drawer')
  const opener = document.querySelector('.whizam-mobile-menu button')
  document.querySelectorAll('[data-whizam-drawer]').forEach((button) => {
    button.addEventListener('click', () => {
      drawer.checked = !drawer.checked
      drawer.dispatchEvent(new Event('change', { bubbles: true }))
    })
  })
  const syncDrawer = () => {
    const open = Boolean(drawer?.checked && matchMedia('(max-width: 959px)').matches)
    opener?.setAttribute('aria-expanded', String(open))
    document.querySelectorAll('.md-content, .md-sidebar--secondary').forEach((element) => {
      element.inert = open
    })
  }
  window.addEventListener('resize', syncDrawer)
  syncDrawer()
  drawer?.addEventListener('change', () => {
    syncDrawer()
    if (drawer.checked) document.querySelector('.whizam-close')?.focus()
    else opener?.focus()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer?.checked) {
      drawer.checked = false
      syncDrawer()
      opener?.focus()
    }
  })
  document.querySelector('.whizam-mobile-toc')?.addEventListener('click', (event) => {
    if (event.target.closest('a')) event.currentTarget.open = false
  })
  document.querySelector('.md-nav--primary')?.addEventListener('click', (event) => {
    if (event.target.closest('a') && drawer?.checked) {
      drawer.checked = false
      syncDrawer()
    }
  })
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !drawer?.checked) return
    const items = [
      ...document.querySelectorAll(
        '.md-sidebar--primary a, .md-sidebar--primary select, .md-sidebar--primary button, .md-sidebar--primary [tabindex="0"]',
      ),
    ].filter((item) => item.getClientRects().length)
    if (!items.length) return
    const first = items[0],
      last = items.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })
})()

// Label the icon explicitly; leave native fragment navigation and copy-link menus intact.
;(() => {
  const english = document.documentElement.lang === 'en'
  for (const link of document.querySelectorAll(
    '.md-typeset :is(h1,h2,h3,h4,h5,h6) > a.headerlink',
  )) {
    const title = [...link.parentElement.childNodes]
      .filter((node) => node !== link)
      .map((node) => node.textContent)
      .join('')
      .trim()
    const label = (english ? 'Link to section: ' : 'Lien vers la section : ') + title
    link.setAttribute('aria-label', label)
    link.setAttribute('title', label)
  }
})()
