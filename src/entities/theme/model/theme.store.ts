import { ref } from 'vue'
import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'
const THEME_KEY = 'app_theme'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>((localStorage.getItem(THEME_KEY) as Theme) || 'light')

  function applyTheme(theme: Theme) {
    currentTheme.value = theme
    localStorage.setItem(THEME_KEY, theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }

  function toggleTheme() {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme(newTheme)
  }

  applyTheme(currentTheme.value)

  return {
    currentTheme,
    toggleTheme,
    applyTheme
  }
})
