import { themes } from 'storybook/theming'
import ui from '../config/documentation/ui.json'
export function toolTheme(dark: boolean) {
  const palette = dark ? ui.dark : ui.light
  return {
    ...(dark ? themes.dark : themes.light),
    appBg: palette.column,
    appContentBg: palette.page,
    appPreviewBg: palette.page,
    barBg: palette.column,
    appBorderColor: palette.border,
    textColor: palette.text,
  }
}
