import type { CSSProperties } from 'vue'

let themeClassSeed = 0

export function createThemeClass(): string {
  themeClassSeed += 1
  return `yiz-theme-${themeClassSeed}`
}

export function createThemeStyle(themeClass: string): {
  update: (vars: CSSProperties) => void
  remove: () => void
} {
  const styleElement = document.createElement('style')
  styleElement.dataset.yizTheme = themeClass
  document.head.appendChild(styleElement)

  return {
    update(vars) {
      const declaration = document.createElement('div').style
      for (const [name, value] of Object.entries(vars)) {
        if (value == null) continue
        const property = name.startsWith('--') ? name : name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
        declaration.setProperty(property, String(value))
      }
      styleElement.textContent = `.${themeClass}{${declaration.cssText}}`
    },
    remove() {
      styleElement.remove()
    },
  }
}
