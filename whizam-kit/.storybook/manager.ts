import { addons } from 'storybook/manager-api'
import { toolTheme } from './tool-theme'
import './SidebarLanguage'

const preference = window.matchMedia('(prefers-color-scheme: dark)')
const applyTheme = () => {
  addons.setConfig({
    theme: {
      ...toolTheme(preference.matches),
      brandTitle:
        addons.getConfig().theme?.brandTitle || `Design système — ${window.__WHIZAM_TOOLS__.name}`,
      brandUrl: './',
    },
  })
  document.documentElement.style.colorScheme = preference.matches ? 'dark' : 'light'
}
applyTheme()
preference.addEventListener('change', applyTheme)
window.addEventListener('pagehide', () => preference.removeEventListener('change', applyTheme))
window.addEventListener('pageshow', () => {
  applyTheme()
  preference.addEventListener('change', applyTheme)
})
