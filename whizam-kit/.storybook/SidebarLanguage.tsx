import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED } from 'storybook/internal/core-events'

declare global {
  interface Window {
    __WHIZAM_TOOLS__: { name: string; locales: string[]; language: string }
  }
}
addons.register('whizam/sidebar-language', (api) => {
  const config = window.__WHIZAM_TOOLS__
  const mount = document.createElement('div')
  mount.className = 'whizam-sidebar-language whizam-language-footer'
  const label = document.createElement('label')
  label.className = 'whizam-language-control'
  const icon = document.createElement('span')
  icon.setAttribute('aria-hidden', 'true')
  icon.className = 'whizam-language-icon'
  const select = document.createElement('select')
  for (const locale of config.locales) {
    const option = document.createElement('option')
    option.value = locale
    option.textContent = locale === 'fr' ? 'Français' : locale === 'en' ? 'English' : locale
    select.append(option)
  }
  select.disabled = config.locales.length < 2
  label.append(icon, select)
  mount.append(label)
  const sync = (event?: { globals?: Record<string, unknown> }) => {
    const language = String(
      event?.globals?.documentationLanguage ||
        api.getGlobals().documentationLanguage ||
        config.language,
    )
    select.value = language
    select.setAttribute(
      'aria-label',
      language === 'en' ? 'Documentation language' : 'Langue de documentation',
    )
    const title = `${language === 'en' ? 'Design System' : 'Design système'} — ${config.name}`
    addons.setConfig({
      theme: {
        ...addons.getConfig().theme,
        brandTitle: title,
        brandImage: undefined,
        brandUrl: './',
        brandTarget: '_self',
      },
    })
  }
  select.addEventListener('change', () =>
    api.updateGlobals({ documentationLanguage: select.value }),
  )
  const install = () => {
    const sidebar = document.getElementById('storybook-sidebar-region')
    if (sidebar) {
      sidebar.classList.add('whizam-language-host')
      if (mount.parentElement !== sidebar) sidebar.append(mount)
    }
  }
  // Version-pinned adapter: the native manager has no public sidebar slot.
  const observer = new MutationObserver(install)
  observer.observe(document.body, { childList: true, subtree: true })
  install()
  sync()
  api.on(GLOBALS_UPDATED, sync)
  window.addEventListener('pagehide', () => observer.disconnect())
  window.addEventListener('pageshow', () => {
    observer.observe(document.body, { childList: true, subtree: true })
    install()
    sync()
  })
})
